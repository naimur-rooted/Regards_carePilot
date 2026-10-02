import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PortalClient } from '@/components/portal-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'portal' });

  return {
    title: t('title'),
    description: t('lede'),
    // The portal is private: it must never appear in search results.
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${params.locale}/portal`,
    },
  };
}

export default function PortalPage() {
  return <PortalClient />;
}
