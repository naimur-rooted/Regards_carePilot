import { getArticles } from '@/lib/content';
import { handle, ok, parseLocale } from '@/lib/api/http';

export const revalidate = 300;

/** Health articles. `category` and `tag` narrow the feed; `limit` caps it. */
export async function GET(request: Request) {
  return handle(async () => {
    const locale = parseLocale(request);
    const params = new URL(request.url).searchParams;
    const category = params.get('category');
    const tag = params.get('tag');
    const limitParam = Number(params.get('limit') ?? '30');
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 30;

    const articles = await getArticles(locale);
    const filtered = articles.filter(
      (article) =>
        (!category || article.category === category) && (!tag || article.tags.includes(tag)),
    );

    return ok(
      filtered.slice(0, limit),
      { locale, count: Math.min(filtered.length, limit), total: filtered.length },
      { cacheable: true },
    );
  });
}
