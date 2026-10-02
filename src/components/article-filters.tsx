'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';

export type ArticleFilterValues = {
  category?: string;
  search?: string;
};

/** Topic and keyword filters for the health article index, driven by the URL. */
export function ArticleFilters({
  categories,
  initial,
  resultCount,
}: {
  categories: string[];
  initial: ArticleFilterValues;
  resultCount: number;
}) {
  const t = useTranslations('health');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [search, setSearch] = useState(initial.search ?? '');

  function push(next: ArticleFilterValues) {
    const merged = { ...initial, ...next };
    const params = new URLSearchParams();
    if (merged.search) params.set('search', merged.search);
    if (merged.category) params.set('category', merged.category);

    const query = params.toString();
    router.push(query ? `/health?${query}` : '/health');
  }

  const hasFilters = Boolean(initial.search || initial.category);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        push({ search });
      }}
      className="mb-8 grid gap-3 rounded-panel border border-line bg-paper p-4 sm:grid-cols-[1.5fr_1fr_auto] sm:items-end"
    >
      <label>
        <span className="field-label">{tCommon('search')}</span>
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
        <span className="field-label">{tCommon('filters')}</span>
        <select
          name="category"
          value={initial.category ?? ''}
          onChange={(event) => push({ category: event.target.value || undefined })}
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

      <div className="flex gap-2">
        <button type="submit" className="btn-primary btn-small">
          {tCommon('search')}
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              router.push('/health');
            }}
            className="btn-secondary btn-small"
          >
            {tCommon('clearFilters')}
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="text-xs font-semibold text-muted sm:col-span-3">
        {tCommon('resultsCount', { count: resultCount })}
      </p>
    </form>
  );
}
