# 02 — DRIVER APP — Mapping Complet DB

**Bazat pe:** Cod real din `src/features/` al app-ului driver  
**Principiu:** Doar ce cere codul real — zero tabele în plus

---

## TABELE FOLOSITE DE DRIVER APP

### 1. `drivers`
Fișiere: `auth-api.ts`, `driver-api.ts`, `useSignin.ts`, `driver-status-api.ts`, `profile-api.ts`, `device-token-service.ts`

| Coloană | Tip | Operație |
|---|---|---|
| `id` | uuid PK | toate |
| `auth_user_id` | uuid UNIQUE FK → auth.users | login, toate |
| `organization_id` | uuid FK → organizations | signup, vehicle queries |
| `first_name` | text NOT NULL | signup, profile |
| `last_name` | text NOT NULL | signup, profile |
| `name` | text | profile (display) |
| `email` | text | signup, profile |
| `phone` | text NOT NULL | signup, profile |
| `address` | text | signup |
| `status` | text | signin check |
| `is_active` | boolean | signin check, driver-status |
| `is_approved` | boolean | go-online check |
| `is_available` | boolean | driver-status toggle |
| `online_status` | text | driver-status ('online'/'offline') |
| `last_online_at` | timestamptz | driver-status |
| `profile_photo_url` | text | profile |
| `rating_average` | numeric | profile |
| `rating_count` | integer | profile |
| `current_latitude` | numeric | heartbeat GPS (la 15s) |
| `current_longitude` | numeric | heartbeat GPS |
| `location_updated_at` | timestamptz | heartbeat GPS |
| `current_device_token` | text | device-token-service |
| `last_device_login_at` | timestamptz | device-token-service |
| `profile_completed` | boolean | signup |
| `car_make` | text | signup (legacy) |
| `car_model` | text | signup (legacy) |
| `car_color` | text | signup (legacy) |
| `car_plate` | text | signup (legacy) |
| `navigation_preference` | text | settings |
| `created_at` | timestamptz | profile |
| `updated_at` | timestamptz | toate |

**Operații cheie:**
- `signOut` → UPDATE `online_status='offline', is_available=false`
- `upsertDriver` → INSERT/UPDATE la signup
- `getDriverByAuthId` → SELECT WHERE `auth_user_id = userId`
- `updateDeviceToken` → UPDATE `current_device_token, last_device_login_at`
- `setOnlineStatus` → UPDATE `online_status, is_available, last_online_at`

---

### 2. `booking_legs`
Fișiere: `jobs-queries.ts`, `accepted/queries.ts`, `status-actions.ts`, `driver-status-api.ts`, `earnings-api.ts`

> ⚠️ **CODUL FOLOSEȘTE ACESTE NUME EXACT — nu se pot schimba fără modificarea codului**

| Coloană | Tip | Operație |
|---|---|---|
| `id` | uuid PK | toate |
| `parent_booking_id` | uuid FK → bookings | jobs, accepted |
| `leg_number` | integer | jobs |
| `leg_type` | text | jobs |
| `vehicle_category` | text | jobs, accepted |
| `vehicle_model` | text | jobs, accepted |
| `pickup_location` | text | jobs, accepted |
| `destination` | text | jobs, accepted |
| `pickup_lat` | numeric | jobs, accepted |
| `pickup_lng` | numeric | jobs, accepted |
| `destination_lat` | numeric | jobs, accepted |
| `destination_lng` | numeric | jobs, accepted |
| `scheduled_at` | timestamptz | jobs, accepted |
| `distance_miles` | numeric | jobs, earnings |
| `duration_min` | integer | jobs |
| `assigned_driver_id` | uuid FK → drivers | jobs filter, accepted |
| `assigned_vehicle_id` | uuid FK → vehicles | jobs |
| `status` | text | toate |
| `leg_price` | numeric | jobs, accepted |
| `driver_payout` | numeric | earnings |
| `assigned_at` | timestamptz | accepted, accept job |
| `started_at` | timestamptz | status-actions (en_route) |
| `arrived_at_pickup` | timestamptz | status-actions (arrived) |
| `passenger_onboard_at` | timestamptz | status-actions (in_progress) |
| `completed_at` | timestamptz | status-actions, earnings |
| `cancelled_at` | timestamptz | cancel |
| `cancel_reason` | text | cancel |
| `cancelled_by` | text | cancel |
| `created_at` | timestamptz | jobs |
| `updated_at` | timestamptz | jobs |

