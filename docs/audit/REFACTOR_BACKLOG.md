# 🎭 ENTERPRISE REFACTOR BY ROLES - BACKLOG BOARD

## **🎯 ROLE-BASED STRATEGY OVERVIEW**

### **🏢 ADMIN ROLE (PRIORITY 1)** 
**Pages: Dashboard, Users, Bookings, Payments, Reviews, Settings + Auth + Navigation**
**Issues: 35 any types + 120 hardcoded values + Shell components**

### **🚚 DRIVER ROLE (PRIORITY 2)** 
**Pages: Documents Upload, Profile, Vehicle Management**  
**Issues: 8 any types + 45 hardcoded values + Large components**

### **🏪 OPERATOR ROLE (PRIORITY 3)**
**Pages: Operator Dashboard, Driver Management**
**Issues: 4 any types + 25 hardcoded values + Performance**

### **🔗 SHARED COMPONENTS (PRIORITY 4)**
**Components: Auth, Notifications, Shared UI, Monitoring**
**Issues: Cross-cutting concerns + Architecture patterns**

---

## **📋 BACKLOG BOARD**

### **🔴 TODO (ORGANIZED BY ROLE)**

## **🏢 ADMIN ROLE REFACTOR (PRIORITY 1)**

### **📱 PHASE A1: SHELL & NAVIGATION**
- [ ] **PR1:** `app-shell` - fix AppShell + Sidebar navigation (auth, responsive)
- [ ] **PR2:** `auth-system` - login/logout + user dropdown + profile settings
- [ ] **PR3:** `topbar-sidebar` - navigation consistency + mobile drawer
- [ ] **PR4:** `route-protection` - admin role guards + permissions

### **📊 PHASE A2: CORE ADMIN PAGES**
- [ ] **PR5:** `admin-dashboard` - dashboard metrics + charts + any types (5)
- [ ] **PR6:** `users-table` - users management + CRUD + EnterpriseDataTable
- [ ] **PR7:** `bookings-table` - bookings list + filters + actions + any types (8)
- [ ] **PR8:** `payments-table` - payments + PaymentRow interface + any types (10)

### **💰 PHASE A3: FINANCIAL MANAGEMENT**  
- [ ] **PR9:** `payments-overview` - overview cards + hardcoded colors (4)
- [ ] **PR10:** `prices-management` - pricing config + any types (9) 
- [ ] **PR11:** `payouts-table` - operator payouts + calculations
- [ ] **PR12:** `invoices-table` - split large file (341L) + any types

### **⚖️ PHASE A4: DISPUTES & REVIEWS**
- [ ] **PR13:** `disputes-table` - split large file (320L) + filters  
- [ ] **PR14:** `reviews-management` - reviews + safety incidents (already mostly done)
- [ ] **PR15:** `refunds-table` - refunds processing + split file (315L)

### **⚙️ PHASE A5: ADMIN SETTINGS**
- [ ] **PR16:** `settings-permissions` - user permissions + roles (215L file)
- [ ] **PR17:** `settings-commissions` - commission rates (211L file) 
- [ ] **PR18:** `settings-vehicle-categories` - vehicle types management
- [ ] **PR19:** `user-modals` - user create/edit/view modals + any types (2)

## **🚚 DRIVER ROLE REFACTOR (PRIORITY 2)**

### **📄 PHASE D1: DRIVER CORE**
- [ ] **PR20:** `driver-profile` - driver profile page + vehicle tab + any types (2)
- [ ] **PR21:** `driver-documents` - document upload + split AddVehicleModal (216L)
- [ ] **PR22:** `vehicle-management` - my vehicles + document management
- [ ] **PR23:** `driver-navigation` - driver-specific sidebar + permissions

## **🏪 OPERATOR ROLE REFACTOR (PRIORITY 3)**

