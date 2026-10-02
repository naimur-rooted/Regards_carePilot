/**
 * Production smoke test.
 *
 * Usage: start the built app (`npx next start -p 3100`) then run
 *   node scripts/smoke.mjs
 *
 * Asserts real rendered output: bilingual pages, server-side directory filters,
 * profile pages, and the SEO files that exclude the private routes.
 */
const base = process.env.SMOKE_BASE_URL || 'http://localhost:3100';

const checks = [
  { path: '/en', expect: 'Healthcare that feels a little more' },
  { path: '/bn', expect: 'lang="bn"' },
  { path: '/en/doctors', expect: 'Dr. Sarah Ahmed' },
  { path: '/en/doctors?specialty=cardiology', expect: 'Dr. Sarah Ahmed', notExpect: 'Dr. Nusrat Jahan' },
  { path: '/en/doctors?branch=chattogram-agrabad', expect: 'Dr. Tanvir Islam', notExpect: 'Dr. Rahul Barua' },
  { path: '/en/doctors?search=haematology', expect: 'Dr. Rahul Barua', notExpect: 'Dr. Sarah Ahmed' },
  { path: '/en/doctors/dr-sarah-ahmed', expect: 'A-12345' },
  { path: '/bn/doctors/dr-sarah-ahmed', expect: 'ডা. সারা আহমেদ' },
  { path: '/en/branches', expect: 'Dhanmondi main centre' },
  { path: '/bn/branches', expect: 'ধানমন্ডি মূল কেন্দ্র' },
  { path: '/en/branches/dhanmondi-main', expect: 'Doctors at this branch' },
  { path: '/robots.txt', expect: 'Disallow: /en/portal' },
  { path: '/robots.txt', expect: 'Disallow: /bn/admin' },
  { path: '/sitemap.xml', expect: 'xhtml:link' },

  // App-facing REST layer (public endpoints return the same content)
  { path: '/api/v1/health', expect: 'ok' },
  { path: '/api/v1/doctors', expect: 'Dr. Sarah Ahmed' },
  { path: '/api/v1/doctors?specialty=cardiology', expect: 'Dr. Sarah Ahmed', notExpect: 'Dr. Nusrat Jahan' },
  { path: '/api/v1/doctors?locale=bn', expect: 'ডা. সারা আহমেদ' },
  { path: '/api/v1/branches', expect: 'Dhanmondi main centre' },
  { path: '/api/v1/specialties', expect: 'cardiology' },
  { path: '/api/v1/tests', expect: 'Complete blood count' },
  { path: '/api/v1/network-stats', expect: 'branches' },

  // Patient endpoints must reject anonymous callers
  { path: '/api/v1/me', expectStatus: 401 },
  { path: '/api/v1/me/addresses', expectStatus: 401 },
  { path: '/api/v1/appointments', expectStatus: 401 },
  { path: '/api/v1/sample-collection', expectStatus: 401 },
];

let failures = 0;

console.log(`Smoke testing ${base}\n`);

for (const check of checks) {
  try {
    const response = await fetch(base + check.path, {
      redirect: 'follow',
      headers: { accept: 'application/json, text/html' },
    });
    const body = await response.text();
    const notes = [`HTTP ${response.status}`];
    let ok = true;

    if (check.expectStatus !== undefined) {
      ok = response.status === check.expectStatus;
      notes.push(ok ? 'status as expected' : `expected ${check.expectStatus}`);
    } else if (response.status !== 200) {
      ok = false;
    }

    if (check.expect) {
      if (body.includes(check.expect)) notes.push(`found "${check.expect}"`);
      else {
        ok = false;
        notes.push(`MISSING "${check.expect}"`);
      }
    }

    if (check.notExpect) {
      if (body.includes(check.notExpect)) {
        ok = false;
        notes.push(`UNEXPECTED "${check.notExpect}"`);
      } else {
        notes.push(`excluded "${check.notExpect}"`);
      }
    }

    if (!ok) failures += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'} | ${check.path} | ${notes.join('; ')}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL | ${check.path} | ${error.message}`);
  }
}

// Root should redirect to the default locale.
try {
  const rootResponse = await fetch(base + '/', { redirect: 'follow' });
  const landed = rootResponse.url.endsWith('/en');
  if (!landed) failures += 1;
  console.log(`${landed ? 'PASS' : 'FAIL'} | / | redirected to ${rootResponse.url}`);
} catch (error) {
  failures += 1;
  console.log(`FAIL | / | ${error.message}`);
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exitCode = failures === 0 ? 0 : 1;
