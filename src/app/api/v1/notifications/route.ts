import { prisma } from '@/lib/prisma';
import { getNotices } from '@/lib/content';
import { requireUser } from '@/lib/api/auth';
import { buildNotificationFeed } from '@/lib/api/dto';
import { handle, ok, parseLocale } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The in-app notification feed: current notices plus this patient's appointment
 * reminders and released reports.
 *
 * The feed is derived from existing tables rather than stored, so no new
 * "notification" table can drift from the clinical records. Whether an item has
 * been read is device state and lives in the app's local cache.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser(request);
    const locale = parseLocale(request);
    const limitParam = Number(new URL(request.url).searchParams.get('limit') ?? '50');
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

    const [notices, appointments, reports] = await Promise.all([
      getNotices(locale),
      prisma.appointment.findMany({
        where: { userId: user.id },
        orderBy: { preferredDate: 'desc' },
        take: 25,
        select: {
          id: true,
          referenceCode: true,
          preferredDate: true,
          timeSlot: true,
          patientName: true,
          status: true,
        },
      }),
      prisma.report.findMany({
        where: { userId: user.id, isReleased: true },
        orderBy: { reportDate: 'desc' },
        take: 25,
      }),
    ]);

    const feed = buildNotificationFeed({
      notices: notices.slice(0, 25).map((notice) => ({
        id: notice.id,
        title: notice.title,
        body: notice.body,
        publishedAt: notice.publishedAt,
      })),
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        referenceCode: appointment.referenceCode,
        preferredDate: appointment.preferredDate.toISOString(),
        timeSlot: appointment.timeSlot,
        patientName: appointment.patientName,
        status: appointment.status,
      })),
      reports,
      limit,
    });

    return ok(feed, { locale, count: feed.length });
  });
}
