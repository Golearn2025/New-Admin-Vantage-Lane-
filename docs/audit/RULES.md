# 🏢 VANTAGE LANE ENTERPRISE RULES

## 🔒 REPOSITORY CONTRACT (NON-NEGOTIABLE)

This document is the **SINGLE SOURCE OF TRUTH** for all enterprise-grade code quality, architecture, security, and deployment rules.

### **Enterprise Standards**
- **ZERO 'ANY' TYPES** - Strict TypeScript enforcement
- **DESIGN TOKENS 100%** - No hardcoded values  
- **FILES < 200 LINES** - Modular architecture enforced
- **FUNCTIONS < 50 LINES** - Single responsibility principle
- **ENTERPRISE SECURITY** - Multi-tenant isolation, audit logging
- **PERFORMANCE TARGETS** - Bundle <300KB, TTI <2s, Coverage >80%

---

## **🔴 TYPESCRIPT RULES**

### **REGULA 1: ZERO 'ANY' TYPES**
```typescript
❌ NU FACE:
const data: any = response;
const handler = (e: any) => {};
const users: any[] = [];
const component = (props: any) => {};

✅ FACE:
interface UserData {
  id: string;
  name: string;
  email: string;
}
const data: UserData = response;
const handler = (e: React.ChangeEvent<HTMLInputElement>) => {};
const users: UserData[] = [];
const component = (props: { userId: string; onUpdate: () => void }) => {};
```

### **REGULA 2: ZERO COD MORT & DEPENDENCIES**
```bash
# Verifică și elimină:
npx ts-prune > dead.txt
npx depcheck > deps.txt
npx madge --circular apps/admin packages > circular.txt

# Verifică manual:
grep -r "import.*unused" apps/admin/
find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "export.*never.*used"
```

---

## **🎨 DESIGN TOKENS RULES**

### **REGULA 3: ZERO CULORI HARDCODATE**
```css
❌ NU FACE:
color: #fff;
background: rgb(255, 0, 0);
border-color: #000000;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

✅ FACE:
color: var(--color-text-primary);
background: var(--color-danger-default);
border-color: var(--color-border);
box-shadow: var(--shadow-card);
```

### **REGULA 4: ZERO VALORI PX BRUTE**
```css
❌ NU FACE:
padding: 16px;
margin: 24px;
font-size: 14px;
width: 320px;
height: 48px;

✅ FACE:
padding: var(--spacing-4);
margin: var(--spacing-6);
font-size: var(--font-sm);
width: var(--width-80);
height: var(--spacing-12);
```

### **REGULA 5: DESIGN TOKENS 100%**
```css
/* Folosește DOAR astea: */
--spacing-1 (4px), --spacing-2 (8px), --spacing-3 (12px), --spacing-4 (16px)
--spacing-5 (20px), --spacing-6 (24px), --spacing-8 (32px), --spacing-10 (40px)
--color-success-500, --color-warning-500, --color-danger-default
--color-info-500, --color-text-primary, --color-text-secondary
--font-xs (12px), --font-sm (14px), --font-base (16px), --font-lg (18px)
--radius-sm, --radius-md, --radius-lg, --radius-full
--shadow-card, --shadow-modal, --motion-duration-fast
```

---

## **🧱 COMPONENT RULES**

### **REGULA 6: UI-CORE COMPONENTS OBLIGATORIU**
```tsx
❌ NU FACE:
<button className="custom-btn">Click</button>
<div className="custom-card">...</div>
<input className="custom-input" />
<svg>...</svg>

✅ FACE:
import { Button, Card, Input } from '@vantage-lane/ui-core';
<Button variant="primary">Click</Button>
<Card>...</Card>
<Input placeholder="Enter text" />
```

### **REGULA 7: LUCIDE-REACT ICONS DOAR**
```tsx
❌ NU FACE:
<svg><path d="M12 2l3.09..."></svg>
<i className="fas fa-user"></i>
<img src="/icons/user.svg" />

✅ FACE:
import { User, Upload, Check, Calendar, Search } from 'lucide-react';
<User size={16} />
<Upload size={20} />
<Check size={14} />
```

