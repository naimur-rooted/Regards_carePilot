# Comprehensive Analysis of Popular Diagnostic Centre Ltd. & CarePilot Feature Alignment

**Reference Website:** [Popular Diagnostic Centre Ltd.](https://www.populardiagnostic.com/)  
**Document Created:** October 2026  
**Target Platform:** CarePilot (Bilingual Diagnostic & Clinical Centre Platform)

---

## 1. Executive Summary & Brand Identity

Popular Diagnostic Centre Ltd. is one of Bangladesh's premier diagnostic and clinical consultation networks. Founded in 1983, the organization operates across major divisions and districts, featuring thousands of specialist doctors, advanced laboratory pathology, medical imaging (MRI, CT, Digital X-Ray, Ultrasonography, Echocardiography), home sample collection, health checkup packages, and an online patient report portal.

### Visual & Graphic Design Profile
- **Primary Brand Color:** Clinical Emerald Green (`#00984a` / Tailwind `teal` palette) with secondary warm gold accents (`#f59e0b` / `sun`), clean white cards, and neutral dark slate (`#1e293b` / `ink`).
- **Typography:** Modern clean sans-serif (`Ubuntu` / `Inter` fallback) with high-contrast legibility for medical schedules, pricing, and diagnostic test details.
- **Graphic Elements:** High-resolution specialist badges, branch location icons, status indicators (e.g., sample status, appointment status), clean card shadows, and responsive grid layouts.

---

## 2. Feature & Architecture Breakdown

### A. Specialist Doctor Directory & Appointment Booking
1. **Multi-Criterion Search & Filtering:**
   - Filter by Specialty (e.g., Cardiology, Endocrinology, Gastroenterology, Gynecology, Neurology, Orthopedics, Pediatrics).
   - Filter by Branch / Location (e.g., Dhanmondi, Gulshan, Uttara, Mirpur, Chittagong, Sylhet, Rajshahi, Bogura, Barishal).
   - Search by Doctor Name or Qualification keyword.
2. **Detailed Doctor Profiles:**
   - Degrees, Designations, Room Number, Consultation Hours, and Available Days.
   - Direct "Book Appointment" CTA triggering slot selection and patient detail submission.

### B. Diagnostic Services & Health Checkup Packages
1. **Diagnostic Test Directory:**
   - Pathology & Clinical Laboratory (Biochemistry, Microbiology, Immunology, Hematology, Histopathology).
   - Medical Imaging (MRI 3.0T, CT Scan 128-slice, Digital X-Ray, Ultrasonography, Mammography).
   - Cardiac & Endoscopic diagnostics (ECG, ETT, Echocardiography, Endoscopy, Colonoscopy).
2. **Tiered Health Checkup Packages:**
   - **Basic Package:** CBC, Blood Sugar, Lipid Profile, Creatinine, Urine R/E, ECG, Chest X-Ray, Abdomen USG.
   - **Executive Package (40+):** Full cardiac, liver, kidney, diabetes, CRP, TSH, Doppler Echo, ETT, and USG.
   - **Women's Health Package:** Hormone profile, Pap Smear, Mammography, USG, thyroid, and blood profiles.
   - **Diabetes Care Package:** HbA1c, Fasting Sugar, Microalbumin, Lipid Profile, Eye/Neuropathy screening.

### C. Online Patient Portal & Report Delivery System
1. **Report Authentication:**
   - Secure login using Patient ID / Registration Number and PIN / Password printed on diagnostic receipts.
2. **Report Download & Status:**
   - Instant PDF download of verified lab/radiology reports.
   - Test status indicator (Pending, Processing, Verified, Ready for Download).

### D. Home Sample Collection Service
1. **On-Demand Booking:**
   - Patient address, preferred date/time window, and required test selection.
   - Mobile phlebotomist assignment and confirmation notifications.

### E. Branch & Location Finder
1. **Branch Network Directory:**
   - Interactive district/city filter.
   - Address, contact hotlines, Google Maps integration, sample collection hours, and available specialist list per branch.

### F. Health Education, Media & Corporate Transparency
1. **Health Articles & Blogs:** Categorized medical tips written by clinical specialists.
2. **Video & Photo Gallery:** Diagnostic equipment showcases, facility walkthroughs, and health awareness videos.
3. **Notices & Leadership:** Operational notices, board of directors, management profile, and official policies (Terms, Privacy, Refund).
4. **Hotlines & Emergency:** 24/7 Hotline bar (`+8809613787801`), email support, and interactive contact forms.

---

## 3. CarePilot Alignment Matrix

| Feature Area | Popular Diagnostic Implementation | CarePilot Implementation Status |
| :--- | :--- | :--- |
| **Doctor Search & Filters** | Filter by specialty, location, name | `src/app/[locale]/doctors/page.tsx` + `DoctorFilters` component |
| **Doctor Profile & Slots** | Room #, Visiting hours, booking button | `src/app/[locale]/doctors/[slug]/page.tsx` + Slot API |
| **Diagnostic Test Search** | Category search, preparation info, fees | `src/app/[locale]/services/page.tsx` + `ServiceFilters` component |
| **Health Packages** | Tiered packages (BDT 5,900 - 14,630) | Integrated into `services` catalogue & Prisma schemas |
| **Patient Report Portal** | ID + PIN authentication, PDF download | `src/app/[locale]/portal/page.tsx` + `PortalAuth` / `PortalClient` |
| **Home Sample Collection** | Online booking form with test checklist | `src/app/[locale]/sample-collection/page.tsx` + `SampleCollectionForm` |
| **Branch Directory & Maps** | Address, hours, interactive map | `src/app/[locale]/branches/page.tsx` + `BranchMap` component |
| **Emergency Hotlines** | 24/7 Hotline list with branch numbers | `src/app/[locale]/hotlines/page.tsx` |
| **Bilingual UI** | English & Bengali support | Next.js `next-intl` (en & bn message bundles) |
| **Structured Schema Data** | MedicalOrganization, DiagnosticLab JSON-LD | Embedded in layout & page metadata |

---

## 4. Operational & Future Enhancement Roadmap
- **SMS & Push Notifications:** Instant SMS alert when diagnostic reports are published to the patient portal.
- **Sanity CMS Integration:** Rich content management for doctor bios, branch notices, and health blogs.
- **Supabase / PostgreSQL Synchronization:** Real-time database backings for appointments, sample collection requests, and patient report metadata.
