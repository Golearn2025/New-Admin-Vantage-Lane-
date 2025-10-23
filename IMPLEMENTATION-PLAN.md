# 📅 IMPLEMENTATION PLAN - Enterprise Rules & Guards

> **Roadmap pentru implementarea regulilor enterprise**  
> **Version:** 1.0  
> **Last Updated:** 2025-10-21

---

## 🎯 OBIECTIV

Implementarea graduală a celor 23 de reguli enterprise, prioritizate pe impact și urgență.

---

## 📊 SCORING MATRIX

| Regulă | Prioritate | Cost | Impact | Urgență | Score |
|--------|-----------|------|--------|---------|-------|
| 1. Secret-scan | 🔴 CRITICAL | 15min | 🔴 HIGH | 🔴 NOW | 10/10 |
| 2. RLS Tests | 🔴 CRITICAL | 3h | 🔴 HIGH | 🔴 NOW | 10/10 |
| 3. CSP Headers | 🔴 CRITICAL | 15min | 🔴 HIGH | 🔴 NOW | 10/10 |
| 4. Deps Audit | 🔴 CRITICAL | 30min | 🟡 MED | 🔴 NOW | 9/10 |
| 5. Bundle Budget | 🟡 HIGH | 1h | 🟡 MED | 🔴 NOW | 8/10 |
| 6. Design Tokens | ✅ DONE | - | 🔴 HIGH | ✅ DONE | - |
| 7. TypeScript Strict | ✅ DONE | - | 🔴 HIGH | ✅ DONE | - |
| 8. Architecture | ✅ DONE | - | 🔴 HIGH | ✅ DONE | - |
| 9. Testing Rules | 🟡 MEDIUM | 2h | 🟡 MED | 🟡 SOON | 7/10 |
| 10. File Naming | ✅ DONE | - | 🟢 LOW | ✅ DONE | - |
| 11. CSS Modules | ✅ DONE | - | 🟡 MED | ✅ DONE | - |
| 12. Export Patterns | ✅ DONE | - | 🟡 MED | ✅ DONE | - |
| 13. Error Handling | 🟡 MEDIUM | 1h | 🟡 MED | 🟡 SOON | 6/10 |
| 14. Performance | 🟡 MEDIUM | 2h | 🟡 MED | 🟡 SOON | 6/10 |
| 15. Logging | 🟡 MEDIUM | 1h | 🟡 MED | 🟡 SOON | 6/10 |
| 16. Timezone Policy | 🟡 MEDIUM | 1h | 🟡 MED | 🟡 SOON | 6/10 |
| 17. Conventional Commits | 🟡 MEDIUM | 30min | 🟡 MED | 🟡 SOON | 7/10 |
| 18. ENV Policy | 🔴 CRITICAL | 30min | 🔴 HIGH | 🔴 NOW | 9/10 |
| 19. Forbidden Imports | ✅ DONE | - | 🔴 HIGH | ✅ DONE | - |
| 20. Git Workflow | 🟡 MEDIUM | 15min | 🟢 LOW | 🟡 SOON | 5/10 |
| 21. Documentation | ⚪ LOW | 3h | 🟢 LOW | ⚪ LATER | 4/10 |
| 22. Migrations | ⚪ LOW | Ongoing | 🟡 MED | ⚪ LATER | 5/10 |
| 23. Pre-commit | 🔴 CRITICAL | 1h | 🔴 HIGH | 🔴 NOW | 10/10 |

---

## 🔥 PHASE 1: CRITICAL (NOW) - Week 1

**Obiectiv:** Implementare reguli de securitate și quality gates critice  
**Timeline:** 5-6 ore  
**Outcome:** Zero risc security, toate checks automate

### 1.1. Secret-scan Setup (15 min)

#### Tasks:
```bash
# Install git-secrets
brew install git-secrets  # macOS
# apt-get install git-secrets  # Linux

# Setup in repo
git secrets --install
git secrets --register-aws
git secrets --add 'SUPABASE_SERVICE_ROLE'
git secrets --add 'eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*'  # JWT pattern
```

#### Package.json:
```json
{
  "scripts": {
    "check:secrets": "git secrets --scan"
  }
}
```

#### Success Criteria:
- [ ] `git secrets --scan` rulează fără erori
- [ ] JWT pattern detectat în test
- [ ] Pre-commit hook blocat dacă secret găsit

---

### 1.2. CSP Headers în Middleware (15 min)

#### File: `middleware.ts`

**Patch:**
```typescript
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ /* ... */ });
  
  // [EXISTING AUTH LOGIC...]
  
  // ADD: Security Headers
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co"
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=()');
  
  return response;
}
```

#### Test:
```bash
curl -I http://localhost:3000 | grep "Content-Security-Policy"
# Expected: Content-Security-Policy: default-src 'self'...
```

#### Success Criteria:
- [ ] CSP header present în response
- [ ] X-Frame-Options: DENY
- [ ] No console warnings despre CSP violations

