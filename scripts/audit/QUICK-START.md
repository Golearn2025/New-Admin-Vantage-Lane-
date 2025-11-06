# ⚡ QUICK START - 3 SCRIPTURI

## **🎯 AUDIT-ONE-PRO (Quality 15 checks) - Înainte de commit**
## **⚡ AUDIT-PERFORMANCE (Performance 8 checks) - Când optimizezi**
## **🚀 AUDIT-ALL (Orchestrator) - Toate modulele (35 features)**

---

## **1️⃣ Dă permisiuni (DOAR prima dată)**

```bash
chmod +x scripts/audit/audit-one-pro.sh
chmod +x scripts/audit/audit-performance.sh
chmod +x scripts/audit/audit-all.sh
```

---

## **2️⃣ Rulează pe un modul**

### **QUALITY CHECK (înainte de commit):**
```bash
./scripts/audit/audit-one-pro.sh apps/admin/features/NUMELE-MODULULUI
```

### **PERFORMANCE CHECK (când optimizezi):**
```bash
./scripts/audit/audit-performance.sh apps/admin/features/NUMELE-MODULULUI
```

**Exemple:**
```bash
# Quality - Auth
./scripts/audit/audit-one-pro.sh apps/admin/features/auth-login

# Quality - Prices
./scripts/audit/audit-one-pro.sh apps/admin/features/prices-management

# Performance - Dashboard
./scripts/audit/audit-performance.sh apps/admin/features/dashboard

# Performance - Users
./scripts/audit/audit-performance.sh apps/admin/features/users-table
```

### **PE TOATE MODULELE (35 features):**
```bash
# Quality pe toate (DEFAULT)
./scripts/audit/audit-all.sh

# Performance pe toate
./scripts/audit/audit-all.sh --performance-only

# Full audit (quality + performance)
./scripts/audit/audit-all.sh --full
```

---

## **3️⃣ Vezi rezultatul**

**QUALITY:**
```bash
cat audit-reports/apps-admin-features-MODUL/summary.txt
```

**PERFORMANCE:**
```bash
cat audit-reports/apps-admin-features-MODUL/performance/summary.txt
```

**ALL MODULES (audit-all.sh):**
```bash
# Quality summary pentru toate
cat audit-reports/all-modules-quality/summary.txt

# Performance summary pentru toate
cat audit-reports/all-modules-performance/summary.txt
```

### **Exemplu output QUALITY:**
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
inline-svg: 0                    ⚡ NOU!
enterprise-datatable: 2          ⚡ NOU!
local-components: 0              ⚡ NOU!
```

### **Exemplu output PERFORMANCE:**
```
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
```

---

## ✅ **Ce înseamnă numerele:**

| Valoare | Înțeles |
|---------|---------|
| `0` | ✅ PERFECT - nu ai probleme |
| `1-5` | ⚠️ MINOR - câteva probleme mici |
| `6-20` | 🔴 MODERAT - trebuie fixes |
| `20+` | 💀 CRITIC - refactor necesar |

---

## 🎯 **CE FAC DUPĂ:**

### **QUALITY - Dacă toate sunt 0:**
```
✅ Modul CLEAN!
✅ Poți face commit fără probleme
🚀 MANDATORY pentru commit!
```

### **QUALITY - Dacă am probleme:**
```
1. Citesc fișierul specific:
   cat audit-reports/.../colors.txt
   cat audit-reports/.../inline-styles.txt
   
2. Fix problemele (MANDATORY)

3. Rulează din nou scriptul

4. Repeat până totul e 0

5. NU COMMIT dacă nu e totul 0!
```

### **PERFORMANCE - Interpretare:**
```
🎉 0-10 issues   = EXCELLENT
✅ 11-30 issues  = GOOD  
⚠️  31-50 issues  = NEEDS OPTIMIZATION
🔴 50+ issues   = CRITICAL

→ Nu e MANDATORY, dar ajută mult!
→ Prioritizează useCallback, useMemo, console.log
```

---

## 📝 **SALVARE REZULTATE:**

```bash
# Pentru Cascade sau echipă
cat audit-reports/apps-admin-features-MODUL/summary.txt > my-audit-proof.txt
```

---

**GATA! Asta e tot ce trebuie să știi.** 🚀
