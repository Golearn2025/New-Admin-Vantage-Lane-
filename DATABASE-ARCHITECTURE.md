# 🏗️ DATABASE ARCHITECTURE - Vantage Lane

## ✅ **STRUCTURA ACTUALĂ (SCALABILĂ ȘI MODULARĂ)**

### **📊 CORE TABLES:**

```
1. organizations
   ├─ id (UUID)
   ├─ code (TEXT) - unique
   ├─ name (TEXT)
   ├─ org_type (TEXT) - 'operator'
   ├─ contact_email (TEXT)
   ├─ contact_phone (TEXT)
   ├─ city (TEXT)
   ├─ is_active (BOOLEAN)
   ├─ rating_average (DECIMAL)
   └─ created_at (TIMESTAMP)

2. drivers
   ├─ id (UUID)
   ├─ email (TEXT)
   ├─ first_name (TEXT)
   ├─ last_name (TEXT)
   ├─ phone (TEXT)
   ├─ operator_id (UUID) → organizations.id ⭐
   ├─ organization_id (UUID) → organizations.id
   ├─ profile_photo_url (TEXT)
   ├─ vehicle_categories (ARRAY)
   ├─ verification_status (TEXT)
   ├─ is_active (BOOLEAN)
   └─ created_at (TIMESTAMP)

3. customers
   ├─ id (UUID)
   ├─ email (TEXT)
   ├─ first_name (TEXT)
   ├─ last_name (TEXT)
   ├─ phone (TEXT)
   ├─ status (TEXT)
   ├─ is_active (BOOLEAN)
   └─ created_at (TIMESTAMP)

4. bookings
   ├─ id (UUID)
   ├─ reference (TEXT)
   ├─ customer_id (UUID) → customers.id ⭐
   ├─ organization_id (UUID) → organizations.id ⭐
   ├─ assigned_driver_id (UUID) → drivers.id
   ├─ assigned_vehicle_id (UUID) → vehicles.id
   ├─ trip_type (TEXT)
   ├─ status (TEXT)
   ├─ start_at (TIMESTAMP)
   ├─ distance_miles (DECIMAL)
   ├─ duration_min (INT)
   ├─ vehicle_category (TEXT)
   ├─ pricing → booking_pricing table
   └─ created_at (TIMESTAMP)

5. booking_pricing
   ├─ id (UUID)
   ├─ booking_id (UUID) → bookings.id ⭐
   ├─ base_price (DECIMAL)
   ├─ platform_commission (DECIMAL) ⭐⭐
   ├─ operator_commission (DECIMAL) ⭐⭐
   ├─ total (DECIMAL)
   └─ currency (TEXT)

6. vehicles
   ├─ id (UUID)
   ├─ organization_id (UUID) → organizations.id ⭐
   ├─ driver_id (UUID) → drivers.id
   ├─ model (TEXT)
   ├─ category (TEXT)
   └─ is_active (BOOLEAN)

7. admin_users
   ├─ id (UUID)
   ├─ email (TEXT)
   ├─ first_name (TEXT)
   ├─ last_name (TEXT)
   ├─ phone (TEXT)
   ├─ is_active (BOOLEAN)
   └─ created_at (TIMESTAMP)

8. page_definitions (Permissions)
   ├─ id (UUID)
   ├─ page_key (TEXT)
   ├─ label (TEXT)
   ├─ href (TEXT)
   └─ is_active (BOOLEAN)

9. role_permissions (Permissions)
   ├─ id (UUID)
   ├─ role (TEXT)
   ├─ page_key (TEXT) → page_definitions
   └─ enabled (BOOLEAN)

10. user_permissions (Permissions)
    ├─ id (UUID)
    ├─ user_id (UUID)
    ├─ page_key (TEXT) → page_definitions
    └─ enabled (BOOLEAN)
```

---

## 🔗 **RELAȚIILE CHEIE:**

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ OPERATORS    │←──────│   DRIVERS    │──────→│  VEHICLES    │
│organizations │       │   drivers    │       │  vehicles    │
└──────────────┘       └──────────────┘       └──────────────┘
       │                      │
       │                      │
       ↓                      ↓
┌──────────────┐       ┌──────────────┐
│  BOOKINGS    │←──────│  CUSTOMERS   │
│  bookings    │       │  customers   │
└──────────────┘       └──────────────┘
       │
       ↓
┌──────────────┐
│   PRICING    │
│booking_pricing│
└──────────────┘
```

---

## ⭐ **SCOPING PENTRU OPERATOR:**

### **✅ PERFECT PENTRU MULTI-TENANT!**

```sql
-- Operator vede doar șoferii săi:
SELECT * FROM drivers 
WHERE operator_id = CURRENT_OPERATOR_ID;

-- Operator vede doar booking-urile șoferilor săi:
SELECT * FROM bookings 
WHERE organization_id = CURRENT_OPERATOR_ID;

