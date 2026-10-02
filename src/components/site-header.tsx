'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher, MobileNav } from '@/components/language-switcher';
import { primaryNav } from '@/lib/site';

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      {/* Top Notification Bar */}
      <div className="bg-[#004d25] text-[0.72rem] text-white">
        <div className="shell flex min-h-[34px] items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-medium">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            ISO 9001:2015 Certified Diagnostic &amp; Consultation Network
          </span>
          <span className="hidden items-center gap-5 sm:flex font-semibold">
            <span>Hotline: <strong className="text-emerald-300">10636 / +880 9611 530530</strong></span>
            <Link href="/hotlines" className="hover:text-emerald-200 transition-colors">
              {t('hotlines')}
            </Link>
            <Link href="/contact" className="hover:text-emerald-200 transition-colors">
              {t('contact')}
            </Link>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="shell relative flex min-h-[78px] items-center gap-5">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3" aria-label="Regards CarePilot Home">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00b050] via-[#008040] to-[#004d25] text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-400/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <span className="text-xl font-black leading-none drop-shadow">+</span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-[#0a2540] group-hover:text-ink transition-colors">Regards </span>
              <span className="bg-gradient-to-r from-[#00b050] via-[#008040] to-[#004d25] bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-600 transition-all">
                carepilot
              </span>
            </span>
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#006a33] mt-1 group-hover:text-emerald-700 transition-colors">
              DIAGNOSTIC &amp; CONSULTATION
            </span>
          </div>
        </Link>

        {/* Top Direct Navigation Links (No dropdown, with satisfying hover animations!) */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-1.5 lg:flex ml-2">
          {primaryNav.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative px-3 py-1.5 text-[0.82rem] font-bold rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 ${
                  active
                    ? 'bg-[#004d25] text-white shadow-sm font-extrabold'
                    : 'text-ink hover:text-[#004d25] hover:bg-emerald-50/80 hover:shadow-xs'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}

          {/* Direct Highlighted Report Download Button with Satisfying Hover Effect */}
          <Link
            href="/portal"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50/80 text-[#004d25] font-extrabold text-[0.82rem] transition-all duration-300 ease-out hover:bg-emerald-100 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md ml-1"
          >
            <svg className="h-4 w-4 fill-current transition-transform duration-300 hover:translate-y-0.5" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            <span>Report Download</span>
          </Link>
        </nav>

        {/* Utility Actions */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher compact />
          </div>

          <Link
            href="/doctors"
            className="btn-primary btn-small hidden sm:inline-flex shadow-md hover:scale-105 transition-transform"
          >
            {t('book')}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
