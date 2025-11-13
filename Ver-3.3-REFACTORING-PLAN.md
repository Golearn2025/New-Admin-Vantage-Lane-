# 📋 Ver 3.3 - REFACTORING STRUCTURE SCALABIL FEATURES

> **Branch:** `Ver-3.3-Refactoring-Structure-Scalabil-Features`  
> **Obiectiv:** Reorganizare `apps/admin/features/` în `admin/operator/driver/shared/`  
> **Durata estimată:** 1-2 zile (5-8 ore cu script automated)  
> **Status:** 🟡 IN PROGRESS

---

## 🎯 OBIECTIV

Reorganizare structură features pentru claritate și scalabilitate:

```
ÎNAINTE (44 folders MIXED):
apps/admin/features/
├── admins-table
├── bookings-table
├── driver-dashboard
├── operator-dashboard
└── ... (toate mixed)

DUPĂ (organizat pe roluri):
apps/admin/features/
├── admin/          (26 features - admin only)
├── operator/       (2 features - operator only)
├── driver/         (5 features - driver only)
└── shared/         (11 features - folosite de toți)
```

---

## 🔴 REGULA DE AUR - ZERO MODIFICĂRI LOGICĂ

### ⚠️ EXTREM DE IMPORTANT:

```
❌ NU SE MODIFICĂ BUSINESS LOGIC!

Singurele modificări permise:
✅ Mutare foldere în admin/operator/driver/shared
✅ Schimbare import paths (@features/... → @features/admin/...)
✅ Update tsconfig.json aliases

❌ INTERZIS:
❌ Schimbat props componente
❌ Schimbat nume componente/hooks
❌ Schimbat logică internă
❌ Schimbat API calls
❌ Schimbat exports
❌ Refactoring de cod "cât sunt aici"
```

### SCOPUL:
Doar reorganizare structură pentru claritate.
ZERO risk de bug în business logic.

### VERIFICARE:
Dacă vezi în git diff altceva decât:
- folder paths
- import strings
→ STOP și reverify!

---

## 📊 PROGRESS TRACKER

### ✅ FAZA 0: PRE-FLIGHT CHECK
- [ ] `pnpm check:ts` - 0 errors
- [ ] `pnpm lint` - 0 errors, 0 warnings
- [ ] `pnpm test:run` - All passing
- [ ] `pnpm build` - SUCCESS
- [ ] Git status clean
- [ ] Branch creat: `Ver-3.3-Refactoring-Structure-Scalabil-Features`

### ⏳ FAZA 1: SETUP STRUCTURE
- [ ] Adăugat alias-uri noi în `tsconfig.json`
- [ ] Adăugat alias-uri noi în `tsconfig.app.json`
- [ ] Creat foldere: `admin/`, `operator/`, `driver/`, `shared/`
- [ ] Verificat `pnpm check:ts` - OK
- [ ] Commit: `chore(structure): add new folder structure and tsconfig aliases`

### ⏳ FAZA 2: MIGRARE ADMIN FEATURES (26 total)
- [ ] admins-table
- [ ] booking-create
- [ ] customers-table
- [ ] deleted-users-table
- [ ] disputes-table
- [ ] driver-assignment
- [ ] driver-verification
- [ ] drivers-pending
- [ ] drivers-table
- [ ] invoices-table
- [ ] notifications-management
- [ ] operators-table
- [ ] payments-overview
- [ ] payments-table
- [ ] payouts-table
- [ ] prices-management
- [ ] refunds-table
- [ ] settings-commissions
- [ ] settings-permissions
- [ ] settings-vehicle-categories
- [ ] user-create-modal
- [ ] user-edit-modal
- [ ] user-profile
- [ ] user-view-modal
- [ ] users-table
- [ ] users-table-base

**Checkpoint după admin:**
- [ ] `pnpm check:ts` - OK
- [ ] `pnpm lint` - OK
- [ ] Commit: `refactor(structure): migrate all admin features to features/admin`

### ⏳ FAZA 3: MIGRARE OPERATOR FEATURES (2 total)
- [ ] operator-dashboard
- [ ] operator-drivers-list

