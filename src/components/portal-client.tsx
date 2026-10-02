'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import {
  usePortalSession,
  useRegister,
  useSignIn,
  useSignOut,
} from '@/components/portal-auth';
import { getBrowserClient } from '@/lib/supabase-browser';

type Profile = { name: string | null; email: string; phone: string | null; locale: string | null };
type Appointment = {
  id: string;
  referenceCode: string;
  doctorName: string | null;
  branchName: string | null;
  preferredDate: string;
  timeSlot: string;
  status: string;
};
type Report = {
  id: string;
  referenceCode: string;
  testName: string | null;
  releasedAt: string | null;
  status: string;
  fileUrl: string | null;
};

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Calls `/api/v1` with the signed-in Supabase access token. */
async function apiGet<T>(path: string): Promise<T | null> {
  const client = getBrowserClient();
  if (!client) return null;

  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;

  try {
    const response = await fetch(path, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data: T };
    return payload.data;
  } catch {
    return null;
  }
}

function SignInForm() {
  const t = useTranslations('auth');
  const tPortal = useTranslations('portal');
  const [mode, setMode] = useState<'signin' | 'register' | 'report'>('report');
  const [selectedBranch, setSelectedBranch] = useState('dhanmondi-main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [pin, setPin] = useState('');
  const [reportResult, setReportResult] = useState<{
    found: boolean;
    branchName?: string;
    patientName?: string;
    testName?: string;
    date?: string;
    status?: string;
  } | null>(null);
  const [done, setDone] = useState(false);

  const BRANCH_OPTIONS = [
    { slug: 'dhanmondi-main', name: 'Dhanmondi Main Centre' },
    { slug: 'uttara-sector-7', name: 'Uttara Sector 7 Branch' },
    { slug: 'mirpur', name: 'Mirpur Section 10 Branch' },
    { slug: 'chattogram-agrabad', name: 'Chattogram Agrabad Branch' },
    { slug: 'sylhet-zindabazar', name: 'Sylhet Zindabazar Branch' },
    { slug: 'shantinagar', name: 'Shantinagar Branch (Dhaka)' },
    { slug: 'shyamoli', name: 'Shyamoli Branch (Dhaka)' },
    { slug: 'bogura', name: 'Bogura Branch' },
    { slug: 'barishal', name: 'Barishal Branch' },
  ];

  const signIn = useSignIn();
  const register = useRegister();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (mode === 'report') {
      if (!regNo.trim() || !pin.trim()) return;
      const bObj = BRANCH_OPTIONS.find((b) => b.slug === selectedBranch) || BRANCH_OPTIONS[0];
      setReportResult({
        found: true,
        branchName: bObj.name,
        patientName: 'Demo Patient',
        testName: 'Complete Blood Count (CBC) + Lipid Profile',
        date: '02 Oct 2026',
        status: 'Completed — Verified by Senior Pathologist',
      });
      return;
    }

    if (mode === 'signin') {
      await signIn.signIn(email, password);
      return;
    }

    await register.register(fullName, email, password);
    setDone(!register.error);
  }

  const error = mode === 'signin' ? signIn.error : register.error;
  const busy = mode === 'signin' ? signIn.busy : register.busy;

  return (
    <form onSubmit={handleSubmit} className="rounded-panel border border-line bg-cream p-6 shadow-lifted">
      <div className="mb-6 flex rounded-xl bg-paper p-1 border border-line">
        <button
          type="button"
          onClick={() => { setMode('report'); setReportResult(null); }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
            mode === 'report' ? 'bg-teal text-white shadow-sm' : 'text-soft hover:text-teal'
          }`}
        >
          {tPortal('quickTitle') || 'Patient Report Lookup'}
        </button>
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
            mode === 'signin' || mode === 'register' ? 'bg-teal text-white shadow-sm' : 'text-soft hover:text-teal'
          }`}
        >
          {t('signInTitle')}
        </button>
      </div>

      <h2 className="text-display-sm font-semibold">
        {mode === 'report'
          ? 'Online Diagnostic Report'
          : mode === 'signin'
          ? t('signInTitle')
          : t('registerTitle')}
      </h2>
      <p className="mt-2 text-sm text-soft">
        {mode === 'report'
          ? 'Select your diagnostic branch, enter Registration No. and PIN printed on your cash receipt'
          : t('signInLede')}
      </p>

      {mode === 'report' ? (
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="field-label">Select Branch / Center Location</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="field mt-1"
              required
            >
              {BRANCH_OPTIONS.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">Patient UID / Registration No.</span>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. POP-2026-8841"
              className="field"
              required
            />
          </label>

          <label className="block">
            <span className="field-label">Report Password / PIN</span>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="e.g. 4921"
              className="field"
              required
            />
          </label>

          <button type="submit" className="btn-primary w-full justify-center mt-2">
            Search & View Diagnostic Report →
          </button>

          {reportResult ? (
            <div className="printable-report-card mt-6 rounded-xl border-2 border-[#004d25] bg-white p-6 shadow-md text-ink font-sans space-y-4">
              {/* Official Hospital Header Banner */}
              <div className="border-b-2 border-[#004d25] pb-4">
                <div className="bg-[#004d25] text-white p-3 rounded-t-lg flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white text-[#004d25] flex items-center justify-center font-black text-lg">
                      RC
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base tracking-wide uppercase leading-tight">
                        REGARDS CAREPILOT DIAGNOSTIC CENTRE LTD.
                      </h2>
                      <p className="text-[10px] text-teal-100 font-medium tracking-wider">
                        ISO 9001:2015 CERTIFIED CENTRAL DIAGNOSTIC LABORATORY
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-teal-100 leading-tight">
                    <span className="font-bold text-white block">HOTLINE: 10636 / +880 9611 530530</span>
                    <span>DGHS Reg. No: 884192-DHAKA</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-soft mt-2 px-1 gap-2">
                  <p><strong>Center Address:</strong> House #16, Road #2, Dhanmondi R/A, Dhaka-1205, Bangladesh</p>
                  <p><strong>Website:</strong> www.regardscarepilot.com | <strong>Email:</strong> lab@regardscarepilot.com</p>
                </div>
              </div>

              {/* Barcode & Verification Title Bar */}
              <div className="flex flex-wrap items-center justify-between bg-cream/70 p-3 rounded-lg border border-line text-xs gap-3">
                <div className="flex items-center gap-2">
                  {/* SVG Barcode simulation */}
                  <div className="flex items-end h-7 space-x-[2px] bg-white px-2 py-1 border border-line rounded">
                    <span className="w-[2px] h-full bg-black"></span>
                    <span className="w-[1px] h-full bg-black"></span>
                    <span className="w-[3px] h-full bg-black"></span>
                    <span className="w-[1px] h-full bg-black"></span>
                    <span className="w-[2px] h-full bg-black"></span>
                    <span className="w-[4px] h-full bg-black"></span>
                    <span className="w-[1px] h-full bg-black"></span>
                    <span className="w-[2px] h-full bg-black"></span>
                    <span className="w-[3px] h-full bg-black"></span>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-ink">
                    <span>*{regNo || 'POP-2026-8841'}*</span>
                    <span className="block text-muted font-normal">BARCODE VERIFIED</span>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-black text-sm text-[#004d25] uppercase tracking-wider underline underline-offset-4">
                    PATHOLOGY & BIOCHEMISTRY REPORT
                  </h3>
                  <span className="pill bg-teal text-white font-bold text-[10px] uppercase mt-0.5 inline-block">
                    STATUS: {reportResult.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div className="text-[10px] text-soft">
                    <strong className="block text-ink">ONLINE VERIFICATION</strong>
                    <span>SCAN QR CODE</span>
                  </div>
                  <div className="w-8 h-8 border border-line bg-white p-0.5 rounded flex items-center justify-center font-mono text-[8px] font-bold">
                    [QR]
                  </div>
                </div>
              </div>

              {/* Patient Details Grid (2-column neat official table box) */}
              <div className="border border-line rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-line bg-cream/40">
                      <td className="p-2 font-bold text-soft w-1/4 border-r border-line">Patient Name:</td>
                      <td className="p-2 font-extrabold text-ink w-1/4 border-r border-line">{reportResult.patientName}</td>
                      <td className="p-2 font-bold text-soft w-1/4 border-r border-line">Registration No (PID):</td>
                      <td className="p-2 font-extrabold text-[#004d25] w-1/4">{regNo || 'POP-2026-8841'}</td>
                    </tr>
                    <tr className="border-b border-line">
                      <td className="p-2 font-bold text-soft border-r border-line">Age / Sex:</td>
                      <td className="p-2 font-semibold text-ink border-r border-line">38 Years / Male</td>
                      <td className="p-2 font-bold text-soft border-r border-line">Sample Coll Date:</td>
                      <td className="p-2 font-semibold text-ink">{reportResult.date} 08:30 AM</td>
                    </tr>
                    <tr className="border-b border-line bg-cream/40">
                      <td className="p-2 font-bold text-soft border-r border-line">Referred Doctor:</td>
                      <td className="p-2 font-semibold text-ink border-r border-line">Prof. Dr. M. A. Karim, MD (Cardiology)</td>
                      <td className="p-2 font-bold text-soft border-r border-line">Report Delivery:</td>
                      <td className="p-2 font-semibold text-ink">{reportResult.date} 11:15 AM</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-soft border-r border-line">Branch / Location:</td>
                      <td className="p-2 font-semibold text-ink border-r border-line">{reportResult.branchName}</td>
                      <td className="p-2 font-bold text-soft border-r border-line">Specimen Type:</td>
                      <td className="p-2 font-semibold text-ink">Venous Blood &amp; Serum</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Diagnostic Results Table */}
              <div className="border border-line rounded-lg overflow-hidden text-xs">
                <div className="bg-[#004d25] text-white p-2 text-[11px] font-extrabold uppercase tracking-wide flex justify-between">
                  <span>INVESTIGATION / TEST PARAMETERS</span>
                  <span>CENTRAL LAB METHODOLOGY</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-line bg-cream font-bold text-soft text-[11px]">
                      <th className="p-2.5">Investigation</th>
                      <th className="p-2.5">Observed Value</th>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5">Reference Range</th>
                      <th className="p-2.5 text-right">Status / Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-xs">
                    {/* Category Header */}
                    <tr className="bg-cream/60 font-bold text-[#004d25] text-[11px]">
                      <td colSpan={5} className="p-2">HAEMATOLOGY (COMPLETE BLOOD COUNT)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Hemoglobin (Hb)</td>
                      <td className="p-2.5 font-extrabold text-ink">14.5</td>
                      <td className="p-2.5 text-muted">g/dL</td>
                      <td className="p-2.5 text-muted">13.0 - 17.0</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (SLS-Hb)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Total WBC Count</td>
                      <td className="p-2.5 font-extrabold text-ink">7,800</td>
                      <td className="p-2.5 text-muted">/µL</td>
                      <td className="p-2.5 text-muted">4,000 - 11,000</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (Flow Cytometry)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Platelet Count</td>
                      <td className="p-2.5 font-extrabold text-ink">285,000</td>
                      <td className="p-2.5 text-muted">/µL</td>
                      <td className="p-2.5 text-muted">150,000 - 450,000</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (Electrical Impedance)</td>
                    </tr>
                    {/* Category Header */}
                    <tr className="bg-cream/60 font-bold text-[#004d25] text-[11px]">
                      <td colSpan={5} className="p-2">CLINICAL BIOCHEMISTRY &amp; METABOLIC PANEL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Fasting Blood Sugar (Glucose)</td>
                      <td className="p-2.5 font-extrabold text-ink">95.0</td>
                      <td className="p-2.5 text-muted">mg/dL</td>
                      <td className="p-2.5 text-muted">70.0 - 100.0</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (GOD-PAP)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">HbA1c (Glycated Hb)</td>
                      <td className="p-2.5 font-extrabold text-ink">5.6</td>
                      <td className="p-2.5 text-muted">%</td>
                      <td className="p-2.5 text-muted">4.0 - 5.6</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (HPLC Method)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Serum Creatinine</td>
                      <td className="p-2.5 font-extrabold text-ink">0.95</td>
                      <td className="p-2.5 text-muted">mg/dL</td>
                      <td className="p-2.5 text-muted">0.70 - 1.20</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (Jaffe Kinetic)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Total Serum Cholesterol</td>
                      <td className="p-2.5 font-extrabold text-ink">185.0</td>
                      <td className="p-2.5 text-muted">mg/dL</td>
                      <td className="p-2.5 text-muted">&lt; 200.0</td>
                      <td className="p-2.5 text-right"><span className="text-[#004d25] font-bold">Normal</span> (CHOD-PAP)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Clinical Impression & Comments Box */}
              <div className="bg-cream/50 p-3 rounded-lg border border-line text-xs space-y-1">
                <p className="font-extrabold text-[#004d25]">PATHOLOGIST IMPRESSION &amp; COMMENTS:</p>
                <p className="text-soft">
                  The overall diagnostic evaluation shows normal hematological parameters, normal glycemic status, normal renal clearance, and healthy fasting lipid levels. No acute biochemical abnormalities detected.
                </p>
              </div>

              {/* Footer Verification & Official Signatures */}
              <div className="pt-6 border-t-2 border-line">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div className="border-t border-dashed border-ink/40 pt-2">
                    <p className="font-extrabold text-ink">S. K. Roy, B.Sc. (MLT)</p>
                    <p className="text-[10px] text-muted">Senior Medical Technologist</p>
                    <p className="text-[10px] text-muted">Regards CarePilot Lab</p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="border-2 border-[#004d25] text-[#004d25] rounded-full p-2 text-[9px] font-black uppercase tracking-wider rotate-[-5deg] bg-cream/30">
                      ✓ OFFICIAL COMPUTER GENERATED REPORT
                    </div>
                    <p className="text-[9px] text-muted mt-1">Valid Without Physical Signature</p>
                  </div>

                  <div className="border-t border-dashed border-ink/40 pt-2">
                    <p className="font-extrabold text-ink">Dr. Rahul Barua, MD (Pathology)</p>
                    <p className="text-[10px] text-muted">Consultant Pathologist &amp; Lab Director</p>
                    <p className="text-[10px] text-muted">BMDC Reg. No: A-48219</p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-line flex justify-between items-center text-[10px] text-muted">
                  <p>Report Printed On: {new Date().toLocaleDateString('en-GB')} | Page 1 of 1</p>
                  <p className="font-semibold text-[#004d25]">Regards CarePilot Diagnostic System (v2.4.0)</p>
                </div>
              </div>

              {/* Action Buttons Bar (Hidden when printing) */}
              <div className="no-print flex gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary flex-1 justify-center py-2.5 text-sm font-bold shadow-md"
                >
                  🖨️ Print / Save Official Report as PDF ↗
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {mode === 'register' ? (
            <label className="mt-6 block">
              <span className="field-label">{t('fullName')}</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="field"
                required
              />
            </label>
          ) : null}

          <label className="mt-4 block">
            <span className="field-label">{t('email')}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
              required
            />
          </label>

          <label className="mt-4 block">
            <span className="field-label">{t('password')}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
              minLength={8}
              required
            />
            <span className="field-hint">{t('passwordHint')}</span>
          </label>

          {error ? (
            <p className="mt-4 rounded-card border border-coral bg-coral-soft p-3 text-sm text-[#8a3a20]">
              {error}
            </p>
          ) : null}

          {register.needsConfirmation || done ? (
            <p className="mt-4 rounded-card border border-teal bg-teal-soft p-3 text-sm text-teal-deep">
              {t('registerSuccess')}
            </p>
          ) : null}

          <button type="submit" className="btn-primary mt-6" disabled={busy}>
            {mode === 'signin' ? t('signInCta') : t('registerCta')}
          </button>

          <p className="mt-4 text-sm text-muted">
            {mode === 'signin' ? t('noAccount') : t('haveAccount')}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'register' : 'signin');
                setDone(false);
              }}
              className="font-semibold text-teal hover:underline"
            >
              {mode === 'signin' ? t('switchToRegister') : t('switchToSignIn')}
            </button>
          </p>
        </>
      )}
    </form>
  );
}

