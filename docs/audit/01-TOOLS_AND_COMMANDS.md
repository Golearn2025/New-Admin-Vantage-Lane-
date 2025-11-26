# AUDIT TOOLS & COMMANDS

**Date:** 2025-11-26  
**Purpose:** Complete toolkit for evidence-based auditing  

## 🔧 TypeScript & Code Quality

### Unused Code Detection
```bash
# Find unused exports (dead code)
npx ts-prune

# Expected: Clean output or only acceptable unused exports
# Attach output to: findings/2025-11.md
```

### Dependency Analysis
```bash
# Check for unused dependencies
npx depcheck

# Expected: No unused dependencies in package.json
# Fix: Remove unused deps or add to .depcheckrc.json if needed
```

### Circular Dependencies
```bash
# Detect circular imports (architecture violations)
npx madge --circular --extensions ts,tsx src/

# Expected: No circular dependencies
# Fix: Refactor imports to break circles
```

### TypeScript Strict Checking
```bash
# Verify strict mode compliance
npx tsc --noEmit --strict

# Expected: 0 errors
# Fix: Add proper types, remove 'any'
```

---

## 🔍 Security Scanning

### Secrets Detection
```bash
# Scan for hardcoded secrets/API keys
npx gitleaks detect --source . --verbose

# Expected: Clean scan (no leaks detected)
# Fix: Move secrets to .env, add to .gitignore
```

### RLS & Auth Testing
```bash
# Test cross-org data isolation (manual)
# 1. Login as operator A
# 2. Try to access operator B's data via API
# 3. Should return 403/empty results

# Examples:
curl -H "Authorization: Bearer <operator_a_token>" \
     http://localhost:3000/api/bookings

# Expected: Only operator A's bookings returned
# Evidence: Screenshots + curl outputs
```

### Environment Variable Audit
```bash
# Check for missing env vars
grep -r "process.env" --include="*.ts" --include="*.tsx" .

# Cross-reference with .env.example
# Expected: All used env vars documented in .env.example
```

---

## ⚡ Performance Analysis

### Bundle Size Analysis
```bash
# Build and analyze bundle
pnpm build
npx @next/bundle-analyzer

# Expected: Main bundle <500KB, lazy loading for routes
# Evidence: Screenshots of bundle analyzer + size report
```

### React Performance Profiling
```bash
# Start dev server with profiling
NODE_ENV=development pnpm dev

# Manual steps:
# 1. Open React DevTools Profiler
# 2. Record interaction (e.g., table sorting, filtering)  
# 3. Look for unnecessary re-renders
# Expected: <50ms render times, minimal re-renders
# Evidence: Profiler flame graphs screenshots
```

### Database Query Analysis
```bash
# Monitor slow queries (if logging enabled)
grep "slow query" logs/application.log

# Or check Supabase dashboard for query performance
# Expected: <100ms for most queries, <500ms for complex ones
# Evidence: Query performance screenshots
```

---

## 🎨 UI/UX Validation  

### Design Token Compliance
```bash
# Find hardcoded colors (should return nothing)
grep -r "#[0-9a-fA-F]\{3,6\}" --include="*.css" --include="*.tsx" src/
grep -r "rgb(" --include="*.css" --include="*.tsx" src/
grep -r "rgba(" --include="*.css" --include="*.tsx" src/

# Find hardcoded spacing (px values - some OK for borders)
grep -r "[0-9]\+px" --include="*.css" src/

# Expected: Zero results (or only acceptable exceptions)
# Fix: Replace with design tokens
```

### Component Reusability Check
```bash
# Find duplicated component patterns
grep -r "className.*grid" --include="*.tsx" src/ | wc -l
grep -r "StatCard" --include="*.tsx" src/ | wc -l

# Expected: High reuse of UI-Core components
# Evidence: Count of component usage
```

---

## 📱 Responsive Testing

### Screenshot Generation (Manual)
```bash
# Use browser DevTools or tools like:
# - Playwright for automated screenshots
# - Manual testing on real devices

# Required breakpoints:
# 320px (iPhone SE)
# 375px (iPhone 12/13/14) 
# 768px (iPad)
# 1024px+ (Desktop)

# Expected: All features functional at all breakpoints
# Evidence: Before/after screenshots for each page
```

### Accessibility Audit
```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run accessibility scan
axe http://localhost:3000/dashboard --save audit-results.json

# Expected: 0 violations (or documented exceptions)
# Evidence: axe-core report JSON + screenshots
```

---

## 🔄 Realtime & Subscription Testing

### Memory Leak Detection
```bash
# Use Chrome DevTools Memory tab
# 1. Take heap snapshot before component mount
# 2. Interact with realtime features
# 3. Unmount component  
# 4. Take heap snapshot after
# 5. Compare memory usage

# Expected: Memory returns to baseline after unmount
# Evidence: Memory usage graphs + screenshots
```

### Subscription Cleanup Verification
```bash
# Check for active subscriptions (manual)
# 1. Open browser DevTools Network tab
# 2. Load page with realtime features
# 3. Navigate away  
# 4. Check for lingering WebSocket connections

# Expected: All connections closed on navigation
# Evidence: Network tab screenshots
```

---

## 📊 Evidence Collection Template

For each audit finding, collect:

### Screenshots
```bash
# Naming convention:
evidence/
  2025-11-26/
    admin-bookings-320px-before.png
    admin-bookings-320px-after.png  
    admin-bookings-768px-before.png
    admin-bookings-768px-after.png
```

### Tool Outputs
```bash
# Save all tool outputs:
evidence/
  2025-11-26/
    ts-prune-output.txt
    depcheck-output.txt  
    madge-circular.txt
    gitleaks-scan.txt
    axe-results.json
    bundle-analysis.txt
```

### Performance Data
```bash
# React DevTools exports:
evidence/  
  2025-11-26/
    profiler-booking-table-sort.json
    profiler-admin-dashboard-load.json
```

---

## 🎯 Command Checklist

Run these for **EVERY** page audit:

- [ ] `npx ts-prune` (unused code)
- [ ] `npx depcheck` (unused deps)  
- [ ] `npx madge --circular` (architecture)
- [ ] `npx tsc --noEmit --strict` (types)
- [ ] `npx gitleaks detect` (security)
- [ ] Design tokens grep (hardcoded values)
- [ ] Manual responsive testing (320/375/768px)
- [ ] `axe` accessibility scan
- [ ] React DevTools performance profiling
- [ ] Bundle size check (if page-specific lazy loading)

**Output Location:** All evidence goes in `evidence/2025-11-26/` with clear naming  
**Finding Reference:** Link specific evidence files in `findings/2025-11.md`
