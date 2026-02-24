# AUDIT MAPARE APPS — BAZA NOUĂ CRISTI

**Data:** 24 Feb 2026  
**Scop:** Verificare ce poate fi legat ACUM între Admin App + Driver App și baza nouă Cristi (ZERO modificări DB)

---

## 📊 REZUMAT EXECUTIV

**Status baza nouă Cristi:**
- ✅ 24 tabele create (organizations, customers, bookings, booking_legs, etc.)
- ✅ Multi-tenancy funcțional (organization_id pe tabele principale)
- ✅ RLS policies active
- ✅ Landing Page funcționează PERFECT

**Ce poate fi legat ACUM:**
- ✅ `customers` — COMPLET funcțional
- ✅ `bookings` — COMPLET funcțional
- ✅ `booking_legs` — COMPLET funcțional
- ✅ `booking_payments` — COMPLET funcțional
- ✅ `organizations` — PARȚIAL (lipsesc coloane pentru Admin App)
- ✅ `organization_members` — PARȚIAL (lipsesc coloane pentru Admin App)

**Ce LIPSEȘTE complet:**
- ❌ `drivers` — Admin App + Driver App NU pot funcționa
- ❌ `vehicles` — Admin App + Driver App NU pot funcționa
- ❌ `driver_documents` — Admin App NU poate funcționa
- ❌ `vehicle_documents` — Admin App NU poate funcționa
- ❌ `notifications` — Admin App NU poate funcționa
- ❌ `live_chat_sessions` — Admin App NU poate funcționa
- ❌ `live_chat_messages` — Admin App NU poate funcționa
- ❌ `driver_performance_stats` — Admin App NU poate funcționa
- ❌ `support_tickets` — Admin App NU poate funcționa
- ❌ `payment_transactions` — Admin App NU poate funcționa
- ❌ `pricing_config` — Admin App NU poate funcționa
- ❌ `reviews` — Admin App NU poate funcționa

---

## 🎯 CE TABELE EXISTĂ ÎN BAZA NOUĂ CRISTI

### **Tabele COMPLETE (pot fi legate ACUM):**

| Tabel | Rows | Coloane | Status Admin App | Status Driver App |
|-------|------|---------|------------------|-------------------|
| `customers` | 3 | 13 | ✅ FUNCȚIONAL | ✅ FUNCȚIONAL |
| `bookings` | 47 | 22 | ✅ FUNCȚIONAL | ✅ FUNCȚIONAL |
| `booking_legs` | 46 | 31 | ✅ FUNCȚIONAL | ✅ FUNCȚIONAL |
| `booking_payments` | 40 | ~15 | ✅ FUNCȚIONAL | ✅ FUNCȚIONAL |
| `booking_jobs` | 28 | ~14 | ✅ FUNCȚIONAL | ⚠️ PARȚIAL |
| `refunds` | 0 | ~10 | ✅ FUNCȚIONAL | ❌ NU FOLOSEȘTE |

### **Tabele PARȚIALE (lipsesc coloane pentru Admin App):**

| Tabel | Rows | Coloane existente | Coloane lipsă pentru Admin App |
|-------|------|-------------------|--------------------------------|
| `organizations` | 2 | 7 | `code`, `contact_email`, `contact_phone`, `city`, `country`, `rating_average`, `review_count`, `updated_at`, `deleted_at` |
| `organization_members` | 2 | 5 | `email`, `first_name`, `last_name`, `name`, `phone`, `permissions`, `is_active`, `updated_at`, `deleted_at` |

### **Tabele AUXILIARE (funcționale):**

| Tabel | Rows | Status |
|-------|------|--------|
| `vehicle_categories` | 4 | ✅ OK |
| `vehicle_models` | 6 | ✅ OK |
| `billing_entities` | 2 | ✅ OK |
| `customer_preferences` | 2 | ✅ OK |
| `service_items` | 34 | ✅ OK |
| `premium_features` | 5 | ✅ OK |
| `coupons` | 0 | ✅ OK |
| `coupon_redemptions` | 0 | ✅ OK |
| `subscriptions` | 0 | ✅ OK |

---

## ❌ CE TABELE LIPSESC COMPLET

### **CRITICE pentru Admin App + Driver App:**

| Tabel | Folosit de | Fișiere afectate | Prioritate |
|-------|-----------|------------------|------------|
| **`drivers`** | Admin App + Driver App | 50+ fișiere | 🔴 CRITICĂ |
| **`vehicles`** | Admin App + Driver App | 30+ fișiere | 🔴 CRITICĂ |
| **`driver_documents`** | Admin App | 15+ fișiere | 🔴 CRITICĂ |
| **`vehicle_documents`** | Admin App | 10+ fișiere | 🔴 CRITICĂ |
| **`notifications`** | Admin App | 20+ fișiere | 🔴 CRITICĂ |
| **`live_chat_sessions`** | Admin App | 5+ fișiere | 🟡 MEDIE |
| **`live_chat_messages`** | Admin App | 5+ fișiere | 🟡 MEDIE |
| **`driver_performance_stats`** | Admin App | 10+ fișiere | 🟡 MEDIE |
| **`support_tickets`** | Admin App | 10+ fișiere | 🟡 MEDIE |
| **`payment_transactions`** | Admin App | 5+ fișiere | 🟡 MEDIE |
| **`pricing_config`** | Admin App | 10+ fișiere | 🟡 MEDIE |
| **`reviews`** | Admin App | 5+ fișiere | 🟡 MEDIE |