**Checkpoint după operator:**
- [ ] `pnpm check:ts` - OK
- [ ] `pnpm lint` - OK
- [ ] Commit: `refactor(structure): migrate operator features to features/operator`

### ⏳ FAZA 4: MIGRARE DRIVER FEATURES (5 total)
- [ ] driver-bookings (GOL dar mutat)
- [ ] driver-dashboard (GOL dar mutat)
- [ ] driver-documents-upload
- [ ] driver-earnings (GOL dar mutat)
- [ ] driver-settings (GOL dar mutat)

**⚠️ NOTE:** `driver-profile` e mutat în SHARED (vezi FAZA 5)

**Checkpoint după driver:**
- [ ] `pnpm check:ts` - OK
- [ ] `pnpm lint` - OK
- [ ] Commit: `refactor(structure): migrate driver features to features/driver`

### ⏳ FAZA 5: MIGRARE SHARED FEATURES (11 total)
- [ ] auth-forgot-password
- [ ] auth-login
- [ ] bookings-table (admin + operator)
- [ ] dashboard (admin + operator + driver)
- [ ] dashboard-metrics (admin + operator)
- [ ] document-viewer (admin + driver)
- [ ] documents-approval (admin + operator)
- [ ] **driver-profile** ⚠️ (admin + driver - SHARED!)
- [ ] notification-center (toți)
- [ ] settings-profile (toți)

**⚠️ IMPORTANT:**
- `driver-profile` e folosit de ADMIN (view) + DRIVER (edit) → SHARED!
- Toate importurile devin: `@features/shared/driver-profile`

**Checkpoint după shared:**
- [ ] `pnpm check:ts` - OK
- [ ] `pnpm lint` - OK
- [ ] Commit: `refactor(structure): migrate shared features to features/shared`

### ⏳ FAZA 6: CLEANUP & FINAL CHECKS
- [ ] Verificat că `apps/admin/features/` conține DOAR: `admin/`, `operator/`, `driver/`, `shared/`
- [ ] Verificat importuri vechi cu: `rg "@features/" apps app -g"*.ts" -g"*.tsx"`
- [ ] Șters alias vechi din `tsconfig.json`: `"@features/*": ["apps/admin/features/*"]`
- [ ] `pnpm check:ts` - OK
- [ ] `pnpm lint` - OK
- [ ] `pnpm test:run` - All passing
- [ ] `pnpm build` - SUCCESS
- [ ] Clear cache: `rm -rf .next` + rebuild
- [ ] Manual test în browser
- [ ] Created `apps/admin/features/README.md`
- [ ] Commit: `docs(structure): add features organization README and finalize refactoring`

---

## 📋 MAPPING FEATURES PER ROL

### 🔴 ADMIN ONLY (26)
```
Features disponibile DOAR pentru admin users:
- admins-table
- booking-create
- customers-table
- deleted-users-table
- disputes-table
- driver-assignment (admin assignează drivers la operators)
- driver-verification (admin verifică drivers)
- drivers-pending (admin aprobă drivers)
- drivers-table (admin vede TOȚI drivers)
- invoices-table
- notifications-management (admin trimite la toți)
- operators-table
- payments-overview
- payments-table
- payouts-table
- prices-management
- refunds-table
- settings-commissions
- settings-permissions
- settings-vehicle-categories
- user-create-modal
- user-edit-modal
- user-profile
- user-view-modal
- users-table
- users-table-base
```

### 🟡 OPERATOR ONLY (2)
```
Features disponibile DOAR pentru operator users:
- operator-dashboard (dashboard cu pricing-ul lor)
- operator-drivers-list (lista drivers-ilor lor)
```

### 🟢 DRIVER ONLY (5)
```
Features disponibile DOAR pentru driver users:
- driver-bookings (GOL - placeholder)
- driver-dashboard (GOL - placeholder)
- driver-documents-upload (upload documente)
- driver-earnings (GOL - placeholder)
- driver-settings (GOL - placeholder)
```

