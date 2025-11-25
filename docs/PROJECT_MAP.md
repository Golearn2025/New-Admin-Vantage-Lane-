# PROJECT MAP – ADMIN

## 1. Overview

- **Stack:** Next.js 14 App Router, TypeScript strict, Supabase PostgreSQL + Auth + Storage, monorepo pnpm + TurboRepo
- **Aplicația principală:** `apps/admin` – Dashboard administrativ complet pentru platforma de ride-sharing Vantage Lane

## 2. Apps

- `apps/admin/` (764 items)

**Rol:** Dashboard administrativ principal pentru management complet al platformei Vantage Lane (ride-sharing). Gestionează bookings, users, payments, operators, drivers, notifications.

**Rute principale:**
- `/admin/(admin)/dashboard` – Overview și metrici generale
- `/admin/(admin)/bookings` – Gestiunea rezervărilor (6 subrute)
- `/admin/(admin)/business-intelligence` – Dashboard BI cu analize timp real  
- `/admin/(admin)/users` – Management users: customers, drivers, operators (13 subrute)
- `/admin/(admin)/payments` – Gestiunea plăților (4 subrute)
- `/admin/(admin)/notifications` – Sistem notificări în timp real
- `/admin/(admin)/documents` – Verificarea documentelor drivers
- `/admin/(admin)/prices` – Management prețuri dinamice (2 subrute)
- `/admin/(admin)/settings` – Configurări sistem (12 subrute)

## 3. Packages

- `packages/ui-core/` (209 items) – Design system central: Button, Input, DataTable, EnterpriseDataTable, Modal, Charts, Icon wrapper
- `packages/ui-dashboard/` (44 items) – Componente specializate dashboard: StatCard, ChartCard, MetricCard
- `packages/ui-icons/` (37 items) – Icon system management, wrapper pentru lucide-react
- `packages/ui-table/` (8 items) – Table components avansate pentru data mari
- `packages/formatters/` (5 items) – Formatters centralizate: date, currency, phone, locations
- `packages/styles/` (3 items) – CSS tokens și theme variables centralizate  
- `packages/contracts/` (6 items) – TypeScript interfaces comune pentru type safety

## 4. Foldere speciale

- `supabase/` (14 items) – Migrations database (12) + Edge functions (2) pentru Supabase
- `scripts/` (52 items) – Scripts audit (10), AI tools (32), CI/CD (1), utilities pentru build/cleanup/guards
- `docs/` (6 items) – Documentație tehnică, orchestrator patterns, database docs, UI audit guides
- `database/` (6 items) – Legacy migrations (moved to supabase/), schema docs, backups
- `lib/` – Shared libraries și utilities
- `types/` – TypeScript type definitions globale

## 5. Fișiere de audit (`*.md` legate de audit / reguli)

| Path | Tip | Descriere |
|------|-----|-----------|
| `AUDIT-BOOKINGS-FEATURE.md` | AUDIT_ACTIV | Audit specific pentru modulul bookings cu checklist detaliat |
| `AUDIT-PERFORMANCE-PLAN.md` | AUDIT_ACTIV | Plan optimizare performanță cu măsurători concrete |
| `CENTRALIZED-COMPLETE-AUDIT.md` | AUDIT_ACTIV | Audit centralizat complet pentru calitatea codului |
| `FULL-PROJECT-AUDIT-REPORT.md` | AUDIT_ACTIV | Raport complet audit la nivel de proiect |
| `apps/admin/docs/AUDIT-CHECKLIST.md` | AUDIT_ACTIV | Checklist audit specific pentru admin app |
| `apps/admin/docs/AUDIT_COMPLETE.md` | AUDIT_ACTIV | Status audit complet pentru admin app |
| `apps/admin/docs/dashboard/AUDIT-REPORT.md` | AUDIT_ACTIV | Audit specific pentru dashboard features |
| `docs/UI_EXPANDED_ROW_AUDIT.md` | AUDIT_ACTIV | Audit pentru expanded row functionality în UI |
| `AUDIT-REPORT.md` | AUDIT_VECHI | Raport general audit (vechi, posibil outdated) |
| `full-audit.md` | AUDIT_VECHI | Audit general foarte vechi (121KB - foarte mare) |

## 6. Fișiere SQL

