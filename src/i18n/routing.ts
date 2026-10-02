import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'bn'] as const;

export type AppLocale = (typeof locales)[number];

export const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  bn: 'বাংলা',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // Every page is served from /en/... or /bn/... so URLs are explicit and
  // hreflang alternates are unambiguous.
  localePrefix: 'always',
});