---

## 📋 FIȘIERE ADMIN APP — CE TREBUIE MODIFICAT

### **1. DRIVERS (50+ fișiere afectate):**

**Fișiere CRITICE care NU pot funcționa:**
```
apps/admin/entities/driver/api/
  ├── driverCrudOperations.ts ❌ — .from('drivers')
  ├── driverLifecycle.ts ❌ — .from('drivers')
  ├── driverStats.ts ❌ — .from('drivers')
  ├── driverDocuments.ts ❌ — .from('driver_documents')
  ├── listPendingDrivers.ts ❌ — .from('drivers')
  
apps/admin/features/shared/driver-profile/hooks/
  ├── useDriverProfile.ts ❌ — .from('drivers')
  ├── useDriverActions.ts ❌ — .from('drivers')
  ├── useDriverDocuments.ts ❌ — .from('driver_documents')
  ├── useDriverVehicle.ts ❌ — .from('vehicles')
  
apps/admin/features/admin/driver-assignment/hooks/
  ├── useDriverAssignment.ts ❌ — .from('drivers')
  
apps/admin/features/admin/users-table/hooks/
  ├── useOperatorDrivers.ts ❌ — .from('drivers')
```

**Acțiune:** Toate aceste fișiere vor da eroare "relation 'drivers' does not exist"

---

### **2. VEHICLES (30+ fișiere afectate):**

**Fișiere CRITICE care NU pot funcționa:**
```
apps/admin/entities/vehicle/api/
  ├── vehicleApi.ts ❌ — .from('vehicles')
  ├── createVehicle.ts ❌ — .from('vehicles')
  ├── updateVehicle.ts ❌ — .from('vehicles')
  ├── deleteVehicle.ts ❌ — .from('vehicles')
  ├── listVehicles.ts ❌ — .from('vehicles')
  ├── uploadVehicleDocument.ts ❌ — .from('vehicle_documents')
  ├── listVehicleDocuments.ts ❌ — .from('vehicle_documents')
```

**Acțiune:** Toate aceste fișiere vor da eroare "relation 'vehicles' does not exist"

---

### **3. NOTIFICATIONS (20+ fișiere afectate):**

**Fișiere CRITICE care NU pot funcționa:**
```
apps/admin/entities/notification/api/
  ├── notificationApi.ts ❌ — .from('notifications')
  ├── broadcastNotification.ts ❌ — .from('notifications')
  ├── sendNotification.ts ❌ — .from('notifications')
  ├── bulkOperations.ts ❌ — .from('notifications')
  
apps/admin/features/admin/notifications-management/hooks/
  ├── useBulkNotifications.ts ❌ — .from('notifications')
```

**Acțiune:** Toate aceste fișiere vor da eroare "relation 'notifications' does not exist"

---

### **4. SUPPORT TICKETS (10+ fișiere afectate):**

**Fișiere CRITICE care NU pot funcționa:**
```
apps/admin/features/admin/support-tickets/hooks/
  ├── useSupportTickets.ts ❌ — .from('support_tickets')
  ├── useTicketActions.ts ❌ — .from('support_tickets')
  ├── useTicketStats.ts ❌ — .from('support_tickets')
  ├── useCreateTicket.ts ❌ — .from('support_tickets')
```

**Acțiune:** Toate aceste fișiere vor da eroare "relation 'support_tickets' does not exist"

---

### **5. PRICING CONFIG (10+ fișiere afectate):**

**Fișiere CRITICE care NU pot funcționa:**
```
apps/admin/entities/pricing/api/
  ├── pricingPolicies.ts ❌ — .from('pricing_config')
  ├── pricingRates.ts ❌ — .from('pricing_config')
  ├── pricingCrudOperations.ts ❌ — .from('pricing_config')
```

**Acțiune:** Toate aceste fișiere vor da eroare "relation 'pricing_config' does not exist"

---

### **6. DOCUMENTS (15+ fișiere afectate):**

**Fișiere CRITICE care NU pot funcționa:**
```
apps/admin/entities/document/api/
  ├── documentQueries.ts ❌ — .from('driver_documents')
  ├── documentMutations.ts ❌ — .from('driver_documents')
  ├── uploadDocument.ts ❌ — .from('driver_documents')
```

**Acțiune:** Toate aceste fișiere vor da eroare "relation 'driver_documents' does not exist"

---

## 📋 FIȘIERE CARE POT FUNCȚIONA ACUM

