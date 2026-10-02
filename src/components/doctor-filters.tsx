'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';

export type DoctorFilterValues = {
  search?: string;
  specialty?: string;
  branch?: string;
};

/**
 * Directory filter bar.
 *
 * Filter state lives in the URL rather than in component state so that results
 * are shareable, bookmarkable and server-rendered (better for SEO and for the
 * back button). Changing a control pushes a new URL and the server re-renders
 * the list.
 */
export function DoctorFilters({
  specialties,
  branches,
  initial,
  resultCount,
}: {
  specialties: { slug: string; name: string; doctorCount: number }[];
  branches: { slug: string; name: string }[];
  initial: DoctorFilterValues;
  resultCount: number;
}) {
  const t = useTranslations('doctors');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [search, setSearch] = useState(initial.search ?? '');

  function push(next: DoctorFilterValues) {
    const merged = { search, specialty: initial.specialty, branch: initial.branch, ...next };
    const params = new URLSearchParams();
    if (merged.search) params.set('search', merged.search);
    if (merged.specialty) params.set('specialty', merged.specialty);
    if (merged.branch) params.set('branch', merged.branch);

    const query = params.toString();
    router.push(query ? `/doctors?${query}` : '/doctors');
  }

  const hasFilters = Boolean(initial.search || initial.specialty || initial.branch);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        push({ search });
      }}
      className="mb-8 grid gap-3 rounded-panel border border-line bg-paper p-4 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-end"
    >
      <label>
        <span className="field-label">{t('searchLabel')}</span>
        <input
          type="search"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="field"
        />
      </label>

      <label>
        <span className="field-label">{t('specialtyLabel')}</span>
        <select
          name="specialty"
          value={initial.specialty ?? ''}
          onChange={(event) => push({ specialty: event.target.value || undefined })}
          className="field"
        >
          <option value="">{t('allSpecialties')}</option>
          {specialties.map((specialty) => (
            <option key={specialty.slug} value={specialty.slug}>
              {specialty.name} ({specialty.doctorCount})
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="field-label">{t('branchLabel')}</span>
        <select
          name="branch"
          value={initial.branch ?? ''}
          onChange={(event) => push({ branch: event.target.value || undefined })}
          className="field"
        >
          <option value="">{t('allBranches')}</option>
          {branches.map((branch) => (
            <option key={branch.slug} value={branch.slug}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        <button type="submit" className="btn-primary btn-small">
          {tCommon('search')}
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              router.push('/doctors');
            }}
            className="btn-secondary btn-small"
          >
            {tCommon('clearFilters')}
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="text-xs font-semibold text-muted sm:col-span-4">
        {t('resultsCount', { count: resultCount })}
      </p>
    </form>
  );
}