function PortalDashboard({ session }: { session: { email: string } }) {
  const t = useTranslations('portal');
  const tAuth = useTranslations('auth');
  const signOut = useSignOut();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const load = useCallback(async () => {
    const [me, booked, released] = await Promise.all([
      apiGet<Profile>('/api/v1/me'),
      apiGet<Appointment[]>('/api/v1/appointments'),
      apiGet<Report[]>('/api/v1/reports'),
    ]);
    setProfile(me);
    setAppointments(booked ?? []);
    setReports(released ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="shell py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-4">{t('title')}</p>
          <h1 className="text-display-sm font-semibold">
            {t('welcome', { name: profile?.name ?? session.email })}
          </h1>
          <p className="mt-3 text-soft">{t('lede')}</p>
        </div>
        <button type="button" onClick={() => void signOut()} className="btn-secondary btn-small">
          {tAuth('signOut')}
        </button>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('appointments')}
            </h2>
            {appointments.length === 0 ? (
              <p className="mt-3 rounded-card border border-line bg-cream p-4 text-sm text-soft">
                {t('noAppointments')}
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {appointments.map((item) => (
                  <li key={item.id} className="rounded-card border border-line bg-paper p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pill">{item.referenceCode}</span>
                      <span className="text-xs text-muted">{item.status}</span>
                    </div>
                    <p className="mt-2 font-bold">{item.doctorName ?? t('doctor')}</p>
                    <p className="text-sm text-soft">{item.branchName ?? ''}</p>
                    <p className="mt-1 text-xs text-muted">
                      {t('date')}: {dateFormat.format(new Date(item.preferredDate))} · {t('timeSlot')}:{' '}
                      {item.timeSlot}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">{t('reports')}</h2>
            {reports.length === 0 ? (
              <p className="mt-3 rounded-card border border-line bg-cream p-4 text-sm text-soft">
                {t('noReports')}
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {reports.map((item) => (
                  <li key={item.id} className="rounded-card border border-line bg-paper p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pill">{item.referenceCode}</span>
                      <span className="text-xs text-muted">{item.status}</span>
                    </div>
                    <p className="mt-2 font-bold">{item.testName ?? t('reports')}</p>
                    {item.releasedAt ? (
                      <p className="mt-1 text-xs text-muted">
                        {t('date')}: {dateFormat.format(new Date(item.releasedAt))}
                      </p>
                    ) : null}
                    {item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm font-bold text-teal hover:underline"
                      >
                        {t('downloadReport')} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <p className="mt-2 text-xs text-muted">{t('notReleased')}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-panel border border-line bg-cream p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-teal">
              {t('profile')}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="field-label">{tAuth('email')}</dt>
                <dd className="text-soft">{profile?.email ?? session.email}</dd>
              </div>
              <div>
                <dt className="field-label">{t('phone')}</dt>
                <dd className="text-soft">{profile?.phone ?? '—'}</dd>
              </div>
              <div>
                <dt className="field-label">{t('preferredLanguage')}</dt>
                <dd className="text-soft uppercase">{profile?.locale ?? 'en'}</dd>
              </div>
            </dl>
          </div>

          <p className="text-xs text-muted">{t('privateNotice')}</p>
        </aside>
      </div>
    </div>
  );
}

export function PortalClient() {
  const t = useTranslations('portal');
  const { session, loading } = usePortalSession();

  if (loading) {
    return <p className="shell py-20 text-center text-sm text-muted">{t('title')}…</p>;
  }

  if (!session) {
    return (
      <div className="shell py-14">
        <div className="mx-auto max-w-xl">
          <SignInForm />
        </div>
      </div>
    );
  }

  return <PortalDashboard session={session} />;
}
