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
    title: t('refund'),
    description: t('placeholder'),
    alternates: {
      canonical: `/${params.locale}/refund-policy`,
      languages: { en: '/en/refund-policy', bn: '/bn/refund-policy' },
    },
  };
}

export default function RefundPolicyPage() {
  return <PolicyArticle policy="refund" />;
}