| Path | Tip | Observații |
|------|-----|------------|
| `supabase/migrations/20241103_dashboard_functions.sql` | MIGRATION | Activ - funcții pentru dashboard |
| `supabase/migrations/20250127012300_add_link_to_notifications.sql` | MIGRATION | Activ - adaugă link la notifications |
| `supabase/migrations/20251022_add_booking_source.sql` | MIGRATION | Activ - tracking booking source |
| `supabase/migrations/20251022_fix_all_hours_bug.sql` | MIGRATION | Activ - fix bug ore booking |
| `supabase/migrations/20251022_fix_oneway_hours.sql` | MIGRATION | Activ - fix ore oneway booking |
| `supabase/migrations/20251022_fix_vehicle_model_mappings.sql` | MIGRATION | Activ - fix mapping vehicule |
| `supabase/migrations/20251022_seed_test_vehicles.sql` | MIGRATION | Activ - seed data vehicule test |
| `supabase/migrations/20251029_notification_history_function.sql` | MIGRATION | Activ - funcții notification history |
| `supabase/migrations/20251110_document_expiry_cron.sql` | MIGRATION | Activ - cron pentru expiry documente |
| `supabase/migrations/20251110_notification_triggers.sql` | MIGRATION | Activ - triggers pentru notificări |
| `supabase/migrations/20251116_fix_notifications_rls.sql` | MIGRATION | Activ - fix RLS policies notifications |
| `supabase/migrations/cleanup_test_bookings.sql` | MIGRATION | Activ - cleanup script pentru test data |
| `database/migrations/006_permissions_system.sql` | MIGRATION | Legacy - posibil outdated (moved to supabase/) |
| `database/migrations/007_permission_functions.sql` | MIGRATION | Legacy - posibil outdated (moved to supabase/) |
| `database/migrations/008_operator_fleet_rls.sql` | MIGRATION | Legacy - posibil outdated (moved to supabase/) |
| `database/migrations/009_add_auth_user_id_to_drivers.sql` | MIGRATION | Legacy - posibil outdated (moved to supabase/) |
| `database/migrations/010_booking_transaction_function.sql` | MIGRATION | Legacy - posibil outdated (moved to supabase/) |
| `database/migrations/011_fix_operator_auth_user_id.sql` | MIGRATION | Legacy - posibil outdated (moved to supabase/) |
| `Supabase Database Backups/full_backup_20251113_114048.sql` | DRAFT | Backup complet schema și date |
| `Supabase Database Backups/backup_schema_$(date +%Y%m%d_%H%M%S).sql` | DRAFT | Template pentru backup-uri |

## 7. Scripturi & Tooling

| Path / Nume script | Tip | Descriere |
|--------------------|-----|-----------|
| `scripts/audit/audit-all.sh` | SCRIPT_FOLOSIT | Script principal pentru audit complet (referit în docs) |
| `scripts/audit/audit-one-pro.sh` | SCRIPT_FOLOSIT | Audit pentru un modul specific, professional |
| `scripts/audit/audit-performance.sh` | SCRIPT_FOLOSIT | Audit focusat pe performanță aplicație |
| `scripts/guard-app-logic.sh` | SCRIPT_FOLOSIT | Guard pentru a preveni logica în app/ (referit în package.json) |
| `scripts/guard-components.mjs` | SCRIPT_FOLOSIT | Guard pentru a preveni componente duplicate |
| `scripts/verify-clean.sh` | SCRIPT_FOLOSIT | Verificare curățenie cod |
| `scripts/verify-complete.sh` | SCRIPT_FOLOSIT | Verificare completă proiect înainte de commit |
| `scripts/verify-pr1.sh` | SCRIPT_FOLOSIT | Verificare specifică PR (referit în CI) |
| `scripts/clean-restart.sh` | SCRIPT_FOLOSIT | Clean restart pentru development environment |
| `scripts/install-ai-extensions.sh` | SCRIPT_POSIBIL_NEFOLOSIT | Instalare extensii AI pentru development |
| `scripts/replace-emoji-with-lucide.cjs` | SCRIPT_POSIBIL_NEFOLOSIT | Migration script pentru înlocuire emoji cu lucide |
| `scripts/aico/*` (32 files) | SCRIPT_POSIBIL_NEFOLOSIT | AI tools și automation (posibil folosite în CI) |
| `scripts/ci/*` | SCRIPT_FOLOSIT | Scripts pentru CI/CD pipeline |

## 8. Rezumat rapid

- Nr. fișiere de audit: 10 (8 active, 2 vechi/neclare)
- Nr. fișiere SQL: 20 (12 migrations active, 6 legacy posibil outdated, 2 backup/drafts)  
- Nr. scripturi: 15+ (10 folosite clar, 5+ posibil nefolosite)
