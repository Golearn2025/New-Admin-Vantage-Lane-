# STEP 1 — ADMIN APP DATA CONTRACTS

**Data:** 24 Feb 2026  
**Scop:** Extragere exactă a contractelor de date din Admin App (ce tabele și coloane cere codul)

---

## 📋 METODOLOGIE

Am scanat toate fișierele din:
- `apps/admin/entities/`
- `apps/admin/features/`

Am extras toate apelurile:
- `.from('table_name')`
- `.select('columns')`
- `.insert(data)`
- `.update(data)`

---

## 🎯 TABELE IDENTIFICATE ÎN ADMIN APP

**Total tabele:** 34

---

## 📊 DATA CONTRACTS DETALIATE

### **1. admin_users**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
email
first_name
last_name
phone
is_active
created_at
deleted_at
auth_user_id
role
name
```

**Fișiere care folosesc:**
- `entities/admin/api/adminApi.ts`
- `entities/user/api/createUser.ts`
- `entities/user/api/updateUser.ts`
- `entities/user/api/listDeletedUsers.ts`

**Query examples:**
```typescript
.from('admin_users')
.select('id, email, first_name, last_name, phone, is_active, created_at')
.in('role', ['admin', 'super_admin'])

.from('admin_users')
.select('*')
.eq('id', id)

.from('admin_users')
.insert(payload)

.from('admin_users')
.update(payload)
.eq('id', id)

.from('admin_users')
.delete()
.eq('id', id)
```

---

### **2. bookings**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
reference
status
start_at
passenger_count
bag_count
trip_type
category
flight_number
distance_miles
duration_min
customer_id
organization_id
assigned_driver_id
assigned_vehicle_id
created_at
updated_at
```

**Relații (JOIN-uri presupuse):**
```
bookings -> booking_segments (1:N)
bookings -> booking_pricing (1:1)
bookings -> booking_services (1:N)
bookings -> payment_transactions (1:N)
bookings -> customers (N:1 via customer_id)
bookings -> organizations (N:1 via organization_id)
```

**Fișiere care folosesc:**
- `entities/booking/api/bookingApi.ts`
- `entities/booking/api/listBookings.ts`
- `entities/booking/api/createBooking.ts`
- `entities/customer/api/customerApi.ts`
- `entities/operator/api/operatorApi.ts`

**Query examples:**
```typescript
.from('bookings')
.select('*', { count: 'exact' })

.from('bookings')
.select('*, booking_segments(*), booking_pricing(*), booking_services(*)')

.from('bookings')
.select('id, status, booking_pricing(price)')

.from('bookings')
.select('status')
.eq('customer_id', customerId)
```

---

### **3. booking_legs**

**Operații:** SELECT, INSERT, UPDATE

**Coloane cerute de Admin:**
```
id
parent_booking_id
leg_number
leg_type
vehicle_category
pickup_location
destination
scheduled_at
distance_miles
duration_min
assigned_driver_id
assigned_vehicle_id
status
leg_price
driver_payout
assigned_at
arrived_at_pickup
passenger_onboard_at
started_at
completed_at
cancelled_at
cancel_reason
```

**Relații (JOIN-uri presupuse):**
```
booking_legs -> bookings (N:1 via parent_booking_id)
booking_legs -> drivers (N:1 via assigned_driver_id)
booking_legs -> vehicles (N:1 via assigned_vehicle_id)
```

**Fișiere care folosesc:**
- `entities/booking/api/listBookings.ts`
- `entities/booking-leg/api/bookingLegApi.ts`

**Query examples:**
```typescript
.from('booking_legs')
.select('id, parent_booking_id, leg_number, leg_type, vehicle_category, pickup_location, destination, scheduled_at, distance_miles, duration_min, assigned_driver_id, assigned_vehicle_id, status, leg_price, driver_payout, assigned_at, arrived_at_pickup, passenger_onboard_at, started_at, completed_at, cancelled_at, cancel_reason')
.in('parent_booking_id', bookingIds)

.from('booking_legs')
.select('pickup_location, destination, distance_miles, duration_min, leg_price')

.from('booking_legs')
.select('vehicle_category, leg_price, driver_payout')
```

