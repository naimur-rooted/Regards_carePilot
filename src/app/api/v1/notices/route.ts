import { getNotices } from '@/lib/content';
import { handle, ok, parseLocale } from '@/lib/api/http';

export const revalidate = 120;

/**
 * Notices, pinned first then newest first, with expired notices removed — the
 * same ordering rule the website homepage uses (`getNotices`).
 */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const limitParam = Number(new URL(request.url).searchParams.get('limit') ?? '50');
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 50;

    const notices = await getNotices(locale);
    const data = notices.slice(0, limit);

    return ok(data, { locale, count: data.length, total: notices.length }, { cacheable: true });
  });
}