---

### 1.3. ENV Policy & Check Script (30 min)

#### Create `.env.example`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE=your-service-role-key-here

# Node
NODE_OPTIONS=--max_old_space_size=2048
```

#### Create `scripts/check-env.ts`:
```typescript
import { readFileSync } from 'fs';

const requiredKeys = readFileSync('.env.example', 'utf8')
  .split('\n')
  .filter((line) => line && !line.startsWith('#') && line.includes('='))
  .map((line) => line.split('=')[0]);

const missingKeys = requiredKeys.filter((key) => !(key in process.env));

if (missingKeys.length > 0) {
  console.error('❌ Missing ENV variables:', missingKeys.join(', '));
  console.error('💡 Check .env.example for required variables');
  process.exit(1);
}

console.log('✅ All ENV variables present');
```

#### Package.json:
```json
{
  "scripts": {
    "check:env": "tsx scripts/check-env.ts"
  }
}
```

#### Success Criteria:
- [ ] `.env.example` complet
- [ ] `npm run check:env` pass cu .env.local valid
- [ ] `npm run check:env` fail cu ENV lipsă

---

### 1.4. Deps Audit (30 min)

#### Package.json:
```json
{
  "scripts": {
    "check:deps": "pnpm audit --audit-level=high && pnpm outdated"
  }
}
```

#### Create `.npmrc`:
```
audit-level=high
fund=false
```

#### Run:
```bash
npm run check:deps
# Review vulnerabilities
# Update critical deps
```

#### Success Criteria:
- [ ] Audit rulează fără high/critical vulnerabilities
- [ ] Outdated packages documented
- [ ] Plan de update pentru deps majore

---

### 1.5. Bundle Budget Check (1h)

#### Create `scripts/check-bundle.js`:
```javascript
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const MAX_BUNDLE_KB = 300;
const buildManifest = '.next/build-manifest.json';

if (!existsSync(buildManifest)) {
  console.error('❌ Build manifest not found. Run `npm run build` first.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(buildManifest, 'utf8'));
let totalBytes = 0;

// Calculate total bundle size
Object.values(manifest.pages).forEach((files) => {
  files.forEach((file) => {
    const filePath = join('.next', file);
    if (existsSync(filePath)) {
      totalBytes += readFileSync(filePath).length;
    }
  });
});

const totalKB = Math.round(totalBytes / 1024);

if (totalKB > MAX_BUNDLE_KB) {
  console.error(`❌ Bundle size ${totalKB}KB exceeds limit ${MAX_BUNDLE_KB}KB`);
  process.exit(1);
}

console.log(`✅ Bundle size ${totalKB}KB (limit: ${MAX_BUNDLE_KB}KB)`);
```

#### Package.json:
```json
{
  "scripts": {
    "check:bundle": "node scripts/check-bundle.js"
  }
}
```

#### Success Criteria:
- [ ] Script detectează bundle > 300KB
- [ ] Current bundle size known
- [ ] Baseline established pentru monitoring

---

### 1.6. Pre-commit Hook (1h)

#### Install Husky:
```bash
pnpm add -D husky
npx husky install
npm pkg set scripts.prepare="husky install"
```

#### Create `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

npm run test:run && \
npm run check:ts && \
npm run lint && \
npm run check:env && \
npm run check:secrets && \
npm run guard:app-logic

if [ $? -ne 0 ]; then
  echo "❌ Pre-commit checks failed. Fix errors before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
```

#### Package.json:
```json
{
  "scripts": {
    "precommit": "npm run test:run && npm run check:ts && npm run lint && npm run check:env && npm run check:secrets && npm run guard:app-logic"
  }
}
```

#### Test:
```bash
git add -A
git commit -m "test: pre-commit hook"
# Should run all checks
```

#### Success Criteria:
- [ ] Hook rulează automat la commit
- [ ] Commit blocat dacă checks fail
- [ ] Hook poate fi skip cu `--no-verify` (emergency only)

---

### 1.7. RLS Tests (3h)

#### Create `lib/test/supabaseClient.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export function supabaseAs(userId: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          'X-Test-User-ID': userId,
        },
      },
    }
  );
}
```

#### Create `entities/booking/api/rls.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { supabaseAs } from '@/lib/test/supabaseClient';

