# 🚖 Fleet Management Portal

> Operator-focused portal for managing drivers, vehicles, and bookings

---

## 📋 Overview

Fleet Portal is a dedicated application for transportation operators to manage their fleet operations. It provides scoped access to only the data relevant to each operator's organization.

---

## 🎯 Features

### ✅ Implemented

- **Dashboard** - Real-time statistics scoped to operator
  - Total bookings
  - Active drivers count
  - Revenue after platform commission
  - Driver payouts tracking
  
- **Drivers Management** - View and manage fleet drivers
  - List all drivers in organization
  - Driver status (active/inactive)
  - Contact information
  - License details
  
- **Authentication** - Secure operator login
  - Role-based access (operators only)
  - Organization scoping
  - Session management

### 🚧 Coming Soon

- **Bookings Table** - Full booking management with filters
- **Vehicles Management** - Add, edit, remove vehicles
- **Earnings Reports** - Detailed financial reports
- **Real-time Updates** - Live booking status changes

---

## 🏗️ Architecture

```
apps/fleet/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page
│   ├── (fleet)/
│   │   ├── layout.tsx          # Main layout with sidebar
│   │   ├── dashboard/          # Dashboard page
│   │   ├── drivers/            # Drivers management
│   │   ├── bookings/           # Bookings (placeholder)
│   │   ├── vehicles/           # Vehicles (placeholder)
│   │   └── earnings/           # Earnings (placeholder)
│   └── layout.tsx              # Root layout
├── shared/
│   └── lib/
│       └── supabase/           # Supabase client & helpers
└── package.json
```

---

## 🔒 Security - RLS Policies

Fleet Portal uses Row-Level Security (RLS) to ensure operators only see their own data:

```sql
-- Operators see only their organization's bookings
CREATE POLICY "operators_see_own_bookings"
ON bookings FOR SELECT
USING (organization_id = current_operator_id());

-- Operators see only their organization's drivers
CREATE POLICY "operators_see_own_drivers"
ON drivers FOR SELECT
USING (organization_id = current_operator_id());
```

**Helper Functions:**
- `current_operator_id()` - Returns operator's organization ID
- `is_super_admin()` - Checks if user is super admin
- `is_operator()` - Checks if user is an operator

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
pnpm 9+
Supabase account
```

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
```

### Development

```bash
# Start development server (port 3001)
cd apps/fleet
pnpm dev

# Open browser
open http://localhost:3001
```

### Build

```bash
pnpm build
pnpm start
```

---

## 📊 Data Scoping

### Price Transformations

Operators see prices **after platform commission**:

```typescript
// Admin sees:
{
  totalPrice: 85.00,      // Full price customer paid
  platformFee: 8.50,      // 10% platform commission
  operatorNet: 76.50,     // What operator receives
  driverPayout: 61.20     // What driver gets (80%)
}

// Operator sees:
{
  displayPrice: 76.50,    // After platform fee
  myEarnings: 15.30,      // Operator commission (20%)
  driverPayout: 61.20     // Driver payout
}
```

### Dashboard Stats

Materialized view for performance:

```sql
CREATE MATERIALIZED VIEW operator_dashboard_stats AS
SELECT 
  organization_id,
  COUNT(*) as total_bookings,
  SUM(operator_net) as total_revenue,
  SUM(operator_net - driver_payout) as total_earnings
FROM bookings
GROUP BY organization_id;
```

---

## 🎨 Design System

Uses shared design tokens from `@vantage-lane/ui-core`:

```css
/* All styles use tokens */
.container {
  padding: var(--spacing-6);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
}
```

**Zero hardcoded values!**

---

## 🔗 Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@vantage-lane/formatters": "*",
  "@vantage-lane/ui-core": "*",
  "@vantage-lane/ui-dashboard": "*",
  "next": "14.2.33",
  "react": "^18.2.0"
}
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod

# Configure domain
# fleet.vantage-lane.com → Fleet Portal
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_FLEET_URL=https://fleet.vantage-lane.com
```

---

## 📝 Usage

### Login as Operator

1. Navigate to `/login`
2. Sign in with operator credentials
3. Must have `role='operator'` and `default_operator_id` set

### Access Control

```typescript
// Automatically filtered by RLS
const drivers = await supabase
  .from('drivers')
  .select('*');  // Only your organization's drivers

const bookings = await supabase
  .from('bookings')
  .select('*');  // Only your organization's bookings
```

---

## 🧪 Testing

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build test
pnpm build
```

---

## 📚 Related

- **Admin Portal** - `/apps/admin` - Full platform management
- **Driver Portal** - `/apps/driver` - Driver-focused features
- **UI Core** - `/packages/ui-core` - Shared components
- **Database** - `/database/migrations` - SQL migrations

---

## 🤝 Contributing

1. Follow project rules in `/RULES.md`
2. Follow workflow in `/WORKFLOW.md`
3. Use design tokens (zero hardcoded values)
4. TypeScript strict mode
5. Files < 200 lines
6. Functions < 50 lines

---

## 📄 License

Proprietary - Vantage Lane Admin

---

**Version:** 1.0.0  
**Port:** 3001  
**Last Updated:** 2025-10-26
