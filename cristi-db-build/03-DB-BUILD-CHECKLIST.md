# 03 — CHECKLIST CONSTRUCȚIE DB NOUĂ

**Ordinea contează!** Construiește în această ordine pentru că FK-urile depind unele de altele.

---

## ⚠️ STATUS — CE AI FĂCUT DEJA

✅ **FAZA 0 — Bookings și Pricing (GATA — 17 tabele)**
- `bookings`, `booking_legs`, `booking_payments` ✅
- `customers`, `customer_preferences`, `billing_entities` ✅
- `client_booking_quotes`, `client_leg_quotes` ✅
- `internal_booking_financials`, `internal_leg_financials` ✅
- `coupons`, `coupon_redemptions`, `refunds` ✅
- `vehicle_categories`, `vehicle_models`, `service_items`, `premium_features` ✅

**PROBLEMA:** `bookings.organization_id` există dar **tabelul `organizations` nu există**.  
→ Trebuie să creezi `organizations` și să adaugi FK-ul pe `bookings`.

---

## FAZA 1 — Fundație (fără dependențe) — ÎNCEPE DE AICI

```
[ ] 1. organizations
[ ] 2. admin_users          ← depinde de organizations
[ ] 3. user_organization_roles ← depinde de organizations
[ ] 4. customers            ← depinde de organizations
[ ] 5. drivers              ← depinde de organizations
[ ] 6. role_permissions     ← independent
[ ] 7. pricing_config       ← depinde de organizations
[ ] 8. platform_settings    ← depinde de organizations
```

---

## FAZA 2 — Bookings Core

```
[ ] 9.  bookings            ← depinde de customers, organizations
[ ] 10. booking_legs        ← depinde de bookings, drivers, vehicles*
[ ] 11. booking_pricing     ← depinde de bookings
[ ] 12. booking_segments    ← depinde de bookings
[ ] 13. booking_services    ← depinde de bookings
```
> *vehicles se creează în Faza 3, deci `assigned_vehicle_id` poate fi nullable inițial

---

## FAZA 3 — Vehicule și Documente

```
[ ] 14. vehicles            ← depinde de drivers, organizations
[ ] 15. vehicle_approval    ← depinde de vehicles, admin_users
[ ] 16. vehicle_service_types ← depinde de vehicles, admin_users
[ ] 17. driver_documents    ← depinde de drivers, admin_users
[ ] 18. vehicle_documents   ← depinde de vehicles, admin_users
```

---

## FAZA 4 — Driver Stats și Earnings

```
[ ] 19. driver_performance_stats ← depinde de drivers
[ ] 20. driver_earnings          ← depinde de drivers, bookings, booking_legs
[ ] 21. driver_ratings           ← depinde de drivers, bookings, customers
[ ] 22. driver_lifecycle_events  ← depinde de drivers, admin_users
```

---

## FAZA 5 — Preferințe Driver

```
[ ] 23. driver_app_preferences           ← depinde de drivers
[ ] 24. driver_notification_preferences  ← depinde de drivers
```

---

## FAZA 6 — Comunicare și Support

```
[ ] 25. notifications           ← depinde de auth.users
[ ] 26. support_tickets         ← depinde de drivers, organizations, admin_users
[ ] 27. support_ticket_messages ← depinde de support_tickets
[ ] 28. live_chat_sessions      ← depinde de drivers, admin_users
[ ] 29. live_chat_messages      ← depinde de live_chat_sessions, drivers
```

---

## FAZA 7 — Financiar

```
[ ] 30. refunds    ← depinde de bookings, admin_users
[ ] 31. disputes   ← depinde de bookings, admin_users
```

---

## FAZA 8 — Workflow și Acțiuni

```
[ ] 32. booking_leg_actions ← depinde de booking_legs, drivers
```

---

## FAZA 9 — Triggers și Funcții

```
[ ] T1. Trigger: update_updated_at() — pe TOATE tabelele cu updated_at
[ ] T2. Trigger: on_booking_leg_completed → INSERT în driver_earnings
[ ] T3. Trigger: on_driver_approved → INSERT în driver_performance_stats
[ ] T4. Trigger: generate_booking_reference() — pe bookings BEFORE INSERT
[ ] T5. Trigger: generate_ticket_number() — pe support_tickets BEFORE INSERT
```

---

## FAZA 10 — RLS Policies

Ordinea: mai întâi activezi RLS, apoi adaugi policies.

```
[ ] R1. organizations — super_admin vede tot, operator vede propria org
[ ] R2. admin_users — super_admin vede tot, admin vede propria org
[ ] R3. drivers — operator vede driverii din org sa, driver vede doar el
[ ] R4. bookings — operator vede booking-urile din org sa
[ ] R5. booking_legs — driver vede doar leg-urile asignate lui
[ ] R6. driver_documents — driver vede doar documentele lui, admin/operator vede org
[ ] R7. vehicle_documents — idem
[ ] R8. notifications — user vede doar notificările lui (user_id = auth.uid())
[ ] R9. driver_earnings — driver vede doar câștigurile lui
[ ] R10. support_tickets — driver vede doar ticketele lui
[ ] R11. driver_app_preferences — driver vede/modifică doar ale lui
[ ] R12. driver_notification_preferences — idem
[ ] R13. live_chat_sessions — driver vede sesiunile lui, operator vede org sa
[ ] R14. live_chat_messages — prin sesiune
```

