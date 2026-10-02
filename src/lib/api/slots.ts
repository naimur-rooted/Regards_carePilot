import type { SlotDto } from './dto.types';

/**
 * Appointment slot generation.
 *
 * The Prisma model stores a doctor's hours as human text
 * (`DoctorBranch.scheduleEn` / `scheduleBn`, e.g. "Sat–Thu, 5:00 pm – 9:00 pm"),
 * because that is what clinicians actually publish and what the CMS authors
 * edit. Rather than invent a structured timetable the website does not have,
 * this module reads the text when it can and otherwise falls back to the
 * network's standard consulting grid:
 *
 *   09:00–13:00  morning clinic
 *   17:00–21:00  evening clinic
 *
 * Slots already held by a non-cancelled appointment are marked unavailable, and
 * slots that have already passed today are removed. The day itself is confirmed
 * by the care team when the request moves from `NEW` to `CONTACTED` — matching
 * the existing request workflow — so an inexact parse can never dead-end a
 * patient.
 */

const MORNING = { startMinutes: 9 * 60, endMinutes: 13 * 60 };
const EVENING = { startMinutes: 17 * 60, endMinutes: 21 * 60 };
const SLOT_MINUTES = 30;

function minutesToLabel(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${suffix}`;
}

function labelToDate(base: Date, minutes: number): Date {
  const date = new Date(base);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

/** Parses "5:00 pm", "17:00", "9 am" into minutes past midnight. */
function parseClock(raw: string): number | null {
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i.exec(raw.trim());
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? '0');
  const meridiem = match[3]?.toLowerCase();

  if (hours > 23 || minutes > 59) return null;
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Extracts consulting windows from free-text schedule. Returns an empty array
 * when nothing usable is found, which callers treat as "use the default grid".
 */
export function parseScheduleWindows(schedule: string | null | undefined): {
  startMinutes: number;
  endMinutes: number;
}[] {
  if (!schedule) return [];

  const clocks = schedule.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi) ?? [];
  const parsed = clocks
    .map((clock) => parseClock(clock))
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);

  if (parsed.length < 2) return [];

  const windows: { startMinutes: number; endMinutes: number }[] = [];
  for (let index = 0; index + 1 < parsed.length; index += 2) {
    const startMinutes = parsed[index];
    const endMinutes = parsed[index + 1];
    if (endMinutes > startMinutes) windows.push({ startMinutes, endMinutes });
  }
  return windows;
}

export type GenerateSlotsInput = {
  /** ISO date (YYYY-MM-DD) the patient asked for. */
  date: string;
  schedule: string | null;
  /** Existing `Appointment.timeSlot` values for that doctor/branch/day. */
  takenSlots: string[];
  /** Injected so tests are deterministic. */
  now?: Date;
};

export function generateSlots(input: GenerateSlotsInput): SlotDto[] {
  const [year, month, day] = input.date.split('-').map(Number);
  if (!year || !month || !day) return [];

  const base = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const now = input.now ?? new Date();
  const isToday =
    now.getFullYear() === year && now.getMonth() === month - 1 && now.getDate() === day;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const parsed = parseScheduleWindows(input.schedule);
  const windows = parsed.length > 0 ? parsed : [MORNING, EVENING];
  const taken = new Set(input.takenSlots.map((slot) => slot.trim().toLowerCase()));

  const slots: SlotDto[] = [];
  const seen = new Set<string>();

  for (const window of windows) {
    for (
      let minutes = window.startMinutes;
      minutes + SLOT_MINUTES <= window.endMinutes;
      minutes += SLOT_MINUTES
    ) {
      const label = minutesToLabel(minutes);
      if (seen.has(label)) continue;
      seen.add(label);

      const alreadyPassed = isToday && minutes <= nowMinutes;
      const isTaken = taken.has(label.toLowerCase());

      slots.push({
        start: labelToDate(base, minutes).toISOString(),
        end: labelToDate(base, minutes + SLOT_MINUTES).toISOString(),
        label,
        available: !alreadyPassed && !isTaken,
      });
    }
  }

  return slots;
}
