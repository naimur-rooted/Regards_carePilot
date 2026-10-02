import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getBranches, getDoctors } from '@/lib/content';
import { siteUrl } from '@/lib/site';

/**
 * Sitemap with hreflang alternates for every public page in both locales.
 * The patient portal, admin dashboard and API routes are intentionally absent.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, branches] = await Promise.all([getDoctors('en'), getBranches('en')]);

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1, changeFrequency: 'daily' },
    { path: '/doctors', priority: 0.9, changeFrequency: 'daily' },
    { path: '/branches', priority: 0.9, changeFrequency: 'weekly' },
  ];

  const dynamicRoutes = [
    ...doctors.map((doctor) => ({
      path: `/doctors/${doctor.slug}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })),
    ...branches.map((branch) => ({
      path: `/branches/${branch.slug}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })),
  ];

  const routes = [...staticRoutes, ...dynamicRoutes];

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternate) => [
            alternate,
            `${siteUrl}/${alternate}${route.path}`,
          ]),
        ),
      },
    })),
  );
}
