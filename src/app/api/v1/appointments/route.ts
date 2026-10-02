import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { appointmentDto } from '@/lib/api/dto';
import { sendPushToUser } from '@/lib/api/push';
import { referenceCode } from '@/lib/notifications';
import {
  ApiError,
  created,
  handle,
  ok,
  parseLocale,
  parsePagination,
  readJson,
} from '@/lib/api/http';
import { createAppointmentSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOCTOR_REF = { select: { slug: true, nameEn: true, nameBn: true, designationEn: true, designationBn: true } };
const BRANCH_REF = { select: { slug: true, nameEn: true, nameBn: true, cityEn: true, cityBn: true } };

/** The signed-in patient's appointments, newest first. */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);
    const params = new URL(request.url).searchParams;
    const { page, pageSize, skip } = parsePagination(request, { pageSize: 20 });

    const statusParam = params.get('status');
    const allowed = ['NEW', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] as const;
    const status = allowed.find((value) => value === statusParam?.toUpperCase());
    if (statusParam && !status) {
      throw new ApiError('BAD_REQUEST', `Unknown status "${statusParam}".`, { allowed });
    }

    const where = { userId: user.id, ...(status ? { status } : {}) };

    const [rows, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { doctor: DOCTOR_REF, branch: BRANCH_REF },
        orderBy: [{ preferredDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.appointment.count({ where }),
    ]);

    return ok(
      rows.map((row) => appointmentDto(row, locale)),
      { locale, count: rows.length, page, pageSize, total, hasMore: skip + rows.length < total },
    );
  });
}

/**
 * Creates an appointment in the shared `appointments` table.
 *
 * Because the website portal reads the same table, a booking made in the app
 * appears in the patient's web portal with no extra sync step. Patient details
 * default from the authenticated profile so a signed-in patient books in three
 * taps.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);
    const payload = validate(createAppointmentSchema, await readJson(request));

    const [doctor, branch] = await Promise.all([
      payload.doctorSlug
        ? prisma.doctor.findUnique({ where: { slug: payload.doctorSlug } })
        : Promise.resolve(null),
      payload.branchSlug
        ? prisma.branch.findUnique({ where: { slug: payload.branchSlug } })
        : Promise.resolve(null),
    ]);

    if (payload.doctorSlug && !doctor) {
      throw new ApiError('NOT_FOUND', `No doctor matches "${payload.doctorSlug}".`);
    }
    if (payload.branchSlug && !branch) {
      throw new ApiError('NOT_FOUND', `No branch matches "${payload.branchSlug}".`);
    }

    const patientName = payload.patientName ?? user.name;
    const phone = payload.phone ?? user.phone;

    if (!patientName) {
      throw new ApiError('BAD_REQUEST', 'A patient name is required.', {
        field: 'patientName',
      });
    }
    if (!phone) {
      throw new ApiError('BAD_REQUEST', 'A contact number is required.', { field: 'phone' });
    }

    const preferredDate = new Date(`${payload.preferredDate}T00:00:00.000Z`);

    // Guard the same slot the availability endpoint marks as taken.
    if (doctor) {
      const clash = await prisma.appointment.findFirst({
        where: {
          doctorId: doctor.id,
          status: { not: 'CANCELLED' },
          timeSlot: payload.timeSlot,
          preferredDate,
        },
        select: { id: true },
      });

      if (clash) {
        throw new ApiError('CONFLICT', 'That slot has just been taken. Please pick another.');
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        referenceCode: referenceCode('AP'),
        patientName,
        phone,
        email: payload.email ?? user.email,
        preferredDate,
        timeSlot: payload.timeSlot,
        reason: payload.reason ?? null,
        locale: payload.locale ?? locale,
        userId: user.id,
        doctorId: doctor?.id ?? null,
        branchId: branch?.id ?? null,
      },
      include: { doctor: DOCTOR_REF, branch: BRANCH_REF },
    });

    // Fire-and-forget: a push failure must never fail the booking.
    void sendPushToUser(user.id, {
      kind: 'appointment',
      title: `Appointment ${appointment.referenceCode}`,
      body: `${payload.preferredDate} · ${payload.timeSlot}`,
      refType: 'appointment',
      refId: appointment.id,
      locale: appointment.locale,
    }).catch(() => undefined);

    return created(appointmentDto(appointment, locale), { locale });
  });
}
