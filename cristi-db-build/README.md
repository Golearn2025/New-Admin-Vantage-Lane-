# 🗂️ DATABASE BUILD GUIDE — Pentru Cristi

**Proiect:** Vantage Lane — Bază de Date Enterprise-Ready  
**Status:** 🚧 În construcție  
**Baza nouă:** `ruskhucrvjvuuzwlboqn`  
**Locație:** `/cristi-db-build/` în proiectul admin

---

## 📁 STRUCTURA FOLDER

```
cristi-db-build/
├── README.md (acest fișier)
│
├── CRISTI-PAS-1-ORGANIZATIONS-ROLES.md ✅
├── CRISTI-PAS-2-VEHICLES-DOCUMENTS.md ✅
├── CRISTI-PAS-3-STATS-PREFERENCES.md ✅
├── CRISTI-PAS-4-COMUNICARE.md ✅
├── CRISTI-PAS-5-UPDATE-TABELE-EXISTENTE.md ✅ 🔴 CRITIC
│
├── 00-ROLES-AND-ARCHITECTURE.md (context arhitectură)
├── 01-ADMIN-APP-MAPPING.md (ce folosește admin app)
├── 02-DRIVER-APP-MAPPING.md (ce folosește driver app)
└── 03-DB-BUILD-CHECKLIST.md (checklist complet)
```

---

## 🎯 START AICI

### **� PRIORITATE CRITICĂ: PAS 5 — UPDATE TABELE EXISTENTE**

**� Citește PRIMUL:** `CRISTI-PAS-5-UPDATE-TABELE-EXISTENTE.md`

**De ce e CRITIC:**
- ❌ Fără `organization_id` pe `booking_legs`, Admin Vantage Lane vede legs London Cabs
- ❌ Fără `organization_id` pe `booking_payments`, Admin Vantage Lane vede payments London Cabs
- ❌ Fără `organization_id` pe `refunds`, Admin Vantage Lane vede refunds London Cabs
- ❌ **ZERO izolare între organizații!**

**Conține:**
- 6 UPDATE-uri SQL pentru tabele existente
- Migrare date pentru `organization_id`
- RLS policies pentru izolare completă
- Verificări SQL după fiecare UPDATE

---

### **După PAS 5, citește:** `CRISTI-PAS-1-ORGANIZATIONS-ROLES.md`

**Conține:**
- 5 tabele noi (organizations UPDATE, organization_members UPDATE, drivers CREATE, customers UPDATE, corporate_employees CREATE)
- Structura completă pentru fiecare tabel
- Relații (FK-uri)
- Verificări SQL
- Instrucțiuni pas cu pas

---

## 📊 STATUS CURENT BAZA NOUĂ

### ✅ CE AI CREAT DEJA (17 tabele)

| Tabel | Coloane | Status |
|-------|---------|--------|
| `bookings` | 22 | ✅ Există |
| `booking_legs` | 31 | ✅ Există |
| `booking_payments` | 12 | ✅ Există |
| `customers` | 12 | ✅ Există (va fi actualizat în PAS 1) |
| `customer_preferences` | 8 | ✅ Există |
| `billing_entities` | 9 | ✅ Există |
| `client_booking_quotes` | 19 | ✅ Există |
| `client_leg_quotes` | 19 | ✅ Există |
| `internal_booking_financials` | 10 | ✅ Există |
| `internal_leg_financials` | 11 | ✅ Există |
| `coupons` | 15 | ✅ Există |
| `coupon_redemptions` | 9 | ✅ Există |
| `refunds` | 12 | ✅ Există |
| `vehicle_categories` | 3 | ✅ Există |
| `vehicle_models` | 4 | ✅ Există |
| `service_items` | 5 | ✅ Există |
| `premium_features` | 3 | ✅ Există |

**Total:** 17 tabele — **PĂSTRĂM TOATE EXACT CUM SUNT!**

---

### ❌ CE LIPSEȘTE (pentru Admin App + Driver App)

