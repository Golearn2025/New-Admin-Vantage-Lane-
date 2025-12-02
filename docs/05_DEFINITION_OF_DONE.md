# ✅ DEFINITION OF DONE

**Owner:** Engineering Team  
**Scope:** PR acceptance criteria  
**Last Updated:** 2025-11-27  
**Status:** ACTIVE

## 🎯 ACCEPT/REFUSE CRITERIA FOR PRs

### 🟢 AUTOMATIC ACCEPT (All Must Pass)

#### CODE QUALITY
- [ ] **pnpm check:ts** → 0 errors
- [ ] **pnpm lint** → 0 errors, 0 warnings
- [ ] **pnpm build** → Build successful
- [ ] **pnpm test:run** → All tests passing
- [ ] Files <200 lines each
- [ ] Functions <50 lines each
- [ ] Zero `any` types in TypeScript

#### ARCHITECTURE  
- [ ] Logic NOT in `app/` directory
- [ ] Proper import aliases (`@features/`, `@entities/`)
- [ ] UI components from `@vantage-lane/ui-core`
- [ ] EnterpriseDataTable for production tables
- [ ] Icons from `lucide-react` only

#### DESIGN TOKENS
- [ ] 100% design tokens (`var(--spacing-4)`)
- [ ] Zero hardcoded colors/spacing
- [ ] Zero inline styles (`style={{}}`)
- [ ] Zero `!important` in CSS

#### SECURITY
- [ ] No sensitive data in client code
- [ ] RLS policies active (if database changes)
- [ ] Input validation implemented
- [ ] Authentication/authorization checked

### 🔴 AUTOMATIC REFUSE (Any Fails = Block)

#### CODE ISSUES
- [ ] TypeScript errors present
- [ ] ESLint errors/warnings present
- [ ] Build failures
- [ ] Test failures
- [ ] Files >200 lines
- [ ] Functions >50 lines
- [ ] `any` types present

#### ARCHITECTURE VIOLATIONS
- [ ] Business logic in `app/` directory
- [ ] Duplicate UI components (not using ui-core)
- [ ] Direct relative imports (`../../../`)
- [ ] Raw HTML tables (not using DataTable)
- [ ] Manual SVG icons (not lucide-react)

#### DESIGN TOKEN VIOLATIONS
- [ ] Hardcoded colors (`#FF0000`, `rgba()`)
- [ ] Hardcoded spacing (`20px`, `margin: 10px`)
- [ ] Inline styles present
- [ ] `!important` declarations

#### SECURITY VIOLATIONS
- [ ] API keys in source code
- [ ] Database credentials exposed
- [ ] Missing authentication checks
- [ ] RLS bypassed incorrectly

## 📋 CHECKLIST VALIDATION

### Before Opening PR:
```bash
# Run all checks locally
pnpm check:ts && pnpm lint && pnpm build && pnpm test:run

# Validate design tokens
grep -r "rgba\|rgb\|#[0-9a-fA-F]" . --include="*.css" | grep -v "var(--"
# Should return 0 results

# Check file sizes  
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 200 {print}'
# Should return 0 results

# Validate architecture
grep -r "import.*\.\./.*\.\./.*\.\." apps/ --include="*.tsx" --include="*.ts" 
# Should return 0 results
```

### PR Description Template:
```markdown
## Changes Made
- [ ] Brief description of changes
- [ ] Architecture impact (if any)
- [ ] Database changes (if any)

## Testing Done  
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing completed

## Checklist
- [ ] All automated checks pass ✅
- [ ] No hardcoded values 
- [ ] Proper TypeScript typing
- [ ] UI components from ui-core
- [ ] Security considerations addressed

## Screenshots (if UI changes)
[Add screenshots showing before/after]
```

## 🚦 REVIEW PROCESS

### Reviewer Checklist:
- [ ] **Auto-checks pass** (CI/CD green)
- [ ] **Code follows patterns** from existing codebase  
- [ ] **Security implications** considered
- [ ] **Performance impact** acceptable
- [ ] **Accessibility maintained** (WCAG 2.1 AA)
- [ ] **Mobile responsiveness** verified
- [ ] **Documentation updated** (if needed)

### Fast-Track Approval (Skip Manual Review):
- [ ] Automated checks all green ✅
- [ ] Changes <10 lines
- [ ] Documentation/comment updates only
- [ ] Bug fixes with tests
- [ ] Dependency updates (patch versions)

### Mandatory Manual Review:
- [ ] Database schema changes
- [ ] Security/authentication changes  
- [ ] New API endpoints
- [ ] Performance-critical changes
- [ ] Breaking changes
- [ ] New features

## ⚡ QUICK REFERENCE

### ✅ GOOD EXAMPLES:
```typescript
// ✅ Design tokens
const styles = { padding: 'var(--spacing-4)' };

// ✅ Proper imports  
import { Button } from '@vantage-lane/ui-core';
import { useUsers } from '@entities/user';

// ✅ TypeScript typing
interface UserProps {
  user: UnifiedUser;
  onEdit: (user: UnifiedUser) => void;
}
```

### ❌ BAD EXAMPLES:
```typescript
// ❌ Hardcoded values
const styles = { padding: '16px', color: '#FF0000' };

// ❌ Relative imports
import { Button } from '../../../ui-core/Button';

// ❌ Any types
const handleUser = (user: any) => { /* ... */ };
```

---

**Definition of Done is NON-NEGOTIABLE. All criteria must pass.**
