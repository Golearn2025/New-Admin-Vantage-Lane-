# Audit Quick Start Guide

## 3-Command Setup

```bash
# 1. Set environment variables
export ADMIN_TEST_PASSWORD="your_admin_password"
export OPERATOR_TEST_PASSWORD="your_operator_password"  
export DRIVER_TEST_PASSWORD="your_driver_password"

# 2. Run complete audit pipeline
node scripts/audit/audit-all.mjs

# 3. View results
open docs/audit/REPORT.md
```

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

## File Locations Reference

```
docs/audit/
├── RULES.md                    # Rules document
├── RUNBOOK.md                  # This runbook  
├── RUNBOOK-QUICK.md            # Quick start guide
├── RUNBOOK-TROUBLESHOOTING.md  # Troubleshooting guide
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
├── audit-rls-helpers.mjs       # RLS test helpers
├── audit-report.mjs            # Report generator
└── audit-all.mjs               # Main pipeline runner

tests/smoke/
├── shell-audit.spec.ts         # Layer 2: UI tests
└── shell-audit-helpers.ts      # UI test helpers
```

**Need detailed help?** See `RUNBOOK.md` for complete procedures.  
**Having issues?** See `RUNBOOK-TROUBLESHOOTING.md` for solutions.

**Last Updated:** ${new Date().toISOString().split('T')[0]}
