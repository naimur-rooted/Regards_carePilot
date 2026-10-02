import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArticleCard } from '@/components/cards';
import { ArticleFilters } from '@/components/article-filters';
import { getArticles } from '@/lib/content';
import type { Locale } from '@/lib/types';

type SearchParams = { category?: string; search?: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'health' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/health`,
      languages: { en: '/en/health', bn: '/bn/health', 'x-default': '/en/health' },
    },
  };
}

export default async function HealthPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  const { locale } = params;
  const t = await getTranslations('health');
  const tCommon = await getTranslations('common');

  const articles = await getArticles(locale);
  const categories = Array.from(
    new Set(articles.map((article) => article.category).filter((value): value is string => Boolean(value))),
  );
  const search = searchParams.search?.trim().toLowerCase();

  const filtered = articles.filter((article) => {
    if (searchParams.category && article.category !== searchParams.category) return false;
    if (search && !`${article.title} ${article.excerpt}`.toLowerCase().includes(search)) return false;
    return true;
  });

  return (
    <div className="shell py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">{t('reviewedBy')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <ArticleFilters
        categories={categories}
        initial={{ category: searchParams.category, search: searchParams.search }}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="rounded-panel border border-line bg-cream p-8 text-center">
          <h2 className="text-lg font-bold">{t('noArticles')}</h2>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-muted">{tCommon('demoNotice')}</p>
    </div>
  );
}
