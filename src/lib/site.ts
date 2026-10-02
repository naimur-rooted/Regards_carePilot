/**
 * Site-wide configuration: navigation, contact channels and the canonical URL.
 * Keeping this in one place means the header, footer, sitemap and metadata all
 * stay in agreement.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const siteName = 'Regards CarePilot';

/** Primary header navigation. `key` maps to messages nav.* */
export const primaryNav = [
  { key: 'doctors', href: '/doctors' },
  { key: 'branches', href: '/branches' },
  { key: 'sampleCollection', href: '/sample-collection' },
  { key: 'services', href: '/services' },
  { key: 'health', href: '/health' },
  { key: 'notices', href: '/notices' },
  { key: 'about', href: '/about' },
] as const;

/** Grouped footer navigation. */
export const footerNav = [
  {
    key: 'quickLinks',
    links: [
      { key: 'doctors', href: '/doctors' },
      { key: 'branches', href: '/branches' },
      { key: 'contact', href: '/contact' },
      { key: 'hotlines', href: '/hotlines' },
    ],
  },
  {
    key: 'patientInfo',
    links: [
      { key: 'sampleCollection', href: '/sample-collection' },
      { key: 'services', href: '/services' },
      { key: 'health', href: '/health' },
      { key: 'gallery', href: '/gallery' },
      { key: 'videos', href: '/videos' },
    ],
  },
  {
    key: 'organisation',
    links: [
      { key: 'about', href: '/about' },
      { key: 'leadership', href: '/leadership' },
      { key: 'notices', href: '/notices' },
      { key: 'portal', href: '/portal' },
    ],
  },
  {
    key: 'legal',
    links: [
      { key: 'terms', href: '/terms', namespace: 'legal' },
      { key: 'privacy', href: '/privacy-policy', namespace: 'legal' },
      { key: 'refund', href: '/refund-policy', namespace: 'legal' },
    ],
  },
] as const;

/** Operational hotlines. Replace with verified numbers before go-live. */
export const hotlines = [
  { key: 'central', number: '+880 1700 000000', hours: '24/7' },
  { key: 'appointments', number: '+880 1700 000010', hours: '8:00 am – 10:00 pm' },
  { key: 'homeCollection', number: '+880 1700 000020', hours: '7:00 am – 8:00 pm' },
  { key: 'reports', number: '+880 1700 000030', hours: '9:00 am – 6:00 pm' },
] as const;

/** Routes that must never be indexed, used by robots.txt and metadata. */
export const privateRoutes = ['/portal', '/admin'] as const;

export const socialImagePath = '/og-default.svg';
