import { prisma } from '@/lib/prisma';
import { getDoctor } from '@/lib/content';
import { ApiError, handle, ok, parseLocale } from '@/lib/api/http';
import { generateSlots } from '@/lib/api/slots';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Bookable slots for one doctor at one branch on one day.
 *
 * The schedule text and the doctor record come from the shared read path; the
 * "already taken" set comes from the same `appointments` table the website
 * portal writes to, so the app can never double-book a slot the website has
 * already claimed.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const params = new URL(request.url).searchParams;

    const doctorSlug = params.get('doctorSlug');
    const branchSlug = params.get('branchSlug') ?? undefined;
    const date = params.get('date');

    if (!doctorSlug) {
      throw new ApiError('BAD_REQUEST', '`doctorSlug` is required.');
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ApiError('BAD_REQUEST', '`date` is required in YYYY-MM-DD form.');
    }

    const doctor = await getDoctor(locale, doctorSlug);
    if (!doctor) {
      throw new ApiError('NOT_FOUND', `No doctor matches "${doctorSlug}".`);
    }

    const availability = branchSlug
      ? doctor.availability.filter((entry) => entry.branchSlug === branchSlug)
      : doctor.availability;

    if (doctor.availability.length > 0 && availability.length === 0) {
      throw new ApiError('NOT_FOUND', `That doctor does not consult at "${branchSlug}".`);
    }

    const primary = availability.find((entry) => entry.isPrimary) ?? availability[0] ?? null;

    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    // Booked slots are only readable when the doctor has a database id; demo
    // doctors (`demo-doctor-…`) have none, so every slot simply stays open.
    const takenSlots =
      doctor.id.startsWith('demo-')
        ? []
        : (
            await prisma.appointment.findMany({
              where: {
                doctorId: doctor.id,
                status: { not: 'CANCELLED' },
                preferredDate: { gte: dayStart, lte: dayEnd },
                ...(branchSlug ? { branch: { slug: branchSlug } } : {}),
              },
              select: { timeSlot: true },
            })
          ).map((row) => row.timeSlot);

    const slots = generateSlots({
      date,
      schedule: primary?.schedule ?? null,
      takenSlots,
    });

    return ok(slots, {
      locale,
      count: slots.length,
      available: slots.filter((slot) => slot.available).length,
      doctorSlug,
      branchSlug: primary?.branchSlug ?? null,
      date,
    });
  });
}