### **REGULA 8: ENTERPRISEDATATABLE UNIC**
```tsx
❌ NU FACE:
<table><thead>...</thead></table>
<CustomTable />
<MyDataTable />
<MaterialTable />

✅ FACE:
import { EnterpriseDataTable } from '@vantage-lane/ui-core';
<EnterpriseDataTable 
  data={data}
  columns={columns}
  stickyHeader={true}
  pagination={true}
  selection={true}
  export={true}
/>
```

---

## **🏗️ ARCHITECTURE RULES**

### **REGULA 9: ZERO FETCH ÎN UI**
```tsx
❌ NU FACE:
const MyComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setData);
  }, []);
  
  return <div>{data.map(...)}</div>;
}

✅ FACE:
// În hooks/useUsersList.ts:
export const useUsersList = () => {
  return useQuery(['users'], () => fetchUsers());
}

// În component:
const MyComponent = () => {
  const { data, loading, error } = useUsersList();
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorBanner />;
  
  return <div>{data.map(...)}</div>;
}
```

### **REGULA 10: FORMATTERS CENTRALIZATE**
```tsx
❌ NU FACE:
// În fiecare component:
{new Date(date).toLocaleDateString()}
{`$${amount / 100}`}
{`${distance / 1000} km`}

✅ FACE:
// În utils/formatters.ts:
export const formatDate = (date: string) => new Date(date).toLocaleDateString();
export const formatCurrency = (cents: number) => `$${cents / 100}`;
export const formatDistance = (meters: number) => `${meters / 1000} km`;

// În component:
{formatDate(user.createdAt)}
{formatCurrency(payment.amount)}
{formatDistance(trip.distance)}
```

---

## **📏 SIZE & COMPLEXITY RULES**

### **REGULA 11: FILE & FUNCTION LIMITS**
```typescript
❌ NU FACE:
// File cu 300+ linii
export const HugeComponent = () => {
  // 500 lines of code
}

// Funcție cu 80+ linii
const complexFunction = () => {
  // 100 lines of logic
}

✅ FACE:
// File < 200 linii (split în multiple files)
// components/UserCard.tsx (150 lines)
// hooks/useUserData.ts (80 lines)
// utils/userHelpers.ts (70 lines)

// Funcție < 50 linii
const processUserData = (user: User) => {
  // 30 lines max
}
```

---

## **🔒 ENTERPRISE SECURITY RULES**

### **REGULA 12: MULTI-TENANT ISOLATION**
```typescript
// Data isolation la DB level:
const getUserBookings = async (userId: string) => {
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId) // RLS ensures org isolation
    .order('created_at', { ascending: false });
    
  return data;
};

// RLS Policies obligatorii:
CREATE POLICY "Users see only their org data" ON bookings
  FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id');
```

### **REGULA 13: INPUT VALIDATION**
```typescript
// XSS Prevention:
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(userInput);

// Zod schemas obligatorii:
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  role: z.enum(['admin', 'operator', 'driver'])
});
```

---

## **⚡ PERFORMANCE RULES**

### **REGULA 14: BUNDLE SIZE & LOADING**
```typescript
// Bundle < 300KB initial
// Code splitting obligatoriu:
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Virtual scrolling pentru >100 items:
import { VariableSizeList as List } from 'react-window';

const VirtualizedTable = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={getItemSize}
    itemData={items}
  >
    {TableRow}
  </List>
);
```

### **REGULA 15: CLEANUP & SUBSCRIPTIONS**
```tsx
useEffect(() => {
  const subscription = subscribe();
  const timer = setInterval(() => {}, 1000);
  
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);
```

---

## **♿ ACCESSIBILITY RULES**

### **REGULA 16: WCAG 2.1 AA COMPLIANCE**
```tsx
// Keyboard navigation obligatoriu:
<Button 
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSubmit();
  }}
  aria-label="Submit form"
>
  Submit
</Button>

// ARIA labels pentru icons:
<Button aria-label="Delete user">
  <Trash size={16} />
</Button>
```

---

## **🧪 TESTING RULES**

