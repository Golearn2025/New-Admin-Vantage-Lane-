# Enterprise Audit Runbook

## Quick Start

For quick setup and common tasks, see **[RUNBOOK-QUICK.md](RUNBOOK-QUICK.md)**.  
For troubleshooting issues, see **[RUNBOOK-TROUBLESHOOTING.md](RUNBOOK-TROUBLESHOOTING.md)**.

This document covers detailed procedures and advanced usage.

## Environment Setup

### Required Environment Variables

```bash
# Add to your .env.local or shell profile:
export ADMIN_TEST_PASSWORD="actual_password_for_catalin@vantage-lane.com"
export OPERATOR_TEST_PASSWORD="actual_password_for_den@vantage-lane.com"
export DRIVER_TEST_PASSWORD="actual_password_for_driver@test.com"

# Optional Supabase config (will use defaults if missing):
export NEXT_PUBLIC_SUPABASE_URL="https://fmeonuvmlopkutbjejlo.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
```

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (for UI tests)
npx playwright install

# Verify environment
npm run check:ts
npm run lint
```

## Running Individual Layers

### Layer 0: Archive Legacy Files

```bash
# Move old audit files to archive (safe operation)
node scripts/audit/audit-archive.mjs

# Check what was moved:
cat docs/audit/outputs/$(date +%Y-%m-%d)/archive-moves.md
```

### Layer 1: Code Quality Scan

```bash
# Run all code quality checks
node scripts/audit/audit-scan.mjs

# View detailed results:
ls docs/audit/outputs/$(date +%Y-%m-%d)/scan/
cat docs/audit/outputs/$(date +%Y-%m-%d)/scan/summary.md
```

### Layer 2: UI Smoke Tests

```bash
# Run Playwright shell tests
npx playwright test tests/smoke/shell-audit.spec.ts --reporter=line

