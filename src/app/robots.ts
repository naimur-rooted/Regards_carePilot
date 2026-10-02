import type { MetadataRoute } from 'next';
import { privateRoutes, siteUrl } from '@/lib/site';
import { routing } from '@/i18n/routing';

/**
 * robots.txt
 *
 * The patient portal and admin dashboard are excluded for both locales, and the
 * X-Robots-Tag header in next.config.mjs enforces noindex at the HTTP layer too.
 */
export default function robots(): MetadataRoute.Robots {
  const localeDisallows = routing.locales.flatMap((locale) =>
    privateRoutes.map((route) => `/${locale}${route}`),
  );

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...privateRoutes, ...localeDisallows, '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
