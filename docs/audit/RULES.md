# Enterprise Audit Rules

## 🔒 REPOSITORY CONTRACT (NON-NEGOTIABLE)

This document is the **SINGLE SOURCE OF TRUTH** for all code quality, architecture, and deployment rules. 

### **Behavior Change Policy**
- **NO BEHAVIOR CHANGES** without explicit approval in PR description
- **SCOPE PER PR:** One feature/component/layer maximum
- **MAX LINES:** 250 lines per file (split if exceeded)
- **QUALITY GATES:** All CI checks must pass before merge

## Single Source of Truth

This directory (`docs/audit/`) is the **ONLY** authoritative source for audit documentation and processes. All other audit-related files have been archived to `docs/_archive/`.

## Pipeline Structure

The audit system consists of 4 layers that run in sequence:

### Layer 0: Archive & Cleanup
- **Purpose:** Move legacy audit files to archive, establish clean foundation
- **Script:** `scripts/audit/audit-archive.mjs`
- **Frequency:** As needed when cleaning up documentation

### Layer 1: Code Quality Scan
- **Purpose:** Hard facts about code health (lint, TypeScript, dependencies, build)
- **Script:** `scripts/audit/audit-scan.mjs`  
- **Frequency:** Every commit, before PR merge

### Layer 2: UI Smoke Testing
- **Purpose:** Shell consistency, route navigation, responsive behavior
- **Script:** `tests/smoke/shell-audit.spec.ts` (Playwright)
- **Frequency:** Before releases, after UI changes

### Layer 3: Security & RLS Testing  
- **Purpose:** Real database security, cross-tenant isolation
- **Script:** `scripts/audit/audit-rls.mjs`
- **Frequency:** After permission changes, monthly

## Non-Negotiable Rules

### 1. No Business Logic Changes
- Audit tools **NEVER** modify application behavior
- Only documentation, scripts, tests, and reports are created/modified
- Zero impact on user experience or functionality

### 2. Fail-Fast Environment Variables
- Required: `ADMIN_TEST_PASSWORD`, `OPERATOR_TEST_PASSWORD`, `DRIVER_TEST_PASSWORD`
- Tests fail immediately if credentials missing
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
