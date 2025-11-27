# Enterprise Audit Report

**Generated:** 2025-11-27T10:42:53.521Z  
**Date Folder:** 2025-11-27  
**Git:** chore/docs-single-source-of-truth@1087c0c (dirty)  
**Overall Status:** ❌ FAILED

## Summary

| Layer | Status | Details |
|-------|--------|---------|
| **0. Archive** | ✅ PASSED | 3 files moved |
| **1. Code Scan** | ❌ FAILED | 3/7 checks |
| **2. UI Smoke** | ✅ PASSED | 0 issues found |
| **3. Security RLS** | ⏭️ SKIPPED | No data |

---

## Layer 0: Archive & Cleanup


**Files Moved:** 3  
**Errors:** 0  
**Archive Location:** `docs/_archive/2025-11-27/`

### Archived Files (Top 10)

1. `docs/00_RULES.md` → `docs/_archive/2025-11-27/docs/00_RULES.md`
2. `docs/01_AUDIT_PROCESS.md` → `docs/_archive/2025-11-27/docs/01_AUDIT_PROCESS.md`
3. `docs/02_CHECKLIST.md` → `docs/_archive/2025-11-27/docs/02_CHECKLIST.md`



📁 **Details:** [archive-moves.md](outputs/2025-11-27/archive-moves.md)


---

## Layer 1: Code Quality Scan


**Status:** ❌ 2 Checks Failed

### Results Summary

| Check | Status | Duration |
|-------|--------|----------|
| Lint Check | ✅ PASSED | 3268ms |
| TypeScript Check | ❌ FAILED | 4368ms |
| Dead Code Check | ✅ PASSED | 3084ms |
| Dependencies Check | ⚠️ FAILED_EXPECTED | 2541ms |
| Circular Dependencies | ✅ PASSED | 2819ms |
| Git Secrets Scan | ⏭️ SKIPPED | N/Ams |
| Build Check | ❌ FAILED | 37956ms |

📁 **Details:** [scan/summary.md](outputs/2025-11-27/scan/summary.md)


---

## Layer 2: UI Smoke Testing

**Total Issues Found:** 0  
**Test Files:** 0

✅ **All Routes Working** - No issues detected

📁 **Screenshots:** `outputs/2025-11-27/` (*.png files)  
📁 **Issue Details:** `outputs/2025-11-27/ui-issues-*.json`

---

## Layer 3: Security & RLS Testing

⏭️ **Skipped** - No RLS data available (check credentials)

---

## Additional Data

### Route Inventory

- **Admin Routes:** 52
- **Operator Routes:** 0  
- **Driver Routes:** 0

📁 **Details:** [routes/routes.json](routes/routes.json)


### Shared Component Analysis

- **Admin Components:** 0 imports
- **Operator Components:** 0 imports
- **Driver Components:** 0 imports
- **Shared Between All:**  components

📁 **Details:** [shared/SHARED_FILES.md](shared/SHARED_FILES.md)


---

## Next Steps


### 🔴 Critical Issues to Fix

- **Code Scan**: Review detailed logs and fix failing checks




### ⚠️ Incomplete Coverage

- **Security RLS**: Configure and run missing audit layer


### 📋 Regular Maintenance

1. Run audit pipeline weekly: `node scripts/audit/audit-all.mjs`
2. Review security tests when changing permissions
3. Update route inventory after adding new pages
4. Monitor shared component growth

---

## Files Generated

- **This Report:** `docs/audit/REPORT.md`
- **Dated Outputs:** `docs/audit/outputs/2025-11-27/`
- **Route Inventory:** `docs/audit/routes/`
- **Shared Analysis:** `docs/audit/shared/`
- **Archived Docs:** `docs/_archive/2025-11-27/`

**Pipeline completed at:** 2025-11-27T10:42:53.521Z
