import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getNetworkStats } from '@/lib/content';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/about`,
      languages: { en: '/en/about', bn: '/bn/about', 'x-default': '/en/about' },
    },
  };
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('about');
  const tHome = await getTranslations('home.stats');
  const stats = await getNetworkStats();

  const goals = ['goal1', 'goal2', 'goal3', 'goal4'] as const;
  const values = [
    { title: t('value1Title'), body: t('value1Body') },
    { title: t('value2Title'), body: t('value2Body') },
    { title: t('value3Title'), body: t('value3Body') },
  ];

  const statItems = [
    { label: tHome('specialties'), value: stats.specialties },
    { label: tHome('doctors'), value: stats.doctors },
    { label: tHome('branches'), value: stats.branches },
    { label: tHome('tests'), value: stats.tests },
  ];

  return (
    <div className="shell py-14">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">{t('missionTitle')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-4 text-lg text-soft">{t('lede')}</p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-display-sm font-semibold text-teal">{stat.value}</p>
            <p className="mt-1 text-sm text-soft">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-display-sm font-semibold">{t('missionTitle')}</h2>
        <p className="mt-4 text-soft">{t('missionBody')}</p>
      </section>

      <section className="mt-14">
        <h2 className="text-display-sm font-semibold">{t('goalsTitle')}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {goals.map((goal, index) => (
            <li key={goal} className="card flex gap-4">
              <span className="text-2xl font-extrabold text-coral" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-soft">{t(goal)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-display-sm font-semibold">{t('valuesTitle')}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <li key={value.title} className="card">
              <h3 className="font-bold">{value.title}</h3>
              <p className="mt-2 text-sm text-soft">{value.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 rounded-panel border border-line bg-cream p-5 text-sm text-muted">
        {t('noticeDisclaimer')}
      </p>
    </div>
  );
}