**Operații cheie:**
- `getAvailableJobs` → SELECT WHERE `status='pending' AND assigned_driver_id IS NULL`
- `getAcceptedJobs` → SELECT WHERE `assigned_driver_id = driverId AND status IN ('assigned','en_route','arrived','in_progress')`
- `acceptJob` → UPDATE `assigned_driver_id, status='assigned', assigned_at`
- `updateStatus` → UPDATE status + timestamp corespunzător
- `cancelJob` → UPDATE `status='cancelled', cancelled_at, cancel_reason, cancelled_by`
- `checkActiveJobs` → SELECT count WHERE `assigned_driver_id = driverId AND status NOT IN ('completed','cancelled')`

**JOIN-uri folosite:**
```
booking_legs
  → bookings!parent_booking_id (reference, category, trip_type, notes, passenger_count, bag_count, currency)
    → customers!customer_id (first_name, last_name, name, phone)
```

---

### 3. `bookings`
Fișiere: via JOIN din `jobs-queries.ts`, `accepted/queries.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `reference` | text | afișat în job card |
| `customer_id` | uuid FK → customers | JOIN |
| `category` | text | afișat în job card |
| `trip_type` | text | afișat în job card |
| `notes` | text | note speciale pentru driver |
| `passenger_count` | integer | afișat în job card |
| `bag_count` | integer | afișat în job card |
| `currency` | text | pentru prețuri |
| `organization_id` | uuid FK → organizations | |

---

### 4. `customers`
Fișiere: via JOIN din `jobs-queries.ts`, `accepted/queries.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `first_name` | text | afișat în job |
| `last_name` | text | afișat în job |
| `name` | text | afișat în job (fallback) |
| `phone` | text | apel client |

---

### 5. `driver_documents`
Fișiere: `documents-api.ts`, `document-upload-api.ts`

| Coloană | Tip | Operație |
|---|---|---|
| `id` | uuid PK | toate |
| `driver_id` | uuid FK → drivers | toate |
| `document_type` | text NOT NULL | toate |
| `document_category` | text | upload ('driver') |
| `file_url` | text | toate |
| `file_name` | text | toate |
| `status` | text | toate |
| `expiry_date` | date | driver-status expired check |
| `upload_date` | timestamptz | toate |
| `rejection_reason` | text | nullable |
| `notes` | text | nullable |

**Tipuri documente driver:**
`profile_photo`, `driving_licence`, `electronic_counterpart`, `pco_licence`, `proof_of_identity`, `proof_of_address`, `bank_statement`

---

### 6. `vehicle_documents`
Fișiere: `documents-api.ts`, `document-upload-api.ts`

| Coloană | Tip | Operație |
|---|---|---|
| `id` | uuid PK | toate |
| `vehicle_id` | uuid FK → vehicles | toate |
| `document_type` | text NOT NULL | toate |
| `document_category` | text | upload ('vehicle') |
| `file_url` | text | toate |
| `file_name` | text | toate |
| `status` | text | toate |
| `expiry_date` | date | expired check |
| `upload_date` | timestamptz | toate |
| `rejection_reason` | text | nullable |
| `notes` | text | nullable |

**Tipuri documente vehicul:**
`phv_licence`, `mot_certificate`, `insurance_certificate`, `v5c_logbook`

---

### 7. `vehicles`
Fișiere: `settings/services/vehicle/queries.ts`

