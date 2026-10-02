'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export function QuickReportWidget() {
  const t = useTranslations('portal');
  const router = useRouter();
  const [registrationNo, setRegistrationNo] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNo.trim() || !pin.trim()) {
      setError(t('fieldsRequired') || 'Please fill in both Registration No and PIN');
      return;
    }
    setError('');
    // Navigate to patient portal with query params for instant lookup
    router.push(`/portal?reg=${encodeURIComponent(registrationNo.trim())}&pin=${encodeURIComponent(pin.trim())}`);
  };

  return (
    <div className="rounded-panel border border-line bg-paper p-5 shadow-lifted">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-teal">
            {t('quickTitle') || 'Online Diagnostic Report'}
          </span>
          <h3 className="text-sm font-bold">{t('portalSubtitle') || 'Download or check report status'}</h3>
        </div>
        <span className="pill bg-mint text-teal font-extrabold">Live Portal</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error ? <p className="text-xs text-coral font-bold">{error}</p> : null}
        <div>
          <label className="block text-xs font-bold text-soft mb-1">
            {t('regNo') || 'Patient / Registration ID'}
          </label>
          <input
            type="text"
            placeholder="e.g. POP-2026-8841"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            className="w-full rounded-lg border border-line bg-cream/50 px-3 py-2 text-xs font-semibold focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-soft mb-1">
            {t('pin') || 'Report PIN / Password'}
          </label>
          <input
            type="password"
            placeholder="e.g. 4921"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-lg border border-line bg-cream/50 px-3 py-2 text-xs font-semibold focus:border-teal focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full btn-primary btn-small text-center justify-center font-bold"
        >
          {t('checkStatus') || 'View / Download Report'} →
        </button>
      </form>
    </div>
  );
}