describe('Booking RLS', () => {
  it('blocks cross-tenant booking access', async () => {
    const client = supabaseAs('operator-org-a');
    
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .eq('organization_id', 'org-b');
    
    expect(error).toBeTruthy();
    expect(data).toBeNull();
  });
  
  it('allows own organization booking access', async () => {
    const client = supabaseAs('operator-org-a');
    
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .eq('organization_id', 'org-a');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

#### Create similar tests for:
- [ ] `entities/payment/api/rls.test.ts`
- [ ] `entities/customer/api/rls.test.ts`

#### Success Criteria:
- [ ] RLS tests pentru bookings
- [ ] RLS tests pentru payments
- [ ] RLS tests pentru customers
- [ ] Toate testele verzi
- [ ] Cross-tenant access blocat

---

## PHASE 1 CHECKLIST:

- [ ] ✅ Secret-scan setup & tested
- [ ] ✅ CSP headers în middleware
- [ ] ✅ .env.example created
- [ ] ✅ check:env script functional
- [ ] ✅ check:deps running
- [ ] ✅ Bundle budget check implemented
- [ ] ✅ Pre-commit hook active
- [ ] ✅ RLS tests pentru 3 entities
- [ ] ✅ All checks pass locally

**Timeline:** 5-6 ore  
**Outcome:** ✅ Security hardened, quality gates automated

---

## 🎯 PHASE 2: IMPORTANT (SOON) - Week 2-3

**Obiectiv:** Coverage, logging, performance  
**Timeline:** 6-8 ore

### 2.1. Test Coverage Thresholds (2h)

#### Update `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/types.ts',
        '**/index.ts',
      ],
    },
  },
});
```

#### Tasks:
- [ ] Add tests pentru entities până la 80%
- [ ] Add tests pentru features până la 60%
- [ ] CI blocat dacă sub threshold

---

### 2.2. Logger Unificat (1h)

#### Create `lib/utils/logger.ts`:
```typescript
type LogLevel = 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: unknown;
}

class Logger {
  private log(level: LogLevel, message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service (Sentry, LogRocket)
      return;
    }
    
    const timestamp = new Date().toISOString();
    const metaStr = meta ? JSON.stringify(meta, null, 2) : '';
    
    switch (level) {
      case 'error':
        console.error(`[${timestamp}] ERROR: ${message}`, metaStr);
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN: ${message}`, metaStr);
        break;
      case 'info':
        console.log(`[${timestamp}] INFO: ${message}`, metaStr);
        break;
    }
  }
  
  error(message: string, meta?: LogMeta) {
    this.log('error', message, meta);
  }
  
  warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
  }
  
  info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
  }
}

export const logger = new Logger();
```

#### ESLint Rule:
```javascript
// .eslintrc.cjs
rules: {
  'no-console': 'error',  // Force logger usage
}
```

---

### 2.3. Timezone Utils (1h)

#### Create `lib/utils/date.ts`:
```typescript
export function formatDateUTC(
  isoString: string,
  timezone: string = 'Europe/London'
): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString));
}

export function toUTC(date: Date): string {
  return date.toISOString();
}

export function parseUTC(isoString: string): Date {
  return new Date(isoString);
}
```

#### Usage:
```typescript
// Backend: Store UTC
const booking = {
  start_at: toUTC(new Date()),
};

// Frontend: Display local
const display = formatDateUTC(booking.start_at, userTimezone);
```

---

### 2.4. Conventional Commits (30min)

#### Install commitlint:
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

#### Create `commitlint.config.cjs`:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf'],
    ],
    'scope-empty': [2, 'never'],  // Scope obligatoriu
    'subject-min-length': [2, 'always', 10],
  },
};
```

#### Create `.husky/commit-msg`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

---

## PHASE 2 CHECKLIST:

- [ ] ✅ Coverage thresholds configured
- [ ] ✅ Tests added pentru 80% entities
- [ ] ✅ Tests added pentru 60% features
- [ ] ✅ Logger unificat implemented
- [ ] ✅ ESLint no-console enforced
- [ ] ✅ Timezone utils created
- [ ] ✅ Conventional commits enforced

**Timeline:** 6-8 ore  
**Outcome:** ✅ Quality improved, standards enforced

---

## 💡 PHASE 3: NICE TO HAVE (LATER) - Month 2

**Obiectiv:** Documentation, migrations, advanced features

### 3.1. Documentation (3h)
- [ ] JSDoc pentru public APIs
- [ ] README per feature
- [ ] Architecture diagrams

### 3.2. Migrations System (Ongoing)
- [ ] Version migration files
- [ ] Rollback scripts
- [ ] Migration tests

### 3.3. API Versioning (N/A)
- [ ] Skip până la public API

---

## 📊 PROGRESS TRACKING

### Week 1:
- [ ] Phase 1 complete (5-6h)

### Week 2-3:
- [ ] Phase 2 complete (6-8h)

### Month 2:
- [ ] Phase 3 started

---

## 🎯 SUCCESS METRICS

### Security:
- ✅ Zero secrets în git history
- ✅ RLS tests passing pentru toate entities
- ✅ CSP headers active
- ✅ Dependencies audited weekly

### Quality:
- ✅ All pre-commit checks passing
- ✅ Coverage > thresholds
- ✅ Bundle < 300KB
- ✅ Build successful

### Developer Experience:
- ✅ Pre-commit hook < 30 seconds
- ✅ Clear error messages
- ✅ Documentation complete
- ✅ Conventional commits enforced

---

**END OF IMPLEMENTATION-PLAN.md**  
**Version 1.0**  
**Roadmap pentru reguli enterprise**