### **📈 PHASE O1: OPERATOR CORE**  
- [ ] **PR24:** `operator-dashboard` - operator-specific dashboard + metrics
- [ ] **PR25:** `operator-drivers` - assigned drivers list + management
- [ ] **PR26:** `operator-permissions` - operator role guards + data isolation
- [ ] **PR27:** `operator-navigation` - operator sidebar + limited features

## **🔗 SHARED COMPONENTS REFACTOR (PRIORITY 4)**

### **🛠️ PHASE S1: SHARED INFRASTRUCTURE**
- [ ] **PR28:** `shared-auth` - forgot password + login shared logic
- [ ] **PR29:** `shared-bookings` - bookings table shared between roles
- [ ] **PR30:** `shared-dashboard` - dashboard metrics shared components  
- [ ] **PR31:** `shared-notifications` - notification center + bell
- [ ] **PR32:** `shared-settings` - profile settings shared
- [ ] **PR33:** `monitoring-system` - monitoring + performance + any types (28)
- [ ] **PR34:** `business-intelligence` - BI module + reporting

---

### **🟡 IN PROGRESS (MAX 2 ITEMS)**

**Currently:** None (Ready to start!)

---

### **✅ DONE (WITH LINKS)**

**None yet** - Starting with WAVE 1!

---

## **📏 PR TEMPLATE & RULES**

### **🎯 PR TITLE FORMAT:**
```
refactor(module): single change description

Examples:
- refactor(prices-management): eliminate any types in handlers.ts
- refactor(payments-table): add PaymentRow interface + column typing
- refactor(ui-tokens): introduce overlay color tokens
```

### **✅ PR CHECKLIST (MANDATORY):**
- [ ] **Single scope:** 1 module OR 1 type of problem only
- [ ] **Tests pass:** `pnpm check:ts` ✅ 0 errors
- [ ] **Lint clean:** `pnpm lint` ✅ 0 warnings  
- [ ] **Build works:** `pnpm build` ✅ success
- [ ] **Audit verified:** grep/find commands show improvement
- [ ] **UI intact:** Screenshots before/after if UI changes
- [ ] **No behavior change:** Functionality identical (or explicitly documented)
- [ ] **Max 2 hours work:** If more, split into another PR

### **📊 VERIFICATION COMMANDS:**
```bash
# For any types removal:
grep -r ": any\|<any>" apps/admin/features/MODULE --include="*.tsx" --include="*.ts"

# For color tokens:
grep -r "rgba\|rgb\|#[0-9a-fA-F]" apps/admin/features/MODULE --include="*.css" | grep -v "var(--"

# For px values:  
grep -r "[0-9]\+px" apps/admin/features/MODULE --include="*.css" | grep -v "var(--"

# For inline styles:
grep -r "style={{" apps/admin/features/MODULE --include="*.tsx"
```

---

## **🚀 ROLE-BASED EXECUTION PLAN**

### **🏢 ADMIN ROLE - EXECUTION ROADMAP**

#### **📅 WEEK 1: SHELL & NAVIGATION (A1)**
**Goal: Stabilește fundamentul pentru toate paginile admin**

**PR1: APP-SHELL (Ziua 1-2)**
```typescript
Target: AppShell + Sidebar + Topbar enterprise compliance
Files: 
- apps/admin/shared/ui/composed/appshell/AppShell.tsx
- apps/admin/shared/ui/composed/appshell/Drawer.module.css  
- apps/admin/shared/ui/composed/appshell/SidebarNav.module.css
- apps/admin/shared/ui/composed/appshell/Topbar.module.css

Issues to fix:
- Hardcoded CSS values → design tokens
- Mobile responsive issues  
- Navigation consistency
- Role-based menu items
```

**PR2: AUTH-SYSTEM (Ziua 3)**
```typescript
Target: Login/Logout + User Dropdown + Profile
Files:
- apps/admin/features/shared/auth-login/
- apps/admin/features/shared/settings-profile/

Issues to fix:
- Auth flow + role guards
- User dropdown functionality
- Profile settings integration
```

