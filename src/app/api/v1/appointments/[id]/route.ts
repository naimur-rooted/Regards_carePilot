import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { appointmentDto } from '@/lib/api/dto';
import { ApiError, handle, ok, parseLocale } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INCLUDE = {
  doctor: { select: { slug: true, nameEn: true, nameBn: true, designationEn: true, designationBn: true } },
  branch: { select: { slug: true, nameEn: true, nameBn: true, cityEn: true, cityBn: true } },
};

/** One appointment, readable only by its owner. */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: INCLUDE,
    });

    if (!appointment) {
      throw new ApiError('NOT_FOUND', 'That appointment does not exist.');
    }
    if (appointment.userId !== user.id) {
      throw new ApiError('FORBIDDEN', 'That appointment belongs to another patient.');
    }

    return ok(appointmentDto(appointment, locale), { locale });
  });
}
