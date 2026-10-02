# CarePilot - Tech Stack, Database & Vercel Deployment Guide

This document provides a comprehensive overview of **CarePilot's tech stack**, **database architecture**, and **step-by-step instructions for deploying the platform on Vercel** — including the exact text block to copy and paste into Vercel's Environment Variables screen.

---

## 1. Tech Stack Overview

CarePilot is a modern, high-performance, bilingual clinical and diagnostic platform designed for native deployment on Vercel's serverless network.

| Layer / Subsystem | Technology / Library | Purpose & Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Native Vercel framework with Server-side Rendering (SSR), Incremental Static Regeneration (ISR), React 18, and Node.js 18+ |
| **Language & Syntax** | **TypeScript** | Type-safe development across frontend, API routes, and database models |
| **Styling & UI** | **Tailwind CSS + PostCSS** | Utility-first styling with custom CarePilot design system tokens |
| **Internationalization (i18n)** | **next-intl** | Full bilingual support (English `en` and Bengali `bn`) via locale-prefixed routes (`/en/...`, `/bn/...`) |
| **Database ORM** | **Prisma ORM** | Schema management, type-safe queries, client generation, and database migrations |
| **Authentication** | **NextAuth.js + Supabase Auth** | Session management, OAuth/Credentials auth backed by Supabase Auth as identity provider |
| **Headless CMS** | **Sanity.io** | Content management for doctors, branches, specialties, diagnostic tests, articles, and notices |
| **Media Storage** | **Cloudinary** | Image/asset optimization and delivery for doctor photos, branch media, and patient reports |
| **Data Validation** | **Zod** | Schema validation for forms, requests, and API payloads |
| **Package Manager** | **npm** | Package management and lifecycle script execution |

---

## 2. Database Architecture

### Engine & Hosting
CarePilot uses **PostgreSQL** as its core relational database. For serverless platforms like Vercel, **Supabase Postgres** (or Vercel Postgres / Neon) is recommended due to connection pooling capabilities.

### Connection Setup (Prisma & Serverless)
The database integration utilizes dual connection URLs configured in `prisma/schema.prisma`:
- **`DATABASE_URL` (Pooled Connection)**: Connects via Supabase PgBouncer (Port 6543) with `?pgbouncer=true&connection_limit=1`. This prevents Vercel Serverless Functions from exhausting database connections under load.
- **`DIRECT_URL` (Direct Connection)**: Connects directly to PostgreSQL (Port 5432). Used by Prisma CLI during build-time schema migrations (`prisma migrate deploy`).

### Data Models & Schema Highlights
The Prisma schema (`prisma/schema.prisma`) defines 15+ models organized into core domains:

1. **Authentication & Identity**: `User`, `Account`, `Session`, `VerificationToken`
2. **Clinical Directory & Content Mirror**: `Specialty`, `Branch`, `Doctor`, `DoctorBranch`, `DiagnosticTest`, `Article`, `Notice`
3. **Patient Requests & Telehealth**: `SampleCollectionRequest`, `ContactSubmission`, `Appointment`, `Report`
4. **Mobile & User Preferences**: `SavedAddress`, `DeviceToken`

---

## 3. Exact Environment Variables to Copy & Paste in Vercel

When importing your project on Vercel, click **"Environment Variables"** -> **"Paste Raw / Bulk Edit"** button (or paste into the first text box).

### Copy-Paste Raw Environment Variables Block

Paste the block below directly into Vercel:

```env
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://your-app-name.vercel.app
AUTH_TRUST_HOST=true
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
SANITY_API_READ_TOKEN=your_sanity_read_token_here
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=carepilot-uploads
```

---

### Field-by-Field Instructions for Replacing Values

| Variable Name | What to replace / How to generate |
| :--- | :--- |
| `DATABASE_URL` | Replace `YOUR_PROJECT_REF` and `YOUR_PASSWORD` with your Supabase database credentials (PgBouncer port `6543`). |
| `DIRECT_URL` | Replace `YOUR_PROJECT_REF` and `YOUR_PASSWORD` with your Supabase direct connection string (Port `5432`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xyzcompany.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Found in Supabase Dashboard -> **Project Settings -> API** (anon public key). |
| `SUPABASE_SERVICE_ROLE_KEY` | Found in Supabase Dashboard -> **Project Settings -> API** (service_role secret key). |
| `NEXTAUTH_SECRET` | Generate a random 32-byte secret. In terminal run: `openssl rand -base64 32` or use any long random string. |
| `NEXTAUTH_URL` | Your live Vercel domain URL, e.g. `https://carepilot.vercel.app` (or custom domain `https://carepilot.com`). |
| `AUTH_TRUST_HOST` | Keep as `true`. Required for NextAuth to trust Vercel serverless proxies. |
| `NEXT_PUBLIC_SITE_URL` | Same as `NEXTAUTH_URL`, e.g. `https://carepilot.vercel.app`. |
| `NEXT_PUBLIC_SANITY_*` | Your Sanity CMS Project ID and API tokens from [sanity.io/manage](https://sanity.io/manage). *(Optional if using demonstration dataset fallback)* |
| `NEXT_PUBLIC_CLOUDINARY_*` | Your Cloudinary Cloud Name, API Key & Secret from [cloudinary.com](https://cloudinary.com). *(Optional if using demo media)* |

---

## 4. Step-by-Step Vercel Deployment Instructions

### Step 1: Push Repository to GitHub / GitLab / Bitbucket
Ensure all your latest changes are pushed to your remote Git repository:
```bash
git add .
git commit -m "Prepare CarePilot for Vercel deployment"
git push origin main
```

---

### Step 2: Import Project on Vercel Dashboard
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Select your repository (**`carepilot`**) and click **Import**.
3. Framework Preset will auto-detect as **Next.js**.
4. Leave **Root Directory** as `./`.

---

### Step 3: Configure Build Commands & Paste Environment Variables
1. Under **Build and Output Settings**, default settings work out-of-the-box:
   - **Build Command**: `npm run build` *(runs `prisma generate && next build`)*
   - **Install Command**: `npm install` *(runs `postinstall: prisma generate`)*
2. Under **Environment Variables**, click **"Paste Raw / Bulk Edit"**.
3. Copy the **Raw Environment Variables Block** from Section 3 above, paste it into Vercel, and update your credentials.
4. Click **Deploy**.

---

### Step 4: Run Database Migrations on Production (After First Deployment)

Once deployed, run database schema migrations against your live database from your local terminal:

```bash
# Apply Prisma schema to your live Supabase database
npx prisma migrate deploy

# Seed demonstration dataset (doctors, branches, tests, specialties)
npm run db:seed
```

---

## 5. Deployment Verification & Status

CarePilot has been verified to build 100% cleanly on Next.js 14 and Vercel:
- **Build Status**: `✓ Compiled successfully`
- **Linting & Type Checking**: Passed
- **Route Generation**: Static & dynamic pages pre-rendered successfully
- **Serverless Resilience**: Built-in safe fallbacks in `src/lib/content.ts` and `src/lib/prisma.ts` ensure zero build failures even if external services (CMS / DB) are temporarily unreachable during static build steps.
