'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { BranchView } from '@/lib/types';

/**
 * Branch locator: a map/list toggle with a branch selector.
 * The embedded map is an iframe so no mapping SDK or API key is required;
 * swap in Google Maps JS or Mapbox later behind the same component.
 */
export function BranchMap({ branches }: { branches: BranchView[] }) {
  const t = useTranslations('branches');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [activeSlug, setActiveSlug] = useState(branches[0]?.slug ?? '');

  const active = branches.find((branch) => branch.slug === activeSlug) ?? branches[0];

  if (!active) return null;

  return (
    <section aria-label={t('title')} className="rounded-panel border border-line bg-paper p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-line p-0.5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'map'}
            onClick={() => setView('map')}
            className={
              view === 'map'
                ? 'rounded-full bg-teal px-4 py-1.5 text-xs font-bold text-white'
                : 'rounded-full px-4 py-1.5 text-xs font-bold text-soft'
            }
          >
            Map
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'list'}
            onClick={() => setView('list')}
            className={
              view === 'list'
                ? 'rounded-full bg-teal px-4 py-1.5 text-xs font-bold text-white'
                : 'rounded-full px-4 py-1.5 text-xs font-bold text-soft'
            }
          >
            List
          </button>
        </div>

        <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-soft">
          {t('viewBranch')}
          <select
            value={activeSlug}
            onChange={(event) => setActiveSlug(event.target.value)}
            className="field h-10 w-auto min-w-[12rem] py-0"
          >
            {branches.map((branch) => (
              <option key={branch.slug} value={branch.slug}>
                {branch.name} — {branch.city}
              </option>
            ))}
          </select>
        </label>
      </div>

      {view === 'map' ? (
        <div className="overflow-hidden rounded-card border border-line">
          {active.mapUrl ? (
            <iframe
              title={`${t('title')}: ${active.name}`}
              src={active.mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0"
            />
          ) : (
            <p className="p-6 text-sm text-soft">{t('noServices')}</p>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <li key={branch.slug} className="rounded-card border border-line p-4">
              <h3 className="font-bold">
                <Link href={`/branches/${branch.slug}`} className="hover:text-teal">
                  {branch.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-soft">{branch.address}</p>
              <p className="mt-2 text-xs text-muted">{branch.hours}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-soft">{active.address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.address)}`}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-teal hover:underline"
        >
          {t('openMaps')} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
