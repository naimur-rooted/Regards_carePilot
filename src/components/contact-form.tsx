'use client';

import { useTranslations } from 'next-intl';
import { useFormState, useFormStatus } from 'react-dom';
import { idleState, submitContactForm, type FormState } from '@/app/actions/forms';

const DEPARTMENTS = ['general', 'sample', 'reports', 'billing', 'feedback'] as const;

function SubmitButton({ label }: { label: string }) {
  const t = useTranslations('common');
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? t('sending') : label}
    </button>
  );
}

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');
  const [state, formAction] = useFormState<FormState, FormData>(submitContactForm, idleState);

  if (state.status === 'success') {
    return (
      <div className="rounded-panel border border-teal bg-teal-soft p-8">
        <h2 className="text-lg font-bold text-teal-deep">{t('successTitle')}</h2>
        <p className="mt-2 text-sm text-soft">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-panel border border-line bg-cream p-6">
      <h2 className="text-display-sm font-semibold">{t('formTitle')}</h2>

      <input type="hidden" name="locale" value={locale} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">{t('name')}</span>
          <input name="fullName" className="field" required />
          {state.fieldErrors?.fullName ? (
            <span className="field-hint text-[#8a3a20]">{state.fieldErrors.fullName}</span>
          ) : null}
        </label>
        <label>
          <span className="field-label">{t('email')}</span>
          <input name="email" type="email" className="field" required />
          {state.fieldErrors?.email ? (
            <span className="field-hint text-[#8a3a20]">{state.fieldErrors.email}</span>
          ) : null}
        </label>
        <label>
          <span className="field-label">{t('phone')}</span>
          <input name="phone" type="tel" className="field" />
        </label>
        <label>
          <span className="field-label">{t('department')}</span>
          <select name="department" className="field" defaultValue="general">
            {DEPARTMENTS.map((key) => (
              <option key={key} value={key}>
                {t(`departments.${key}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="field-label">{t('subject')}</span>
        <input name="subject" className="field" />
      </label>

      <label className="mt-4 block">
        <span className="field-label">{t('message')}</span>
        <textarea name="message" rows={5} className="field h-auto py-3" required />
        {state.fieldErrors?.message ? (
          <span className="field-hint text-[#8a3a20]">{state.fieldErrors.message}</span>
        ) : null}
      </label>

      {state.status === 'error' && state.message ? (
        <p className="mt-4 rounded-card border border-coral bg-coral-soft p-3 text-sm text-[#8a3a20]">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 flex items-center gap-4">
        <SubmitButton label={t('submit')} />
        <span className="text-xs text-muted">{tCommon('required')}</span>
      </div>
    </form>
  );
}