---

## FAZA 11 — Realtime

Activează Realtime pe aceste tabele în Supabase Dashboard:

```
[ ] booking_legs        ← status updates live
[ ] notifications       ← notificări instant
[ ] live_chat_messages  ← chat live
[ ] live_chat_sessions  ← status sesiune
[ ] drivers             ← online status (heartbeat locație)
```

---

## FAZA 12 — Edge Functions (opțional, după DB gata)

```
[ ] send-push-notification    ← trimite push via Expo la driver
[ ] broadcast-notification    ← trimite la grup de driveri
[ ] get-dashboard-charts      ← RPC pentru BI (poate fi funcție SQL)
[ ] process-driver-approval   ← activare driver după documente
```

---

## ⚠️ DECIZII CHEIE înainte de a începe

### Decizia 1: Numele coloanelor în `booking_legs`

**Opțiunea A (recomandată):** Folosești numele vechi
```
parent_booking_id, pickup_location, destination,
destination_lat, destination_lng, vehicle_category (text),
vehicle_model (text), leg_price, driver_payout
```
→ Zero modificări în codul admin și driver app ✅

**Opțiunea B:** Folosești numele noi + VIEW compatibil
```sql
CREATE VIEW booking_legs_compat AS
SELECT
  id,
  booking_id AS parent_booking_id,
  pickup_address AS pickup_location,
  dropoff_address AS destination,
  dropoff_lat AS destination_lat,
  dropoff_lng AS destination_lng,
  ...
FROM booking_legs;
```
→ DB mai curată, dar necesită VIEW + modificări cod ⚠️

### Decizia 2: `bookings` — `category`/`trip_type` vs `booking_type` enum

Codul admin și driver folosesc `category` și `trip_type` ca text.  
DB nouă are `booking_type` enum.  
→ Fie adaugi `category` și `trip_type` ca text, fie modifici codul.

### Decizia 3: `customers.name`

Driver app face JOIN și cere `name` direct.  
→ Fie adaugi coloana `name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED`  
→ Fie modifici codul să folosească `first_name || ' ' || last_name`

---

## 📊 Rezumat — Câte tabele în total

| Fază | Tabele | Status |
|---|---|---|
| Faza 1 | 8 tabele fundație | |
| Faza 2 | 5 tabele bookings | |
| Faza 3 | 5 tabele vehicule/documente | |
| Faza 4 | 4 tabele stats/earnings | |
| Faza 5 | 2 tabele preferințe | |
| Faza 6 | 5 tabele comunicare | |
| Faza 7 | 2 tabele financiar | |
| Faza 8 | 1 tabel workflow | |
| **TOTAL** | **32 tabele** | |

**DB veche:** 90+ tabele (din care 30+ goale, 5 backup, 20+ neutilizate)  
**DB nouă:** 32 tabele — toate folosite, toate cu FK-uri corecte

---

## 🔗 Diagrama relațiilor principale

```
auth.users (Supabase)
    ├── admin_users (auth_user_id)
    ├── user_organization_roles (user_id)
    ├── drivers (auth_user_id)
    └── customers (auth_user_id)

organizations
    ├── admin_users (organization_id)
    ├── drivers (organization_id)
    ├── customers (organization_id)
    ├── bookings (organization_id)
    ├── vehicles (organization_id)
    └── pricing_config (organization_id)

drivers
    ├── booking_legs (assigned_driver_id)
    ├── driver_documents (driver_id)
    ├── vehicles (driver_id)
    ├── driver_earnings (driver_id)
    ├── driver_performance_stats (driver_id) [1:1]
    ├── driver_app_preferences (driver_id) [1:1]
    ├── driver_notification_preferences (driver_id) [1:1]
    ├── driver_lifecycle_events (driver_id)
    ├── driver_ratings (driver_id)
    ├── support_tickets (driver_id)
    ├── live_chat_sessions (driver_id)
    └── live_chat_messages (driver_id)

bookings
    ├── booking_legs (parent_booking_id)
    ├── booking_pricing (booking_id)
    ├── booking_segments (booking_id)
    ├── booking_services (booking_id)
    ├── driver_earnings (booking_id)
    ├── driver_ratings (booking_id)
    ├── refunds (booking_id)
    └── disputes (booking_id)

booking_legs
    ├── booking_leg_actions (booking_leg_id)
    └── driver_earnings (booking_leg_id)

vehicles
    ├── vehicle_documents (vehicle_id)
    ├── vehicle_approval (vehicle_id)
    └── vehicle_service_types (vehicle_id)
```