### **REGULA 17: COVERAGE >80%**
```typescript
// Unit tests obligatorii:
describe('useUsersList', () => {
  it('should fetch users successfully', async () => {
    const { result } = renderHook(() => useUsersList());
    await waitFor(() => {
      expect(result.current.data).toHaveLength(5);
    });
  });
});

// E2E pentru critical paths:
test('User can create booking', async ({ page }) => {
  await page.goto('/bookings/create');
  await page.fill('[data-testid="pickup"]', 'London');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
```

---

## **🏢 ENTERPRISE MONITORING**

### **REGULA 18: ERROR & PERFORMANCE TRACKING**
```typescript
// Sentry pentru errors:
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: { component: 'UsersList', action: 'fetch' },
  user: { id: userId, role: userRole },
  extra: { query: queryParams }
});

// Web Vitals tracking:
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
getCLS(console.log);
getFID(console.log);
```

---

## **📊 VALIDATION CHECKLIST ENTERPRISE**

### **🔴 CRITICAL CHECKS (MANDATORY)**
```bash
1. pnpm check:ts
   ✅ EXPECTED: 0 errors

2. pnpm lint -- --max-warnings=0  
   ✅ EXPECTED: 0 errors, 0 warnings

3. pnpm test -- --coverage
   ✅ EXPECTED: >80% coverage

4. pnpm build
   ✅ EXPECTED: Bundle < 300KB initial

5. grep -r ": any\|<any>" apps/ --include="*.tsx" --include="*.ts"
   ✅ EXPECTED: 0 results

6. grep -r "rgba\|rgb\|#[0-9a-fA-F]" apps/ --include="*.css" | grep -v "var(--"
   ✅ EXPECTED: 0 hardcoded colors

7. grep -r "[0-9]+px" apps/ --include="*.css" | grep -v "var(--"
   ✅ EXPECTED: 0 hardcoded px values

8. npx @axe-core/cli http://localhost:3000
   ✅ EXPECTED: 0 accessibility violations

9. lighthouse http://localhost:3000
   ✅ EXPECTED: All scores >90

10. npx madge --circular apps/
    ✅ EXPECTED: 0 circular dependencies
```

### **🏢 ENTERPRISE TARGETS**
- **Performance:** TTI <2s, Bundle <300KB
- **Reliability:** Error rate <0.1%, Uptime >99.9%
- **Security:** Multi-tenant isolation, Audit logs
- **Accessibility:** WCAG 2.1 AA compliance
- **Testing:** >80% coverage, E2E critical paths
- **Monitoring:** Real-time error/performance tracking

---

## **⚠️ STOP CONDITIONS**

**OPREȘTE-TE și CERE CLARIFICARE dacă:**
❌ Regulă hard ar fi încălcată (any types, hardcoded values)
❌ Fișier ar depăși 200 lines
❌ Funcție ar depăși 50 lines  
❌ Coverage ar scădea sub 80%
❌ Bundle size ar crește peste 300KB
❌ Circular dependency detectat
❌ Security vulnerability găsită
❌ Breaking change pentru alte features

---

## **🎯 COMMIT TEMPLATE ENTERPRISE**

```markdown
feat(module): enterprise compliance

- Zero 'any' types eliminated
- Design tokens 100% implemented
- Multi-tenant security verified
- Performance targets met
- >80% test coverage achieved
- WCAG 2.1 AA compliance

Files: X modified
Bundle: 280KB (target: <300KB)
Coverage: 85% (target: >80%)
Performance: All green
Security: Verified
Verified: ts ✓ | lint ✓ | test ✓ | security ✓

CERE APROBARE USER ÎNAINTE DE COMMIT!
```

**Last Updated:** 2025-11-27
**Version:** 2.0.0 - Enterprise Edition
- **NEVER** hardcode fallback passwords in audit scripts

### 3. Collect All Issues
- UI tests use `expect.soft()` to collect all problems before failing
- Generate complete issue reports, not just first failure
- Provide actionable details for every issue found

