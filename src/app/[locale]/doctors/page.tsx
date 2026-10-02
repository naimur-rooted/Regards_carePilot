import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DoctorCard } from '@/components/cards';
import { DoctorFilters } from '@/components/doctor-filters';
import { getBranches, getDoctors, getSpecialties } from '@/lib/content';
import type { Locale } from '@/lib/types';

type SearchParams = { search?: string; specialty?: string; branch?: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'doctors' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/doctors`,
      languages: { en: '/en/doctors', bn: '/bn/doctors', 'x-default': '/en/doctors' },
    },
  };
}

export default async function DoctorsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  const { locale } = params;
  const t = await getTranslations('doctors');

  const filters = {
    search: searchParams.search,
    specialty: searchParams.specialty,
    branch: searchParams.branch,
  };

  const [doctors, specialties, branches] = await Promise.all([
    getDoctors(locale, filters),
    getSpecialties(locale),
    getBranches(locale),
  ]);

  const activeSpecialty = specialties.find((item) => item.slug === filters.specialty);
  const activeBranch = branches.find((item) => item.slug === filters.branch);

  return (
    <div className="shell py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">{t('specialtyLabel')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
        {activeSpecialty || activeBranch ? (
          <p className="mt-3 text-sm text-muted">
            {[activeSpecialty?.name, activeBranch?.name].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </header>

      <DoctorFilters
        specialties={specialties.map((specialty) => ({
          slug: specialty.slug,
          name: specialty.name,
          doctorCount: specialty.doctorCount,
        }))}
        branches={branches.map((branch) => ({ slug: branch.slug, name: branch.name }))}
        initial={filters}
        resultCount={doctors.length}
      />

      {doctors.length === 0 ? (
        <div className="rounded-panel border border-line bg-cream p-8 text-center">
          <h2 className="text-lg font-bold">{t('noResults')}</h2>
          <p className="mt-2 text-sm text-soft">{t('noResultsHint')}</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, index) => (
            <li key={doctor.id}>
              <DoctorCard doctor={doctor} index={index} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
