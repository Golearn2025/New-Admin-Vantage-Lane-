.
├── app
│   ├── (admin)
│   │   ├── audit-history
│   │   │   └── page.tsx
│   │   ├── bookings
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── active
│   │   │   │   └── page.tsx
│   │   │   ├── new
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── past
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   ├── dashboard.module.css
│   │   │   ├── feature.ts
│   │   │   └── page.tsx
│   │   ├── disputes
│   │   │   └── page.tsx
│   │   ├── documents
│   │   │   └── page.tsx
│   │   ├── invoices
│   │   │   └── page.tsx
│   │   ├── monitoring
│   │   │   └── page.tsx
│   │   ├── notifications
│   │   │   └── page.tsx
│   │   ├── operator
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   └── drivers
│   │   │       └── page.tsx
│   │   ├── payments
│   │   │   ├── disputes
│   │   │   │   └── page.tsx
│   │   │   ├── refunds
│   │   │   │   └── page.tsx
│   │   │   ├── transactions
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── payouts
│   │   │   └── page.tsx
│   │   ├── prices
│   │   │   ├── history
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── project-health
│   │   │   └── page.tsx
│   │   ├── refunds
│   │   │   └── page.tsx
│   │   ├── settings
│   │   │   ├── commissions
│   │   │   │   └── page.tsx
│   │   │   ├── legal
│   │   │   │   └── page.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── permissions
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   ├── feature.ts
│   │   │   │   ├── page.tsx
│   │   │   │   └── profile.module.css
│   │   │   ├── roles
│   │   │   │   └── page.tsx
│   │   │   ├── security
│   │   │   │   └── page.tsx
│   │   │   ├── vehicle-categories
│   │   │   │   └── page.tsx
│   │   │   ├── webhooks
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── support-tickets
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── users
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── admins
│   │   │   │   └── page.tsx
│   │   │   ├── all
│   │   │   │   └── page.tsx
│   │   │   ├── corporate
│   │   │   │   └── page.tsx
│   │   │   ├── customers
│   │   │   │   └── page.tsx
│   │   │   ├── drivers
│   │   │   │   ├── [id]
│   │   │   │   ├── pending
│   │   │   │   └── page.tsx
│   │   │   ├── operators
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.module.css
│   │   └── layout.tsx
│   ├── api
│   │   ├── bookings
│   │   │   ├── [id]
│   │   │   │   └── legs
│   │   │   ├── counts
│   │   │   │   └── route.ts
│   │   │   ├── create
│   │   │   │   └── route.ts
│   │   │   └── list
│   │   │       ├── helpers.ts
│   │   │       ├── route.ts
│   │   │       └── transform.ts
│   │   ├── dashboard
│   │   │   ├── charts
│   │   │   │   └── route.ts
│   │   │   └── metrics
│   │   │       └── route.ts
│   │   ├── health
│   │   │   └── route.ts
│   │   └── notifications
│   │       └── history
│   │           └── route.ts
│   ├── forgot-password
│   │   ├── forgot-password.module.css
│   │   └── page.tsx
│   ├── login
│   │   ├── login.module.css
│   │   └── page.tsx
│   ├── logout
│   │   ├── logout.module.css
│   │   └── page.tsx
│   ├── test-simple
│   │   └── page.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── utilities.css
├── apps
│   ├── admin
│   │   ├── app
│   │   │   ├── (admin)
│   │   │   │   └── dashboard
│   │   │   ├── test-simple
│   │   │   │   └── page.tsx
│   │   │   └── ui-dashboard-demo
│   │   │       └── page.tsx
│   │   ├── docs
│   │   │   ├── dashboard
│   │   │   │   ├── AUDIT-REPORT.md
│   │   │   │   ├── binding-spec.md
│   │   │   │   ├── chart-lib-decision.md
│   │   │   │   ├── error-policy.md
│   │   │   │   ├── FILTER-SYNC-VERIFICATION.md
│   │   │   │   ├── FILTERS-REUSABLE.md
│   │   │   │   ├── FLOW-TABURI-CALENDAR.md
│   │   │   │   ├── i18n-formatting.md
│   │   │   │   ├── IMPLEMENTATION-SUMMARY.md
│   │   │   │   ├── responsiveness.md
│   │   │   │   └── test-matrix.md
│   │   │   ├── DECISIONS
│   │   │   │   ├── ADR-0001.md
│   │   │   │   └── ADR-0002-dashboard-real-data.md
│   │   │   ├── ACCEPTANCE.md
│   │   │   ├── ARCHITECTURE.md
│   │   │   ├── AUDIT_COMPLETE.md
│   │   │   ├── AUDIT-CHECKLIST.md
│   │   │   ├── BIBLIOTECA-REUTILIZABILE.md
│   │   │   ├── CHECKLIST.md
│   │   │   ├── DESIGN-SYSTEM.md
│   │   │   ├── ENTERPRISE-CHECKLIST.md
│   │   │   ├── FREEZE-LIST.md
│   │   │   ├── LOGIN-BRIEF.md
│   │   │   ├── OPERATIONS.md
│   │   │   ├── OWNERS.md
│   │   │   ├── PERFORMANCE.md
│   │   │   ├── PLAN-BIBLIOTECA-DATATRACK-IQ.md
│   │   │   ├── PROGRES-BIBLIOTECA.md
│   │   │   ├── PROJECT-PLAN.md
│   │   │   ├── QUALITY-GATE.md
│   │   │   ├── ROADMAP.md
│   │   │   ├── SCHEMA.md
│   │   │   ├── SECURITY.md
│   │   │   ├── SIGURANTA-BIBLIOTECA.md
│   │   │   ├── STRIPE.md
│   │   │   └── TESTING.md
│   │   ├── entities
│   │   │   ├── admin
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── admin.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── booking
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── booking-leg
│   │   │   │   ├── api
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── customer
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── customer.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── dispute
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── dispute.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── document
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── driver
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── driver.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── invoice
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── index.ts
│   │   │   │   └── invoice.test.ts
│   │   │   ├── notification
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── index.ts
│   │   │   │   └── notification.test.ts
│   │   │   ├── operator
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── index.ts
│   │   │   │   └── operator.test.ts
│   │   │   ├── payment
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── permission
│   │   │   │   ├── api
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── platform-settings
│   │   │   │   ├── api
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── pricing
│   │   │   │   ├── api
│   │   │   │   ├── model
│   │   │   │   └── index.ts
│   │   │   ├── refund
│   │   │   │   ├── api
│   │   │   │   ├── lib
│   │   │   │   ├── model
│   │   │   │   ├── index.ts
│   │   │   │   └── refund.test.ts
│   │   │   └── user
│   │   │       ├── api
│   │   │       ├── lib
│   │   │       ├── model
│   │   │       └── index.ts
│   │   ├── features
│   │   │   ├── admins-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── admins-table.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── auth-forgot-password
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   └── index.ts
│   │   │   ├── auth-login
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   └── index.ts
│   │   │   ├── booking-create
│   │   │   │   ├── components
│   │   │   │   ├── constants
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   ├── bookings-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── utils
│   │   │   │   ├── index.ts
│   │   │   │   ├── README.md
│   │   │   │   └── types.ts
│   │   │   ├── customers-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── customers-table.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── dashboard
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   └── index.ts
│   │   │   ├── dashboard-metrics
│   │   │   │   ├── DashboardMetrics.module.css
│   │   │   │   ├── DashboardMetrics.tsx
│   │   │   │   └── useDashboardMetrics.ts
│   │   │   ├── disputes-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── disputes-table.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── document-viewer
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── document-viewer.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── documents-approval
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   ├── driver-verification
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── driver-verification.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── drivers-pending
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── drivers-pending.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── drivers-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── drivers-table.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── invoices-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── invoices-table.test.ts
│   │   │   ├── notification-center
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── notification-center.test.ts
│   │   │   ├── notifications-management
│   │   │   │   ├── components
│   │   │   │   └── index.ts
│   │   │   ├── operator-dashboard
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── operator-dashboard.test.ts
│   │   │   ├── operator-drivers-list
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── operator-drivers-list.test.ts
│   │   │   ├── operators-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── operators-table.test.ts
│   │   │   ├── payments-overview
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── payments-overview.test.ts
│   │   │   ├── payments-table
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── index.test.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── payouts-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── utils
│   │   │   │   ├── constants.ts
│   │   │   │   ├── index.test.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── prices-management
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   └── prices-management.test.ts
│   │   │   ├── refunds-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── refunds-table.test.ts
│   │   │   ├── settings-commissions
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── settings-commissions.test.ts
│   │   │   ├── settings-permissions
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── settings-permissions.test.ts
│   │   │   ├── settings-profile
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── utils
│   │   │   │   └── index.ts
│   │   │   ├── settings-vehicle-categories
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── settings-vehicle-categories.test.ts
│   │   │   ├── user-create-modal
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── user-create-modal.test.ts
│   │   │   ├── user-edit-modal
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── user-edit-modal.test.ts
│   │   │   ├── user-profile
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   ├── user-view-modal
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── user-view-modal.test.ts
│   │   │   ├── users-table
│   │   │   │   ├── columns
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── index.test.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   └── users-table-base
│   │   │       ├── columns
│   │   │       ├── components
│   │   │       ├── hooks
│   │   │       ├── types
│   │   │       ├── index.ts
│   │   │       └── users-table-base.test.ts
│   │   ├── lib
│   │   │   ├── stripe
│   │   │   │   ├── client.ts
│   │   │   │   └── server.ts
│   │   │   ├── supabase
│   │   │   │   ├── client.ts
│   │   │   │   └── server.ts
│   │   │   └── utils
│   │   │       └── logger.ts
│   │   ├── public
│   │   ├── scripts
│   │   │   └── test-stripe.ts
│   │   ├── shared
│   │   │   ├── api
│   │   │   │   ├── auth
│   │   │   │   ├── clients
│   │   │   │   └── contracts
│   │   │   ├── config
│   │   │   │   ├── design-tokens
│   │   │   │   ├── dashboard.cards.ts
│   │   │   │   ├── dashboard.charts.ts
│   │   │   │   └── dashboard.types.ts
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── useCurrentUser.ts
│   │   │   │   ├── useDateFilter.ts
│   │   │   │   ├── useLogout.ts
│   │   │   │   └── useNotifications.ts
│   │   │   ├── ui
│   │   │   │   └── composed
│   │   │   └── utils
│   │   │       └── chartGrouping.ts
│   │   └── tests
│   │       ├── contracts
│   │       │   ├── bookings.test.ts
│   │       │   ├── payments.test.ts
│   │       │   └── users.test.ts
│   │       └── rls
│   │           └── rbac-cleanup.test.ts
│   ├── driver
│   │   ├── app
│   │   │   ├── _ui
│   │   │   │   ├── AuthCard
│   │   │   │   ├── BrandBackground
│   │   │   │   ├── BrandName
│   │   │   │   ├── Button
│   │   │   │   ├── Checkbox
│   │   │   │   ├── ErrorBanner
│   │   │   │   ├── FormRow
│   │   │   │   └── Input
│   │   │   ├── (driver)
│   │   │   │   ├── bookings
│   │   │   │   ├── documents
│   │   │   │   ├── earnings
│   │   │   │   ├── profile
│   │   │   │   ├── support
│   │   │   │   ├── layout.module.css
│   │   │   │   ├── layout.tsx
│   │   │   │   └── placeholders.module.css
│   │   │   ├── bookings
│   │   │   ├── login
│   │   │   │   ├── login.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── entities
│   │   │   ├── driver-document
│   │   │   │   ├── api
│   │   │   │   ├── schemas
│   │   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   └── notification
│   │   │       ├── api
│   │   │       ├── model
│   │   │       └── index.ts
│   │   ├── features
│   │   │   ├── document-card
│   │   │   │   ├── components
│   │   │   │   └── index.ts
│   │   │   ├── document-upload
│   │   │   │   ├── components
│   │   │   │   └── index.ts
│   │   │   └── documents-manager
│   │   │       ├── hooks
│   │   │       └── index.ts
│   │   ├── public
│   │   │   └── brand
│   │   │       └── logo.png
│   │   ├── shared
│   │   │   ├── api
│   │   │   │   ├── auth
│   │   │   │   └── clients
│   │   │   ├── hooks
│   │   │   │   └── useNotifications.ts
│   │   │   ├── lib
│   │   │   │   └── supabase
│   │   │   └── ui
│   │   │       └── composed
│   │   ├── next-env.d.ts
│   │   ├── next.config.js
│   │   ├── next.config.js.backup
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   └── fleet
│       ├── app
│       │   ├── _ui
│       │   │   ├── AuthCard
│       │   │   ├── BrandBackground
│       │   │   ├── BrandName
│       │   │   ├── Button
│       │   │   ├── Checkbox
│       │   │   ├── ErrorBanner
│       │   │   ├── FormRow
│       │   │   └── Input
│       │   ├── (fleet)
│       │   │   ├── bookings
│       │   │   ├── dashboard
│       │   │   ├── drivers
│       │   │   ├── earnings
│       │   │   ├── vehicles
│       │   │   ├── layout.module.css
│       │   │   └── layout.tsx
│       │   ├── dashboard
│       │   ├── login
│       │   │   ├── login.module.css
│       │   │   └── page.tsx
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── entities
│       │   └── notification
│       │       ├── api
│       │       ├── model
│       │       └── index.ts
│       ├── public
│       │   └── brand
│       │       └── logo.png
│       ├── shared
│       │   ├── api
│       │   │   ├── auth
│       │   │   └── clients
│       │   ├── hooks
│       │   │   └── useNotifications.ts
│       │   ├── lib
│       │   │   └── supabase
│       │   └── ui
│       │       └── composed
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── next.config.js.backup
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
├── database
│   └── migrations
│       ├── 006_permissions_system.sql
│       ├── 007_permission_functions.sql
│       └── 008_operator_fleet_rls.sql
├── docs
│   ├── database
│   │   ├── BOOKINGS_DATA_MAPPING.md
│   │   └── BOOKINGS_RLS_POLICIES.md
│   ├── BOOKING_SOURCE_TRACKING.md
│   ├── ORCHESTRATOR-PATTERN.md
│   ├── UI_EXPANDED_ROW_AUDIT.md
│   └── VERIFY_ONEWAY_BOOKING.md
├── lib
│   ├── config
│   │   ├── api.ts
│   │   └── env.ts
│   ├── middleware
│   │   └── rbac.ts
│   ├── supabase
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils
│       └── logger.ts
├── packages
│   ├── contracts
│   │   ├── src
│   │   │   ├── bookings.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── formatters
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── styles
│   │   ├── globals.css
│   │   ├── package.json
│   │   └── README.md
│   ├── ui-core
│   │   ├── src
│   │   │   ├── ActionButton
│   │   │   │   ├── ActionButton.module.css
│   │   │   │   ├── ActionButton.tsx
│   │   │   │   ├── ActionButton.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── ActionMenu
│   │   │   │   ├── ActionMenu.module.css
│   │   │   │   ├── ActionMenu.tsx
│   │   │   │   ├── ActionMenu.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── ActivityCard
│   │   │   │   ├── ActivityCard.module.css
│   │   │   │   ├── ActivityCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── AuthCard
│   │   │   │   ├── AuthCard.module.css
│   │   │   │   ├── AuthCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Avatar
│   │   │   │   ├── Avatar.module.css
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge
│   │   │   │   ├── Badge.module.css
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── BookingCard
│   │   │   │   ├── BookingCard.module.css
│   │   │   │   ├── BookingCard.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── BrandBackground
│   │   │   │   ├── BrandBackground.module.css
│   │   │   │   ├── BrandBackground.tsx
│   │   │   │   └── index.ts
│   │   │   ├── BrandName
│   │   │   │   ├── BrandName.module.css
│   │   │   │   ├── BrandName.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Button
│   │   │   │   ├── Button.module.css
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card
│   │   │   │   ├── Card.module.css
│   │   │   │   ├── Card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ChartCard
│   │   │   │   └── ChartCard.module.css
│   │   │   ├── charts
│   │   │   │   ├── BarChartPremium
│   │   │   │   └── index.ts
│   │   │   ├── Checkbox
│   │   │   │   ├── Checkbox.module.css
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   └── index.ts
│   │   │   ├── components
│   │   │   │   ├── NotificationBell
│   │   │   │   ├── StatusBadge
│   │   │   │   └── index.ts
│   │   │   ├── ConfirmDialog
│   │   │   │   ├── ConfirmDialog.module.css
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   └── index.ts
│   │   │   ├── DataTable
│   │   │   │   ├── components
│   │   │   │   ├── hooks
│   │   │   │   ├── types
│   │   │   │   ├── BulkActionsToolbar.module.css
│   │   │   │   ├── BulkActionsToolbar.tsx
│   │   │   │   ├── DataTable.hooks.ts
│   │   │   │   ├── DataTable.module.css
│   │   │   │   ├── DataTable.states.module.css
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── DataTable.utils.ts
│   │   │   │   ├── DataTable.variants.module.css
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── EnterpriseDataTable.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── LoadingSkeleton.tsx
│   │   │   │   ├── TableBody.tsx
│   │   │   │   ├── TableCell.tsx
│   │   │   │   ├── TableHeader.tsx
│   │   │   │   ├── TableRow.tsx
│   │   │   │   └── types.ts
│   │   │   ├── DonutCard
│   │   │   │   ├── DonutCard.module.css
│   │   │   │   ├── DonutCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ErrorBanner
│   │   │   │   ├── ErrorBanner.module.css
│   │   │   │   ├── ErrorBanner.tsx
│   │   │   │   └── index.ts
│   │   │   ├── FormField
│   │   │   │   ├── FormField.module.css
│   │   │   │   ├── FormField.tsx
│   │   │   │   └── index.ts
│   │   │   ├── FormRow
│   │   │   │   ├── FormRow.module.css
│   │   │   │   ├── FormRow.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Icon
│   │   │   │   ├── Icon.module.css
│   │   │   │   ├── Icon.tsx
│   │   │   │   ├── icons.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input
│   │   │   │   ├── index.ts
│   │   │   │   ├── Input.module.css
│   │   │   │   └── Input.tsx
│   │   │   ├── LoginForm
│   │   │   │   ├── index.ts
│   │   │   │   ├── LoginForm.module.css
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── MetricBarsCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── MetricBarsCard.module.css
│   │   │   │   └── MetricBarsCard.tsx
│   │   │   ├── MiniMetricCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── MiniMetricCard.module.css
│   │   │   │   └── MiniMetricCard.tsx
│   │   │   ├── Modal
│   │   │   │   ├── index.ts
│   │   │   │   ├── Modal.module.css
│   │   │   │   └── Modal.tsx
│   │   │   ├── Pagination
│   │   │   │   ├── index.ts
│   │   │   │   ├── Pagination.module.css
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── Pagination.types.ts
│   │   │   │   ├── PaginationButton.tsx
│   │   │   │   └── PaginationInfo.tsx
│   │   │   ├── ProfileCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── ProfileCard.module.css
│   │   │   │   └── ProfileCard.tsx
│   │   │   ├── ProfileSection
│   │   │   │   ├── index.ts
│   │   │   │   ├── ProfileSection.module.css
│   │   │   │   └── ProfileSection.tsx
│   │   │   ├── ProgressCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── ProgressCard.module.css
│   │   │   │   └── ProgressCard.tsx
│   │   │   ├── RowActions
│   │   │   │   ├── index.ts
│   │   │   │   ├── RowActions.module.css
│   │   │   │   └── RowActions.tsx
│   │   │   ├── SaveButton
│   │   │   │   ├── index.ts
│   │   │   │   ├── SaveButton.module.css
│   │   │   │   └── SaveButton.tsx
│   │   │   ├── Select
│   │   │   │   ├── index.ts
│   │   │   │   ├── Select.module.css
│   │   │   │   └── Select.tsx
│   │   │   ├── StatCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── StatCard.module.css
│   │   │   │   └── StatCard.tsx
│   │   │   ├── TableActions
│   │   │   │   ├── index.ts
│   │   │   │   ├── TableActions.module.css
│   │   │   │   └── TableActions.tsx
│   │   │   ├── TableCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── TableCard.module.css
│   │   │   │   └── TableCard.tsx
│   │   │   ├── TableFilters
│   │   │   │   ├── AmountRangeFilter.tsx
│   │   │   │   ├── DateRangeFilter.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── SearchFilter.tsx
│   │   │   │   ├── StatusFilter.tsx
│   │   │   │   ├── TableFilters.module.css
│   │   │   │   ├── TableFilters.tsx
│   │   │   │   └── types.ts
│   │   │   ├── Tabs
│   │   │   │   ├── index.ts
│   │   │   │   ├── Tabs.module.css
│   │   │   │   └── Tabs.tsx
│   │   │   ├── theme
│   │   │   │   ├── index.ts
│   │   │   │   ├── theme-presets.ts
│   │   │   │   └── ThemeProvider.tsx
│   │   │   ├── ThemeSwitcher
│   │   │   │   ├── index.ts
│   │   │   │   ├── ThemeSwitcher.module.css
│   │   │   │   └── ThemeSwitcher.tsx
│   │   │   ├── tokens
│   │   │   │   ├── animations.css
│   │   │   │   ├── borders.css
│   │   │   │   ├── colors.css
│   │   │   │   ├── index.css
│   │   │   │   ├── shadows.css
│   │   │   │   ├── spacing.css
│   │   │   │   └── typography.css
│   │   │   ├── UserBadge
│   │   │   │   ├── index.ts
│   │   │   │   ├── UserBadge.module.css
│   │   │   │   └── UserBadge.tsx
│   │   │   ├── css-modules.d.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── REFACTORING-COMPLETE.md
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── ui-dashboard
│   │   ├── src
│   │   │   ├── cards
│   │   │   │   ├── MetricCard
│   │   │   │   └── index.ts
│   │   │   ├── charts
│   │   │   │   ├── BarBasic
│   │   │   │   ├── DonutChart
│   │   │   │   ├── LineChart
│   │   │   │   ├── StackedBarChart
│   │   │   │   ├── WaterfallChart
│   │   │   │   ├── constants.ts
│   │   │   │   └── index.ts
│   │   │   ├── components
│   │   │   │   └── index.ts
│   │   │   ├── filters
│   │   │   │   ├── DateFilterPreset
│   │   │   │   ├── DateRangePicker
│   │   │   │   ├── FilterBar
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   └── useDateRangeOrchestrator.ts
│   │   │   ├── theme
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── palettes.ts
│   │   │   ├── utils
│   │   │   │   ├── datePeriods.ts
│   │   │   │   ├── datePresets.ts
│   │   │   │   ├── dateRangePresets.ts
│   │   │   │   ├── dateTypes.ts
│   │   │   │   ├── dateUtils.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── useCounterAnimation.ts
│   │   │   ├── css-modules.d.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── ui-icons
│   │   ├── src
│   │   │   ├── _adapters
│   │   │   │   └── lucide.tsx
│   │   │   ├── Assign.tsx
│   │   │   ├── Bell.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Cancel.tsx
│   │   │   ├── ChevronDown.tsx
│   │   │   ├── Clock.tsx
│   │   │   ├── Copy.tsx
│   │   │   ├── CreditCard.tsx
│   │   │   ├── Currency.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Documents.tsx
│   │   │   ├── Download.tsx
│   │   │   ├── Edit.tsx
│   │   │   ├── Email.tsx
│   │   │   ├── Eye.tsx
│   │   │   ├── index.ts
│   │   │   ├── Luggage.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Monitoring.tsx
│   │   │   ├── More.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── Phone.tsx
│   │   │   ├── Plane.tsx
│   │   │   ├── Refunds.tsx
│   │   │   ├── Route.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Support.tsx
│   │   │   ├── types.ts
│   │   │   ├── User.tsx
│   │   │   ├── UserPlus.tsx
│   │   │   ├── Users.tsx
│   │   │   └── View.tsx
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── ui-table
│   │   ├── src
│   │   │   ├── DataTable.module.css
│   │   │   ├── DataTable.module.css.d.ts
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTable.types.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   ├── CHANGELOG.md
│   ├── PR-CHECKLIST.md
│   ├── PR1-SUMMARY.md
│   ├── PR1.1-SUMMARY.md
│   ├── PR2-SUMMARY.md
│   ├── PR3-SUMMARY.md
│   └── README.md
├── public
│   ├── brand
│   │   └── logo.png
│   └── site.webmanifest
├── reports
│   ├── audit
│   │   ├── files
│   │   ├── pages
│   │   ├── findings.csv
│   │   ├── INDEX.json
│   │   └── summary.md
│   ├── circular.txt
│   ├── depcruise.txt
│   ├── eslint.log
│   ├── next-build.log
│   └── tsc.log
├── scripts
│   ├── aico
│   │   ├── config
│   │   │   ├── aico-creation-rules.json
│   │   │   └── aico-extended-rules.json
│   │   ├── generators
│   │   │   ├── create-entity.cjs
│   │   │   ├── create-feature.cjs
│   │   │   ├── create-page.cjs
│   │   │   └── create-ui.cjs
│   │   ├── guardian
│   │   │   └── ai-guardian-ultimate.cjs
│   │   ├── modules
│   │   │   ├── advanced-code-quality.cjs
│   │   │   ├── code-audit.cjs
│   │   │   ├── dead-code-checker.cjs
│   │   │   ├── dependency-checker.cjs
│   │   │   ├── page-pattern-checker.cjs
│   │   │   ├── performance-checker.cjs
│   │   │   ├── security-pro-scanner.cjs
│   │   │   ├── structure-checker.cjs
│   │   │   ├── typescript-checker.cjs
│   │   │   ├── ui-accessibility-checker.cjs
│   │   │   └── ui-pattern-checker.cjs
│   │   ├── templates
│   │   │   ├── api
│   │   │   │   └── route.ts.template
│   │   │   ├── components
│   │   │   │   ├── component.test.tsx.template
│   │   │   │   ├── component.tsx.template
│   │   │   │   ├── component.types.ts.template
│   │   │   │   └── index.ts.template
│   │   │   ├── hooks
│   │   │   │   ├── useAnimations.ts.template
│   │   │   │   ├── useEvents.ts.template
│   │   │   │   └── useManager.ts.template
│   │   │   └── stores
│   │   │       └── store.ts.template
│   │   ├── aico-cli.cjs
│   │   ├── aico-generator.js
│   │   ├── README.md
│   │   ├── structure-validator.js
│   │   └── template-engine.js
│   ├── ci
│   │   └── fail-empty-dirs.mjs
│   ├── check-deadcode.sh
│   ├── check-duplicates.sh
│   ├── check-everything.sh
│   ├── check-health.sh
│   ├── check-performance.sh
│   ├── check-quality.sh
│   ├── clean-restart.sh
│   ├── guard-app-logic.sh
│   ├── guard-components.mjs
│   ├── install-ai-extensions.sh
│   ├── README.md
│   ├── replace-emoji-with-lucide.cjs
│   └── verify-pr1.sh
├── supabase
│   └── migrations
│       ├── 20241103_dashboard_functions.sql
│       ├── 20250127012300_add_link_to_notifications.sql
│       ├── 20251022_add_booking_source.sql
│       ├── 20251022_fix_all_hours_bug.sql
│       ├── 20251022_fix_oneway_hours.sql
│       ├── 20251022_fix_vehicle_model_mappings.sql
│       ├── 20251022_seed_test_vehicles.sql
│       ├── 20251029_notification_history_function.sql
│       └── cleanup_test_bookings.sql
├── templates
│   ├── component.tsx.hbs
│   ├── index.ts.hbs
│   ├── stories.tsx.hbs
│   ├── styles.module.css.hbs
│   └── test.tsx.hbs
├── types
│   └── css-modules.d.ts
├── ADVANCED-QUALITY-CHECKS.md
├── all-tests-final.txt
├── all-tests-fixed.txt
├── all-tests-result.txt
├── AUDIT-BOOKINGS-FEATURE.md
├── AUDIT-BOOKINGS-RESULTS.json
├── AUDIT-PERFORMANCE-PLAN.md
├── AUDIT-REPORT.md
├── audit-structure.sh
├── bookings-test-result.txt
├── CACHE-FIX-EXPLAINED.md
├── CHANGELOG.md
├── circular-full.txt
├── circular.txt
├── DATABASE-ANALYSIS.md
├── DATABASE-ARCHITECTURE.md
├── DATABASE-MIGRATIONS.md
├── dead.txt
├── deps.txt
├── eslint-errors.log
├── files-with-hooks.txt
├── full-audit.md
├── IMPLEMENTATION-PLAN.md
├── lighthouse-login-report.json
├── lint.txt
├── mcp_config.json
├── middleware.ts
├── MIGRATION-PROGRESS.md
├── missing-use-client.txt
├── next-env.d.ts
├── next.config.js
├── P0-FILES-CHECKLIST.md
├── P0-REFACTORING-SUMMARY.md
├── package-lock.json
├── package.json
├── PERMISSIONS-SYSTEM.md
├── PHASE-2-COMPLETE-SUMMARY.md
├── plopfile.cjs
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── PORTALS-GUIDE.md
├── PROJECT-ROADMAP.md
├── PROJECT-STATUS.md
├── README.md
├── REFACTORING-REPORT.md
├── render.yaml
├── RULES.md
├── STRUCTURE.md
├── svgo.config.js
├── TEST-INSTRUCTIONS.md
├── test-results.txt
├── tests.txt
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── typescript-errors.log
├── typescript.txt
├── vantage-lane-complete-schema.json
├── VANTAGE-PREMIUM-PROGRESS.md
├── VER-2.4-CHECKLIST.md
├── VER-2.4-REFACTORING-PLAN.md
├── vitest.config.ts
└── WORKFLOW.md

502 directories, 657 files
