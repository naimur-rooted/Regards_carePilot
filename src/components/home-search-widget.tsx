'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

interface HomeSearchWidgetProps {
  specialties: { slug: string; name: string }[];
  branches: { slug: string; name: string; city: string }[];
}

export function HomeSearchWidget({ specialties, branches }: HomeSearchWidgetProps) {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedSpecialty) params.set('specialty', selectedSpecialty);
    if (selectedBranch) params.set('branch', selectedBranch);

    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mt-6 grid gap-3 rounded-2xl border border-line bg-paper p-4 shadow-lifted sm:grid-cols-3 lg:grid-cols-4 lg:p-5"
    >
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          Search Doctor
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Doctor name or qualification..."
          className="w-full rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-teal focus:bg-paper focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          {tNav('specialties')}
        </label>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm font-medium text-ink focus:border-teal focus:bg-paper focus:outline-none focus:ring-1 focus:ring-teal"
        >
          <option value="">All Specialties</option>
          {specialties.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          Branch Location
        </label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm font-medium text-ink focus:border-teal focus:bg-paper focus:outline-none focus:ring-1 focus:ring-teal"
        >
          <option value="">All Branches</option>
          {branches.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name} ({item.city})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">
          🔍 {tCommon('search')} Doctors
        </button>
      </div>
    </form>
  );
}