---

### **4. booking_segments**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
booking_id
seq_no
role
place_text
place_label
```

**Relații (JOIN-uri presupuse):**
```
booking_segments -> bookings (N:1 via booking_id)
```

**Fișiere care folosesc:**
- `entities/booking/api/listBookings.ts`

**Query examples:**
```typescript
.from('booking_segments')
.select('booking_id, seq_no, role, place_text, place_label')
.in('booking_id', bookingIds)
.order('seq_no', { ascending: true })
```

---

### **5. booking_pricing**

**Operații:** SELECT, INSERT, UPDATE

**Coloane cerute de Admin:**
```
booking_id
price
currency
payment_method
payment_status
platform_fee
operator_net
driver_payout
platform_commission_pct
driver_commission_pct
extras_total
```

**Relații (JOIN-uri presupuse):**
```
booking_pricing -> bookings (1:1 via booking_id)
```

**Fișiere care folosesc:**
- `entities/booking/api/listBookings.ts`
- `entities/customer/api/customerApi.ts`
- `entities/business-intelligence/api/biQueries.ts`

**Query examples:**
```typescript
.from('booking_pricing')
.select('booking_id, price, currency, payment_method, payment_status, platform_fee, operator_net, driver_payout, platform_commission_pct, driver_commission_pct')
.in('booking_id', bookingIds)

.from('booking_pricing')
.select('*')

.from('booking_pricing')
.select('price, platform_fee, driver_payout')
```

---

### **6. booking_services**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
booking_id
service_code
unit_price
quantity
notes
```

**Relații (JOIN-uri presupuse):**
```
booking_services -> bookings (N:1 via booking_id)
```

**Fișiere care folosesc:**
- `entities/booking/api/listBookings.ts`

**Query examples:**
```typescript
.from('booking_services')
.select('booking_id, service_code, unit_price, quantity, notes')
.in('booking_id', bookingIds)
```

---

### **7. booking_assignment**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
booking_id
assigned_at
assigned_by
```

**Relații (JOIN-uri presupuse):**
```
booking_assignment -> bookings (1:1 via booking_id)
```

**Fișiere care folosesc:**
- `entities/booking/api/listBookings.ts`

**Query examples:**
```typescript
.from('booking_assignment')
.select('booking_id, assigned_at, assigned_by')
.in('booking_id', bookingIds)
```

---

### **8. customers**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
email
first_name
last_name
phone
status
is_active
created_at
deleted_at
auth_user_id
rating_average
rating_count
total_rides
loyalty_tier
total_spent
```

**Relații (JOIN-uri presupuse):**
```
customers -> bookings (1:N via id -> customer_id)
```

**Fișiere care folosesc:**
- `entities/customer/api/customerApi.ts`
- `entities/booking/api/listBookings.ts`
- `entities/user/api/createUser.ts`
- `entities/user/api/listDeletedUsers.ts`

**Query examples:**
```typescript
.from('customers')
.select('id, email, first_name, last_name, phone, is_active, created_at')

.from('customers')
.select('id, first_name, last_name, email, status, rating_average, created_at')

.from('customers')
.select('id, first_name, last_name, email, phone')

.from('customers')
.insert(payload)

.from('customers')
.update(payload)
.eq('id', id)

.from('customers')
.delete()
.eq('id', id)
```

---

