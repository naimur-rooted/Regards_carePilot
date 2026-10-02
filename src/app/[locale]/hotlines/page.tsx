import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { hotlines } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });

  return {
    title: t('hotlineTitle'),
    description: t('hotlineLede'),
    alternates: {
      canonical: `/${params.locale}/hotlines`,
      languages: { en: '/en/hotlines', bn: '/bn/hotlines', 'x-default': '/en/hotlines' },
    },
  };
}

export default async function HotlinesPage() {
  const t = await getTranslations('contact');
  const tNav = await getTranslations('nav');

  const label: Record<string, string> = {
    central: 'general',
    appointments: 'general',
    homeCollection: 'sample',
    reports: 'reports',
  };

  return (
    <div className="shell py-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-4">{tNav('hotlines')}</p>
        <h1 className="text-display-sm font-semibold">{t('hotlineTitle')}</h1>
        <p className="mt-3 text-soft">{t('hotlineLede')}</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {hotlines.map((line) => (
          <li key={line.key} className="card flex flex-col gap-2">
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-teal">
              {t(`departments.${label[line.key] ?? 'general'}`)}
            </p>
            <a
              href={`tel:${line.number.replace(/\s/g, '')}`}
              className="text-2xl font-extrabold text-ink hover:text-teal"
            >
              {line.number}
            </a>
            <p className="text-sm text-soft">{line.hours}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 rounded-panel border border-coral bg-coral-soft p-5 text-sm text-[#8a3a20]">
        {t('emergencyNotice')}
      </p>

      <p className="mt-6 text-sm">
        <Link href="/contact" className="font-semibold text-teal hover:underline">
          {t('title')} <span aria-hidden="true">→</span>
        </Link>
      </p>
    </div>
  );
}
