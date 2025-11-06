# 🛠️ Scripts Directory

**Code Quality & Verification Scripts**

---

## 🎯 **QUICK START** - Complete Verification

```bash
# Standard verification (fast)
bash scripts/verify-complete.sh

# Clean verification (removes all cache/deps, slow but 100% reliable)
bash scripts/verify-clean.sh

# Audit all modules
bash scripts/audit/audit-all.sh
```

---

## 🔍 **AUDIT SCRIPT** ⭐ **MAIN TOOL**

### **audit-one-pro.sh** - Per-Module Quality Audit

```bash
./scripts/audit/audit-one-pro.sh apps/admin/features/MODULE-NAME
```

**📖 Documentation:**
- **[QUICK START](audit/QUICK-START.md)** - 3 pași simpli
- **[README](audit/README.md)** - Documentație completă
- **[Examples](audit/examples/)** - Exemple reale

**Ce verifică:**
- ✅ any types
- ✅ culori hardcodate
- ✅ px hardcodate
- ✅ inline styles
- ✅ !important
- ✅ fișiere > 200 linii
- ✅ raw <table> tags
- ✅ importuri UI greșite
- ✅ iconițe non-lucide
- ✅ breakpoints custom
- ✅ fetch în UI
- ✅ inline map functions

**Exemple:**
```bash
# Auth
./scripts/audit/audit-one-pro.sh apps/admin/features/auth-login

# Dashboard
./scripts/audit/audit-one-pro.sh apps/admin/features/dashboard

# Users
./scripts/audit/audit-one-pro.sh apps/admin/features/users-table

# Bookings
./scripts/audit/audit-one-pro.sh apps/admin/features/bookings-table

# Prices
./scripts/audit/audit-one-pro.sh apps/admin/features/prices-management
```

**Output:**
```
audit-reports/apps-admin-features-MODULE/
├── summary.txt              ← CITEȘTE ASTA PRIMUL!
├── any.txt
├── colors.txt
├── px.txt
├── inline-styles.txt
├── important.txt
├── file-size.txt
├── raw-tables.txt
├── illegal-ui-imports.txt
├── illegal-icons.txt
├── custom-breakpoints.txt
├── fetch-in-ui.txt
└── inline-map.txt
```

---

## 🛡️ **UTILITY SCRIPTS**

### **guard-app-logic.sh** - App Logic Guard
```bash
./scripts/guard-app-logic.sh
# SAU
npm run guard:app-logic
```

**Ce face:**
- Verifică că `app/` folder NU conține business logic
- Architecture enforcement

### **clean-restart.sh** - Clean Restart
```bash
./scripts/clean-restart.sh
```

**Ce face:**
- Șterge node_modules, .next, cache
- Fresh install & restart

### **verify-pr1.sh** - Legacy PR Verification
```bash
./scripts/verify-pr1.sh
```

**Status:** Legacy (folosește audit-one-pro.sh)

---

## 🚀 **QUICK START:**

### **1. Audit modul (30 sec):**
```bash
./scripts/audit/audit-one-pro.sh apps/admin/features/MODULE
```

### **2. Vezi rezultat:**
```bash
cat audit-reports/apps-admin-features-MODULE/summary.txt
```

### **3. Fix probleme & re-run**

---

## ⚡ **NPM SCRIPTS:**

```bash
# TypeScript & Linting
npm run check:ts          # TypeScript compilation
npm run lint              # ESLint

# Architecture
npm run guard:app-logic   # No logic in app/

# Testing
npm test                  # Unit tests
npm run test:e2e          # E2E tests

# Build
npm run build             # Production build
```

---

## 📊 **WORKFLOW RECOMANDAT:**

```bash
# 1. Înainte de commit:
./scripts/audit/audit-one-pro.sh apps/admin/features/MODULE
cat audit-reports/.../summary.txt
# → Toate la 0? ✅ COMMIT!

# 2. Periodic checks:
npm run check:ts
npm run lint
npm run guard:app-logic

# 3. Înainte de PR:
./scripts/audit/audit-one-pro.sh apps/admin/features/MODULE
npm run build
npm test
```

---

## 🎯 **BEST PRACTICES:**

1. **Rulează audit-one-pro.sh ÎNAINTE de commit**
2. **ZERO toleranță pentru violations (toate la 0)**
3. **Nu commit dacă audit fails**
4. **Păstrează audit reports pentru proof**
5. **Run periodic pe toate modulele**

---

## 📚 **DOCUMENTATION:**

### **Audit Tool:**
- [audit/QUICK-START.md](audit/QUICK-START.md) - Start rapid
- [audit/README.md](audit/README.md) - Documentație completă
- [audit/examples/](audit/examples/) - Exemple

### **Project:**
- `/RULES.md` - Reguli de cod (1020 linii)
- `/WORKFLOW.md` - Workflow-ul proiectului (570 linii)
- `VER-2.4-CHECKLIST.md` - Checklist versiune

---

## 🔒 **VERIFICATION SCRIPTS**

### **verify-complete.sh** - Complete Project Verification

Rulează TOATE verificările:
1. TypeScript compilation (0 errors)
2. ESLint validation (0 warnings)
3. Unit tests (all passing)
4. Dead code detection (ts-prune)
5. Circular dependencies (madge)
6. Unused dependencies (depcheck)
7. Module audits (audit-all.sh)
8. **Audit completeness (1:1 match features vs reports)** ⭐ NEW!

```bash
bash scripts/verify-complete.sh
```

**Exit codes:**
- `0` - All checks passed
- `1` - Some checks failed (see output)

**Reports generated:**
- `complete-audit-TIMESTAMP/` - Full reports directory

### **verify-clean.sh** - Clean Environment Verification

Rulează în director COMPLET CURAT:
1. `git clean -fdx` - Șterge tot (node_modules, .next, cache)
2. `pnpm install` - Instalează fresh
3. `pnpm check:ts && pnpm lint` - Verifică
4. `pnpm build` - Build complet
5. `pnpm test:run` - Toate testele
6. `bash scripts/verify-complete.sh` - Verificare completă

```bash
bash scripts/verify-clean.sh
```

**⚠️ WARNING:** Șterge TOATE fișierele netracked! Confirmă înainte!

**Use case:**
- Verifică că nu ai dependențe locale ascunse
- Elimină cache issues
- Pregătește pentru CI/CD
- Verificare finală înainte de release

---

## 💡 **PRO TIPS:**

### **Alias în .zshrc:**
```bash
alias audit='./scripts/audit/audit-one-pro.sh'
alias audit-results='cat audit-reports/*/summary.txt'
alias verify='bash scripts/verify-complete.sh'
alias verify-clean='bash scripts/verify-clean.sh'
```

### **Usage:**
```bash
audit apps/admin/features/dashboard
audit-results
```

---

**Last updated:** 2025-11-05  
**Version:** 2.0.0 - Audit One Pro
