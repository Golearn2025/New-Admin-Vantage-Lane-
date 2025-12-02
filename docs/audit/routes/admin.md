# Routes (ADMIN)

**Total:** 52 routes
**Dynamic:** 5 routes (with parameters)
**Nested:** 33 routes (depth > 1)
**Protected:** 52 routes (require auth)

## Route List

- `/api-test` → `app/(admin)/api-test/page.tsx` 🔒 Protected
- `/bookings` → `app/(admin)/bookings/page.tsx` 🔒 Protected
- `/bookings/[id]` → `app/(admin)/bookings/[id]/page.tsx` 🔗 Dynamic 📁 Nested 🔒 Protected
- `/bookings/active` → `app/(admin)/bookings/active/page.tsx` 📁 Nested 🔒 Protected
- `/bookings/new` → `app/(admin)/bookings/new/page.tsx` 📁 Nested 🔒 Protected
- `/bookings/past` → `app/(admin)/bookings/past/page.tsx` 📁 Nested 🔒 Protected
- `/business-intelligence` → `app/(admin)/business-intelligence/page.tsx` 🔒 Protected
- `/dashboard` → `app/(admin)/dashboard/page.tsx` 🔒 Protected
- `/debug/profile` → `app/(admin)/debug/profile/page.tsx` 📁 Nested 🔒 Protected
- `/disputes` → `app/(admin)/disputes/page.tsx` 🔒 Protected
- `/documents` → `app/(admin)/documents/page.tsx` 🔒 Protected
- `/driver` → `app/(admin)/driver/page.tsx` 🔒 Protected
- `/driver/documents` → `app/(admin)/driver/documents/page.tsx` 📁 Nested 🔒 Protected
- `/invoices` → `app/(admin)/invoices/page.tsx` 🔒 Protected
- `/monitoring` → `app/(admin)/monitoring/page.tsx` 🔒 Protected
- `/notifications` → `app/(admin)/notifications/page.tsx` 🔒 Protected
- `/operator/drivers` → `app/(admin)/operator/drivers/page.tsx` 📁 Nested 🔒 Protected
- `/payments` → `app/(admin)/payments/page.tsx` 🔒 Protected
- `/payments/disputes` → `app/(admin)/payments/disputes/page.tsx` 📁 Nested 🔒 Protected
- `/payments/refunds` → `app/(admin)/payments/refunds/page.tsx` 📁 Nested 🔒 Protected
- `/payments/transactions` → `app/(admin)/payments/transactions/page.tsx` 📁 Nested 🔒 Protected
- `/payouts` → `app/(admin)/payouts/page.tsx` 🔒 Protected
- `/prices` → `app/(admin)/prices/page.tsx` 🔒 Protected
- `/prices/history` → `app/(admin)/prices/history/page.tsx` 📁 Nested 🔒 Protected
- `/project-health` → `app/(admin)/project-health/page.tsx` 🔒 Protected
- `/refunds` → `app/(admin)/refunds/page.tsx` 🔒 Protected
- `/reviews` → `app/(admin)/reviews/page.tsx` 🔒 Protected
- `/settings` → `app/(admin)/settings/page.tsx` 🔒 Protected
- `/settings/commissions` → `app/(admin)/settings/commissions/page.tsx` 📁 Nested 🔒 Protected
- `/settings/legal` → `app/(admin)/settings/legal/page.tsx` 📁 Nested 🔒 Protected
- `/settings/notifications` → `app/(admin)/settings/notifications/page.tsx` 📁 Nested 🔒 Protected
- `/settings/permissions` → `app/(admin)/settings/permissions/page.tsx` 📁 Nested 🔒 Protected
- `/settings/profile` → `app/(admin)/settings/profile/page.tsx` 📁 Nested 🔒 Protected
- `/settings/roles` → `app/(admin)/settings/roles/page.tsx` 📁 Nested 🔒 Protected
- `/settings/security` → `app/(admin)/settings/security/page.tsx` 📁 Nested 🔒 Protected
- `/settings/vehicle-categories` → `app/(admin)/settings/vehicle-categories/page.tsx` 📁 Nested 🔒 Protected
- `/settings/webhooks` → `app/(admin)/settings/webhooks/page.tsx` 📁 Nested 🔒 Protected
- `/support-tickets` → `app/(admin)/support-tickets/page.tsx` 🔒 Protected
- `/support-tickets/[id]` → `app/(admin)/support-tickets/[id]/page.tsx` 🔗 Dynamic 📁 Nested 🔒 Protected
- `/users` → `app/(admin)/users/page.tsx` 🔒 Protected
- `/users/[id]` → `app/(admin)/users/[id]/page.tsx` 🔗 Dynamic 📁 Nested 🔒 Protected
- `/users/admins` → `app/(admin)/users/admins/page.tsx` 📁 Nested 🔒 Protected
- `/users/all` → `app/(admin)/users/all/page.tsx` 📁 Nested 🔒 Protected
- `/users/assign-drivers-to-operators` → `app/(admin)/users/assign-drivers-to-operators/page.tsx` 📁 Nested 🔒 Protected
- `/users/corporate` → `app/(admin)/users/corporate/page.tsx` 📁 Nested 🔒 Protected
- `/users/customers` → `app/(admin)/users/customers/page.tsx` 📁 Nested 🔒 Protected
- `/users/drivers` → `app/(admin)/users/drivers/page.tsx` 📁 Nested 🔒 Protected
- `/users/drivers/[id]` → `app/(admin)/users/drivers/[id]/page.tsx` 🔗 Dynamic 📁 Nested 🔒 Protected
- `/users/drivers/[id]/verify` → `app/(admin)/users/drivers/[id]/verify/page.tsx` 🔗 Dynamic 📁 Nested 🔒 Protected
- `/users/drivers/pending` → `app/(admin)/users/drivers/pending/page.tsx` 📁 Nested 🔒 Protected
- `/users/operators` → `app/(admin)/users/operators/page.tsx` 📁 Nested 🔒 Protected
- `/users/trash` → `app/(admin)/users/trash/page.tsx` 📁 Nested 🔒 Protected
