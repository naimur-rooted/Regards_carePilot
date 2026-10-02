import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SampleCollectionForm } from '@/components/sample-collection-form';
import { getBranches, getTests } from '@/lib/content';
import { hotlines } from '@/lib/site';
import type { Locale } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'sample' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/sample-collection`,
      languages: {
        en: '/en/sample-collection',
        bn: '/bn/sample-collection',
        'x-default': '/en/sample-collection',
      },
    },
  };
}

export default async function SampleCollectionPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const t = await getTranslations('sample');

  const [tests, branches] = await Promise.all([getTests(locale), getBranches(locale)]);

  const steps = ['step1', 'step2', 'step3', 'step4'] as const;
  const preparation = ['preparation1', 'preparation2', 'preparation3'] as const;
  const slots = ['morning', 'afternoon', 'evening'] as const;

  return (
    <div className="shell py-14">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">{t('stepsTitle')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <section>
        <h2 className="text-display-sm font-semibold">{t('stepsTitle')}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step} className="card">
              <p className="text-2xl font-extrabold text-coral" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-bold">{t(`${step}.title`)}</h3>
              <p className="mt-2 text-sm text-soft">{t(`${step}.body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <SampleCollectionForm locale={locale} tests={tests} />

        <aside className="space-y-8">
          <section className="card">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('preparationTitle')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-soft">
              {preparation.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-teal" aria-hidden="true">
                    ✓
                  </span>
                  {t(item)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('coverageTitle')}
            </h2>
            <ul className="mt-3 space-y-2">
              {branches.map((branch) => (
                <li
                  key={branch.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-card border border-line bg-paper p-3"
                >
                  <span className="text-sm font-semibold">{branch.name}</span>
                  <span className="text-xs text-muted">{branch.city}</span>
                  <span className="w-full text-xs text-soft">{branch.address}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('slot')}
            </h2>
            <ul className="mt-3 space-y-2">
              {hotlines
                .filter((line) => line.key === 'homeCollection' || line.key === 'central')
                .map((line) => (
                  <li key={line.key} className="rounded-card border border-line bg-paper p-3">
                    <a
                      href={`tel:${line.number.replace(/\s/g, '')}`}
                      className="font-bold text-teal hover:underline"
                    >
                      {line.number}
                    </a>
                    <span className="ml-2 text-xs text-muted">{line.hours}</span>
                  </li>
                ))}
            </ul>
            <p className="mt-3 text-xs text-muted">{slots.map((slot) => t(`slots.${slot}`)).join(' · ')}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
