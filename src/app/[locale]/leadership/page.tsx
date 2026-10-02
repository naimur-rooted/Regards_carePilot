import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getDoctors } from '@/lib/content';
import type { Locale } from '@/lib/types';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'leadership' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/leadership`,
      languages: { en: '/en/leadership', bn: '/bn/leadership', 'x-default': '/en/leadership' },
    },
  };
}

type Member = { name: string; role: { en: string; bn: string }; bio: { en: string; bn: string } };

/**
 * Leadership is authored in the content studio; until it is populated the page
 * falls back to the clinical leads drawn from the doctor directory, so the route
 * never renders empty.
 */
const placeholderTeam: Member[] = [];

export default async function LeadershipPage({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations('leadership');
  const tCommon = await getTranslations('common');
  const { locale } = params;

  const doctors = await getDoctors(locale);

  const clinicalLeads = [...doctors]
    .sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0))
    .slice(0, 6)
    .map<Member>((doctor) => ({
      name: doctor.name,
      role: { en: doctor.designation, bn: doctor.designation },
      bio: {
        en: `${doctor.specialtyName} · ${doctor.availability.length} branch${
          doctor.availability.length === 1 ? '' : 'es'
        }`,
        bn: `${doctor.specialtyName} · ${doctor.availability.length} টি শাখা`,
      },
    }));

  const team = [...placeholderTeam, ...clinicalLeads];
  const pick = (value: Member['role']) => (locale === 'bn' ? value.bn || value.en : value.en || value.bn);

  return (
    <div className="shell py-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-4">{t('title')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <li key={member.name} className="card">
            <h2 className="text-lg font-bold">{member.name}</h2>
            <p className="mt-1 text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-teal">
              {pick(member.role)}
            </p>
            <p className="mt-3 text-sm text-soft">
              {locale === 'bn' ? member.bio.bn || member.bio.en : member.bio.en || member.bio.bn}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted">
        <Link href="/doctors" className="font-semibold text-teal hover:underline">
          {tCommon('viewAll')}
        </Link>
      </p>
    </div>
  );
}