### 4. Dated Output Structure
```
docs/audit/outputs/YYYY-MM-DD/
  archive-moves.json          # Files moved to archive
  archive-moves.md            # Human-readable archive report
  scan/
    *.log                     # Detailed tool outputs
    summary.json              # Aggregated scan results
    summary.md                # Human-readable scan report
  security/
    rls.json                  # RLS test results
    rls.md                    # Human-readable security report
  ui-issues-*.json            # Per-role/viewport issues
  route-*.png                 # Screenshots per route
  pipeline.json               # Full pipeline execution log
  pipeline-summary.md         # Human-readable pipeline report
```

### 5. Zero External Dependencies for Security
- RLS tests use **ONLY** `@supabase/supabase-js` with client keys
- **FORBIDDEN:** Service role keys, direct database connections
- All authentication through standard login flow

### 6. Archive Safety
- **NEVER** delete audit files permanently
- Move to `docs/_archive/YYYY-MM-DD/` with original structure preserved
- Keep audit trail of what was moved when

## Quality Gates

### Before Commit
```bash
# All of these must pass:
npm run lint -- --max-warnings=0
npm run check:ts  
npm run build
```

### Before Release
```bash
# Full pipeline must complete:
node scripts/audit/audit-all.mjs
# Check: docs/audit/REPORT.md shows no critical failures
```

### After Permission Changes
```bash
# Security audit required:
node scripts/audit/audit-rls.mjs
# Verify: No cross-tenant data leaks detected
```

## Output Interpretation

### Layer 1: Code Scan Status
- **PASSED:** All tools ran successfully, no issues
- **FAILED:** Critical issues found (TypeScript errors, build failures)
- **SKIPPED:** Tool not available or configured

### Layer 2: UI Issue Types
- **ERROR_PAGE:** Route returns 404/500 or error content
- **MISSING_SHELL:** App header/navigation not found
- **NAV_FAIL:** Route navigation completely failed
- **SCREENSHOT_FAIL:** Could not capture visual proof

### Layer 3: Security Test Results
- **PASSED:** Proper isolation confirmed
- **FAILED:** Cross-tenant data leak detected (CRITICAL)
- **SKIPPED:** Missing credentials or test environment

## Maintenance Schedule

### Daily (CI/CD)
- Layer 1 (Code Scan) on every commit

### Weekly
- Full pipeline (`audit-all.mjs`) on main branch
- Review and address any new issues

### Monthly
- Layer 3 (Security) deep audit
- Archive cleanup if needed
- Review and update test credentials

### Before Major Releases
- Complete pipeline with manual review
- Security audit with penetration testing mindset
- Performance baseline establishment

## Emergency Procedures

### Critical Security Issue Found
1. **STOP** - Do not merge/deploy
2. Review RLS test details in `security/rls.md`
3. Fix database policies immediately
4. Re-run security audit to confirm fix
5. Document fix in security changelog

### Build Pipeline Broken
1. Check `scan/summary.md` for specific failures
2. Fix issues in order of criticality:
   - TypeScript errors (highest priority)
   - Lint violations
   - Dependency issues
   - Build optimization warnings
3. Re-run scan to confirm fixes

### Mass UI Failures
1. Review `ui-issues-*.json` files for patterns
2. Common causes:
   - Missing test IDs (`data-testid="app-header"`)
   - Route configuration changes
   - Authentication flow changes
3. Fix systematically by role/viewport
4. Re-run UI tests to verify

## Access Control

### Who Can Modify Audit Rules
- Senior developers with security clearance
- DevOps engineers managing CI/CD
- Security team members

### Who Can Run Full Pipeline
- Any developer (local environment)
- CI/CD system (automated)
- QA team (testing environments)

### Who Can View Security Reports
- Development team (aggregated results)
- Security team (detailed outputs)
- Management (summary status only)

## Compliance

This audit system helps maintain:
- **SOC 2 Type II:** Automated security monitoring
- **ISO 27001:** Regular security assessments  
- **GDPR:** Data access control verification
- **PCI DSS:** Cross-tenant isolation (if handling payments)

## Updates to Rules

Changes to this document require:
1. Security team approval for Layer 3 changes
2. Code review for Layer 1/2 changes
3. Update to `RUNBOOK.md` if procedures change
4. Communication to all developers

**Last Updated:** ${new Date().toISOString().split('T')[0]}  
**Version:** 1.0.0