# View screenshots and issues:
ls docs/audit/outputs/$(date +%Y-%m-%d)/*.png
cat docs/audit/outputs/$(date +%Y-%m-%d)/ui-issues-*.json
```

### Layer 3: Security RLS Tests

```bash
# Run cross-tenant security tests
node scripts/audit/audit-rls.mjs

# View security results:
cat docs/audit/outputs/$(date +%Y-%m-%d)/security/rls.md
```

## Interpreting Results

### Overall Status

Check `docs/audit/REPORT.md` for high-level status:
- ✅ **PASSED** - All layers successful
- ❌ **FAILED** - Critical issues found
- ⚠️ **INCOMPLETE** - Some layers skipped

### Layer 1: Code Quality

**Common Issues & Fixes:**

```bash
# TypeScript errors
npm run check:ts
# Fix: Address type errors in reported files

# Lint violations  
npm run lint -- --fix
# Fix: Auto-fix where possible, manual fix for remaining

# Build failures
npm run build
# Fix: Resolve import/export issues, missing dependencies

# Dead code
npx ts-prune
# Fix: Remove unused exports or add to ignore list

# Circular dependencies  
npx madge --circular apps/admin packages
# Fix: Refactor import structure to break cycles
```

### Layer 2: UI Issues

**Issue Types:**

- **ERROR_PAGE:** Route returns 404/500
  - Check route configuration in app directory
  - Verify file exists and is properly exported
  
- **MISSING_SHELL:** App header not found
  - Add `data-testid="app-header"` to shell component
  - Ensure shell renders before content
  
- **NAV_FAIL:** Navigation completely failed
  - Check authentication flow
  - Verify user permissions for route
  
- **SCREENSHOT_FAIL:** Visual capture failed
  - Usually indicates page crash or infinite loading
  - Check browser console logs

### Layer 3: Security Issues

**Critical Failures:**

- **Cross-tenant data leak:** STOP DEPLOYMENT
  - Review RLS policies on affected tables
  - Test fix manually in database before re-running
  
- **Authentication bypass:** CRITICAL SECURITY ISSUE
  - Review auth middleware and route protection
  - Verify user context is properly set

## Troubleshooting

### Pipeline Stops at Layer 1

```bash
# Check specific scan failures:
ls docs/audit/outputs/$(date +%Y-%m-%d)/scan/*.log

# Common fixes:
npm install           # Missing dependencies
npm run build         # Build configuration issues
npx ts-prune --ignore "test|spec"  # Reduce false positives
```

### Playwright Tests Fail to Start

```bash
# Install/update browsers:
npx playwright install

# Check environment:
echo $ADMIN_TEST_PASSWORD  # Should not be empty

# Run single test for debugging:
npx playwright test tests/smoke/shell-audit.spec.ts --headed --project=chromium
```

### RLS Tests Show "No Data"

```bash
# Verify Supabase connection:
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test authentication manually:
node -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
client.auth.signInWithPassword({
  email: 'catalin@vantage-lane.com', 
  password: process.env.ADMIN_TEST_PASSWORD
}).then(r => console.log(r.data ? 'Auth OK' : r.error));
"
```

### "Archive Already Exists" Error

```bash
# Check existing archive:
ls docs/_archive/$(date +%Y-%m-%d)/

# Force re-archive (careful!):
rm -rf docs/_archive/$(date +%Y-%m-%d)
node scripts/audit/audit-archive.mjs
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Audit Pipeline
on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday 6AM

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install
      - run: node scripts/audit/audit-all.mjs
        env:
          ADMIN_TEST_PASSWORD: ${{ secrets.ADMIN_TEST_PASSWORD }}
          OPERATOR_TEST_PASSWORD: ${{ secrets.OPERATOR_TEST_PASSWORD }}
          DRIVER_TEST_PASSWORD: ${{ secrets.DRIVER_TEST_PASSWORD }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: audit-results
          path: docs/audit/outputs/
```

### Local Development Hook

```bash
# Add to .git/hooks/pre-push:
#!/bin/bash
echo "Running audit pipeline..."
node scripts/audit/audit-scan.mjs
if [ $? -ne 0 ]; then
    echo "❌ Code quality issues found. Fix before pushing."
    exit 1
fi
echo "✅ Code quality checks passed"
```

## Maintenance Tasks

### Weekly

```bash
# Run full pipeline and review results
node scripts/audit/audit-all.mjs
open docs/audit/REPORT.md

# Clean up old outputs (keep last 4 weeks)
find docs/audit/outputs -type d -name "20*" -mtime +28 -exec rm -rf {} \;
```

### Monthly  

```bash
# Deep security audit
node scripts/audit/audit-rls.mjs

# Update route inventory
node scripts/audit-routes.mjs

# Check for unused audit archives
ls docs/_archive/
```

### Before Major Release

```bash
# Complete pipeline with manual review
node scripts/audit/audit-all.mjs

# Performance baseline (if applicable)
npm run build -- --analyze

# Security penetration test mindset:
# - Try accessing other users' data
# - Test with expired/invalid tokens
# - Verify all admin routes blocked for operators
```

## Getting Help

### Common Questions

**Q: Pipeline takes too long**  
A: Run layers individually and skip non-critical ones during development

**Q: Too many false positives in code scan**  
A: Configure ignore patterns in individual tool configs (`.eslintignore`, etc.)

**Q: Security tests fail locally but pass in production**  
A: Check if you're using production database URL locally (don't!)

**Q: Screenshots show wrong layout**  
A: Verify viewport settings in Playwright config match design breakpoints

### Escalation Path

1. **Code Quality Issues:** Development team lead
2. **Security Issues:** Security team immediately  
3. **Infrastructure Issues:** DevOps team
4. **Process Issues:** Update this runbook and notify team

## File Locations Reference

```
docs/audit/
├── RULES.md                    # This rules document
├── RUNBOOK.md                  # This runbook  
├── REPORT.md                   # Latest audit results
├── outputs/YYYY-MM-DD/         # Dated results
│   ├── archive-moves.*         # Archive operations
│   ├── scan/                   # Code quality details
│   ├── security/               # RLS test details  
│   ├── ui-issues-*.json        # UI test issues
│   ├── route-*.png             # Screenshots
│   └── pipeline.*              # Execution logs
├── routes/                     # Route inventory
├── shared/                     # Component sharing analysis
└── _templates/                 # Report templates

docs/_archive/YYYY-MM-DD/       # Archived legacy files

scripts/audit/
├── audit-archive.mjs           # Layer 0: Archive
├── audit-scan.mjs              # Layer 1: Code scan
├── audit-rls.mjs               # Layer 3: Security
├── audit-report.mjs            # Report generator
└── audit-all.mjs               # Main pipeline runner

tests/smoke/
└── shell-audit.spec.ts         # Layer 2: UI tests
```

**Need more help?** Check the detailed logs in `docs/audit/outputs/latest/` or ask the team.

**Last Updated:** ${new Date().toISOString().split('T')[0]}
