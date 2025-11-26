# OPERATOR PAGES MATRIX - LIMITED ACCESS AUDIT

**Date:** 2025-11-26  
**Role:** Operator (Organization-Scoped Access)  
**Total Accessible Pages:** 6 pages (heavily restricted)  
**Critical Requirement:** Organization isolation + commission deduction  

## 📊 OPERATOR ACCESSIBLE PAGES

| Page | Route | Risk Level | Status | Priority | Organization Isolation | Est. Hours |
|------|-------|------------|---------|----------|----------------------|------------|
| **Dashboard** | `/dashboard` | 🔴 HIGH | TODO | P1 | ✅ REQUIRED | 6h |
| **Bookings** | `/bookings` | 🔴 HIGH | TODO | P1 | ✅ REQUIRED | 6h |
| **Drivers** | `/driver` | 🔴 HIGH | TODO | P1 | ✅ REQUIRED | 5h |
| **Documents** | `/documents` | 🟡 MEDIUM | TODO | P2 | ✅ REQUIRED | 4h |
| **Notifications** | `/notifications` | 🟡 MEDIUM | TODO | P2 | ✅ REQUIRED | 3h |
| **Profile** | `/profile` | 🟢 LOW | TODO | P3 | ⚪ N/A | 2h |

**Total Audit Time:** 26 hours  

## 🚫 BLOCKED PAGES (Must Verify Access Denied)

| Page | Route | Expected Response | Verification Required |
|------|-------|-------------------|----------------------|
| **Users Management** | `/users` | 403 Forbidden | ✅ |
| **Payments** | `/payments` | 403 Forbidden | ✅ |
| **Business Intelligence** | `/business-intelligence` | 403 Forbidden | ✅ |
| **Settings** | `/settings` | 403 Forbidden | ✅ |
| **Invoices** | `/invoices` | 403 Forbidden | ✅ |
| **Disputes** | `/disputes` | 403 Forbidden | ✅ |
| **Refunds** | `/refunds` | 403 Forbidden | ✅ |
| **Payouts** | `/payouts` | 403 Forbidden | ✅ |
| **Support Tickets** | `/support-tickets` | 403 Forbidden | ✅ |
| **Reviews** | `/reviews` | 403 Forbidden | ✅ |
| **Prices** | `/prices` | 403 Forbidden | ✅ |
| **Monitoring** | `/monitoring` | 403 Forbidden | ✅ |
| **Project Health** | `/project-health` | 403 Forbidden | ✅ |
| **Audit History** | `/audit-history` | 403 Forbidden | ✅ |

---

## 🔴 HIGH RISK PAGES (Organization Isolation Critical)

### 1. Dashboard (`/dashboard`) - Organization Metrics Only
**Why High Risk:**
- Commission-adjusted pricing display (operator sees price - 10%)
- Organization-scoped analytics (only their drivers, bookings, revenue)
- Real-time data updates with proper filtering
- Cross-org data leak potential (critical security risk)

