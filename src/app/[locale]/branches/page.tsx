import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BranchCard } from '@/components/cards';
import { BranchMap } from '@/components/branch-map';
import { getBranches } from '@/lib/content';
import type { Locale } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'branches' });

  return {
    title: t('title'),
    description: t('lede'),
    alternates: {
      canonical: `/${params.locale}/branches`,
      languages: { en: '/en/branches', bn: '/bn/branches', 'x-default': '/en/branches' },
    },
  };
}

export default async function BranchesPage({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations('branches');
  const branches = await getBranches(params.locale);

  return (
    <div className="shell py-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">{t('address')}</p>
        <h1 className="text-display-sm font-semibold">{t('title')}</h1>
        <p className="mt-3 text-soft">{t('lede')}</p>
      </header>

      <BranchMap branches={branches} />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <li key={branch.id}>
            <BranchCard branch={branch} />
          </li>
        ))}
      </ul>
    </div>
  );
}
