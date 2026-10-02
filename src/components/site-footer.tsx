import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { footerNav, hotlines, siteName } from '@/lib/site';

export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-cream">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-sm">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${t('nav.home')} — ${siteName}`}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00b050] via-[#008040] to-[#004d25] text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-400/30 transition-transform duration-300 group-hover:scale-110">
              <span className="text-lg font-black leading-none drop-shadow">+</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">
                <span className="text-[#0a2540] group-hover:text-ink transition-colors">Regards </span>
                <span className="bg-gradient-to-r from-[#00b050] via-[#008040] to-[#004d25] bg-clip-text text-transparent">
                  carepilot
                </span>
              </span>
              <span className="text-[8px] font-extrabold tracking-[0.2em] uppercase text-[#006a33] mt-1">
                DIAGNOSTIC &amp; CONSULTATION
              </span>
            </div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-soft">{t('footer.about')}</p>
          <p className="mt-4 rounded-xl border border-line bg-paper p-3 text-xs text-soft">
            <strong className="block text-ink">{t('contact.hotlineTitle')}</strong>
            <a href={`tel:${hotlines[0].number.replace(/\s/g, '')}`} className="font-semibold text-teal">
              {hotlines[0].number}
            </a>{' '}
            · {hotlines[0].hours}
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.key} aria-label={t(`footer.${group.key}`)}>
            <h2 className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-teal">
              {t(`footer.${group.key}`)}
            </h2>
            <ul className="space-y-2 text-sm text-soft">
              {group.links.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="transition hover:text-teal">
                    {t(`${'namespace' in link ? link.namespace : 'nav'}.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}. {t('footer.rights')}
          </p>
          <p className="flex flex-wrap gap-4">
            <Link href="/terms" className="hover:text-teal">
              {t('legal.terms')}
            </Link>
            <Link href="/privacy-policy" className="hover:text-teal">
              {t('legal.privacy')}
            </Link>
            <Link href="/refund-policy" className="hover:text-teal">
              {t('legal.refund')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
