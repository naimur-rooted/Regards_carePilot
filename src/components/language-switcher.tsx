'use client';

import { useParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { localeLabels, locales, type AppLocale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/**
 * Language switcher.
 *
 * Rewrites the locale segment of the current URL directly instead of rebuilding
 * the path, so dynamic routes (doctor and branch profiles) keep their slug and
 * any query string.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('nav');
  const params = useParams();
  const pathname = usePathname();

  const activeLocale = (params?.locale as AppLocale) ?? 'en';
  const alternateLocale = locales.find((locale) => locale !== activeLocale) ?? 'en';
  const currentPath = pathname || '/';

  if (compact) {
    return (
      <Link
        href={currentPath}
        locale={alternateLocale}
        lang={alternateLocale}
        className="rounded-full border border-line px-3 py-1.5 text-xs font-bold text-soft transition hover:border-teal hover:text-teal"
        title={t('language')}
      >
        {localeLabels[alternateLocale]}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-line p-0.5" role="group" aria-label={t('language')}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={currentPath}
          locale={locale}
          lang={locale}
          aria-current={locale === activeLocale ? 'true' : undefined}
          className={
            locale === activeLocale
              ? 'rounded-full bg-teal px-3 py-1 text-xs font-bold text-white'
              : 'rounded-full px-3 py-1 text-xs font-bold text-soft transition hover:text-teal'
          }
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}

/** Mobile navigation disclosure. */
export function MobileNav() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t('menuClose') : t('menuOpen')}
        className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-line bg-white shadow-xs transition-transform active:scale-95"
      >
        <span className="block h-[2px] w-5 bg-ink" />
        <span className="block h-[2px] w-5 bg-ink" />
        <span className="block h-[2px] w-5 bg-ink" />
      </button>

      <div
        id="mobile-nav"
        hidden={!open}
        className="absolute left-0 right-0 top-full border-b border-line bg-white/95 backdrop-blur-xl px-5 pb-6 pt-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="text-xs font-black text-[#004d25] uppercase tracking-wider mb-2 border-b border-line pb-1.5 flex items-center justify-between">
          <span>Find Care &amp; Services</span>
          <span className="text-[10px] text-muted font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Menu</span>
        </div>

        <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1.5">
          <Link
            href="/doctors"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl border border-emerald-600/30 bg-emerald-50/60 p-2.5 text-xs font-extrabold text-emerald-900 transition-all duration-200 active:scale-98 hover:bg-emerald-50 hover:shadow-xs"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-emerald-700 font-bold border border-emerald-200 group-hover:bg-[#004d25] group-hover:text-white transition-colors">
              👤
            </span>
            <div>
              <span className="block font-extrabold text-xs">Find a Doctor</span>
              <span className="text-[10px] text-soft font-medium">Expert specialists across all fields</span>
            </div>
          </Link>

          <Link
            href="/health"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-ink transition-all duration-200 active:scale-98 hover:bg-emerald-50/60"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-soft font-bold border border-line group-hover:bg-[#004d25] group-hover:text-white transition-colors">
              ♡
            </span>
            <div>
              <span className="block font-bold text-xs group-hover:text-[#004d25]">Health Packages</span>
              <span className="text-[10px] text-soft font-medium">Comprehensive health checkups</span>
            </div>
          </Link>

          <Link
            href="/branches"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-ink transition-all duration-200 active:scale-98 hover:bg-emerald-50/60"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-soft font-bold border border-line group-hover:bg-[#004d25] group-hover:text-white transition-colors">
              🏢
            </span>
            <div>
              <span className="block font-bold text-xs group-hover:text-[#004d25]">Our Branches</span>
              <span className="text-[10px] text-soft font-medium">24+ locations across Bangladesh</span>
            </div>
          </Link>

          <Link
            href="/sample-collection"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-ink transition-all duration-200 active:scale-98 hover:bg-emerald-50/60"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-soft font-bold border border-line group-hover:bg-[#004d25] group-hover:text-white transition-colors">
              🧪
            </span>
            <div>
              <span className="block font-bold text-xs group-hover:text-[#004d25]">Home Collection</span>
              <span className="text-[10px] text-soft font-medium">Sample collection at your doorstep</span>
            </div>
          </Link>

          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl border border-emerald-600/40 bg-emerald-50/80 p-2.5 text-xs font-extrabold text-[#004d25] mt-1 transition-all duration-200 active:scale-98 hover:bg-emerald-100"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#004d25] text-white font-bold">
              📥
            </span>
            <div>
              <span className="block font-extrabold text-xs">Report Download</span>
              <span className="text-[10px] text-soft font-medium">Download patient diagnostic reports</span>
            </div>
          </Link>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="border-t border-line mt-2 pt-2 py-2 text-xs font-bold text-soft hover:text-[#004d25]"
          >
            Contact Support &amp; Hotlines
          </Link>
        </nav>

        <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
          <LanguageSwitcher />
          <Link href="/doctors" onClick={() => setOpen(false)} className="btn-primary btn-small">
            {t('book')}
          </Link>
        </div>
      </div>
    </div>
  );
}
