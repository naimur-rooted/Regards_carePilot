import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const POLICIES = ['terms', 'privacy', 'refund'] as const;

export type PolicyKey = (typeof POLICIES)[number];

/**
 * The three legal pages are structurally identical and are authored in the content
 * studio; a shared renderer keeps their layout, metadata and warning in step.
 */
export function policyMetadata(policy: PolicyKey, locale: string, title: string): Metadata {
  return {
    title,
    description: title,
    alternates: {
      canonical: `/${locale}/${policy === 'privacy' ? 'privacy-policy' : `${policy}-policy`}`,
      languages: {
        en: `/en/${policy === 'privacy' ? 'privacy-policy' : `${policy}-policy`}`,
        bn: `/bn/${policy === 'privacy' ? 'privacy-policy' : `${policy}-policy`}`,
      },
    },
  };
}

export function PolicyBody({ policy }: { policy: PolicyKey }) {
  return <PolicyArticle policy={policy} />;
}

async function PolicyArticle({ policy }: { policy: PolicyKey }) {
  const t = await getTranslations('legal');
  const tNav = await getTranslations('nav');
  const tHome = await getTranslations('home');

  const updated = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const navKey = policy === 'privacy' ? 'privacy-policy' : `${policy}-policy`;

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
        <h2>{tHome('meta.tagline')}</h2>
        <p>{tHome('meta.description')}</p>
        <ul>
          <li>{tHome('footer.about')}</li>
        </ul>
      </div>

      <p className="mt-10 max-w-3xl rounded-panel border border-coral bg-coral-soft p-5 text-sm text-[#8a3a20]">
        {t('draftWarning')}
      </p>

      <p className="mt-6 text-sm">
        <a href={`/${''}`} className="font-semibold text-teal hover:underline">
          {tNav('home')} <span aria-hidden="true">→</span>
        </a>
        <span className="sr-only">{navKey}</span>
      </p>
    </div>
  );
}
