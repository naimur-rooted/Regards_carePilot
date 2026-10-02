import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TestCard } from '@/components/cards';
import { ServiceFilters } from '@/components/service-filters';
import { getBranches, getTests } from '@/lib/content';
import type { Locale, TestCategory } from '@/lib/types';

const CATEGORIES: TestCategory[] = [
  'PATHOLOGY',
  'RADIOLOGY',
  'CARDIOLOGY',
  'IMAGING',
  'PACKAGE',
  'OTHER',
];

type SearchParams = { category?: string; branch?: string; search?: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/services`,
      languages: { en: '/en/services', bn: '/bn/services', 'x-default': '/en/services' },
    },
  };
}

export default async function ServicesPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  const { locale } = params;
  const t = await getTranslations('services');

  const category = CATEGORIES.find((value) => value === searchParams.category);
  const search = searchParams.search?.trim().toLowerCase();

  const [allTests, branches] = await Promise.all([getTests(locale), getBranches(locale)]);

  const branchSlug = branches.find((item) => item.slug === searchParams.branch)?.slug;
  const activeBranch = branches.find((item) => item.slug === branchSlug);

  const tests = allTests.filter((test) => {
    if (category && test.category !== category) return false;
    if (branchSlug) {
      const testBranch = test.branchName;
      const matchesBranch =
        !testBranch || branches.find((item) => item.name === testBranch)?.slug === branchSlug;
      if (!matchesBranch) return false;
    }
    if (search && !test.name.toLowerCase().includes(search)) return false;
    return true;
  });

  return (
    <div className="shell py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">{t('categoryLabel')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <ServiceFilters
        categories={CATEGORIES}
        branches={branches.map((branch) => ({ slug: branch.slug, name: branch.name }))}
        initial={{ category, branch: branchSlug, search: searchParams.search }}
        resultCount={tests.length}
      />

      {tests.length === 0 ? (
        <div className="rounded-panel border border-line bg-cream p-8 text-center">
          <h2 className="text-lg font-bold">{t('noResults')}</h2>
          <p className="mt-2 text-sm text-soft">{t('priceNotice')}</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <li key={test.id}>
              <TestCard test={test} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-muted">{t('priceNotice')}</p>
      {activeBranch ? <p className="text-xs text-muted">{activeBranch.name}</p> : null}
    </div>
  );
}
