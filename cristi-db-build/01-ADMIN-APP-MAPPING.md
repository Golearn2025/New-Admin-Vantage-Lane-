# 01 — ADMIN APP — Mapping Complet DB

**Bazat pe:** Cod real din `apps/admin/entities/` și `apps/admin/features/`

---

## TABELE FOLOSITE DE ADMIN APP

### 1. `admin_users`
Fișiere: `adminApi.ts`, `useCurrentUser.ts`, `actions.ts`, `rbac.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `auth_user_id` | uuid UNIQUE FK → auth.users | cheie legătură auth |
| `organization_id` | uuid FK → organizations | nullable pt super_admin |
| `email` | text NOT NULL | |
| `name` | text | display name |
| `first_name` | text | |
| `last_name` | text | |
| `phone` | text | |
| `role` | text NOT NULL | 'super_admin'\|'admin'\|'support' |
| `is_active` | boolean DEFAULT true | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### 2. `user_organization_roles`
Fișiere: `useCurrentUser.ts`, `rbac.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → auth.users | = auth_user_id |
| `organization_id` | uuid FK → organizations | |
| `role` | text NOT NULL | 'operator'\|'manager'\|'dispatcher' |
| `is_active` | boolean DEFAULT true | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### 3. `organizations`
Fișiere: `operatorApi.ts`, `listBookings.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `name` | text NOT NULL | "Vantage Lane" |
| `org_type` | text NOT NULL | 'platform_owner'\|'operator'\|'corporate' |
| `code` | text UNIQUE | 'VL' |
| `contact_email` | text | |
| `contact_phone` | text | |
| `city` | text | |
| `country` | text | |
| `is_active` | boolean DEFAULT true | |
| `rating_average` | numeric | |
| `review_count` | integer DEFAULT 0 | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### 4. `bookings`
Fișiere: `listBookings.ts`, `bookingApi.ts`, `customerApi.ts`, `operatorApi.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `customer_id` | uuid FK → customers | |
| `organization_id` | uuid FK → organizations | |
| `reference` | text UNIQUE | auto: VL-2026-XXXX |
| `trip_type` | text | 'single'\|'return'\|'hourly'\|'daily'\|'fleet' |
| `category` | text | 'standard'\|'executive'\|'luxury' |
| `booking_source` | text | 'web'\|'app'\|'phone'\|'api' |
| `status` | text NOT NULL | 'NEW'\|'ASSIGNED'\|'EN_ROUTE'\|'ARRIVED'\|'IN_PROGRESS'\|'COMPLETED'\|'CANCELLED' |
| `payment_status` | text | 'pending'\|'paid'\|'refunded' |
| `start_at` | timestamptz | |
| `passenger_count` | integer | |
| `bag_count` | integer | |
| `currency` | text DEFAULT 'GBP' | |
| `flight_number` | text | nullable |
| `notes` | text | note interne |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `deleted_at` | timestamptz | soft delete |

---

### 5. `booking_legs`
Fișiere: `listBookings.ts`, `bookingLegApi.ts`, `useDriverAssignment.ts`

