# AUDIT ENTERPRISE – ADMIN

## 1. Frontend & UI-Core

### 1.1. Stil & Design Tokens
[ ] fără `any` nejustificat
[ ] fără `ts-ignore` (suppress-uri de erori)
[ ] fără culori hardcodate (doar design tokens)
[ ] fără `px` brute (doar tokens / rem / tailwind tokens)
[ ] zero inline style
[ ] zero `!important`
[ ] zero magic numbers (extras în tokens/const)
[ ] CSS Modules pentru styling local, nu global styles

### 1.2. Layout & Responsiveness
[ ] responsive minim: 320, 375, 768, 1024, 1440
[ ] responsive design testat pe mobile, tablet, desktop
[ ] sticky header acolo unde e logic (tabele, liste lungi)
[ ] fără overflow orizontal necontrolat
[ ] tabelele mari sunt utilizabile pe mobile (scroll / card view)

### 1.3. Componente & Patterns
[ ] doar `EnterpriseDataTable` pentru tabele mari
[ ] formatters centralizate (date, money, status, locations)
[ ] filtre reutilizabile, nu copy/paste
[ ] fără `fetch` direct în UI (doar prin hooks / data layer)
[ ] fără inline functions costisitoare în `.map`
[ ] fără re-fetch la fiecare re-render (cache, SWR / React Query)
[ ] pagination cu limit/offset clar
[ ] pagination server-side pentru liste >100 items, keyset pentru >1000
[ ] expanded row components primesc toate datele necesare (nu doar ID)

### 1.4. Accesibilitate & UX
[ ] axe-core passing (fără erori critice)
[ ] keyboard navigation funcțională
[ ] aria-labels pentru butoane icon-only
[ ] focus states vizibile
[ ] A11y compliance: focus visible, ARIA labels, alt text

### 1.5. Igienă cod
[ ] zero cod mort (ts-prune rulat regulat)
[ ] zero deps nefolosite (depcheck)
[ ] zero circular imports (madge)
[ ] output brut (ts-prune / depcheck / madge) atașat în PR-uri mari
[ ] file size limits: UI ≤200 lines, logic ≤150 lines, hooks ≤80 lines
[ ] ESLint clean: zero warnings sau errors
[ ] Prettier formatted: consistent code formatting

## 2. Securitate & Auth

> Vezi `docs/AUTH_AUDIT_REPORT.md` pentru statusul actual și problemele identificate pe Auth & Security (admin, operator, driver).

[ ] toate rutele admin protejate de auth
[ ] verificarea rolurilor făcută server-side (nu doar în UI)
[ ] niciun `service_role` în cod de client
[ ] niciun secret / cheie hardcodată în repo
[ ] log-urile nu conțin date sensibile
[ ] toate server actions / API routes validează input-ul (zod / schema)
[ ] endpoints critice au auth + role check +, ideal, rate limiting
[ ] RLS enabled: toate query-urile cu Row Level Security
[ ] input validation: schema validation pentru toate forms
[ ] XSS prevention: user input sanitized

## 3. Database & Supabase

[ ] migrations din repo = schema reală din Supabase (fără drift)
[ ] SQL vechi / nefolosit mutat în `supabase/sql/_archive`
[ ] index-uri pe coloanele folosite în filtre / sortări
[ ] fără `select('*')` pe tabele mari în UI
[ ] fără N+1 queries în UI (folosite joins / views / RPC)
[ ] RLS activ pentru tabele cu date de user
[ ] RLS testat pentru fiecare rol (super_admin, operator, driver, customer)
[ ] query optimization: database queries <200ms p95

## 4. Realtime & Notificări

[ ] subscriptions create o singură dată (nu la fiecare render)
[ ] unsubscribe corect în cleanup (`useEffect`)
[ ] fără memory leaks evidente la Realtime
[ ] store centralizat pentru notificări
[ ] tipurile de notificări tipizate (TS unions, nu string random)

## 5. Arhitectură & Reutilizare

[ ] structură feature-based (bookings, notifications, drivers, operators, payments etc.)
[ ] în fiecare feature, separare pe `components/`, `hooks/`, `data/`, `types/`
[ ] data-access separat de componente (fără Supabase direct în UI)
[ ] tipuri comune centralizate (DTO, Supabase rows)
[ ] componente UI generice puse în `ui-core`

## 6. Performanță & Scalabilitate

[ ] dynamic imports pentru componente grele (charts, maps, tabele mari)
[ ] fără console.log masiv în producție
[ ] bundle-ul nu include librării mari nefolosite
[ ] paginare pentru toate listele mari; virtualizare dacă sunt foarte mari
[ ] caching pentru date statice/semi-statice unde are sens
[ ] bundle impact: <+20KB gzipped sau justificare
[ ] Core Web Vitals: LCP <2s, CLS <0.1, TBT <200ms
[ ] componente slow render: <16ms target pentru performance
[ ] memory leaks detection și prevention
[ ] re-render-uri inutile evitate

## 7. CI/CD & Teste

[ ] pipeline CI (GitHub Actions sau similar) cu:
    - install
    - lint
    - typecheck
    - test
    - build
[ ] CI rulează pe `push` și `pull_request` pe branch-urile principale
[ ] build-ul trece pe CI înainte de deploy pe Render
[ ] există minim 3–5 smoke tests documentate (login, bookings, notificări)
[ ] contract test: pentru endpoint-uri noi/modificate
[ ] RLS test: pentru policy-uri noi/modificate
[ ] component test: pentru UI nou/modificat
[ ] test coverage: minimum 80% pentru module nou

## 8. Logging, Monitorizare & Erori

[ ] error boundary global pentru admin
[ ] sistem de logging unitar (nu console.log random peste tot)
[ ] nu logăm date sensibile
[ ] health check endpoint/documentat pentru Render

## 9. Legătura cu documentația veche

### 9.1. Fișiere din care au fost integrate regulile (marcate DEPRECATED):
- `AUDIT-BOOKINGS-FEATURE.md` – integrat în acest audit: file size limits, TypeScript strict, RLS security, pagination
- `AUDIT-PERFORMANCE-PLAN.md` – integrat în acest audit: performance metrics, Core Web Vitals, memory leaks detection
- `apps/admin/docs/AUDIT-CHECKLIST.md` – integrat în acest audit: code quality, styling, performance, security, testing
- `CENTRALIZED-COMPLETE-AUDIT.md` – integrat în acest audit: project-level verification, dependency management
- `apps/admin/docs/dashboard/AUDIT-REPORT.md` – integrat în acest audit: reutilizabilitate, CSS variables, magic numbers
- `docs/UI_EXPANDED_ROW_AUDIT.md` – integrat în acest audit: expanded row data completeness

### 9.2. Fișiere de audit păstrate doar ca istoric (nu mai conțin reguli noi):
- `AUDIT-REPORT.md` – raport general vechi, doar referință
- `full-audit.md` – raport istoric foarte mare (121KB), doar referință
- `FULL-PROJECT-AUDIT-REPORT.md` – raport de progres, arhivat ca istoric
- `apps/admin/docs/AUDIT_COMPLETE.md` – status istoric, marcăt deprecated

### 9.3. Regulă generală:
**Pentru reguli noi se editează DOAR `docs/AUDIT_ENTERPRISE.md`**. Fișierele vechi nu se mai actualizează și sunt păstrate doar ca referință istorică.
