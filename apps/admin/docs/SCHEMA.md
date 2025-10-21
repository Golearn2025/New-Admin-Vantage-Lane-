# Database Schema

## Overview

Schema pentru aplicația Vantage Lane Admin cu focus pe performance și securitate.

## Core Tables

### Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexuri necesare:**

- `idx_users_email` - pentru login
- `idx_users_role_created_at` - pentru listare cu filtrare
- `idx_users_created_at_id` - pentru paginare keyset

### Bookings

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES users(id),
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexuri necesare:**

- `idx_bookings_customer_id` - pentru rezervările clientului
- `idx_bookings_driver_id` - pentru rezervările șoferului
- `idx_bookings_status_created_at` - pentru filtrare după status
- `idx_bookings_created_at_id` - pentru paginare keyset

## Enums

### user_role (R0 UPDATE - Removed super_admin)

```sql
CREATE TYPE user_role AS ENUM (
  'admin',     -- Consolidated from super_admin, full system access
  'operator',  -- Regional/company operations management
  'driver',    -- Individual driver account
  'customer',  -- End customer account
  'auditor'    -- Read-only access for compliance and audit
);
```

### booking_status

```sql
CREATE TYPE booking_status AS ENUM (
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled'
);
```

## RLS Policies

### Users Table

```sql
-- R0 UPDATE: Removed super_admin references
-- Admins have full access (consolidated from super_admin)
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Operators can view users in their scope
CREATE POLICY "Operators can view scoped users" ON users
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'operator' AND operator_id = auth.jwt() ->> 'operator_id');

-- Auditors have read-only access to all users
CREATE POLICY "Auditors can view all users" ON users
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'auditor');

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);
```

### Bookings Table

```sql
-- R0 UPDATE: Removed super_admin references
-- Admins have full access to all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Operators can view bookings in their scope
CREATE POLICY "Operators can view scoped bookings" ON bookings
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'operator' AND operator_id = auth.jwt() ->> 'operator_id');

-- Auditors have read-only access to all bookings
CREATE POLICY "Auditors can view all bookings" ON bookings
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'auditor');

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

-- Drivers can view their assigned bookings
CREATE POLICY "Drivers can view assigned bookings" ON bookings
  FOR SELECT TO authenticated
  USING (driver_id = auth.uid());
```

## Migration Strategy

1. **Schema changes** - prin migrații versionate
2. **Index management** - cu downtime minim
3. **Data migrations** - separate de schema
4. **RLS updates** - cu testare obligatorie

## Performance Guidelines

- **Keyset pagination** pentru liste >1000 items
- **Composite indexes** pentru sort/filter combinat
- **Partial indexes** pentru status-uri frecvente
- **Query analysis** obligatoriu pentru >100ms

## M0.3 - Complete Index Specifications

### Bookings Table Indexes (Updated)

```sql
-- Primary keyset pagination index
CREATE INDEX idx_bookings_created_at_id ON bookings (created_at DESC, id DESC);

-- Status filtering with date sort
CREATE INDEX idx_bookings_status_created_at ON bookings (status, created_at DESC);

-- Operator filtering with date sort
CREATE INDEX idx_bookings_operator_created_at ON bookings (operator_id, created_at DESC);

-- Driver filtering with date sort
CREATE INDEX idx_bookings_driver_created_at ON bookings (driver_id, created_at DESC);

-- Source filtering with date sort
CREATE INDEX idx_bookings_source_created_at ON bookings (source, created_at DESC);

-- Scheduled bookings lookup
CREATE INDEX idx_bookings_scheduled_at ON bookings (scheduled_at) WHERE scheduled_at IS NOT NULL;
```

### Users Table Indexes (Updated)

```sql
-- Primary keyset pagination index (role, status, last_login, id)
CREATE INDEX idx_users_role_status_last_login_id ON users (role, status, last_login DESC, id DESC);

-- Status filtering with creation date
CREATE INDEX idx_users_status_created_at ON users (status, created_at DESC);

-- Date-based sorting fallback
CREATE INDEX idx_users_created_at_id ON users (created_at DESC, id DESC);

-- Unique email lookup
CREATE UNIQUE INDEX idx_users_email_unique ON users (email);

-- Phone lookup
CREATE INDEX idx_users_phone ON users (phone) WHERE phone IS NOT NULL;

-- Full-text search on name and email
CREATE INDEX idx_users_search_text ON users USING GIN (to_tsvector('english', name || ' ' || email));
```

### Documents Table Indexes (New)

```sql
-- Primary keyset pagination (expiry date first for renewal alerts)
CREATE INDEX idx_documents_expiry_created_id ON documents (expiry_date ASC, created_at DESC, id DESC);

-- Status + expiry filtering
CREATE INDEX idx_documents_status_expiry ON documents (status, expiry_date ASC);

-- Document type filtering
CREATE INDEX idx_documents_type_status ON documents (document_type, status);

-- Owner-based filtering
CREATE INDEX idx_documents_owner_type_id ON documents (owner_type, owner_id);

-- Date-based sorting
CREATE INDEX idx_documents_created_at_id ON documents (created_at DESC, id DESC);

-- Renewal alerts (documents expiring within 30 days)
CREATE INDEX idx_documents_expiry_renewal ON documents (expiry_date)
WHERE expiry_date BETWEEN NOW() AND NOW() + INTERVAL '30 days';
```

### Support Tickets Table Indexes (New)

```sql
-- Primary keyset pagination (SLA priority)
CREATE INDEX idx_tickets_sla_priority_created_id ON tickets (sla_due_at ASC, priority DESC, created_at DESC, id DESC);

-- State + SLA filtering
CREATE INDEX idx_tickets_state_sla ON tickets (state, sla_due_at ASC);

-- Priority-based sorting
CREATE INDEX idx_tickets_priority_created ON tickets (priority DESC, created_at DESC);

-- Agent assignment filtering
CREATE INDEX idx_tickets_assigned_state ON tickets (assigned_to, state) WHERE assigned_to IS NOT NULL;

-- Customer-based filtering
CREATE INDEX idx_tickets_customer_created ON tickets (customer_id, created_at DESC);

-- Category filtering
CREATE INDEX idx_tickets_category_state ON tickets (category, state);

-- Overdue tickets alert
CREATE INDEX idx_tickets_sla_overdue ON tickets (sla_due_at) WHERE sla_due_at < NOW();
```

### Payments Table Indexes (New)

```sql
-- Primary keyset pagination
CREATE INDEX idx_payments_created_at_id ON payments (created_at DESC, id DESC);

-- Status filtering with date
CREATE INDEX idx_payments_status_created ON payments (status, created_at DESC);

-- Amount-based sorting
CREATE INDEX idx_payments_amount_created ON payments (amount DESC, created_at DESC);

-- Customer filtering
CREATE INDEX idx_payments_customer_created ON payments (customer_id, created_at DESC);

-- Booking association lookup
CREATE INDEX idx_payments_booking_id ON payments (booking_id) WHERE booking_id IS NOT NULL;

-- Gateway filtering
CREATE INDEX idx_payments_gateway_status ON payments (gateway, status);

-- Payment method filtering
CREATE INDEX idx_payments_method_created ON payments (payment_method, created_at DESC);

-- Currency filtering
CREATE INDEX idx_payments_currency_status ON payments (currency, status);
```