> ⚠️ **DECIZIE CHEIE:** Codul admin și driver folosesc numele VECHI de coloane.

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `parent_booking_id` | uuid FK → bookings | ⚠️ NU `booking_id` |
| `leg_number` | integer NOT NULL | |
| `leg_type` | text | 'single'\|'outbound'\|'return' |
| `vehicle_category` | text | ⚠️ text direct, NU FK |
| `vehicle_model` | text | ⚠️ text direct, NU FK |
| `pickup_location` | text | ⚠️ NU `pickup_address` |
| `destination` | text | ⚠️ NU `dropoff_address` |
| `pickup_lat` | numeric | |
| `pickup_lng` | numeric | |
| `destination_lat` | numeric | ⚠️ NU `dropoff_lat` |
| `destination_lng` | numeric | ⚠️ NU `dropoff_lng` |
| `scheduled_at` | timestamptz | |
| `distance_miles` | numeric | |
| `duration_min` | integer | |
| `assigned_driver_id` | uuid FK → drivers | |
| `assigned_vehicle_id` | uuid FK → vehicles | |
| `status` | text NOT NULL | 'pending'\|'assigned'\|'en_route'\|'arrived'\|'in_progress'\|'completed'\|'cancelled' |
| `leg_price` | numeric | ⚠️ direct pe tabel, NU în tabel separat |
| `driver_payout` | numeric | ⚠️ direct pe tabel, NU în tabel separat |
| `assigned_at` | timestamptz | |
| `started_at` | timestamptz | workflow |
| `arrived_at_pickup` | timestamptz | workflow |
| `passenger_onboard_at` | timestamptz | workflow |
| `completed_at` | timestamptz | workflow |
| `cancelled_at` | timestamptz | workflow |
| `cancel_reason` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### 6. `booking_pricing`
Fișiere: `listBookings.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `booking_id` | uuid FK → bookings |
| `price` | numeric |
| `currency` | text DEFAULT 'GBP' |
| `payment_method` | text |
| `payment_status` | text |
| `platform_fee` | numeric |
| `operator_net` | numeric |
| `driver_payout` | numeric |
| `platform_commission_pct` | numeric |
| `driver_commission_pct` | numeric |
| `extras_total` | numeric |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 7. `booking_segments`
Fișiere: `listBookings.ts`, `customerApi.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `booking_id` | uuid FK → bookings |
| `seq_no` | integer |
| `role` | text — 'pickup'\|'stop'\|'dropoff' |
| `place_text` | text |
| `place_label` | text |
| `lat` | numeric |
| `lng` | numeric |
| `created_at` | timestamptz |

---

### 8. `booking_services`
Fișiere: `listBookings.ts`, `customerApi.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `booking_id` | uuid FK → bookings |
| `service_code` | text |
| `quantity` | integer DEFAULT 1 |
| `unit_price` | numeric DEFAULT 0 |
| `notes` | text |
| `created_at` | timestamptz |

---

### 9. `customers`
Fișiere: `customerApi.ts`, `listBookings.ts`, `refundApi.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `auth_user_id` | uuid FK → auth.users | nullable (guest) |
| `organization_id` | uuid FK → organizations | |
| `first_name` | text NOT NULL | |
| `last_name` | text NOT NULL | |
| `email` | text | |
| `phone` | text | |
| `is_active` | boolean DEFAULT true | |
| `status` | text | 'active'\|'suspended'\|'banned' |
| `total_rides` | integer DEFAULT 0 | |
| `total_spent` | numeric DEFAULT 0 | |
| `loyalty_tier` | text | 'bronze'\|'silver'\|'gold'\|'platinum' |
| `rating_average` | numeric | |
| `rating_count` | integer DEFAULT 0 | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `deleted_at` | timestamptz | |

---

### 10. `drivers`
Fișiere: `driverCrudOperations.ts`, `driverLifecycle.ts`, `listBookings.ts`, `operatorApi.ts`, `useCurrentUser.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `auth_user_id` | uuid UNIQUE FK → auth.users | |
| `organization_id` | uuid FK → organizations | |
| `first_name` | text NOT NULL | |
| `last_name` | text NOT NULL | |
| `name` | text | computed sau câmp |
| `email` | text | |
| `phone` | text NOT NULL | |
| `address` | text | |
| `date_of_birth` | date | |
| `status` | text | 'pending'\|'active'\|'inactive'\|'suspended' |
| `is_active` | boolean DEFAULT false | |
| `is_approved` | boolean DEFAULT false | |
| `is_available` | boolean DEFAULT false | |
| `online_status` | text | 'online'\|'offline' |
| `profile_completed` | boolean DEFAULT false | |
| `profile_photo_url` | text | |
| `rating_average` | numeric | |
| `rating_count` | integer DEFAULT 0 | |
| `current_latitude` | numeric | heartbeat GPS |
| `current_longitude` | numeric | heartbeat GPS |
| `location_updated_at` | timestamptz | |
| `current_device_token` | text | single-device login |
| `last_device_login_at` | timestamptz | |
| `last_online_at` | timestamptz | |
| `car_make` | text | legacy |
| `car_model` | text | legacy |
| `car_color` | text | legacy |
| `car_plate` | text | legacy |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `deleted_at` | timestamptz | |

---

### 11. `driver_lifecycle_events`
Fișiere: `driverLifecycle.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `event_type` | text — 'approved'\|'activated'\|'deactivated'\|'suspended' |
| `event_at` | timestamptz |
| `event_by` | uuid FK → admin_users |
| `reason` | text nullable |
| `metadata` | jsonb nullable |
| `created_at` | timestamptz |

