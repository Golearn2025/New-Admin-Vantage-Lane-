# 🔍 AUDIT SCRIPTS

Trei scripturi pentru calitate, performanță și orchestrare.

---

## 📊 What Does It Check?

### `audit-one-pro.sh` (16 verificări comprehensive)

**Scop:** Validare cod înainte de commit (MANDATORY)

**Ce verifică:**

```
1.  any types (: any | <any>)
2.  culori hardcodate (#fff, rgb(), rgba())
3.  px hardcodate (exceptând breakpoints: 320, 375, 768, 1024, 1280)
4.  inline styles (style={{)
5.  !important în CSS
6.  fișiere > 200 linii
7.  raw <table> tags (trebuie EnterpriseDataTable)
8.  importuri UI greșite (nu din @vantage-lane/ui-core)
9.  iconițe non-lucide (react-icons, @heroicons)
10. breakpoints custom (altele decât 320, 375, 768, 1024, 1280)
11. fetch în UI (trebuie în hooks)
12. inline map functions (.map(()
13. **CSS Without Tokens** - CSS files that don't use any var(--) tokens
14. **Non-Standard Tokens** - Tokens not matching allowed prefixes (validated from `allowed-tokens.txt`)
15. **Large Functions** - Files > 200 lines (heuristic for function size)
16. **useEffect in UI** - useEffect in component files (logic should be in hooks)) ⚡ NOU!
```

---

## ⚡ **AUDIT-PERFORMANCE.SH** - Performance (8 verificări)

**Scop:** Optimizare performanță (OPTIONAL)

**Ce verifică:**

```
1. missing useCallback (functions fără optimization)
2. missing useMemo (calcule fără memoization)
3. missing React.memo (componente fără optimization)
4. heavy imports (lodash, moment full)
5. console.log în production
6. <img> instead of <Image> (Next.js)
7. missing key în .map()
8. unused imports (imports nefolosite)
```

---

## 🚀 **AUDIT-ALL.SH** - Orchestrator (TOATE modulele)

**Scop:** Audit complet pe toate modulele (35 features)

**Moduri de rulare:**

```bash
# Default: doar quality pe toate modulele
./scripts/audit/audit-all.sh

# Doar quality
./scripts/audit/audit-all.sh --quality-only

# Doar performance
./scripts/audit/audit-all.sh --performance-only

# Ambele: quality + performance
./scripts/audit/audit-all.sh --full
```

**Output:**
- Summary colorat pentru fiecare modul
- Raport agregat în `audit-reports/all-modules-quality/summary.txt`
- Raport agregat în `audit-reports/all-modules-performance/summary.txt`

---

## 🚀 **CUM SE FOLOSEȘTE:**

### **Pas 1: Dă permisiuni (doar prima dată)**

```bash
chmod +x scripts/audit/audit-one-pro.sh
chmod +x scripts/audit/audit-performance.sh
chmod +x scripts/audit/audit-all.sh
```

### **Pas 2: Rulează pe un modul SAU toate modulele**

#### **Pe un singur modul:**

**QUALITY CHECK (înainte de commit):**
```bash
# Auth
./scripts/audit/audit-one-pro.sh apps/admin/features/auth-login

# Prices
./scripts/audit/audit-one-pro.sh apps/admin/features/prices-management

# Users Table
./scripts/audit/audit-one-pro.sh apps/admin/features/users-table
```

**PERFORMANCE CHECK (când optimizezi):**
```bash
# Auth
./scripts/audit/audit-performance.sh apps/admin/features/auth-login

# Prices
./scripts/audit/audit-performance.sh apps/admin/features/prices-management

# Dashboard
./scripts/audit/audit-performance.sh apps/admin/features/dashboard
```

#### **Pe TOATE modulele (35 features):**

```bash
# Quality check pe toate (DEFAULT)
./scripts/audit/audit-all.sh

# Performance check pe toate
./scripts/audit/audit-all.sh --performance-only

# Full audit: quality + performance pe toate
./scripts/audit/audit-all.sh --full
```

