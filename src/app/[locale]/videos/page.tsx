import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getArticles } from '@/lib/content';
import type { Locale } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'videos' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/videos`,
      languages: { en: '/en/videos', bn: '/bn/videos', 'x-default': '/en/videos' },
    },
  };
}

/**
 * Video records are authored in the content studio. Until they exist, the page
 * points at the written explainers so the route is useful rather than empty.
 */
export default async function VideosPage({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations('videos');
  const tHealth = await getTranslations('health');
  const tCommon = await getTranslations('common');
  const articles = await getArticles(params.locale);

  return (
    <div className="shell py-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-4">{t('title')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      {articles.length === 0 ? (
        <p className="rounded-panel border border-line bg-cream p-8 text-center text-sm text-soft">
          {t('empty')}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <li key={article.id} className="card flex flex-col gap-2">
              <div
                className="grid h-28 place-items-center rounded-card bg-teal-soft text-3xl"
                aria-hidden="true"
              >
                ▶
              </div>
              {article.category ? (
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-teal">
                  {tHealth(`categories.${article.category}`)}
                </p>
              ) : null}
              <h2 className="text-base font-bold leading-snug">{article.title}</h2>
              <p className="text-sm text-soft">{article.excerpt}</p>
              <a
                href={`/${params.locale}/health/${article.slug}`}
                className="mt-auto pt-3 text-sm font-bold text-teal hover:underline"
              >
                {t('watch')} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-muted">{tCommon('demoNotice')}</p>
    </div>
  );
}