---

### 12. `driver_documents`
Fișiere: `documentQueries.ts`, `documentMutations.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `document_type` | text NOT NULL |
| `file_name` | text |
| `file_url` | text |
| `status` | text — 'pending'\|'approved'\|'rejected'\|'expired'\|'expiring_soon'\|'replaced' |
| `notes` | text |
| `upload_date` | timestamptz |
| `expiry_date` | date |
| `reviewed_by` | uuid FK → admin_users |
| `reviewed_at` | timestamptz |
| `rejection_reason` | text |
| `file_size` | integer |
| `mime_type` | text |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 13. `vehicle_documents`
Fișiere: `documentQueries.ts`, `documentMutations.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `vehicle_id` | uuid FK → vehicles |
| `document_type` | text NOT NULL |
| `file_name` | text |
| `file_url` | text |
| `status` | text |
| `notes` | text |
| `upload_date` | timestamptz |
| `expiry_date` | date |
| `reviewed_by` | uuid FK → admin_users |
| `reviewed_at` | timestamptz |
| `rejection_reason` | text |
| `file_size` | integer |
| `mime_type` | text |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 14. `vehicles`
Fișiere: `vehicleApi.ts`, `listBookings.ts`, `operatorApi.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `organization_id` | uuid FK → organizations |
| `make` | text |
| `model` | text |
| `year` | integer |
| `color` | text |
| `license_plate` | text |
| `passenger_capacity` | integer |
| `luggage_capacity` | integer |
| `is_active` | boolean DEFAULT false |
| `approval_status` | text |
| `insurance_expiry` | date |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 15. `vehicle_service_types`
Fișiere: `driverLifecycle.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `vehicle_id` | uuid FK → vehicles |
| `service_type` | text |
| `approved_by` | uuid FK → admin_users |
| `approved_at` | timestamptz |
| `created_at` | timestamptz |

---

### 16. `vehicle_approval`
Fișiere: `vehicleApi.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `vehicle_id` | uuid FK → vehicles |
| `approval_status` | text |
| `reviewed_by` | uuid FK → admin_users |
| `approved_at` | timestamptz |
| `rejection_reason` | text |
| `created_at` | timestamptz |

---

### 17. `notifications`
Fișiere: `notificationApi.ts`, `broadcastNotification.ts`

| Coloană | Tip | Note |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → auth.users | = auth_user_id, NU driver_id |
| `type` | text NOT NULL | |
| `title` | text NOT NULL | |
| `message` | text NOT NULL | |
| `link` | text | nullable |
| `read_at` | timestamptz | null = necitit |
| `target_type` | text | 'driver'\|'admin'\|'operator'\|'all' |
| `is_system` | boolean DEFAULT false | |
| `sender_type` | text | 'system'\|'admin'\|'operator' |
| `priority` | text | 'low'\|'normal'\|'high'\|'urgent' |
| `created_at` | timestamptz | |

---

### 18. `support_tickets`
Fișiere: `useTicketStats.ts`, `useTicketActions.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `ticket_number` | text UNIQUE |
| `driver_id` | uuid FK → drivers nullable |
| `organization_id` | uuid FK → organizations |
| `subject` | text NOT NULL |
| `description` | text |
| `category` | text |
| `priority` | text DEFAULT 'medium' |
| `status` | text DEFAULT 'open' |
| `booking_reference` | text nullable |
| `assigned_to` | uuid FK → admin_users nullable |
| `resolved_by` | uuid FK → admin_users nullable |
| `resolved_at` | timestamptz nullable |
| `created_by_id` | uuid |
| `created_by_type` | text DEFAULT 'driver' |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 19. `support_ticket_messages`
Fișiere: `useTicketActions.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `ticket_id` | uuid FK → support_tickets |
| `sender_id` | uuid |
| `sender_type` | text — 'driver'\|'admin'\|'operator' |
| `message` | text NOT NULL |
| `attachments` | jsonb DEFAULT '[]' |
| `created_at` | timestamptz |

---

### 20. `driver_performance_stats`
Fișiere: `driverStats.ts`, `biQueriesExtended.ts`

| Coloană | Tip |
|---|---|
| `driver_id` | uuid PK FK → drivers |
| `total_completed` | integer DEFAULT 0 |
| `total_cancellations` | integer DEFAULT 0 |
| `cancellations_this_month` | integer DEFAULT 0 |
| `cancellation_rate` | numeric DEFAULT 0 |
| `total_late_arrivals` | integer DEFAULT 0 |
| `late_arrivals_this_month` | integer DEFAULT 0 |
| `completion_rate` | numeric DEFAULT 0 |
| `warning_level` | text DEFAULT 'none' |
| `last_cancellation_at` | timestamptz |
| `updated_at` | timestamptz |
| `reset_at` | timestamptz |

---

### 21. `driver_earnings`
Fișiere: `biQueriesExtended.ts`, `driverStats.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `booking_id` | uuid FK → bookings |
| `booking_leg_id` | uuid FK → booking_legs |
| `gross_amount` | numeric |
| `net_amount` | numeric |
| `platform_fee` | numeric |
| `currency` | text DEFAULT 'GBP' |
| `earning_date` | date |
| `status` | text — 'pending'\|'paid'\|'held' |
| `paid_at` | timestamptz |
| `created_at` | timestamptz |