**⚠️ Atenție:** Full audit cu `--full` durează ~5-10 minute!

### **Pas 3: Vezi rezultatele**

După run, rezultatele sunt în:

**QUALITY REPORTS:**
```
audit-reports/
└── apps-admin-features-MODULE/
    ├── summary.txt           ← CITEȘTE ASTA PRIMUL!
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

**PERFORMANCE REPORTS:**
```
audit-reports/
└── apps-admin-features-MODULE/
    └── performance/
        ├── summary.txt                ← CITEȘTE ASTA!
        ├── missing-useCallback.txt
        ├── missing-useMemo.txt
        ├── missing-react-memo.txt
        ├── heavy-imports.txt
        ├── console-log.txt
        ├── img-tag.txt
        ├── missing-keys.txt
        └── unused-imports.txt
```

**ALL MODULES REPORTS (audit-all.sh):**
```
audit-reports/
├── all-modules-quality/
│   └── summary.txt             ← SUMMARY pentru toate modulele
│                                 (ex: users-table: 12 issues ⚠️)
└── all-modules-performance/
    └── summary.txt             ← SUMMARY performance pt toate
                                  (ex: dashboard: 37 issues ⚠️)
```

---

## 📊 **EXEMPLE OUTPUT:**

### **QUALITY AUDIT:**
```
==========================================
🔍 AUDIT: apps/admin/features/prices-management
📁 Output: audit-reports/apps-admin-features-prices-management
==========================================

[1/12] Checking any types...
any: 0
[2/12] Checking hardcoded colors...
colors: 2
[3/12] Checking hardcoded px...
px: 15
[4/12] Checking inline styles...
inline-styles: 46
[5/12] Checking !important...
important: 0
[6/12] Checking file sizes...
files>200: 7
[7/12] Checking raw <table>...
raw-tables: 13
[8/12] Checking UI imports...
illegal-ui-imports: 0
[9/12] Checking icons...
illegal-icons: 0
[10/12] Checking breakpoints...
custom-breakpoints: 0
[11/12] Checking fetch in UI...
fetch-in-ui: 0
[12/12] Checking inline map...
inline-map: 5

========================================
✅ AUDIT COMPLET!
========================================

any: 0
colors: 2
px: 15
inline-styles: 46
important: 0
files>200: 7
raw-tables: 13
illegal-ui-imports: 0
illegal-icons: 0
custom-breakpoints: 0
fetch-in-ui: 0
inline-map: 5

📁 Rapoarte detaliate: audit-reports/apps-admin-features-prices-management
📄 Summary: audit-reports/apps-admin-features-prices-management/summary.txt
```

### **PERFORMANCE AUDIT:**
```
==========================================
⚡ PERFORMANCE AUDIT: apps/admin/features/dashboard
📁 Output: audit-reports/apps-admin-features-dashboard/performance
==========================================

[1/8] Checking useCallback usage...
missing-useCallback: 12
[2/8] Checking useMemo usage...
missing-useMemo: 8
[3/8] Checking React.memo usage...
missing-react-memo: 5
[4/8] Checking heavy imports...
heavy-imports: 2
[5/8] Checking console.log...
console-log: 3
[6/8] Checking <img> usage...
img-tag: 0
[7/8] Checking missing keys in .map()...
missing-keys: 1
[8/8] Checking unused imports...
unused-imports: 6

==========================================
✅ PERFORMANCE AUDIT COMPLET!
==========================================

missing-useCallback: 12
missing-useMemo: 8
missing-react-memo: 5
heavy-imports: 2
console-log: 3
img-tag: 0
missing-keys: 1
unused-imports: 6

📊 PERFORMANCE SCORE:
   ⚠️  NEEDS OPTIMIZATION (37 issues)

📁 Rapoarte detaliate: audit-reports/apps-admin-features-dashboard/performance
📄 Summary: audit-reports/apps-admin-features-dashboard/performance/summary.txt
```

---

## 🎯 **CE FAC CU REZULTATELE:**

### **1. Citesc summary.txt**
```bash
cat audit-reports/apps-admin-features-prices-management/summary.txt
```

Asta îmi spune câte probleme am pe fiecare categorie.

### **2. Dacă vreau detalii, citesc fișierul specific**
```bash
# Vezi exact care fișiere au > 200 linii
cat audit-reports/apps-admin-features-prices-management/file-size.txt

# Vezi unde sunt culori hardcodate
cat audit-reports/apps-admin-features-prices-management/colors.txt

# Vezi inline styles
cat audit-reports/apps-admin-features-prices-management/inline-styles.txt
```

### **3. Salvez summary pentru Cascade**
```bash
# Copiază summary.txt și trimite-l în chat
```

---

## ✅ **CÂND RULEAZĂ BINE:**

```
any: 0
colors: 0
px: 0
inline-styles: 0
important: 0
files>200: 0
raw-tables: 0
illegal-ui-imports: 0
illegal-icons: 0
custom-breakpoints: 0
fetch-in-ui: 0
inline-map: 0
```

**TOATE LA 0 = MODUL CLEAN!** ✅

---

## 📈 **WORKFLOW RECOMANDAT:**

### **1. Înainte de commit (MANDATORY)**
```bash
# Run quality check
./scripts/audit/audit-one-pro.sh apps/admin/features/MODULE

# Check results
cat audit-reports/apps-admin-features-MODULE/summary.txt

# → Toate la 0? ✅ COMMIT!
# → Probleme? 🔴 FIX Întâi!
```

### **2. Când optimizezi performance (OPTIONAL)**
```bash
# Run performance check
./scripts/audit/audit-performance.sh apps/admin/features/MODULE

# Check results
cat audit-reports/apps-admin-features-MODULE/performance/summary.txt

# Identify bottlenecks & optimize
```

### **3. Înainte de release (FULL AUDIT)**
```bash
# Run both checks
./scripts/audit/audit-one-pro.sh apps/admin/features/MODULE
./scripts/audit/audit-performance.sh apps/admin/features/MODULE

# Review both reports
# Quality MUST be 0
# Performance SHOULD be < 10 issues
```

### **4. Workflow examples**

**Daily development:**
```bash
# Code changes...
./scripts/audit/audit-one-pro.sh apps/admin/features/dashboard
# Fix issues...
git commit
```

**Performance sprint:**
```bash
# Identify slow module
./scripts/audit/audit-performance.sh apps/admin/features/dashboard

# Fix top issues:
# - Add useCallback to event handlers
# - Add useMemo to expensive computations
# - Remove console.log statements
# - Replace lodash with lodash-es

# Re-check
./scripts/audit/audit-performance.sh apps/admin/features/dashboard
```

---

## ⚠️ **DACĂ CEVA E GREȘIT:**

Număr > 0 înseamnă probleme. Exemplu:

```
inline-styles: 46
```

→ Ai 46 de linii cu `style={{` în cod
→ Trebuie să le elimini și să folosești CSS classes

```
files>200: 7
```

→ Ai 7 fișiere cu > 200 linii
→ Trebuie să le împarți în fișiere mai mici

---

## 🔧 **DEPENDINȚE:**

Script merge cu:
- **ripgrep** (recomandat) SAU **grep** (fallback automat)
- **find**, **wc** (sunt deja instalate pe Mac/Linux)

Instalare ripgrep (opțional, dar mai rapid):
```bash
brew install ripgrep
```

---

## 📝 **NOTIȚE:**

- Scriptul nu modifică NIMIC, doar citește și raportează
- Poți rula de câte ori vrei, e safe
- Output-ul se suprascrie la fiecare run
- Dacă vrei să păstrezi rapoarte vechi, redenumește folderul `audit-reports/`

---

**Gata! Folosește-l pentru orice modul înainte să faci commit.** 🚀