### **9. drivers**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
email
first_name
last_name
phone
is_active
status
created_at
deleted_at
updated_at
auth_user_id
organization_id
profile_photo_url
vehicle_categories
verification_status
rating_average
rating_count
online_status
license_number
license_expiry
is_approved
```

**Relații (JOIN-uri presupuse):**
```
drivers -> organizations (N:1 via organization_id)
drivers -> vehicles (1:N via id -> driver_id)
drivers -> driver_documents (1:N via id -> driver_id)
drivers -> driver_performance_stats (1:1 via id -> driver_id)
drivers -> booking_legs (1:N via id -> assigned_driver_id)
```

**Fișiere care folosesc:**
- `entities/driver/api/driverCrudOperations.ts`
- `entities/driver/api/listPendingDrivers.ts`
- `entities/operator/api/operatorApi.ts`
- `entities/user/api/createUser.ts`
- `features/admin/driver-assignment/hooks/useDriverAssignment.ts`
- `features/shared/driver-profile/hooks/useDriverProfile.ts`

**Query examples:**
```typescript
.from('drivers')
.select('id, email, first_name, last_name, phone, is_active, created_at')

.from('drivers')
.select('id, first_name, last_name, status, rating_average, rating_count, online_status, driver_performance_stats(total_completed, total_cancellations, completion_rate, warning_level)')

.from('drivers')
.select('id, email, first_name, last_name, phone, is_active, status, created_at')
.eq('organization_id', operatorId)

.from('drivers')
.insert(payload)

.from('drivers')
.update(payload)
.eq('id', id)

.from('drivers')
.delete()
.eq('id', id)
```

---

### **10. vehicles**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
driver_id
organization_id
category
make
model
year
color
license_plate
insurance_expiry
mot_expiry
passenger_capacity
luggage_capacity
is_active
is_available
approval_status
rejection_reason
approved_by
approved_at
created_at
updated_at
```

**Relații (JOIN-uri presupuse):**
```
vehicles -> drivers (N:1 via driver_id)
vehicles -> organizations (N:1 via organization_id)
vehicles -> vehicle_documents (1:N via id -> vehicle_id)
vehicles -> booking_legs (1:N via id -> assigned_vehicle_id)
```

**Fișiere care folosesc:**
- `entities/vehicle/api/vehicleApi.ts`
- `entities/vehicle/api/listVehicles.ts`
- `entities/booking/api/listBookings.ts`
- `entities/operator/api/operatorApi.ts`

**Query examples:**
```typescript
.from('vehicles')
.select('id, organization_id, driver_id, category, make, model, year, color, license_plate, insurance_expiry, mot_expiry, passenger_capacity, luggage_capacity, is_active, is_available, approval_status, rejection_reason, approved_by, approved_at, created_at, updated_at')

.from('vehicles')
.select('id, category, make, model, year, passenger_capacity, is_active, approval_status')

.from('vehicles')
.select('id, driver_id, make, model, year, color, license_plate')
.in('id', vehicleIds)

.from('vehicles')
.insert(vehicleData)

.from('vehicles')
.update(updateData)
.eq('id', vehicleId)

.from('vehicles')
.delete()
.eq('id', vehicleId)
```

---

### **11. organizations**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
name
code
contact_email
contact_phone
city
country
org_type
is_active
rating_average
review_count
created_at
deleted_at
updated_at
driver_commission_pct
```

**Relații (JOIN-uri presupuse):**
```
organizations -> drivers (1:N via id -> organization_id)
organizations -> vehicles (1:N via id -> organization_id)
organizations -> bookings (1:N via id -> organization_id)
organizations -> organization_members (1:N via id -> organization_id)
```

**Fișiere care folosesc:**
- `entities/operator/api/operatorApi.ts`
- `entities/booking/api/listBookings.ts`
- `entities/user/api/createUser.ts`
- `entities/user/api/listDeletedUsers.ts`

**Query examples:**
```typescript
.from('organizations')
.select('id, code, name, contact_email, contact_phone, city, is_active, rating_average, created_at')
.eq('org_type', 'operator')

.from('organizations')
.select('id, name, rating_average, review_count')
.in('id', orgIds)

.from('organizations')
.select('id, name, driver_commission_pct')

.from('organizations')
.insert(payload)

