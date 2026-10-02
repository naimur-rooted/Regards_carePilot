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
    title: t('privacy'),
    description: t('placeholder'),
    alternates: {
      canonical: `/${params.locale}/privacy-policy`,
      languages: { en: '/en/privacy-policy', bn: '/bn/privacy-policy' },
    },
  };
}

export default function PrivacyPage() {
  return <PolicyArticle policy="privacy" />;
}
