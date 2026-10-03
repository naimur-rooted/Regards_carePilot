import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { FloatingActionHub } from '@/components/floating-action-hub';
import { routing, type AppLocale } from '@/i18n/routing';
import { siteName, siteUrl } from '@/lib/site';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#126d67',
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteName} | ${t('tagline')}`,
      template: `%s | ${siteName}`,
    },
    description: t('description'),
    keywords: t('keywords').split(',').map((keyword) => keyword.trim()),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        bn: '/bn',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName,
      title: `${siteName} | ${t('tagline')}`,
      description: t('description'),
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      alternateLocale: locale === 'bn' ? ['en_US'] : ['bn_BD'],
      url: `${siteUrl}/${locale}`,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: 'Regards CarePilot — Diagnostic & Consultation Network',
        },
      ],
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} | ${t('tagline')}`,
      description: t('description'),
      images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as AppLocale)) notFound();

  const messages = await getMessages();

  /**
   * Fonts are loaded from Google Fonts in the head below so the build never
   * depends on a network font fetch, while Bengali still gets a proper
   * Bangla-capable stack.
   */
  const fontVars = {
    '--font-sans': "'Inter', 'Segoe UI', Arial, sans-serif",
    '--font-display': "'Fraunces', Georgia, serif",
  } as React.CSSProperties;

  return (
    <html lang={locale} dir="ltr" style={fontVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router applies this in the root layout for every route */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;1,400&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only rounded-full focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          <SkipLabel />
        </a>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <FloatingActionHub />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function SkipLabel() {
  const t = await getTranslations('nav');
  return <>{t('skipToContent')}</>;
}
