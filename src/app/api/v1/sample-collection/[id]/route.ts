import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { sampleCollectionDto } from '@/lib/api/dto';
import { ApiError, handle, ok, parseLocale } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One sample-collection request, with the status the care team has moved it to:
 * `NEW → CONTACTED → SCHEDULED → COMPLETED`. The app renders this as its
 * tracking timeline.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);

    const record = await prisma.sampleCollectionRequest.findUnique({
      where: { id: params.id },
      include: { branch: { select: { slug: true, nameEn: true, nameBn: true, cityEn: true, cityBn: true } } },
    });

    if (!record) {
      throw new ApiError('NOT_FOUND', 'That request does not exist.');
    }
    if (user.phone && record.phone !== user.phone) {
      throw new ApiError('FORBIDDEN', 'That request belongs to another patient.');
    }

    return ok(sampleCollectionDto(record, locale), { locale });
  });
}