| Coloană | Tip | Operație |
|---|---|---|
| `id` | uuid PK | toate |
| `driver_id` | uuid FK → drivers | toate |
| `organization_id` | uuid FK → organizations | create |
| `make` | text | create/update/display |
| `model` | text | create/update/display |
| `year` | integer | create/update |
| `color` | text | create/update |
| `license_plate` | text | create/update |
| `passenger_capacity` | integer | create/update |
| `luggage_capacity` | integer | create/update |
| `insurance_expiry` | date | create (default +1 year) |
| `approval_status` | text | getDriverVehicles |
| `is_active` | boolean DEFAULT false | create |
| `created_at` | timestamptz | order by |

**JOIN folosit:**
```
vehicles
  → vehicle_approval(approval_status, approved_at) ON vehicle_id
```

---

### 8. `vehicle_approval`
Fișiere: `settings/services/vehicle/queries.ts` (JOIN)

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `vehicle_id` | uuid FK → vehicles |
| `approval_status` | text |
| `approved_at` | timestamptz nullable |

---

### 9. `notifications`
Fișiere: `notifications/api/notifications-api.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → auth.users | = auth_user_id, NU driver_id |
| `type` | text NOT NULL | |
| `title` | text NOT NULL | |
| `message` | text NOT NULL | |
| `read_at` | timestamptz | null = necitit |
| `target_type` | text | nullable |
| `is_system` | boolean | nullable |
| `link` | text | nullable |
| `sender_type` | text | nullable |
| `priority` | text | nullable |
| `created_at` | timestamptz | |

**Operații:**
- SELECT WHERE `user_id = auth_user_id` ORDER BY `created_at DESC`
- UPDATE `read_at = now()` WHERE `id = notificationId`

---

### 10. `driver_app_preferences`
Fișiere: `app-preferences/services/app-preferences-service.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `sound_enabled` | boolean DEFAULT true |
| `vibration_enabled` | boolean DEFAULT true |
| `language` | text DEFAULT 'en' |
| `theme` | text DEFAULT 'dark' |
| `auto_accept_jobs` | boolean DEFAULT false |
| `location_sharing` | boolean DEFAULT true |
| `offline_mode` | boolean DEFAULT false |
| `data_usage` | text DEFAULT 'standard' |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

**Operații:**
- SELECT WHERE `driver_id = driverId` — getPreferences
- UPSERT `driver_id, ...settings` — savePreferences

---

### 11. `driver_notification_preferences`
Fișiere: `notification-preferences/services/notification-preferences-checker.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `job_alerts` | boolean DEFAULT true |
| `payment_updates` | boolean DEFAULT true |
| `document_reminders` | boolean DEFAULT true |
| `app_updates` | boolean DEFAULT true |
| `marketing` | boolean DEFAULT false |
| `push_enabled` | boolean DEFAULT true |
| `email_enabled` | boolean DEFAULT true |
| `sms_enabled` | boolean DEFAULT false |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

**Operații:**
- SELECT `*` WHERE `driver_id = driverId` — checkNotificationPreferences
- SELECT `push_enabled` WHERE `driver_id = driverId` — canSendPushNotification
- SELECT `email_enabled` WHERE `driver_id = driverId`
- SELECT `sms_enabled` WHERE `driver_id = driverId`
- SELECT `*` WHERE `driver_id IN (...)` — batchCheck

---

### 12. `driver_earnings`
Fișiere: `earnings/services/earnings-api.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK → drivers | |
| `booking_id` | uuid FK → bookings | JOIN pentru reference |
| `gross_amount` | numeric | |
| `net_amount` | numeric | |
| `currency` | text | |
| `earning_date` | date | ORDER BY |
| `status` | text | 'paid'\|'pending' |
| `created_at` | timestamptz | |

**JOIN folosit:**
```
driver_earnings
  → bookings!driver_earnings_booking_id_fkey (reference)
```
> ⚠️ FK-ul trebuie să se numească exact `driver_earnings_booking_id_fkey`