### 🔵 SHARED (11)
```
Features folosite de MULTIPLE roluri:
- auth-forgot-password (toți)
- auth-login (toți)
- bookings-table (admin + operator - RLS filter)
- dashboard (admin + operator + driver)
- dashboard-metrics (admin + operator)
- document-viewer (admin + driver)
- documents-approval (admin + operator)
- driver-profile (admin view + driver edit - SHARED!)
- notification-center (toți)
- settings-profile (toți)
```

---

## 🔧 ALIAS-URI TSCONFIG

### TEMPORAR (FAZA 1-5):
```json
{
  "compilerOptions": {
    "paths": {
      "@features/*": ["apps/admin/features/*"],  // ← TEMPORAR (backward compatibility)
      
      "@features/admin/*": ["apps/admin/features/admin/*"],
      "@features/operator/*": ["apps/admin/features/operator/*"],
      "@features/driver/*": ["apps/admin/features/driver/*"],
      "@features/shared/*": ["apps/admin/features/shared/*"]
    }
  }
}
```

### FINAL (FAZA 6):
```json
{
  "compilerOptions": {
    "paths": {
      "@features/admin/*": ["apps/admin/features/admin/*"],
      "@features/operator/*": ["apps/admin/features/operator/*"],
      "@features/driver/*": ["apps/admin/features/driver/*"],
      "@features/shared/*": ["apps/admin/features/shared/*"]
    }
  }
}
```

---

## 🛠️ COMENZI UTILE

### Migrare feature manual:
```bash
# 1. Mută folder
mv apps/admin/features/FEATURE_NAME apps/admin/features/ROLE/

# 2. Update imports (macOS)
find apps app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i '' "s|@features/FEATURE_NAME|@features/ROLE/FEATURE_NAME|g" {} +

# 3. Test
pnpm check:ts && pnpm lint

# 4. Commit
git add .
git commit -m "refactor(structure): move FEATURE_NAME to features/ROLE"
```

### Verificare importuri vechi:
```bash
# Simplu - arată toate importurile @features/
rg "@features/" apps app -g"*.ts" -g"*.tsx"

# Trebuie să vezi DOAR:
# @features/admin/...
# @features/operator/...
# @features/driver/...
# @features/shared/...
```

### Verificare finală:
```bash
pnpm check:ts      # 0 errors
pnpm lint          # 0 errors, 0 warnings
pnpm test:run      # All passing
pnpm build         # SUCCESS

# Clear cache
rm -rf .next
pnpm build
```

---

## ⚠️ AJUSTĂRI FĂCUTE vs PLAN INIȚIAL

### 1. **driver-profile** → SHARED (NU driver/)
**MOTIVUL:**
- Folosit de ADMIN (să vadă profilul driverului)
- Folosit de DRIVER (să-și editeze profilul)
- **SHARED** e mai logic semantic

**IMPORTURI:**
```typescript
// Admin
import { DriverProfile } from '@features/shared/driver-profile';

// Driver
import { DriverProfile } from '@features/shared/driver-profile';
```

### 2. **Script sed -i ''** - macOS only
**ATENȚIE:** `sed -i ''` e sintaxă macOS!

**Pentru cross-platform:**
- Rulează scriptul DOAR local (macOS)
- SAU rescrie în Node.js

**Varianta Node.js** (dacă vrei):
```javascript
const fs = require('fs');
const glob = require('glob');

function replaceInFiles(pattern, oldPath, newPath) {
  const files = glob.sync(pattern);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      new RegExp(oldPath, 'g'),
      newPath
    );
    fs.writeFileSync(file, content);
  });
}
```

### 3. **Checkpoint optimization** ⭐ BALANCED (RECOMANDAT)

**STRATEGIE ADOPTATĂ:**

```bash
# ✅ BALANCED approach (optimal speed + safety):

# 1. După fiecare 3-5 features mutate:
pnpm check:ts
pnpm lint

# 2. La final (după TOATE features):
pnpm check:ts
pnpm lint
pnpm test:run
pnpm build
rm -rf .next
pnpm build  # rebuild cu cache curat

# 3. Manual test în browser
```

