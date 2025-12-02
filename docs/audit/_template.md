# AUDIT TEMPLATE - [MODULE NAME]

**Date:** YYYY-MM-DD  
**Auditor:** [Name]  
**Scope:** [Specific module/feature]  
**Status:** [IN_PROGRESS | COMPLETED | BLOCKED]

## 📋 CHECKLIST APLICAT

- [ ] **TypeScript:** Zero `any` types
- [ ] **Design Tokens:** 100% var(--tokens)  
- [ ] **File Limits:** <250 lines per file
- [ ] **UI Components:** Using ui-core only
- [ ] **Architecture:** Clean separation (ui/model/api)
- [ ] **Performance:** No fetch in UI, stable query keys
- [ ] **Security:** RLS policies active, no secrets in client
- [ ] **Tests:** All passing, coverage >80%

## 🔍 FINDINGS

### Critical Issues:
1. [Issue description + file location + fix needed]

### Warnings:
1. [Issue description + recommendation]

### Improvements:
1. [Optimization opportunity]

## 📊 METRICS

- **Files Audited:** X
- **Issues Found:** Critical: X, Warnings: Y  
- **Lines of Code:** Before: X, After: Y
- **Test Coverage:** X%
- **Bundle Size Impact:** +/- X KB

## ✅ VERIFICATION COMMANDS

```bash
# Commands used to verify fixes
pnpm check:ts
pnpm lint
pnpm test:run
# ... other checks
```

## 📈 BEFORE/AFTER

### Before:
- [Description of state before audit]

### After:  
- [Description of improvements made]

## 🎯 NEXT STEPS

1. [Action item 1]
2. [Action item 2]

---

**Audit completed following ENTERPRISE v2 standards from docs/00_RULES.md**
