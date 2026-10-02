'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { DoctorBookingModal } from '@/components/doctor-booking-modal';
import type { DoctorView } from '@/lib/types';

const BRANCH_OPTIONS = [
  { slug: 'dhanmondi-main', name: 'Dhanmondi Main Branch (Dhaka)' },
  { slug: 'uttara-sector-7', name: 'Uttara Sector 7 Branch (Dhaka)' },
  { slug: 'mirpur', name: 'Mirpur Branch (Dhaka)' },
  { slug: 'chattogram-agrabad', name: 'Chattogram Agrabad Branch' },
  { slug: 'sylhet-zindabazar', name: 'Sylhet Zindabazar Branch' },
  { slug: 'shantinagar', name: 'Shantinagar Branch (Dhaka)' },
  { slug: 'shyamoli', name: 'Shyamoli Branch (Dhaka)' },
  { slug: 'bogura', name: 'Bogura Branch' },
  { slug: 'barishal', name: 'Barishal Branch' },
];

const DEFAULT_BOOKING_DOCTOR: DoctorView = {
  id: 'doc-1',
  slug: 'dr-sarah-ahmed',
  name: 'Dr. Sarah Ahmed',
  designation: 'Senior Consultant, Cardiology',
  specialtySlug: 'cardiology',
  specialtyName: 'Cardiology',
  qualifications: 'MBBS, FCPS (Cardiology), MD (Cardiology)',
  bio: 'Focuses on preventive cardiology, hypertension, echocardiography and heart failure follow-up.',
  photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  bmdcRegNo: 'A-12345',
  experienceYears: 14,
  languages: ['Bangla', 'English'],
  isFeatured: true,
  availability: [
    {
      branchSlug: 'dhanmondi-main',
      branchName: 'Dhanmondi Main branch',
      branchCity: 'Dhaka',
      schedule: 'Sat, Mon, Wed (5:00 PM - 9:00 PM)',
      fee: 1200,
      isPrimary: true,
    },
    {
      branchSlug: 'uttara-sector-7',
      branchName: 'Uttara Sector 7 branch',
      branchCity: 'Dhaka',
      schedule: 'Sun, Tue, Thu (6:00 PM - 9:00 PM)',
      fee: 1200,
      isPrimary: false,
    },
  ],
};

