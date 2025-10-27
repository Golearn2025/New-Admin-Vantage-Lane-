# 🚀 Vantage Lane - Multi-Portal Architecture

> Complete guide for the 3-portal system: Admin, Fleet, and Driver

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────┐
│         VANTAGE LANE PLATFORM                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  🏢 ADMIN PORTAL (Super Admin + Support)        │
│  URL: admin.vantage-lane.com (localhost:3000)   │
│  Access: Full platform management               │
│                                                 │
│  🚖 FLEET PORTAL (Operators)                    │
│  URL: fleet.vantage-lane.com (localhost:3001)   │
│  Access: Organization-scoped data               │
│                                                 │
│  🚗 DRIVER PORTAL (Drivers)                     │
│  URL: drivers.vantage-lane.com (localhost:3002) │
│  Access: Personal profile & bookings            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### Monorepo Structure

```
Vantage Lane Admin/
├── apps/
│   ├── admin/          # Port 3000 - Admin Portal
│   ├── fleet/          # Port 3001 - Fleet Portal (NEW)
│   └── driver/         # Port 3002 - Driver Portal (NEW)
│
├── packages/
│   ├── ui-core/        # Shared components
│   ├── ui-dashboard/   # Dashboard widgets
│   └── formatters/     # Utilities
│
├── database/
│   └── migrations/
│       └── 008_operator_fleet_rls.sql  # NEW - RLS policies
│
└── docs/
```

---

## 🎯 Portal Comparison

| Feature | Admin | Fleet | Driver |
|---------|-------|-------|--------|
| **Users** | Super Admin, Support | Operators | Drivers |
| **Access** | All data | Organization-scoped | Personal data only |
| **Bookings** | All (72) | Filtered by org_id | Own assignments |
| **Drivers** | All (3) | Own drivers only | N/A |
| **Vehicles** | All (6) | Own vehicles only | Assigned vehicle |
| **Pricing** | Full breakdown | After platform fee | N/A |
| **Port** | 3000 | 3001 | 3002 |
| **Status** | ✅ Full | ✅ MVP | 🚧 Profile only |

---

## 🔒 Security Model

### Row-Level Security (RLS)

Each portal uses RLS to filter data automatically:

```sql
-- Helper functions
current_operator_id()  -- Returns operator's organization_id
is_super_admin()       -- Check if super admin
is_operator()          -- Check if operator

-- Example policy for operators
CREATE POLICY "operators_see_own_bookings"
ON bookings FOR SELECT
USING (
  is_super_admin() 
  OR organization_id = current_operator_id()
);
```

### Access Matrix

```
┌──────────────┬────────────┬────────────┬────────────┐
│   Resource   │   Admin    │   Fleet    │   Driver   │
├──────────────┼────────────┼────────────┼────────────┤
│ Bookings     │ ALL        │ ORG-SCOPED │ ASSIGNED   │
│ Drivers      │ ALL        │ ORG-SCOPED │ SELF       │
│ Vehicles     │ ALL        │ ORG-SCOPED │ ASSIGNED   │
│ Customers    │ ALL        │ RELATED    │ N/A        │
│ Organizations│ ALL        │ SELF       │ N/A        │
│ Platform Fee │ VISIBLE    │ HIDDEN     │ N/A        │
│ Settings     │ ALL        │ LIMITED    │ N/A        │
└──────────────┴────────────┴────────────┴────────────┘
```

---

## 💰 Price Transformations

### Admin View (Full Transparency)

```typescript
{
  totalPrice: 85.00,           // What customer paid
  platformFee: 8.50,           // 10% platform commission
  operatorNet: 76.50,          // 90% to operator
  driverPayout: 61.20,         // 80% of operator net
  operatorEarnings: 15.30      // 20% operator commission
}
```

### Operator View (After Platform Fee)

```typescript
{
  displayPrice: 76.50,         // After platform fee (hidden)
  myEarnings: 15.30,           // My commission
  driverPayout: 61.20          // What I pay driver
}
```

### Driver View (Simple)

```typescript
{
  myEarnings: 61.20            // What I get paid
}
```

---

## 🚀 Quick Start

### Development (All Portals)

```bash
# Terminal 1 - Admin Portal
cd apps/admin
pnpm dev  # http://localhost:3000

# Terminal 2 - Fleet Portal
cd apps/fleet
pnpm dev  # http://localhost:3001

# Terminal 3 - Driver Portal
cd apps/driver
pnpm dev  # http://localhost:3002
```

### Production Deployment

