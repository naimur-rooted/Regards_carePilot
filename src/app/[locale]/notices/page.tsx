import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NoticeFeed } from '@/components/cards';
import { getNotices } from '@/lib/content';
import type { Locale, NoticeView } from '@/lib/types';

type SearchParams = { from?: string; to?: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'notices' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/notices`,
      languages: { en: '/en/notices', bn: '/bn/notices', 'x-default': '/en/notices' },
    },
  };
}

/** Date filters are inclusive on both ends; invalid input is ignored. */
function inRange(notice: NoticeView, from?: string, to?: string): boolean {
  const published = new Date(notice.publishedAt).getTime();
  const fromMs = from ? new Date(from).getTime() : null;
  const toMs = to ? new Date(`${to}T23:59:59.999Z`).getTime() : null;
  if (fromMs !== null && Number.isNaN(fromMs)) return true;
  if (toMs !== null && Number.isNaN(toMs)) return true;
  if (fromMs !== null && published < fromMs) return false;
  if (toMs !== null && published > toMs) return false;
  return true;
}

export default async function NoticesPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  const t = await getTranslations('notices');
  const notices = await getNotices(params.locale);
  const filtered = notices.filter((notice) => inRange(notice, searchParams.from, searchParams.to));

  return (
    <div className="shell py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">{t('publishedOn')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <form className="mb-8 grid gap-3 rounded-panel border border-line bg-paper p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label>
          <span className="field-label">{t('filterFrom')}</span>
          <input type="date" name="from" defaultValue={searchParams.from ?? ''} className="field" />
        </label>
        <label>
          <span className="field-label">{t('filterTo')}</span>
          <input type="date" name="to" defaultValue={searchParams.to ?? ''} className="field" />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary btn-small">
            {t('applyFilter')}
          </button>
          <a href={`/${params.locale}/notices`} className="btn-secondary btn-small">
            {t('reset')}
          </a>
        </div>
      </form>

      <NoticeFeed notices={filtered} />
    </div>
  );
}