**Operator-Specific Requirements:**
- [ ] **Organization metrics only** (no platform-wide data)
- [ ] **Commission-deducted revenue** (10% platform commission hidden)
- [ ] **Driver count** (only drivers assigned to their organization)
- [ ] **Booking statistics** (only bookings for their organization)
- [ ] **Performance metrics** (their organization's performance only)

**Security Tests:**
```bash
# Verify organization isolation
GET /api/dashboard/metrics?organization_id=current_org
Expected: Only current organization data

# Verify commission deduction  
Expected: Revenue shown as (booking_total - platform_commission)

# Test cross-org access attempt
GET /api/dashboard/metrics?organization_id=other_org
Expected: 403 Forbidden OR empty results (RLS blocks)
```

### 2. Bookings (`/bookings`) - Commission Model + RLS
**Why High Risk:**
- Commission calculations must be accurate (price - 10%)
- Organization-scoped booking visibility (RLS critical)
- Real-time booking updates with proper filtering
- High data volume requiring efficient pagination

**Operator-Specific Requirements:**
- [ ] **Organization bookings only** (WHERE organization_id = operator_org)
- [ ] **Commission-adjusted pricing** (admin sees £100, operator sees £90)
- [ ] **Real-time updates** (new bookings appear with correct pricing)
- [ ] **Booking assignment** (can assign bookings to their drivers only)
- [ ] **Status management** (update booking status for their organization)

**Security Tests:**
```bash
# Organization isolation verification
GET /api/bookings
Expected: Only bookings where organization_id = operator_organization

# Commission calculation verification
GET /api/bookings/{id}
Expected: booking.operator_price = booking.total_price - platform_commission

# Cross-org booking access test
GET /api/bookings/{other_org_booking_id}
Expected: 404 Not Found (RLS prevents access)
```

### 3. Drivers (`/driver`) - Organization-Scoped Management
**Why High Risk:**
- Driver assignment and creation (organization isolation critical)
- Document approval workflow (security-sensitive)
- Driver activation/deactivation (operational impact)
- Cross-org driver management prevention

**Operator-Specific Requirements:**
- [ ] **Own drivers only** (WHERE organization_id = operator_org)
- [ ] **Driver creation** (auto-assign to operator's organization)
- [ ] **Status management** (activate/deactivate their drivers)
- [ ] **Document approval** (approve/reject their drivers' documents)
- [ ] **Performance tracking** (earnings, ratings for their drivers)

**Security Tests:**
```bash
# Driver isolation verification
GET /api/drivers
Expected: Only drivers assigned to operator's organization

# Driver creation with organization assignment
POST /api/drivers
Body: { name: "New Driver", email: "driver@test.com" }
Expected: Driver created with organization_id = operator_organization

# Cross-org driver access prevention
GET /api/drivers/{other_org_driver_id}
Expected: 404 Not Found (RLS prevents access)
```

---

## 🟡 MEDIUM RISK PAGES (Role Restrictions)

### 4. Documents (`/documents`) - Driver Document Management
**Organization Scope:** Only documents for their organization's drivers
- [ ] **Driver documents only** (documents.driver_id IN operator_org_drivers)
- [ ] **Approval workflow** (approve/reject documents for their drivers)
- [ ] **Upload management** (drivers upload, operators approve)
- [ ] **Compliance tracking** (document expiration alerts for their drivers)

### 5. Notifications (`/notifications`) - Role-Based Messaging
**Messaging Restrictions:** Critical role-based limitations
- [ ] **Send to own drivers only** (recipient_id IN operator_org_drivers)
- [ ] **Receive from admin/drivers** (can receive notifications)
- [ ] **Customer messaging blocked** (CANNOT send to customers)
- [ ] **Cross-org driver messaging blocked** (CANNOT send to other org drivers)

**Security Tests:**
```bash
# Customer notification blocking
POST /api/notifications
Body: { recipient_type: "customer", message: "test" }
Expected: 403 Forbidden

# Cross-org driver notification blocking  
POST /api/notifications
Body: { recipient_id: "other_org_driver_id", message: "test" }
Expected: 403 Forbidden

# Own driver notification allowed
POST /api/notifications
Body: { recipient_id: "own_driver_id", message: "test" }
Expected: 200 OK
```

---

## 🟢 LOW RISK PAGES (Standard Functionality)

### 6. Profile (`/profile`) - Operator Settings
**Standard Functionality:** Personal settings and preferences
- [ ] **Profile information** (name, email, phone)
- [ ] **Password management** (change password)
- [ ] **Notification preferences** (email/SMS preferences)
- [ ] **Organization information** (read-only organization details)

---

## 🧪 COMPREHENSIVE ORGANIZATION ISOLATION TESTING

### Cross-Organization Data Leak Tests
```bash
# Test 1: Booking data isolation
# Operator A tries to access Operator B's booking
curl -H "Authorization: Bearer operator_a_token" \
     GET /api/bookings?organization_id=operator_b_org
Expected: Empty results or 403 Forbidden

# Test 2: Driver management isolation
curl -H "Authorization: Bearer operator_a_token" \
     PUT /api/drivers/operator_b_driver_id/status
Body: { status: "inactive" }
Expected: 404 Not Found or 403 Forbidden

# Test 3: Document access isolation
curl -H "Authorization: Bearer operator_a_token" \
     GET /api/documents?driver_id=operator_b_driver_id
Expected: Empty results (RLS blocks cross-org access)

# Test 4: Dashboard metrics isolation
curl -H "Authorization: Bearer operator_a_token" \
     GET /api/dashboard/metrics
Expected: Only operator A's organization metrics
```

### Commission Model Verification Tests
```bash
# Test 5: Commission calculation accuracy
# Same booking viewed by admin vs operator:

# Admin view:
GET /api/bookings/123 (with admin token)
Expected: { total: 100, platform_commission: 10, operator_share: 90 }

# Operator view:  
GET /api/bookings/123 (with operator token)
Expected: { total: 90, platform_commission: hidden, admin_view: hidden }

# Test 6: Platform revenue hidden from operators
GET /api/analytics/platform-revenue (with operator token)
Expected: 403 Forbidden (admin-only endpoint)
```

### Role Boundary Testing
```bash
# Test 7: Admin page access prevention
GET /admin/users (with operator token)
GET /admin/business-intelligence (with operator token)  
GET /admin/settings (with operator token)
Expected: 401 Unauthorized or 403 Forbidden for all

# Test 8: Customer communication blocking
POST /api/notifications/customers (with operator token)
Expected: 403 Forbidden (operators cannot message customers)
```

---

## 📊 OPERATOR AUDIT WORKFLOW

### Phase 1: Organization Isolation Verification (Critical)
1. **RLS Policy Testing** - Verify database-level organization filtering
2. **API Endpoint Testing** - Test all operator endpoints for cross-org access
3. **UI Data Verification** - Ensure UI only shows organization-scoped data

### Phase 2: Commission Model Verification (Critical)
1. **Price Calculation Testing** - Verify commission deduction accuracy
2. **Platform Commission Hiding** - Ensure operators cannot see platform revenue
3. **Financial Data Isolation** - Test platform-wide financial data access prevention

### Phase 3: Role Restriction Verification (Critical)
1. **Admin Page Access** - Verify 403/401 responses for admin-only pages
2. **Customer Communication** - Test notification restrictions  
3. **Cross-Role Actions** - Verify operators cannot perform admin actions

### Phase 4: Standard Quality Checks
1. **Enterprise Checklist** - UI tokens, TypeScript, architecture
2. **Performance Testing** - Page load times, table performance
3. **Responsive Design** - Mobile/tablet experience verification

---

## 🎯 OPERATOR SUCCESS CRITERIA

**Operator audit COMPLETE when:**

### Security Requirements (CRITICAL)
- [ ] **Zero cross-org data leaks** verified through comprehensive testing
- [ ] **Commission model accurate** (operator sees price - platform commission)
- [ ] **Admin page access blocked** (401/403 responses verified)
- [ ] **Customer messaging prevented** (notification restrictions enforced)
- [ ] **RLS policies effective** (database-level organization filtering)

### Functional Requirements
- [ ] **Organization-scoped functionality** working (dashboard, bookings, drivers)
- [ ] **Driver management** limited to their organization
- [ ] **Document workflow** working for their drivers only
- [ ] **Real-time updates** filtered to their organization

### Quality Standards
- [ ] **All enterprise standards** met (UI-Core, tokens, TypeScript)
- [ ] **Performance requirements** met (<2s load, <300ms interactions)
- [ ] **Responsive design** verified (320px, 375px, 768px)
- [ ] **Evidence collected** (test results, screenshots, tool outputs)

**Definition of Done:** All operator pages pass security isolation tests + standard quality gates

**Next Action:** Create operator dashboard audit file and begin RLS verification testing
