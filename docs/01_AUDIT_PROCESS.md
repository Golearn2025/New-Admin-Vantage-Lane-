# 🔍 AUDIT PROCESS - STEP BY STEP

**Owner:** Engineering Team  
**Scope:** Code quality audits  
**Last Updated:** 2025-11-27  
**Status:** ACTIVE

## 🎯 QUICK AUDIT (Per Module)

### STEP 1: Pre-flight Check
```bash
git status                    # Clean working tree
pnpm check:ts                # 0 TypeScript errors
pnpm lint                    # 0 ESLint errors
```

### STEP 2: Module Scan
```bash
MODULE="users-table"  # Example module
find apps/admin/features/$MODULE -name "*.tsx" -o -name "*.ts" -o -name "*.css"
```

### STEP 3: Critical Checks
```bash
# 1. TypeScript 'any' audit
grep -r ": any\|<any>" apps/admin/features/$MODULE --include="*.tsx" --include="*.ts"
# ✅ EXPECTED: 0 results

# 2. Hardcoded colors audit  
grep -r "rgba\|rgb\|#[0-9a-fA-F]" apps/admin/features/$MODULE --include="*.css" | grep -v "var(--"
# ✅ EXPECTED: 0 results

# 3. Hardcoded px values
grep -r "[0-9]\+px" apps/admin/features/$MODULE --include="*.css" | grep -v "var(--"
# ✅ EXPECTED: 0 results

# 4. Inline styles
grep -r "style={{" apps/admin/features/$MODULE --include="*.tsx"
# ✅ EXPECTED: 0 results

# 5. UI component duplicates
grep -r "export function.*Button\|export const.*Button" apps/admin/features/$MODULE
# ✅ EXPECTED: 0 results (use ui-core)
```

### STEP 4: Architecture Validation
```bash
# 6. EnterpriseDataTable usage
grep -r "EnterpriseDataTable\|DataTable" apps/admin/features/$MODULE
# ✅ EXPECTED: EnterpriseDataTable for >100 rows

# 7. UI-Core imports
grep -r "from '@vantage-lane/ui-core'" apps/admin/features/$MODULE
# ✅ EXPECTED: All UI from ui-core

# 8. Fetch in UI components  
grep -r "fetch\|axios" apps/admin/features/$MODULE --include="*.tsx" | grep -v "hooks"
# ✅ EXPECTED: 0 results (API calls in hooks only)
```

## 🚨 FAILURE ACTIONS

If ANY check fails:
1. **Fix immediately** before proceeding
2. **Re-run checks** until all pass ✅
3. **Document fixes** in commit message
4. **No commits** until all checks pass

## 📊 AUDIT REPORT FORMAT

```markdown
## MODULE AUDIT: {module-name}

### FILES SCANNED: {count}
### ISSUES FOUND: {count}
### FIXES APPLIED: {count}

### RESULTS:
✅ TypeScript: 0 any types
✅ Colors: 100% design tokens  
✅ Spacing: 100% design tokens
✅ UI Components: 100% ui-core
✅ Architecture: Clean separation
✅ Tests: All passing
```

## ⚡ AUTOMATION

Add to `.pre-commit-config.yaml`:
```yaml
- repo: local
  hooks:
    - id: audit-check
      name: Module Audit
      entry: scripts/audit-module.sh
      language: script
```

---

**Run audit on EVERY feature before PR. No exceptions.**