---

### 22. `driver_ratings`
Fișiere: `reviewStatistics.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `booking_id` | uuid FK → bookings |
| `customer_id` | uuid FK → customers |
| `rating` | integer — 1-5 |
| `comment` | text nullable |
| `created_at` | timestamptz |

---

### 23. `pricing_config`
Fișiere: `pricingPolicies.ts`, `pricingRates.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `organization_id` | uuid FK → organizations |
| `service_policies` | jsonb |
| `general_policies` | jsonb |
| `return_settings` | jsonb |
| `hourly_settings` | jsonb |
| `daily_settings` | jsonb |
| `fleet_settings` | jsonb |
| `time_multipliers` | jsonb |
| `event_multipliers` | jsonb |
| `premium_services` | jsonb |
| `time_period_config` | jsonb |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 24. `role_permissions`
Fișiere: `getRolePermissions.ts`, `updateRolePermissions.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `role` | text NOT NULL |
| `resource` | text NOT NULL |
| `can_create` | boolean DEFAULT false |
| `can_read` | boolean DEFAULT false |
| `can_update` | boolean DEFAULT false |
| `can_delete` | boolean DEFAULT false |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 25. `live_chat_sessions` + `live_chat_messages`
Fișiere: features live chat, `useOperatorProfileData.ts`

**live_chat_sessions:**

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `driver_id` | uuid FK → drivers |
| `topic` | text |
| `status` | text — 'active'\|'closed'\|'waiting' |
| `assigned_operator_id` | uuid FK → admin_users nullable |
| `started_at` | timestamptz |
| `closed_at` | timestamptz nullable |
| `last_message_at` | timestamptz nullable |
| `created_at` | timestamptz |

**live_chat_messages:**

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
| `created_at` | timestamptz |

---

### 26. `refunds`
Fișiere: `refundApi.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `booking_id` | uuid FK → bookings |
| `amount` | numeric NOT NULL |
| `currency` | text DEFAULT 'GBP' |
| `reason` | text |
| `status` | text — 'pending'\|'approved'\|'rejected'\|'processed' |
| `processed_by` | uuid FK → admin_users nullable |
| `processed_at` | timestamptz nullable |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 27. `disputes`
Fișiere: `disputeApi.ts`

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `booking_id` | uuid FK → bookings |
| `raised_by` | uuid |
| `raised_by_type` | text — 'driver'\|'customer'\|'admin' |
| `reason` | text NOT NULL |
| `description` | text |
| `status` | text — 'open'\|'under_review'\|'resolved'\|'closed' |
| `resolution` | text nullable |
| `resolved_by` | uuid FK → admin_users nullable |
| `resolved_at` | timestamptz nullable |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

---

### 28. `driver_app_preferences`
Fișiere: `app-preferences-service.ts` (driver app), citit și din admin

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

---

### 29. `driver_notification_preferences`
Fișiere: `notification-preferences-checker.ts` (driver app)

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

---

### 30. `platform_settings`
Fișiere: `settings-commissions` hooks

| Coloană | Tip |
|---|---|
| `id` | uuid PK |
| `organization_id` | uuid FK → organizations |
| `key` | text NOT NULL |
| `value` | jsonb NOT NULL |
| `description` | text |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |
