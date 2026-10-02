import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { appointmentDto } from '@/lib/api/dto';
import { ApiError, handle, ok, parseLocale, readJson } from '@/lib/api/http';
import { cancelAppointmentSchema, validate } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INCLUDE = {
  doctor: { select: { slug: true, nameEn: true, nameBn: true, designationEn: true, designationBn: true } },
  branch: { select: { slug: true, nameEn: true, nameBn: true, cityEn: true, cityBn: true } },
};

/**
 * Cancels an appointment. Implemented as a status transition rather than a
 * delete so the care team keeps its audit trail and the website portal shows the
 * same history.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);
    const payload = validate(cancelAppointmentSchema, await readJson(request));

    const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });

    if (!appointment) {
      throw new ApiError('NOT_FOUND', 'That appointment does not exist.');
    }
    if (appointment.userId !== user.id) {
      throw new ApiError('FORBIDDEN', 'That appointment belongs to another patient.');
    }
    if (appointment.status === 'CANCELLED') {
      throw new ApiError('CONFLICT', 'That appointment is already cancelled.');
    }
    if (appointment.status === 'COMPLETED') {
      throw new ApiError('CONFLICT', 'A completed appointment cannot be cancelled.');
    }

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: 'CANCELLED',
        ...(payload.reason
          ? {
              reason: [appointment.reason, `Cancelled: ${payload.reason}`]
                .filter(Boolean)
                .join('\n'),
            }
          : {}),
      },
      include: INCLUDE,
    });

    return ok(appointmentDto(updated, locale), { locale });
  });
}