### **✅ BOOKINGS (FUNCȚIONAL 100%):**

```
apps/admin/entities/booking/api/
  ├── listBookings.ts ✅ — .from('bookings'), .from('booking_legs')
  ├── bookingApi.ts ✅ — .from('bookings')
  ├── createTestBooking.ts ✅ — .from('bookings')
  
apps/admin/entities/booking-leg/api/
  ├── bookingLegApi.ts ✅ — .from('booking_legs')
```

**Acțiune:** Aceste fișiere pot fi legate ACUM la baza nouă Cristi

---

### **✅ CUSTOMERS (FUNCȚIONAL 100%):**

```
apps/admin/entities/customer/api/
  ├── customerApi.ts ✅ — .from('customers')
```

**Acțiune:** Aceste fișiere pot fi legate ACUM la baza nouă Cristi

---

### **✅ PAYMENTS (FUNCȚIONAL 100%):**

```
apps/admin/entities/payment/api/
  ├── paymentApi.ts ✅ — .from('booking_payments')
  ├── processRefund.ts ✅ — .from('refunds')
```

**Acțiune:** Aceste fișiere pot fi legate ACUM la baza nouă Cristi

---

### **⚠️ ORGANIZATIONS (PARȚIAL — lipsesc coloane):**

```
apps/admin/entities/operator/api/
  ├── operatorApi.ts ⚠️ — .from('organizations')
  
apps/admin/features/shared/settings-profile/hooks/
  ├── useOperatorProfileData.ts ⚠️ — .from('organizations')
```

**Acțiune:** Aceste fișiere pot funcționa PARȚIAL, dar vor da eroare la coloane lipsă (code, contact_email, etc.)

---

## 🎯 PLAN DE ACȚIUNE — CE TREBUIE FĂCUT

### **FAZA 1 — CE POATE FI LEGAT ACUM (fără modificări DB):**

**Fișiere care pot fi legate imediat:**
1. ✅ Toate fișierele care folosesc `bookings` (100+ fișiere)
2. ✅ Toate fișierele care folosesc `booking_legs` (50+ fișiere)
3. ✅ Toate fișierele care folosesc `customers` (20+ fișiere)
4. ✅ Toate fișierele care folosesc `booking_payments` (10+ fișiere)
5. ✅ Toate fișierele care folosesc `refunds` (5+ fișiere)

**Acțiune:**
- Schimbă Supabase project URL în `.env` de la baza veche la baza nouă Cristi
- Testează Landing Page — ar trebui să funcționeze PERFECT

---

### **FAZA 2 — CE TREBUIE CREAT (PAS 1-4):**

**Tabele CRITICE care trebuie create:**
1. 🔴 `drivers` — PAS 1
2. 🔴 `vehicles` — PAS 2
3. 🔴 `driver_documents` — PAS 2
4. 🔴 `vehicle_documents` — PAS 2
5. 🔴 `notifications` — PAS 4
6. 🟡 `live_chat_sessions` — PAS 4
7. 🟡 `live_chat_messages` — PAS 4
8. 🟡 `driver_performance_stats` — PAS 3
9. 🟡 `support_tickets` — PAS 6
10. 🟡 `payment_transactions` — PAS 6
11. 🟡 `pricing_config` — PAS 6
12. 🟡 `reviews` — PAS 6

**Acțiune:**
- Cristi execută PAS 1-4 (drivers, vehicles, documents, stats, notifications, chat)
- După PAS 1-4, Admin App + Driver App pot fi legate complet

---

### **FAZA 3 — CE TREBUIE EXTINS (PAS 5):**

**Tabele care trebuie extinse cu coloane:**
1. ⚠️ `organizations` — ADD 9 coloane (code, contact_email, etc.)
2. ⚠️ `organization_members` — ADD 9 coloane (email, first_name, etc.)

**Acțiune:**
- Cristi execută PAS 5 (UPDATE tabele existente)
- După PAS 5, Admin App poate folosi toate features pentru organizations

---

## 📊 STATISTICI FINALE

**Tabele în baza nouă Cristi:** 24  
**Tabele funcționale pentru Admin App:** 8 (33%)  
**Tabele lipsă pentru Admin App:** 12 (67%)  

**Fișiere Admin App:** ~300+  
**Fișiere care pot funcționa ACUM:** ~100 (33%)  
**Fișiere care NU pot funcționa:** ~200 (67%)  

**Concluzie:**
- ✅ Landing Page poate fi legată ACUM (bookings, customers funcționează)
- ❌ Admin App NU poate fi legată (lipsesc drivers, vehicles, notifications)
- ❌ Driver App NU poate fi legată (lipsesc drivers, vehicles)

**Next Steps:**
1. Cristi execută PAS 1-4 (CREATE tabele lipsă)
2. După PAS 1-4 → Admin App + Driver App pot fi legate
3. Cristi execută PAS 5 (UPDATE tabele existente)
4. După PAS 5 → Admin App funcționează 100%