export function FloatingActionHub() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Quick Report State inside Floating Hub Modal
  const [selectedBranch, setSelectedBranch] = useState(BRANCH_OPTIONS[0].slug);
  const [regNo, setRegNo] = useState('POP-2026-8841');
  const [pin, setPin] = useState('4921');
  const [reportResult, setReportResult] = useState<{
    branchName: string;
    patientName: string;
    testName: string;
    date: string;
    status: string;
  } | null>(null);

  const [chatMessageSent, setChatMessageSent] = useState<string | null>(null);

  function handleReportSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!regNo.trim() || !pin.trim()) return;
    const bObj = BRANCH_OPTIONS.find((b) => b.slug === selectedBranch) || BRANCH_OPTIONS[0];
    setReportResult({
      branchName: bObj.name,
      patientName: 'MD. TANVIR HOSSAIN',
      testName: 'Complete Blood Count (CBC) + Clinical Biochemistry Panel',
      date: new Date().toLocaleDateString('en-GB'),
      status: 'Verified & Delivered',
    });
  }

  function handleOpenPortal() {
    setIsOpen(false);
    setIsReportModalOpen(true);
  }

  return (
    <>
      {/* 1. Doctor Booking Modal */}
      <DoctorBookingModal
        doctor={DEFAULT_BOOKING_DOCTOR}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* 2. Instant Patient Portal & Report Search Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-panel border-2 border-[#004d25] bg-paper p-6 shadow-2xl transition-all my-8 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-cream hover:text-ink transition font-bold"
              aria-label="Close portal modal"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-line pb-4 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#004d25] text-white font-extrabold text-lg shadow">
                📄
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-ink">
                  Patient Portal — Diagnostic Report Lookup
                </h3>
                <p className="text-xs text-soft">
                  Select your branch, enter Patient UID &amp; PIN from cash receipt
                </p>
              </div>
            </div>

            <form onSubmit={handleReportSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Branch / Center Location
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full rounded-lg border border-line bg-white p-2.5 text-xs font-semibold text-ink focus:border-teal focus:outline-none"
                  required
                >
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    Patient Registration No. (UID)
                  </label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. POP-2026-8841"
                    className="w-full rounded-lg border border-line bg-white p-2.5 text-xs font-bold text-ink focus:border-teal focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    Report Password / PIN
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="e.g. 4921"
                    className="w-full rounded-lg border border-line bg-white p-2.5 text-xs font-bold text-ink focus:border-teal focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary flex-1 justify-center py-2.5 text-xs font-bold"
                >
                  Search &amp; View Diagnostic Report →
                </button>
                <Link
                  href="/portal"
                  onClick={() => setIsReportModalOpen(false)}
                  className="btn-secondary text-xs font-semibold py-2.5"
                >
                  Full Portal Page ↗
                </Link>
              </div>
            </form>

            {reportResult && (
              <div className="mt-5 rounded-xl border border-teal/40 bg-white p-4 shadow-sm space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="pill bg-[#004d25] text-white font-bold text-[10px]">
                    {reportResult.status}
                  </span>
                  <span className="text-xs font-bold text-[#004d25]">{reportResult.branchName}</span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-extrabold text-sm text-ink">{reportResult.testName}</p>
                  <p className="text-muted">Patient: <strong className="text-ink">{reportResult.patientName} (Age 38, Male)</strong></p>
                  <p className="text-muted">UID: <strong className="text-[#004d25] font-mono">{regNo}</strong> | Issued: {reportResult.date}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-primary btn-small text-xs flex-1 justify-center font-bold"
                  >
                    🖨️ Print / Save Official Report PDF ↗
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Assistive Graphical Menu Floating Speed Dial Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 select-none">
        {/* Expanded Graphical Menu Overlay */}
        {isOpen && (
          <div className="flex w-80 max-w-[calc(100vw-2.5rem)] flex-col gap-3 rounded-2xl border border-teal/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-[#004d25] text-white font-extrabold text-xs">
                  RC
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#004d25]">
                  Assistive Menu &amp; Smart Actions
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-cream hover:text-ink transition text-xs font-bold"
                aria-label="Close assistive menu"
              >
                ✕
              </button>
            </div>

            {/* Graphical Prompt Cards */}
            <div className="flex flex-col gap-2.5">
              {/* Card 1: Book Appointment */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsBookingOpen(true);
                }}
                className="group relative flex items-center gap-3 rounded-xl border border-teal/20 bg-gradient-to-r from-teal-50/90 via-cyan-50/70 to-emerald-50/90 p-3 text-left transition-all duration-200 hover:border-teal/50 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="h-9 w-1.5 rounded-full bg-teal/50 group-hover:bg-teal transition-colors" />
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-extrabold text-ink group-hover:text-[#004d25]">
                    Book an appointment with our specialists
                  </h4>
                  <p className="text-[10px] text-muted">
                    Instant appointment booking with top consultants
                  </p>
                </div>
              </button>

              {/* Card 2: Download Reports */}
              <button
                type="button"
                onClick={handleOpenPortal}
                className="group relative flex items-center gap-3 rounded-xl border border-teal/20 bg-gradient-to-r from-teal-50/90 via-cyan-50/70 to-emerald-50/90 p-3 text-left transition-all duration-200 hover:border-teal/50 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="h-9 w-1.5 rounded-full bg-teal/50 group-hover:bg-teal transition-colors" />
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-extrabold text-ink group-hover:text-[#004d25]">
                    Download your medical reports
                  </h4>
                  <p className="text-[10px] text-muted">
                    Enter Patient UID &amp; PIN for instant report PDF
                  </p>
                </div>
              </button>

              {/* Card 3: Home Sample Collection */}
              <Link
                href="/sample-collection"
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center gap-3 rounded-xl border border-[#004d25]/20 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 p-3 text-left transition-all duration-200 hover:border-teal/50 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="h-9 w-1.5 rounded-full bg-teal/50 group-hover:bg-teal transition-colors" />
                <span className="text-lg">🧪</span>
                <div>
                  <h4 className="text-xs font-extrabold text-ink group-hover:text-[#004d25]">
                    Home Sample Collection Request
                  </h4>
                  <p className="text-[10px] text-muted">
                    Certified phlebotomist visit at your doorstep
                  </p>
                </div>
              </Link>
            </div>

            {/* Live Chat Support Box */}
            <div className="mt-1 rounded-xl border border-line bg-cream/50 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] text-muted">
                <span className="font-bold text-soft uppercase tracking-wider">
                  REGARDS CAREPILOT SUPPORT • LIVE
                </span>
                <span className="flex items-center gap-1 text-teal font-extrabold">
                  <span>✨</span> Smart Actions
                </span>
              </div>

              <div className="rounded-lg bg-white p-2.5 shadow-sm text-xs text-ink">
                <p className="font-semibold">
                  Welcome to our live chat support! How can I assist you today?
                </p>
              </div>

              {chatMessageSent ? (
                <div className="rounded-lg bg-teal-soft p-2 text-[11px] font-bold text-teal">
                  ✓ Request recorded: &quot;{chatMessageSent}&quot;. Our support agent will assist you shortly!
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setChatMessageSent('Thank You')}
                    className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-semibold text-soft hover:border-teal hover:text-teal transition"
                  >
                    Thank You
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenPortal}
                    className="rounded-full border border-teal/40 bg-teal-soft/60 px-2.5 py-1 text-[10px] font-bold text-teal hover:bg-teal hover:text-white transition"
                  >
                    Download Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatMessageSent('Emergency Call')}
                    className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-semibold text-soft hover:border-teal hover:text-teal transition"
                  >
                    10636 Hotline
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vertical Circular Quick Action Buttons Column */}
        <div className="flex flex-col gap-2.5 items-center">
          {/* 1. Phone Hotline Button */}
          <a
            href="tel:+8809611530530"
            title="Call Helpline: 10636 / +880 9611 530530"
            className="group relative grid h-11 w-11 place-items-center rounded-2xl border-2 border-emerald-600 bg-white text-emerald-700 shadow-lg transition-transform duration-200 hover:scale-110"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </a>

          {/* 2. Download Report Button */}
          <button
            type="button"
            onClick={handleOpenPortal}
            title="Download Medical Reports"
            className="group relative grid h-11 w-11 place-items-center rounded-2xl border-2 border-emerald-600 bg-white text-emerald-700 shadow-lg transition-transform duration-200 hover:scale-110"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </button>

          {/* 3. Patient Account Login Button */}
          <button
            type="button"
            onClick={handleOpenPortal}
            title="Patient Portal & Account"
            className="group relative grid h-11 w-11 place-items-center rounded-2xl border-2 border-emerald-600 bg-white text-emerald-700 shadow-lg transition-transform duration-200 hover:scale-110"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {/* 4. Book Appointment Button */}
          <button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            title="Book Specialist Appointment"
            className="group relative grid h-11 w-11 place-items-center rounded-2xl border-2 border-emerald-600 bg-white text-emerald-700 shadow-lg transition-transform duration-200 hover:scale-110"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
            </svg>
          </button>

          {/* 5. Main Smart Actions Toggle Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title="Assistive Smart Actions Menu"
            className="group relative grid h-12 w-12 place-items-center rounded-2xl border-2 border-emerald-600 bg-[#004d25] text-white shadow-xl transition-transform duration-200 hover:scale-110 focus:outline-none"
            aria-label="Assistive graphical menu toggle"
          >
            {isOpen ? (
              <span className="text-xl font-bold">✕</span>
            ) : (
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <svg
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