-- SAU prin drivers:
SELECT b.* FROM bookings b
JOIN drivers d ON d.id = b.assigned_driver_id
WHERE d.operator_id = CURRENT_OPERATOR_ID;

-- Operator vede doar vehiculele sale:
SELECT * FROM vehicles 
WHERE organization_id = CURRENT_OPERATOR_ID;
```

---

## 💰 **PRICING & COMMISSIONS:**

### **STRUCTURA ACTUALĂ:**

```typescript
booking_pricing:
├─ base_price: 100€          ← Prețul inițial
├─ platform_commission: 20€  ← Comisionul platformei (20%)
├─ operator_commission: 10€  ← Comisionul operatorului (10%)
└─ total: 100€               ← Total plătit de client

CALCULE:
- Client plătește: 100€
- Platformă primește: 20€ (20%)
- Operator primește: 100€ - 20€ = 80€
- Din 80€, operator plătește șoferului: 80€ - 10€ = 70€
- Șofer primește: 70€
```

### **CE VEDE FIECARE:**

```typescript
// ADMIN vede (FULL ACCESS):
{
  totalPrice: 100€,
  platformCommission: 20€,     // câștig platformă
  operatorCommission: 10€,     // câștig operator
  driverPayout: 70€            // plata șofer
}

// OPERATOR vede (DUPĂ COMISION PLATFORMĂ):
{
  totalPrice: 80€,             // 100 - 20 (după comision platformă)
  operatorCommission: 10€,     // câștigul său
  driverPayout: 70€            // plata către șofer
}

// DRIVER vede:
{
  totalPrice: 70€              // ce primește el
}
```

---

## ✅ **SCALABILITATE:**

### **1. ROW-LEVEL SECURITY (RLS) - READY!**

```sql
-- Policy pentru operators:
CREATE POLICY "operators_see_own_drivers"
ON drivers FOR SELECT
USING (operator_id = auth.uid());

CREATE POLICY "operators_see_own_bookings"
ON bookings FOR SELECT
USING (
  organization_id = (
    SELECT id FROM organizations 
    WHERE auth.uid() IN (SELECT user_id FROM operator_users)
  )
);
```

### **2. MODULAR & CLEAN:**

✅ **Separarea clară:**
- `organizations` - Operatorii (scalabil pentru mai mulți)
- `drivers` cu `operator_id` - Fiecare șofer aparține unui operator
- `bookings` cu `organization_id` - Fiecare booking legat de operator
- `booking_pricing` - Comisioane separate și flexibile

✅ **Relații bine definite:**
- Foreign keys corecte
- Cascade delete logic
- Indexes pe coloane cheie

✅ **Flexibilitate:**
- Poți adăuga noi operatori ușor
- Poți schimba comisioane per operator
- Poți avea operatori cu rate diferite

---

## 🎯 **PENTRU IMPLEMENTARE OPERATOR SCOPED:**

### **CE TREBUIE FĂCUT:**

1. **RLS Policies** (3-4 ore)
   ```sql
   - operators_see_own_drivers
   - operators_see_own_bookings
   - operators_see_own_vehicles
   ```

2. **API Functions cu Scope** (2-3 ore)
   ```typescript
   - getOperatorDashboard(operatorId)
   - getOperatorBookings(operatorId)
   - getOperatorDrivers(operatorId)
   ```

3. **Field Transformations** (2-3 ore)
   ```typescript
   - Transform prices (după comision platformă)
   - Calculate operator earnings
   - Calculate driver payouts
   ```

4. **Dashboard Personalizat** (3-4 ore)
   ```typescript
   - /operator/dashboard cu metrics scope-uite
   - Grafice doar pentru datele operatorului
   - Stats cu sume corecte
   ```

---

## ✅ **CONCLUZIE:**

### **BAZA DE DATE ESTE:**

✅ **SCALABILĂ** - Poți adăuga 100+ operatori fără probleme  
✅ **MODULARĂ** - Fiecare entitate e separată și clară  
✅ **RELAȚIONALĂ** - Foreign keys corecte  
✅ **READY FOR MULTI-TENANT** - operator_id/organization_id peste tot  
✅ **FLEXIBILĂ** - Comisioane separate, configurabile  

### **CE LIPSEȘTE (PENTRU OPERATOR SCOPED):**

❌ RLS Policies (trebuie create)  
❌ API functions scope-uite (trebuie modificate)  
❌ Field transformations (trebuie implementate)  
❌ Dashboard personalizat (trebuie creat)  

### **TIMPUL ESTIMAT TOTAL:**

⏱️ **10-12 ore pentru sistem complet operator scoped**

---

## 🚀 **NEXT STEPS:**

1. ✅ Permissions system (DONE)
2. 🔄 RLS Policies (NEXT)
3. 🔄 API scoping
4. 🔄 Operator dashboard
5. 🔄 Field transformations

**Gata să începem? 🎯**
