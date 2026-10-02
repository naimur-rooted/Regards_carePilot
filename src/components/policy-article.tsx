import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export type PolicyKey = 'terms' | 'privacy' | 'refund';

export const policyPaths: Record<PolicyKey, string> = {
  terms: 'terms',
  privacy: 'privacy-policy',
  refund: 'refund-policy',
};

/**
 * The three legal pages are structurally identical and their wording is authored
 * in the content studio, so a single renderer keeps their layout, metadata and
 * draft warning in step.
 */
export default async function PolicyArticle({ policy }: { policy: PolicyKey }) {
  const t = await getTranslations('legal');
  const tMeta = await getTranslations('meta');
  const tFooter = await getTranslations('footer');

  const updated = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="shell py-14">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">{t('updated')}</p>
        <h1 className="text-display-sm font-semibold">{t(policy)}</h1>
        <p className="mt-3 text-sm text-muted">
          {t('updated')}: <time dateTime={new Date().toISOString().slice(0, 10)}>{updated}</time>
        </p>
      </header>

      <div className="prose-care mt-8 max-w-3xl">
        <p>{t('placeholder')}</p>
        <h2>{tMeta('tagline')}</h2>
        <p>{tMeta('description')}</p>
        <p>{tFooter('about')}</p>
      </div>

      <p className="mt-10 max-w-3xl rounded-panel border border-coral bg-coral-soft p-5 text-sm text-[#8a3a20]">
        {t('draftWarning')}
      </p>

      <p className="mt-6 text-sm">
        <Link href="/contact" className="font-semibold text-teal hover:underline">
          {tFooter('quickLinks')} <span aria-hidden="true">→</span>
        </Link>
      </p>
    </div>
  );
}