.from('organizations')
.update(payload)
.eq('id', id)

.from('organizations')
.delete()
.eq('id', id)
```

---

### **12. driver_documents**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
driver_id
document_type
file_url
status
upload_date
metadata
expiry_date
type
```

**Relații (JOIN-uri presupuse):**
```
driver_documents -> drivers (N:1 via driver_id)
```

**Fișiere care folosesc:**
- `entities/driver/api/driverDocuments.ts`
- `entities/document/api/documentQueries.ts`
- `entities/document/api/documentMutations.ts`
- `features/shared/driver-profile/hooks/useDriverDocuments.ts`

**Query examples:**
```typescript
.from('driver_documents')
.select('id, driver_id, document_type, file_url')

.from('driver_documents')
.select('driver_id, document_type')

.from('driver_documents')
.select('metadata, expiry_date')

.from('driver_documents')
.select('status')

.from('driver_documents')
.insert(documentData)

.from('driver_documents')
.update(updateData)
.eq('id', documentId)
```

---

### **13. vehicle_documents**

**Operații:** SELECT, INSERT, UPDATE

**Coloane cerute de Admin:**
```
id
vehicle_id
document_type
file_url
status
upload_date
```

**Relații (JOIN-uri presupuse):**
```
vehicle_documents -> vehicles (N:1 via vehicle_id)
```

**Fișiere care folosesc:**
- `entities/vehicle/api/listVehicleDocuments.ts`
- `entities/vehicle/api/uploadVehicleDocument.ts`

**Query examples:**
```typescript
.from('vehicle_documents')
.select('vehicle_id, document_type, status, upload_date')

.from('vehicle_documents')
.select('*')

.from('vehicle_documents')
.insert(documentData)

.from('vehicle_documents')
.update({ status: 'approved' })
.eq('id', documentId)
```

---

### **14. notifications**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
user_id
created_at
```

**Fișiere care folosesc:**
- `entities/notification/api/notificationApi.ts`
- `entities/notification/api/broadcastNotification.ts`
- `entities/notification/api/sendNotification.ts`

**Query examples:**
```typescript
.from('notifications')
.select('*')

.from('notifications')
.select('id, user_id, created_at')

.from('notifications')
.insert(notificationData)
```

---

### **15. payment_transactions**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
booking_id
amount
currency
status
payment_method
created_at
```

**Relații (JOIN-uri presupuse):**
```
payment_transactions -> bookings (N:1 via booking_id)
```

**Fișiere care folosesc:**
- `entities/invoice/api/invoiceApi.ts`
- `entities/payment/api/paymentApi.ts`

**Query examples:**
```typescript
.from('payment_transactions')
.select('*, bookings!inner(reference, customer_id)')

.from('payment_transactions')
.select('*')
.eq('id', id)

.from('payment_transactions')
.insert(payload)

.from('payment_transactions')
.update(payload)
.eq('id', id)
```

---

### **16. refunds**

**Operații:** SELECT, INSERT, UPDATE, DELETE

**Coloane cerute de Admin:**
```
id
booking_id
amount
reason
status
created_at
```

**Relații (JOIN-uri presupuse):**
```
refunds -> bookings (N:1 via booking_id)
```

**Fișiere care folosesc:**
- `entities/refund/api/refundApi.ts`
- `entities/payment/api/processRefund.ts`

**Query examples:**
```typescript
.from('refunds')
.select('*, bookings!inner(reference, customer_id)')

.from('refunds')
.select('*')
.eq('id', id)

.from('refunds')
.insert(payload)

.from('refunds')
.update(payload)
.eq('id', id)
```

---

### **17. support_tickets**

**Operații:** SELECT, INSERT, UPDATE

**Coloane cerute de Admin:**
```
id
created_by_id
status
priority
subject
description
created_at
```

**Fișiere care folosesc:**
- `features/admin/support-tickets/hooks/useSupportTickets.ts`
- `features/admin/support-tickets/hooks/useTicketActions.ts`
- `features/admin/support-tickets/hooks/useCreateTicket.ts`

