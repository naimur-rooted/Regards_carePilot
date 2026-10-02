'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DoctorView } from '@/lib/types';

export function DoctorBookingModal({
  doctor,
  isOpen,
  onClose,
}: {
  doctor: DoctorView;
  isOpen: boolean;
  onClose: () => void;
}) {
  const tDoctors = useTranslations('doctors');
  const tCommon = useTranslations('common');

  const [selectedBranch, setSelectedBranch] = useState(
    doctor.availability[0]?.branchSlug ?? ''
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('evening');
  const [notes, setNotes] = useState('');
  const [confirmation, setConfirmation] = useState<{
    referenceCode: string;
    branchName: string;
    date: string;
    fee: number | null;
  } | null>(null);

  if (!isOpen) return null;

  const currentBranchObj = doctor.availability.find(
    (item) => item.branchSlug === selectedBranch
  ) || doctor.availability[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !preferredDate) return;

    const refCode = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmation({
      referenceCode: refCode,
      branchName: currentBranchObj?.branchName ?? 'CarePilot Center',
      date: preferredDate,
      fee: currentBranchObj?.fee ?? null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-panel border border-line bg-paper p-6 shadow-2xl transition-all my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-cream hover:text-ink transition"
          aria-label={tCommon('close')}
        >
          ✕
        </button>

        {confirmation ? (
          <div className="text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-soft text-teal text-3xl font-extrabold mb-4">
              ✓
            </div>
            <p className="eyebrow mb-2">Appointment Confirmed</p>
            <h2 className="text-display-sm font-semibold text-ink">Booking Success!</h2>
            <p className="mt-2 text-sm text-soft">
              Your appointment request with <strong className="text-ink">{doctor.name}</strong> has been registered.
            </p>

            <div className="mt-6 rounded-card border border-teal bg-teal-soft/60 p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-teal/20 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wide text-teal">Reference Code</span>
                <span className="pill bg-teal text-white font-extrabold tracking-wider">{confirmation.referenceCode}</span>
              </div>
              <div className="text-sm">
                <span className="font-bold text-soft block">Location / Branch:</span>
                <span className="text-ink font-semibold">{confirmation.branchName}</span>
              </div>
              <div className="text-sm flex justify-between">
                <div>
                  <span className="font-bold text-soft block">Requested Date:</span>
                  <span className="text-ink font-semibold">{confirmation.date}</span>
                </div>
                {confirmation.fee ? (
                  <div className="text-right">
                    <span className="font-bold text-soft block">Consultation Fee:</span>
                    <span className="text-teal font-extrabold">৳{confirmation.fee}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-xs text-muted">
              Please present this reference code or your mobile number at the reception desk 15 minutes before your time slot.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-secondary flex-1 justify-center btn-small"
              >
                Print Receipt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary flex-1 justify-center btn-small"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="eyebrow mb-1">{doctor.specialtyName}</p>
              <h2 className="text-display-sm font-semibold text-ink">Book Appointment</h2>
              <p className="text-sm text-soft mt-1 font-medium">{doctor.name} ({doctor.designation})</p>
            </div>

            <div className="rounded-card border border-line bg-cream p-4 space-y-2">
              <label className="block">
                <span className="field-label">Select Visiting Branch</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="field mt-1"
                >
                  {doctor.availability.map((slot) => (
                    <option key={slot.branchSlug} value={slot.branchSlug}>
                      {slot.branchName} — {slot.schedule} {slot.fee ? `(৳${slot.fee})` : ''}
                    </option>
                  ))}
                </select>
              </label>

              {currentBranchObj ? (
                <div className="flex justify-between items-center text-xs text-soft pt-1">
                  <span>Schedule: <strong>{currentBranchObj.schedule}</strong></span>
                  {currentBranchObj.fee ? (
                    <span className="font-bold text-teal">Fee: ৳{currentBranchObj.fee}</span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Patient Name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="field"
                  required
                />
              </label>

              <label>
                <span className="field-label">Mobile Number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17..."
                  className="field"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label>
                <span className="field-label">Age</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 35"
                  className="field"
                />
              </label>

              <label>
                <span className="field-label">Preferred Date</span>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="field"
                  required
                />
              </label>

              <label>
                <span className="field-label">Time Shift</span>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="field"
                >
                  <option value="morning">Morning (9 AM - 1 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="field-label">Health Problem / Notes (Optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Briefly describe your health issue..."
                className="field h-auto py-2"
              />
            </label>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 justify-center"
              >
                {tCommon('back')}
              </button>
              <button type="submit" className="btn-primary flex-1 justify-center">
                Confirm Booking →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
