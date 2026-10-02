import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { reportDto } from '@/lib/api/dto';
import { ApiError, handle, ok } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** One report. The PDF itself is served from Cloudinary via `fileUrl`. */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireUser(request);

    const report = await prisma.report.findUnique({ where: { id: params.id } });

    if (!report) {
      throw new ApiError('NOT_FOUND', 'That report does not exist.');
    }
    if (report.userId !== user.id) {
      throw new ApiError('FORBIDDEN', 'That report belongs to another patient.');
    }

    return ok(reportDto(report));
  });
}
