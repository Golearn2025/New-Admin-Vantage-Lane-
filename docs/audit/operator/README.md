# OPERATOR DASHBOARD AUDIT

**Date:** 2025-11-26  
**Role:** Operator (Limited Access)  
**Scope:** Organization-specific operations with restricted permissions  

## 🎯 Operator Dashboard Scope

### Limited Platform Access
Operator users have restricted access to:
- **Own bookings only** (price minus 10% platform commission)
- **Own organization data** (drivers, vehicles, documents assigned to them)
- **Own drivers management** (create, activate/deactivate THEIR drivers only)
- **Limited notifications** (send only to THEIR drivers, receive from admin/drivers)
- **Profile management** (settings, password change)

### Commission Model Understanding
- **Operator View:** Booking price MINUS 10% platform commission
- **Data Isolation:** Can ONLY see their organization's data
- **Driver Assignment:** Only drivers assigned to their organization
- **Financial Visibility:** No platform-wide financial data access

### 🚫 RESTRICTED ACCESS (Critical Security)
- ❌ **CANNOT see other operators' data** (strict organization isolation)
- ❌ **CANNOT send notifications to customers** (customer communication restricted)
- ❌ **CANNOT send notifications to all drivers** (only their assigned drivers)
- ❌ **CANNOT see platform-wide analytics** (admin-only data)
- ❌ **CANNOT access system settings** (admin-only configuration)
- ❌ **CANNOT create customers** (customer creation on landing page only)

---

## 📄 Operator Pages Matrix

See `PAGES_MATRIX.md` for complete list with organization isolation requirements.

### HIGH RISK PAGES (Priority 1 Audit)
1. **Dashboard** - Organization-specific metrics, commission deduction verification
2. **Bookings** - Organization isolation critical, commission calculations
3. **Drivers** - Driver assignment and management, RLS verification
4. **Documents** - Driver document approval, organization-scoped access

### MEDIUM RISK PAGES (Priority 2 Audit)
5. **Notifications** - Role-based messaging restrictions
6. **Profile** - Operator settings and preferences

### NO ACCESS PAGES (Verify Blocked)
- Users Management (admin-only)
- Payments (admin-only)
- Business Intelligence (admin-only)
- System Settings (admin-only)
- Cross-organization data (admin-only)

---

## 🔒 Operator Security Requirements (CRITICAL)

### Organization Isolation (RLS)
- [ ] **Row Level Security enforced** on all operator-accessible tables
- [ ] **organization_id filtering** in all queries (automatic via RLS)
- [ ] **Cross-org data leak testing** (operator A cannot see operator B data)
- [ ] **API endpoint protection** (organization_id validation server-side)

