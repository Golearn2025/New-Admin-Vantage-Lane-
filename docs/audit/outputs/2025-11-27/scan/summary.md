# Hard Facts Scan Report - 2025-11-27

**Generated:** 2025-11-27T16:20:46.232Z

## Summary

| Status | Count |
|--------|-------|
| ✅ Passed | 5 |
| ❌ Failed | 0 |
| ⏭️ Skipped | 1 |
| **Total** | **7** |

## Detailed Results

### ✅ Lint Check

**Status:** PASSED
**Command:** `npm run lint -- --max-warnings=0`
**Duration:** 3282ms

**Details:** [docs/audit/outputs/2025-11-27/scan/lint_check.log](docs/audit/outputs/2025-11-27/scan/lint_check.log)

### ✅ TypeScript Check

**Status:** PASSED
**Command:** `npm run check:ts`
**Duration:** 6967ms

**Details:** [docs/audit/outputs/2025-11-27/scan/typescript_check.log](docs/audit/outputs/2025-11-27/scan/typescript_check.log)

### ✅ Dead Code Check

**Status:** PASSED
**Command:** `npx ts-prune --ignore "test|spec|stories"`
**Duration:** 4796ms

**Details:** [docs/audit/outputs/2025-11-27/scan/dead_code_check.log](docs/audit/outputs/2025-11-27/scan/dead_code_check.log)

### ⚠️ Dependencies Check

**Status:** FAILED_EXPECTED
**Command:** `npx depcheck --ignores="@types/*,eslint-*,prettier,autoprefixer"`
**Duration:** 3793ms

**Details:** [docs/audit/outputs/2025-11-27/scan/dependencies_check.log](docs/audit/outputs/2025-11-27/scan/dependencies_check.log)

### ✅ Circular Dependencies

**Status:** PASSED
**Command:** `npx madge --circular apps/admin packages --extensions ts,tsx,js,jsx`
**Duration:** 4822ms

**Details:** [docs/audit/outputs/2025-11-27/scan/circular_dependencies.log](docs/audit/outputs/2025-11-27/scan/circular_dependencies.log)

### ⏭️ Git Secrets Scan

**Status:** SKIPPED
**Command:** `N/A`

**Reason:** git-secrets not installed


### ✅ Build Check

**Status:** PASSED
**Command:** `npm run build`
**Duration:** 37366ms

**Details:** [docs/audit/outputs/2025-11-27/scan/build_check.log](docs/audit/outputs/2025-11-27/scan/build_check.log)


## Overall Status

✅ **PASSED** - All checks passed

## Files Generated

- Summary: `docs/audit/outputs/2025-11-27/scan/summary.json`
- Detailed logs: `docs/audit/outputs/2025-11-27/scan/*.log`