| Categorie | Tabele Lipsă | Prioritate | Fișier |
|-----------|--------------|------------|--------|
| **UPDATE Tabele Existente** | 6 UPDATE-uri | 🔴 CRITICĂ | PAS 5 ✅ |
| **Organizations + Roluri** | 5 tabele | 🔴 CRITICĂ | PAS 1 ✅ |
| **Vehicles + Documents** | 5 tabele | 🔴 CRITICĂ | PAS 2 ✅ |
| **Stats + Preferences** | 4 tabele | 🟡 MEDIE | PAS 3 ✅ |
| **Comunicare** | 3 tabele | 🟡 MEDIE | PAS 4 ✅ |
| **Payments + Support + Reviews** | 4 tabele | 🟡 MEDIE | PAS 6 ⏳ |

---

### ⚠️ AUDIT COMPLET — CE MAI LIPSEȘTE (PAS 6)

**Bazat pe verificare cod Admin App:**

| Tabel | Folosit de | Prioritate | Status |
|-------|-----------|------------|--------|
| `payment_transactions` | Admin App (invoices) | 🟡 MEDIE | ❌ Lipsește |
| `pricing_config` | Admin App (pricing management) | 🟡 MEDIE | ❌ Lipsește |
| `support_tickets` | Admin App (support) | 🟡 MEDIE | ❌ Lipsește |
| `reviews` / `ratings` | Admin App (reviews) | 🟡 MEDIE | ❌ Lipsește |

**Notă:** PAS 6 va fi creat după ce finalizezi PAS 1-5

---

## 📋 ORDINEA DE LUCRU

### **FAZA 1 — PAS 5 (CRITIC — UPDATE tabele existente):**
1. 🔴 Citește `CRISTI-PAS-5-UPDATE-TABELE-EXISTENTE.md`
2. 🔴 UPDATE `organizations` — ADD coloane lipsă
3. 🔴 UPDATE `organization_members` — ADD coloane lipsă
4. 🔴 UPDATE `customers` — ADD `customer_type`
5. 🔴 UPDATE `booking_legs` — ADD `organization_id` (CRITIC pentru izolare)
6. 🔴 UPDATE `booking_payments` — ADD `organization_id`
7. 🔴 UPDATE `refunds` — ADD `organization_id`
8. 🔴 Rulează verificările SQL din PAS 5
9. 🔴 Testează izolare: Admin Vantage Lane NU vede date London Cabs

### **FAZA 2 — PAS 1-4 (CREATE tabele noi):**
10. ✅ Citește `CRISTI-PAS-1-ORGANIZATIONS-ROLES.md`
11. ✅ CREATE `drivers`, `corporate_employees`
12. ✅ Citește `CRISTI-PAS-2-VEHICLES-DOCUMENTS.md`
13. ✅ CREATE `vehicles`, `driver_documents`, `vehicle_documents`, `vehicle_approval`, `vehicle_services`
14. ✅ Citește `CRISTI-PAS-3-STATS-PREFERENCES.md`
15. ✅ CREATE `driver_performance_stats`, `driver_app_preferences`, `driver_notification_preferences`, `driver_lifecycle_events`
16. ✅ Citește `CRISTI-PAS-4-COMUNICARE.md`
17. ✅ CREATE `notifications`, `live_chat_sessions`, `live_chat_messages`
18. ✅ Rulează toate verificările SQL
19. ✅ Testează Admin App + Driver App

### **FAZA 3 — PAS 6 (OPȚIONAL — tabele suplimentare):**
20. ⏳ Așteaptă PAS 6 pentru `payment_transactions`, `pricing_config`, `support_tickets`, `reviews`

---

## 📚 FIȘIERE REFERINȚĂ (opțional)

- `00-ROLES-AND-ARCHITECTURE.md` — Explicații arhitectură, roluri, RLS
- `01-ADMIN-APP-MAPPING.md` — Ce tabele folosește admin app
- `02-DRIVER-APP-MAPPING.md` — Ce tabele folosește driver app
- `03-DB-BUILD-CHECKLIST.md` — Checklist complet toate tabelele

---

**Succes! 🚀**