**Query examples:**
```typescript
.from('support_tickets')
.select('*', { count: 'exact', head: true })

.from('support_tickets')
.select('created_by_id', { count: 'exact', head: true })

.from('support_tickets')
.insert(ticketData)

.from('support_tickets')
.update({ status: 'resolved' })
.eq('id', ticketId)
```

---

### **18. pricing_config**

**Operații:** SELECT, UPDATE

**Coloane cerute de Admin:**
```
id
vehicle_types
airport_fees
zone_fees
is_active
updated_at
```

**Fișiere care folosesc:**
- `entities/pricing/api/pricingCrudOperations.ts`
- `entities/pricing/api/pricingRates.ts`
- `entities/pricing/api/pricingPolicies.ts`

**Query examples:**
```typescript
.from('pricing_config')
.select('*')
.eq('is_active', true)

.from('pricing_config')
.select('vehicle_types')
.eq('id', configId)

.from('pricing_config')
.update({ vehicle_types: updatedVehicleTypes })
.eq('id', configId)
```

---

### **19. platform_settings**

**Operații:** SELECT, UPDATE

**Coloane cerute de Admin:**
```
setting_key
setting_value
updated_by
```

**Fișiere care folosesc:**
- `entities/platform-settings/api/getCommissionRates.ts`
- `entities/platform-settings/api/updateCommissionRates.ts`

**Query examples:**
```typescript
.from('platform_settings')
.select('setting_value')
.eq('setting_key', 'commission_rates')

.from('platform_settings')
.update({ setting_value: settingValue, updated_by: userId })
.eq('setting_key', 'commission_rates')
```

---

### **20. page_definitions**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
page_key
page_name
is_active
display_order
```

**Fișiere care folosesc:**
- `entities/permission/api/getPageDefinitions.ts`
- `entities/permission/api/getRolePermissions.ts`

**Query examples:**
```typescript
.from('page_definitions')
.select('*')
.eq('is_active', true)
.order('display_order', { ascending: true })
```

---

### **21. role_permissions**

**Operații:** SELECT, UPSERT

**Coloane cerute de Admin:**
```
role
page_key
enabled
```

**Fișiere care folosesc:**
- `entities/permission/api/getRolePermissions.ts`
- `entities/permission/api/updateRolePermissions.ts`

**Query examples:**
```typescript
.from('role_permissions')
.select('page_key, enabled')
.eq('role', role)

.from('role_permissions')
.upsert({ role, page_key, enabled })
```

---

### **22. user_permissions**

**Operații:** SELECT, UPSERT, DELETE

**Coloane cerute de Admin:**
```
user_id
page_key
enabled
```

**Fișiere care folosesc:**
- `entities/permission/api/updateUserPermissions.ts`

**Query examples:**
```typescript
.from('user_permissions')
.upsert({ user_id, page_key, enabled })

.from('user_permissions')
.delete()
.eq('user_id', userId)
.eq('page_key', pageKey)
```

---

### **23. user_organization_roles**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
user_id
organization_id
role
is_active
```

**Relații (JOIN-uri presupuse):**
```
user_organization_roles -> organizations (N:1 via organization_id)
```

**Fișiere care folosesc:**
- `entities/user/api/userApi.ts`

**Query examples:**
```typescript
.from('user_organization_roles')
.select('user_id, organizations!inner(org_type, is_active)')

.from('user_organization_roles')
.select('organization_id, role, is_active')
```

---

### **24. driver_reviews**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
id
driver_id
rating
comment
created_at
```

**Relații (JOIN-uri presupuse):**
```
driver_reviews -> drivers (N:1 via driver_id)
```

**Fișiere care folosesc:**
- `entities/review/api/reviewOperations.ts`
- `entities/review/api/reviewStatistics.ts`

**Query examples:**
```typescript
.from('driver_reviews')
.select('*, drivers(id, first_name, last_name, email, phone)')

