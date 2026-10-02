import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/cards';
import { Link } from '@/i18n/navigation';
import { cldImage } from '@/lib/cloudinary';
import { getArticle, getArticles } from '@/lib/content';
import type { Locale } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getArticles('en');
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.locale as Locale, params.slug);
  if (!article) return { title: 'Article not found' };

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/${params.locale}/health/${article.slug}`,
      languages: {
        en: `/en/health/${article.slug}`,
        bn: `/bn/health/${article.slug}`,
      },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  const t = await getTranslations('health');

  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const cover = cldImage(article.cover, { width: 1200, height: 630, crop: 'fill' });
  const all = await getArticles(locale);
  const related = all
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="shell py-14">
      <Link href="/health" className="text-sm font-semibold text-teal hover:underline">
        <span aria-hidden="true">←</span> {t('backToArticles')}
      </Link>

      <header className="mx-auto mt-6 max-w-3xl text-center">
        {article.category ? (
          <p className="eyebrow justify-center mb-4">{t(`categories.${article.category}`)}</p>
        ) : null}
        <h1 className="text-display-sm font-semibold">{article.title}</h1>
        <p className="mt-4 text-lg text-soft">{article.excerpt}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted">
          <span>
            {t('author')}: <strong className="text-soft">{article.author}</strong>
          </span>
          {article.reviewedBy ? (
            <span>
              {t('reviewedBy')}: <strong className="text-soft">{article.reviewedBy}</strong>
            </span>
          ) : null}
          {article.publishedAt ? (
            <span>
              {t('publishedOn')}:{' '}
              <time dateTime={article.publishedAt}>{dateFormat.format(new Date(article.publishedAt))}</time>
            </span>
          ) : null}
          {article.reviewDate ? (
            <span>
              {t('nextReview')}:{' '}
              <time dateTime={article.reviewDate}>{dateFormat.format(new Date(article.reviewDate))}</time>
            </span>
          ) : null}
          {article.readingMinutes ? (
            <span className="font-semibold text-teal">{t('minRead', { minutes: article.readingMinutes })}</span>
          ) : null}
        </div>
      </header>

      {cover ? (
        <div className="relative mx-auto mt-8 h-64 w-full max-w-4xl overflow-hidden rounded-panel bg-teal-soft sm:h-80">
          <Image src={cover} alt={article.title} fill priority className="object-cover" sizes="(max-width: 900px) 100vw, 900px" />
        </div>
      ) : null}

      <div className="prose-care mx-auto mt-10 max-w-3xl">
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {article.tags.length > 0 ? (
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-soft">{t('tags')}:</span>
          {article.tags.map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-display-sm font-semibold">{t('related')}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <ArticleCard article={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
