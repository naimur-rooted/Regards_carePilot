'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import type { TestCategory } from '@/lib/types';

export type ServiceFilterValues = {
  category?: TestCategory;
  branch?: string;
  search?: string;
};

/**
 * Service catalogue filter bar.
 *
 * Like the doctor filters, state lives in the URL so a filtered catalogue can be
 * shared and rendered on the server.
 */
export function ServiceFilters({
  categories,
  branches,
  initial,
  resultCount,
}: {
  categories: TestCategory[];
  branches: { slug: string; name: string }[];
  initial: ServiceFilterValues;
  resultCount: number;
}) {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [search, setSearch] = useState(initial.search ?? '');

  function push(next: ServiceFilterValues) {
    const merged = { ...initial, ...next };
    const params = new URLSearchParams();
    if (merged.search) params.set('search', merged.search);
    if (merged.category) params.set('category', merged.category);
    if (merged.branch) params.set('branch', merged.branch);

    const query = params.toString();
    router.push(query ? `/services?${query}` : '/services');
  }

  const hasFilters = Boolean(initial.search || initial.category || initial.branch);

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
        <span className="field-label">{t('categoryLabel')}</span>
        <select
          name="category"
          value={initial.category ?? ''}
          onChange={(event) =>
            push({ category: (event.target.value || undefined) as TestCategory | undefined })
          }
          className="field"
        >
          <option value="">{t('allCategories')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {t(`categories.${category}`)}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="field-label">{t('availableAt')}</span>
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
              router.push('/services');
            }}
            className="btn-secondary btn-small"
          >
            {tCommon('clearFilters')}
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="text-xs font-semibold text-muted sm:col-span-4">
        {tCommon('resultsCount', { count: resultCount })}
      </p>
    </form>
  );
}
