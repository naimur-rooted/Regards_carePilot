import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api/auth';
import { reportDto } from '@/lib/api/dto';
import { handle, ok, parsePagination } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The patient's reports. `fileUrl` is only populated for released reports;
 * everything else shows as "pending clinical review" in the app.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const { page, pageSize, skip } = parsePagination(request, { pageSize: 20 });
    const releasedOnly = new URL(request.url).searchParams.get('releasedOnly') === 'true';

    const where = { userId: user.id, ...(releasedOnly ? { isReleased: true } : {}) };

    const [rows, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { reportDate: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.report.count({ where }),
    ]);

    return ok(rows.map(reportDto), {
      count: rows.length,
      page,
      pageSize,
      total,
      hasMore: skip + rows.length < total,
    });
  });
}