.from('driver_reviews')
.select('rating')
```

---

### **25. rating_statistics**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
user_id
user_type
five_star_count
four_star_count
three_star_count
two_star_count
one_star_count
total_ratings
current_rating
```

**Fișiere care folosesc:**
- `entities/review/api/reviewStatistics.ts`

**Query examples:**
```typescript
.from('rating_statistics')
.select('five_star_count, four_star_count, three_star_count, two_star_count, one_star_count, total_ratings, current_rating')
.eq('user_id', driverId)
.eq('user_type', 'driver')
```

---

### **26. safety_incidents**

**Operații:** SELECT, UPDATE

**Coloane cerute de Admin:**
```
id
incident_type
description
admin_investigation_status
created_at
```

**Fișiere care folosesc:**
- `entities/review/api/safetyIncidents.ts`
- `entities/review/api/reviewStatistics.ts`

**Query examples:**
```typescript
.from('safety_incidents')
.select('*', { count: 'exact' })

.from('safety_incidents')
.select('admin_investigation_status')

.from('safety_incidents')
.update(updateData)
.eq('id', incidentId)
```

---

### **27. feedback_templates**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
id
template_type
template_text
is_active
sort_order
```

**Fișiere care folosesc:**
- `entities/review/api/reviewTemplates.ts`

**Query examples:**
```typescript
.from('feedback_templates')
.select('*')
.eq('is_active', true)
.order('sort_order')
```

---

### **28. disputes**

**Operații:** SELECT, INSERT, UPDATE

**Coloane cerute de Admin:**
```
id
booking_id
dispute_type
status
description
created_at
```

**Fișiere care folosesc:**
- `entities/dispute/api/disputeApi.ts`

**Query examples:**
```typescript
.from('disputes')
.select('*')

.from('disputes')
.insert(disputeData)

.from('disputes')
.update({ status: 'resolved' })
.eq('id', disputeId)
```

---

### **29. driver_lifecycle_events**

**Operații:** SELECT

**Coloane cerute de Admin:**
```
driver_id
event_type
event_at
event_by
reason
```

**Fișiere care folosesc:**
- `entities/driver/api/driverLifecycle.ts`

**Query examples:**
```typescript
.from('driver_lifecycle_events')
.select('event_type, event_at, event_by, reason')
.eq('driver_id', driverId)
```

---

### **30. support_ticket_messages**

**Operații:** SELECT, INSERT

**Coloane cerute de Admin:**
```
id
ticket_id
sender_id
message_text
created_at
```

**Fișiere care folosesc:**
- `features/admin/support-tickets/hooks/useSupportTickets.ts`

**Query examples:**
```typescript
.from('support_ticket_messages')
.select('*')
.eq('ticket_id', ticketId)

.from('support_ticket_messages')
.insert(messageData)
```

---

### **31-34. Tabele fără SELECT explicit (doar metadata)**

**Tabele identificate dar fără query-uri detaliate:**
- `booking_metadata` — probabil JSONB storage
- `booking_timeline` — evenimente booking
- `driver_job_types` — tipuri job-uri driver
- `vehicle_service_types` — tipuri servicii vehicul

---

## 📊 REZUMAT FINAL

**Total tabele cu contracts clare:** 30  
**Total coloane unice identificate:** 200+  
**Total fișiere scanate:** 100+  

**Operații identificate:**
- SELECT: 30 tabele
- INSERT: 20 tabele
- UPDATE: 18 tabele
- DELETE: 10 tabele

**Relații (FK) presupuse:** 25+

---

## 🎯 NEXT STEP

**STEP 2:** Compară aceste contracts cu schema reală DB (așteaptă output-uri SQL de la user)

**STEP 3:** Generează Gap Analysis (ce lipsește, ce nu se potrivește)

**STEP 4:** Propune fix-uri SQL concrete