### Role-Based Restrictions
- [ ] **Driver management scoped** (only drivers in their organization)
- [ ] **Booking visibility limited** (only bookings for their organization)
- [ ] **Document access restricted** (only their drivers' documents)
- [ ] **Notification recipients limited** (no customer notifications, only their drivers)

### Commission Model Security
- [ ] **Price calculation verification** (operator sees price - commission)
- [ ] **Admin commission hidden** (operator cannot see platform commission)
- [ ] **Financial data restricted** (no platform-wide revenue access)

---

## 💼 Operator-Specific Requirements

### Dashboard Functionality
- [ ] **Organization metrics only** (bookings, drivers, revenue for their org)
- [ ] **Commission-adjusted pricing** (prices shown minus platform commission)
- [ ] **Driver performance tracking** (only their assigned drivers)
- [ ] **Real-time updates** (bookings appear with organization filtering)

### Driver Management
- [ ] **Create drivers** (can add new drivers to their organization)
- [ ] **Driver assignment** (drivers automatically assigned to operator's organization)
- [ ] **Activate/deactivate drivers** (manage their drivers' status)
- [ ] **Document approval** (approve/reject documents for their drivers only)

### Booking Operations
- [ ] **Organization-scoped bookings** (see only bookings assigned to their organization)
- [ ] **Commission-deducted pricing** (booking totals show operator's share)
- [ ] **Real-time booking updates** (new bookings appear with proper pricing)
- [ ] **Booking assignment** (assign bookings to their drivers)

---

## 🎯 Operator Audit Priorities

### Phase 1: Critical Security (Organization Isolation)
1. Dashboard (organization data isolation)
2. Bookings (RLS verification, commission calculations)  
3. Drivers (organization-scoped driver management)
4. Documents (organization-scoped document access)

### Phase 2: Role Restrictions
5. Notifications (role-based messaging limitations)
6. Profile (standard operator settings)

### Phase 3: Access Prevention Verification
7. Verify admin-only pages are blocked (401/403 responses)
8. Test cross-organization data access attempts (should fail)
9. Commission bypass attempts (should be impossible)

---

## 🧪 Operator Security Testing Scenarios

### Organization Isolation Testing
```bash
# Test 1: Operator A cannot see Operator B data
# Login as operator A, try to access operator B's data
GET /api/bookings?organization_id=operator_b_org
Expected: 403 Forbidden OR empty results (RLS blocks)

# Test 2: Driver management isolation
GET /api/drivers?organization_id=other_org  
Expected: Empty results (RLS prevents cross-org access)

# Test 3: Document access isolation
GET /api/documents?driver_id=other_org_driver
Expected: 403 Forbidden (driver not in operator's organization)
```

### Commission Model Verification
```bash
# Test 4: Commission deduction verification
# Same booking should show different prices:
# Admin view: £100 (full price + commission)
# Operator view: £90 (price - 10% commission)

# Test 5: Platform commission hidden
# Operator should never see platform commission amount
# Financial endpoints should not reveal platform revenue
```

### Role Restriction Testing
```bash
# Test 6: Customer notification blocked
POST /api/notifications
Body: { recipient_type: "customer", message: "test" }
Expected: 403 Forbidden (operators cannot message customers)

# Test 7: Cross-driver notification blocked  
POST /api/notifications
Body: { recipient_id: "driver_from_other_org", message: "test" }
Expected: 403 Forbidden (can only message their own drivers)

# Test 8: Admin page access blocked
GET /admin/users
GET /admin/business-intelligence  
GET /admin/settings
Expected: 401/403 for all admin-only pages
```

---

## 📊 Operator Evidence Collection

### Organization Isolation Proof
```bash
evidence/operator/
  organization-isolation/
    cross-org-access-denied-proof.txt
    rls-policy-verification.sql
    operator-a-vs-b-data-comparison.txt
```

### Commission Model Verification
```bash
evidence/operator/
  commission-model/
    admin-vs-operator-pricing-screenshots.png
    commission-calculation-verification.txt
    platform-revenue-hidden-proof.txt
```

### Role Restriction Verification
```bash
evidence/operator/
  role-restrictions/
    admin-page-access-denied.txt
    customer-notification-blocked.txt
    cross-org-driver-messaging-blocked.txt
```

---

## 🚨 OPERATOR CRITICAL RISKS

**SECURITY CRITICAL** (immediate fix required):
1. **Cross-org data visible** (operator sees other operators' data)
2. **Commission bypass** (operator can see full pricing + platform commission)
3. **Admin page access** (operator can access admin-only features)
4. **Customer messaging allowed** (operator can send notifications to customers)
5. **RLS not enforced** (database queries return cross-org data)

**HIGH PRIORITY** (fix this sprint):
1. **Driver assignment bypass** (can manage drivers from other organizations)
2. **Document access leak** (can see/approve documents from other org drivers)
3. **Platform analytics visible** (can see platform-wide business intelligence)

**MEDIUM PRIORITY** (next sprint):
1. **Poor operator UX** (interface not optimized for operator-specific workflow)
2. **Missing operator features** (bulk operations for their drivers)

---

## 🎯 Success Criteria

**Operator audit complete when:**
- [ ] Organization isolation verified (zero cross-org data leaks)
- [ ] Commission model working correctly (operator sees price - commission)
- [ ] Role restrictions enforced (no admin page access, no customer messaging)
- [ ] Driver management scoped (only their organization's drivers)
- [ ] All enterprise standards met (UI tokens, performance, responsive)
- [ ] Security tests pass (RLS, role boundaries, access controls)
- [ ] Evidence collected for all operator-specific scenarios

**Next Action:** Create `PAGES_MATRIX.md` for operator pages and begin organization isolation audit
