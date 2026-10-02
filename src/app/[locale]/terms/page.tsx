import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PolicyArticle from '@/components/policy-article';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'legal' });

  return {
    title: t('terms'),
    description: t('placeholder'),
    alternates: {
      canonical: `/${params.locale}/terms`,
      languages: { en: '/en/terms', bn: '/bn/terms' },
    },
  };
}

export default function TermsPage() {
  return <PolicyArticle policy="terms" />;
}
