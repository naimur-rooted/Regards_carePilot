import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/contact-form';
import { BranchCard } from '@/components/cards';
import { getBranches } from '@/lib/content';
import { hotlines } from '@/lib/site';
import type { Locale } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/contact`,
      languages: { en: '/en/contact', bn: '/bn/contact', 'x-default': '/en/contact' },
    },
  };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const t = await getTranslations('contact');
  const branches = await getBranches(locale);

  return (
    <div className="shell py-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-4">{t('department')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm locale={locale} />

        <aside className="space-y-8">
          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('hotlineTitle')}
            </h2>
            <p className="mt-2 text-sm text-soft">{t('hotlineLede')}</p>
            <ul className="mt-4 space-y-2">
              {hotlines.map((line) => (
                <li
                  key={line.key}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-card border border-line bg-paper p-3"
                >
                  <span className="text-sm font-semibold text-soft">
                    {t(`departments.${line.key === 'central' ? 'general' : line.key === 'homeCollection' ? 'sample' : line.key === 'reports' ? 'reports' : 'general'}`)}
                  </span>
                  <a
                    href={`tel:${line.number.replace(/\s/g, '')}`}
                    className="font-bold text-teal hover:underline"
                  >
                    {line.number}
                  </a>
                  <span className="w-full text-xs text-muted">{line.hours}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('branchTitle')}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {branches.map((branch) => (
                <li key={branch.id}>
                  <BranchCard branch={branch} />
                </li>
              ))}
            </ul>
          </section>

          <p className="rounded-panel border border-coral bg-coral-soft p-4 text-sm text-[#8a3a20]">
            {t('emergencyNotice')}
          </p>
          <p className="text-xs text-muted">{t('feedbackNotice')}</p>
        </aside>
      </div>
    </div>
  );
}