---

### 13. `support_tickets`
Fișiere: `support/services/tickets-api.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `ticket_number` | text UNIQUE |
| `driver_id` | uuid FK → drivers |
| `organization_id` | uuid FK → organizations |
| `subject` | text NOT NULL |
| `description` | text |
| `category` | text |
| `priority` | text DEFAULT 'medium' |
| `status` | text DEFAULT 'open' |
| `booking_reference` | text nullable |
| `attachments` | jsonb DEFAULT '[]' |
| `assigned_to` | uuid nullable |
| `resolved_by` | uuid nullable |
| `resolved_at` | timestamptz nullable |
| `created_by_id` | uuid |
| `created_by_type` | text DEFAULT 'driver' |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 14. `driver_performance_stats`
Fișiere: `driver-status/services/driver-status-api.ts`

| Coloană | Tip | Note |
|---|---|---|
| `driver_id` | uuid PK FK → drivers | |
| `total_cancellations` | integer DEFAULT 0 | |
| `cancellations_this_month` | integer DEFAULT 0 | |
| `cancellation_rate` | numeric DEFAULT 0 | |
| `total_late_arrivals` | integer DEFAULT 0 | |
| `late_arrivals_this_month` | integer DEFAULT 0 | |
| `total_completed` | integer DEFAULT 0 | |
| `completion_rate` | numeric DEFAULT 0 | |
| `warning_level` | text DEFAULT 'none' | 'none'\|'warning'\|'critical' |
| `last_cancellation_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `reset_at` | timestamptz | |

---

### 15. `live_chat_sessions`
Fișiere: `support/services/` live chat

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `topic` | text |
| `status` | text — 'active'\|'closed' |
| `assigned_operator_id` | uuid nullable |
| `started_at` | timestamptz |
| `closed_at` | timestamptz nullable |
| `last_message_at` | timestamptz nullable |

---

### 16. `live_chat_messages`
Fișiere: `support/services/` live chat

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `session_id` | uuid FK → live_chat_sessions |
| `driver_id` | uuid FK → drivers |
| `sender_id` | uuid |
| `sender_type` | text — 'driver'\|'operator'\|'admin' |
| `message_type` | text — 'text'\|'image'\|'system' |
| `message` | text nullable |
| `image_url` | text nullable |
| `read_at` | timestamptz nullable |
| `chatbot_category` | text nullable |
| `chatbot_subcategory` | text nullable |
| `chatbot_metadata` | jsonb nullable |
| `created_at` | timestamptz |

---

### 17. `booking_leg_actions`
Fișiere: `job-workflow/services/status-actions.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `booking_leg_id` | uuid FK → booking_legs |
| `driver_id` | uuid FK → drivers |
| `action_type` | text — 'cancelled'\|'late_notification'\|'location_issue'\|etc. |
| `reason` | text nullable |
| `notes` | text nullable |
| `time_before_pickup` | integer nullable (minute) |
| `metadata` | jsonb nullable |
| `created_at` | timestamptz |

---

## LOCAȚIE — Arhitectura (ZERO DB writes pentru GPS live)

```
GPS device (1s interval)
    ↓
Supabase Realtime BROADCAST (3s throttle) ← ZERO DB writes
    ↓ (la 15s)
drivers.current_latitude / current_longitude / location_updated_at  ← heartbeat DB
```

**Tabelul `driver_locations` din DB veche** — NU mai este necesar.  
Locația live se face prin Realtime Broadcast, nu prin inserturi în DB.

---

## SIGNUP FLOW — Ce se creează la înregistrare

```
1. auth.users → Supabase Auth creează user
2. drivers → INSERT cu auth_user_id + datele din formular
3. driver_app_preferences → INSERT cu defaults
4. driver_notification_preferences → INSERT cu defaults
5. driver_performance_stats → INSERT cu defaults (sau trigger)
```