#### **📅 WEEK 2: CORE ADMIN PAGES (A2)**

**PR5: ADMIN-DASHBOARD (Ziua 1-2)**
```typescript
Target: Dashboard + metrics + charts
Files: apps/admin/features/shared/dashboard/
Issues: Dashboard metrics + any types (5)
```

**PR6: USERS-TABLE (Ziua 3-4)**  
```typescript
Target: Users management complete
Files: 
- apps/admin/features/admin/users-table/
- apps/admin/features/admin/admins-table/
- apps/admin/features/admin/customers-table/
- apps/admin/features/admin/operators-table/
- apps/admin/features/admin/drivers-table/

Issues: EnterpriseDataTable + CRUD operations
```

**PR8: PAYMENTS-TABLE (Ziua 5)**
```typescript
Target: PaymentRow interface + eliminate 10 'any' types
Files: apps/admin/features/admin/payments-table/

Current violation:
accessor: (row: any) => row.id,
cell: (row: any) => (...)

Fix plan:
interface PaymentRow {
  id: string;
  bookingId: string;  
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
```

#### **📅 WEEK 3: FINANCIAL MANAGEMENT (A3)**

**PR10: PRICES-MANAGEMENT (Ziua 1)**
```typescript
Target: Eliminate 9 'any' types în handlers.ts
Files: apps/admin/features/admin/prices-management/

Current violation:
mutate: any;
export async function handleUpdateVehicleType(config: PricingConfig, mutate: any, ...)

Fix plan:
interface MutateFunction<T = any> {
  (data?: T, opts?: { revalidate?: boolean }): Promise<T | undefined>;
}
```

### **🚚 DRIVER ROLE - EXECUTION ROADMAP**

#### **📅 WEEK 4: DRIVER CORE (D1)**

**PR21: DRIVER-DOCUMENTS (Ziua 1-2)**
```typescript
Target: Split AddVehicleModal (216L) + eliminate any types (2)
Files: apps/admin/features/driver/driver-documents-upload/

Split plan:
- AddVehicleModal.tsx (216L) → 
  - AddVehicleModal.tsx (80L)
  - VehicleForm.tsx (70L)  
  - VehicleUpload.tsx (60L)
```

### **🏪 OPERATOR ROLE - EXECUTION ROADMAP**

#### **📅 WEEK 5: OPERATOR CORE (O1)**

**PR24: OPERATOR-DASHBOARD**
```typescript
Target: Operator-specific dashboard + role isolation
Files: apps/admin/features/operator/operator-dashboard/
```

### **🔗 SHARED COMPONENTS - EXECUTION ROADMAP**

#### **📅 WEEK 6: SHARED INFRASTRUCTURE (S1)**

**PR33: MONITORING-SYSTEM**
```typescript
Target: Eliminate 28 'any' types în monitoring
Files: apps/admin/features/monitoring/

Interfaces needed:
interface SlowQuery {
  query: string;
  duration: number;
  timestamp: string;
}
interface PerformanceMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
}
```

---

## **⚡ GOLDEN RULES**

### **🚨 STOP CONDITIONS:**
- **>2 ore pe PR** → Split în 2 PR-uri
- **Functionality breaks** → Rollback immediate  
- **Tests fail** → Fix before merge
- **Multiple modules touched** → Split by module

### **🎯 SUCCESS METRICS:**
- **Any types counter:** 47 → 0 (Wave 1)
- **Hardcoded values counter:** 584 → 0 (Wave 2) 
- **Fetch in UI counter:** 44 → 0 (Wave 3)
- **Large files counter:** 32 → 0 (Wave 4)

### **📈 TRACKING:**
Update this board daily. Move items from TODO → IN PROGRESS → DONE.
Celebrate every PR merge! 🎉

---

**READY TO START WAVE 1? Let's eliminate those 'any' types! 🚀**