**Alte opțiuni (nu recomandate):**

**A) SUPER SAFE (prea lent):**
```bash
# Check după FIECARE feature
pnpm check:ts && pnpm lint
# ⚠️ Prea multe checks, încetinește munca
```

**C) YOLO (prea risky):**
```bash
# Check doar la final
# ❌ Risc mare - nu știi unde s-a rupt
```

---

## 📝 NOTES & LESSONS LEARNED

### Ce a mers bine:
- (va fi completat pe parcurs)

### Ce am ajustat:
- (va fi completat pe parcurs)

### Probleme întâlnite:
- (va fi completat pe parcurs)

---

## 🎯 ORDINEA RECOMANDATĂ - CRITICAL FIXES ÎNTÂI!

### ⚠️ IMPORTANT: NU ÎNCEPE REFACTORING-UL ÎNCĂ!

**ORDINEA CORECTĂ:**

### **STEP 1: CRITICAL FIXES ÎNTÂI** 🔴 (2-3 zile)

```bash
# Branch: Ver-3.4-Critical-Backend-Fixes (sau similar)

1. Add transactions în createBooking (3-4 ore)
   - Wrap în Supabase RPC function
   - All or nothing pentru booking + segments + pricing + services
   
2. Add Zod validation în API routes (3-4 ore)
   - app/api/bookings/create/route.ts
   - app/api/bookings/list/route.ts
   - Toate endpoints cu POST/PUT
   
3. Replace console.log cu logger (2-3 ore)
   - Create lib/logger.ts (winston)
   - Replace în toate entities/ (36 fișiere)
   - Replace în app/api/
   
4. Fix service role fallback (30 min)
   - Remove fallback la ANON key
   - Throw error dacă SERVICE_ROLE_KEY lipsește
   
5. Fix password generation (1 oră)
   - Use crypto.randomBytes() instead of Math.random()
   - Move to server-only file

# După fiecare fix:
pnpm check:ts
pnpm lint
pnpm test:run
pnpm build

# Merge în main când TOATE sunt verzi
```

**MOTIVUL:**
- Vrei să refactorizezi structură peste cod CORECT și SIGUR
- Altfel nu mai știi dacă un bug vine din logică sau din mutarea folderelor
- Security fixes trebuie făcute IMEDIAT (service role, passwords)

---

### **STEP 2: REFACTORING STRUCTURE** 🟢 (1-2 zile)

```bash
# Branch: Ver-3.3-Refactoring-Structure-Scalabil-Features (ACEST branch)

# Rulezi planul din acest document:
# FAZA 0 → FAZA 1 → FAZA 2-5 → FAZA 6

# După ce TOTUL e verde:
# Merge în main
```

---

## 🎯 NEXT STEPS DUPĂ AMBELE (CRITICAL + REFACTORING)

După ce terminăm AMBELE (critical fixes + refactoring):

1. **CLEANUP CODE MORT** (1 zi):
   - [ ] Șterge foldere goale (driver-bookings, driver-earnings, etc.)
   - [ ] Consolidate formatters
   - [ ] Fix TypeScript any (59 instances)
   - [ ] Fix hardcoded colors (206 instances)

2. **DOCUMENTATION** (ongoing):
   - [ ] Update ARCHITECTURE.md
   - [ ] Update CONTRIBUTING.md
   - [ ] Add ADR (Architecture Decision Records)

---

## ✅ DEFINITION OF DONE

Refactoring-ul e COMPLET când:

- [ ] Toate features mutate în folderele corecte
- [ ] Toate importurile actualizate
- [ ] `pnpm check:ts` - 0 errors
- [ ] `pnpm lint` - 0 errors, 0 warnings
- [ ] `pnpm test:run` - All passing
- [ ] `pnpm build` - SUCCESS
- [ ] Manual test în browser - funcțional 100%
- [ ] PR merged în main
- [ ] README.md actualizat
- [ ] Acest plan marcat ca DONE

---

**Last Updated:** 2025-11-13  
**Author:** Cascade + Tomita  
**Status:** 🟡 IN PROGRESS - FAZA 0