```bash
# Deploy each portal separately
vercel --prod --cwd apps/admin
vercel --prod --cwd apps/fleet
vercel --prod --cwd apps/driver

# Configure domains
admin.vantage-lane.com  → Admin Portal
fleet.vantage-lane.com  → Fleet Portal
drivers.vantage-lane.com → Driver Portal
```

---

## 📝 User Roles

### Super Admin

```sql
INSERT INTO admin_users (email, role, is_active)
VALUES ('admin@vantage-lane.com', 'super_admin', true);
```

**Access:** All portals, all data, all features

### Operator

```sql
INSERT INTO admin_users (
  email, 
  role, 
  default_operator_id,
  is_active
) VALUES (
  'operator@fleet.com',
  'operator',
  'org-uuid-here',
  true
);
```

**Access:** Fleet portal only, organization-scoped data

### Driver

```sql
INSERT INTO drivers (
  email,
  first_name,
  last_name,
  organization_id,
  is_active
) VALUES (
  'driver@example.com',
  'John',
  'Doe',
  'org-uuid-here',
  true
);
```

**Access:** Driver portal only, personal data

---

## 🎨 Design System

All portals share design tokens:

```css
/* Spacing */
var(--spacing-1) to var(--spacing-12)

/* Colors */
var(--color-bg-primary)
var(--color-text-primary)
var(--color-primary)
var(--color-success)

/* Typography */
var(--font-size-xs) to var(--font-size-6xl)
var(--font-weight-normal) to var(--font-weight-bold)

/* Borders & Shadows */
var(--border-radius-sm) to var(--border-radius-full)
var(--shadow-sm) to var(--shadow-xl)
```

### Portal Branding

```
Admin:  Purple (#8B5CF6) - Authority
Fleet:  Blue (#3B82F6)   - Professional
Driver: Green (#10B981)  - Active
```

---

## 📊 Database Schema

### Key Tables

```sql
-- Organizations (Operators)
organizations
├─ id (UUID)
├─ name
├─ driver_commission_pct (default 20%)
└─ is_active

-- Admin Users (Admin + Operators)
admin_users
├─ id (UUID)
├─ email
├─ role (super_admin, admin, operator, support)
├─ default_operator_id → organizations.id
└─ is_active

-- Drivers
drivers
├─ id (UUID)
├─ organization_id → organizations.id
├─ email
├─ license_number
└─ is_active

-- Bookings
bookings
├─ id (UUID)
├─ customer_id → customers.id
├─ organization_id → organizations.id
├─ assigned_driver_id → drivers.id
└─ status

-- Booking Pricing
booking_pricing
├─ booking_id → bookings.id
├─ price (total customer paid)
├─ platform_fee (10%)
├─ operator_net (90%)
├─ driver_payout (80% of operator_net)
└─ platform_commission_pct
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Shared (all portals)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Admin specific
NEXT_PUBLIC_ADMIN_URL=http://localhost:3000

# Fleet specific
NEXT_PUBLIC_FLEET_URL=http://localhost:3001

# Driver specific  
NEXT_PUBLIC_APP_NAME="Driver Portal"
```

---

## 📚 Documentation

- [Admin Portal](apps/admin/README.md) - Full platform management
- [Fleet Portal](apps/fleet/README.md) - Operator features
- [Driver Portal](apps/driver/README.md) - Driver features
- [Database Migrations](database/migrations/) - SQL schema
- [UI Core](packages/ui-core/) - Shared components

---

## 🧪 Testing

```bash
# Type check all portals
pnpm run check:ts

# Lint all portals
pnpm run lint

# Build all portals
pnpm run build

# Run tests
pnpm run test:run
```

---

## 🚧 Roadmap

### Admin Portal
- ✅ Full platform management
- ✅ User management
- ✅ Permissions system
- 🚧 Advanced analytics

### Fleet Portal
- ✅ Dashboard with stats
- ✅ Drivers list
- 🚧 Bookings table
- 🚧 Earnings reports
- 🚧 Vehicle management

### Driver Portal
- ✅ Profile page
- 🚧 Earnings dashboard
- 🚧 Bookings list
- 🚧 Document upload
- 🚧 Support center

---

## 🤝 Contributing

1. Read [RULES.md](RULES.md) - Coding standards
2. Read [WORKFLOW.md](WORKFLOW.md) - Development workflow
3. Use design tokens (zero hardcoded values)
4. TypeScript strict mode
5. Files < 200 lines
6. Functions < 50 lines

---

## 📄 License

Proprietary - Vantage Lane Admin

---

**Version:** 2.0.0  
**Multi-Portal Release:** 2025-10-26  
**Portals:** 3 (Admin, Fleet, Driver)  
**Database:** PostgreSQL with RLS  
**Framework:** Next.js 14 + React 18
