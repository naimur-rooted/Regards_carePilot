'use client';

import { useTranslations } from 'next-intl';
import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { idleState, submitSampleCollection, type FormState } from '@/app/actions/forms';
import type { TestView } from '@/lib/types';

const SLOTS = ['morning', 'afternoon', 'evening'] as const;

function SubmitButton({ label }: { label: string }) {
  const t = useTranslations('common');
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? t('sending') : label}
    </button>
  );
}

export function SampleCollectionForm({
  locale,
  tests,
}: {
  locale: string;
  tests: TestView[];
}) {
  const t = useTranslations('sample');
  const tCommon = useTranslations('common');
  const [state, formAction] = useFormState<FormState, FormData>(submitSampleCollection, idleState);
  const [selected, setSelected] = useState<string[]>([]);

  if (state.status === 'success') {
    return (
      <div className="rounded-panel border border-teal bg-teal-soft p-8">
        <h2 className="text-lg font-bold text-teal-deep">{t('successTitle')}</h2>
        <p className="mt-2 text-sm text-soft">{t('successBody')}</p>
        {state.reference ? (
          <p className="mt-4 text-sm">
            {t('reference')}:{' '}
            <strong className="rounded-full bg-white px-3 py-1 text-teal">{state.reference}</strong>
          </p>
        ) : null}
      </div>
    );
  }

  function toggle(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  return (
    <form action={formAction} className="rounded-panel border border-line bg-cream p-6">
      <h2 className="text-display-sm font-semibold">{t('formTitle')}</h2>
      <p className="mt-2 text-sm text-soft">{t('formLede')}</p>

      <input type="hidden" name="locale" value={locale} />
      {selected.map((slug) => (
        <input key={slug} type="hidden" name="tests" value={slug} />
      ))}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">{t('name')}</span>
          <input name="fullName" className="field" required />
          {state.fieldErrors?.fullName ? (
            <span className="field-hint text-[#8a3a20]">{state.fieldErrors.fullName}</span>
          ) : null}
        </label>
        <label>
          <span className="field-label">{t('phone')}</span>
          <input name="phone" type="tel" className="field" required />
          {state.fieldErrors?.phone ? (
            <span className="field-hint text-[#8a3a20]">{state.fieldErrors.phone}</span>
          ) : null}
        </label>
        <label>
          <span className="field-label">{t('email')}</span>
          <input name="email" type="email" className="field" />
        </label>
        <label>
          <span className="field-label">{t('area')}</span>
          <input name="area" className="field" />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="field-label">{t('address')}</span>
        <textarea name="address" rows={3} className="field h-auto py-3" required />
        {state.fieldErrors?.address ? (
          <span className="field-hint text-[#8a3a20]">{state.fieldErrors.address}</span>
        ) : null}
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label>
          <span className="field-label">{t('city')}</span>
          <input name="city" className="field" />
        </label>
        <label>
          <span className="field-label">{t('date')}</span>
          <input name="preferredDate" type="date" className="field" required />
          {state.fieldErrors?.preferredDate ? (
            <span className="field-hint text-[#8a3a20]">{state.fieldErrors.preferredDate}</span>
          ) : null}
        </label>
        <label>
          <span className="field-label">{t('slot')}</span>
          <select name="preferredSlot" className="field" defaultValue="morning" required>
            {SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {t(`slots.${slot}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="field-label">{t('tests')}</legend>
        <p className="field-hint mb-2">{t('testsHint')}</p>
        <ul className="max-h-56 space-y-1 overflow-y-auto rounded-card border border-line bg-white p-3">
          {tests.map((test) => (
            <li key={test.id}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(test.slug)}
                  onChange={() => toggle(test.slug)}
                />
                <span>{test.name}</span>
                {test.discountedPrice ?? test.price ? (
                  <span className="ml-auto text-xs text-muted">
                    ৳{test.discountedPrice ?? test.price}
                  </span>
                ) : null}
              </label>
            </li>
          ))}
        </ul>
        {state.fieldErrors?.tests ? (
          <span className="field-hint text-[#8a3a20]">{state.fieldErrors.tests}</span>
        ) : null}
      </fieldset>

      <label className="mt-4 block">
        <span className="field-label">
          {t('notes')} <span className="font-normal normal-case text-muted">({tCommon('optional')})</span>
        </span>
        <textarea name="notes" rows={3} className="field h-auto py-3" />
      </label>

      {state.status === 'error' && state.message ? (
        <p className="mt-4 rounded-card border border-coral bg-coral-soft p-3 text-sm text-[#8a3a20]">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6">
        <SubmitButton label={t('submit')} />
      </div>
    </form>
  );
}
