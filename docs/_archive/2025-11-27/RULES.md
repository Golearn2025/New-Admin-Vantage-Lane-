PROMPT UNIC (ENTERPRISE) PENTRU CLAUDE/CASCADE — VANTAGE LANE (Supabase, 3 roluri: admin/driver/operator)
Scop: Refactor + audit incremental, fără să strici funcționarea, cu performanță, securitate, cost control, și reguli stricte. Supabase DB + Auth sunt deja create. Nu inventa scheme noi decât dacă ți se cere explicit.

======================== 0) CONTRACT NON-NEGOCIABIL
========================
A. Refactor = ZERO schimbări de comportament (UI/logică/flow). Nu adaugi features. Nu schimbi text/label/layout decât dacă era bug clar.
B. Lucrezi INCREMENTAL: un singur scope pe pas (un feature / un folder / un ecran). Interzis “refactor global” fără etapizare.
C. Bugete anti-fișiere gigantice:

- Max 250 linii / fișier (hard). Max 150 linii / componentă UI. Max 80 linii / hook. Max 120 linii / server function.
- Dacă depășești: spargi în fișiere (types/constants/utils/hooks/components). NU ai voie să “crești la 500 linii”.
  D. Interzis: `any`, culori hardcodate (#fff/#000/rgb/hex), px brute în layout, inline styles, `!important`, copy/paste între pagini, fetch în UI, subscriptions fără cleanup, re-fetch la re-render, query keys duplicate, cod mort, deps nefolosite, circular imports.
  E. Totul trebuie să fie verificabil: la final returnezi checklists + dovezi (comenzi, grep-uri, diff-uri).

========================

1. # REGULI UI/UX (Design System)

1) Tokens 100% pentru: culori, spacing, font-size, radius, shadows, motion. Fără valori brute în layout.
   - NU: #fff, #000, rgb(), hex, "16px", "24px", "border-radius: 8px"
   - DA: var(--color-_), var(--spacing-_), var(--font-_), var(--radius-_)
2) Responsive obligatoriu: 320px, 375px, 768px (minimul). Nu bloca layout-ul pe desktop-only.
3) Accesibilitate obligatorie:
   - ARIA labels unde e nevoie, focus states, tab/enter/esc, focus trap în modals.
   - Color contrast WCAG AA.
4) UI Components: folosești component library existentă (ui-core) pentru Button/Input/Select/Modal/Card/Badge/Avatar.
   - Nu creezi alternative “încă o versiune de tabel/card/button”.
5) ZERO inline style, ZERO `!important`.
6) Screenshot înainte/după pentru schimbări UI vizibile (unde e cazul).

======================== 2) ENTERPRISE DATATABLE (adevăr unic)
========================

1. Există UN SINGUR tabel: `EnterpriseDataTable`. Orice listă tabelară MUST use it.
2. Cerințe DataTable:
   - sticky header
   - scroll doar pe tbody
   - colgroup pentru widths
   - resize fără flicker
   - sort/pagination/selection în hooks (nu în component)
   - fără inline functions în map (folosește handlers memoizați)
   - mobile: scroll orizontal controlat, fără layout break
3. Paginare REALĂ: limit/offset (sau cursor), nu “load all then slice”.

======================== 3) ARCHITECTURE & MODULARITATE
========================

1. Fără logică business în UI: UI consumă hooks/services.
2. Separi pe straturi:
   - ui/ (componente)
   - model/ (types, state, zod schemas)
   - api/ (supabase calls, query keys)
   - lib/ (utils pure)
3. O singură sursă de adevăr:
   - formatters centralizate (date, currency, distance)
   - filtre reutilizabile (DateRangeFilter, StatusFilter, AmountRangeFilter)
   - query keys centralizate
4. Fără duplicări: dacă vezi pattern repetat de 2 ori, extragi.

======================== 4) DATA FETCHING & PERFORMANCE (anti loop)
========================

1. Interzis fetch în UI. DOAR hooks (ex: useBookingsList, useUsersList, useDashboardMetrics).
2. Fără query repetat la re-render:
   - memoize deps, key stabil, evită inline objects/arrays ca deps
   - “enabled” controlat, queryKey stabil
3. Caching activ (React Query/SWR): staleTime, keepPreviousData, dedupe.
4. Realtime doar unde e necesar. Subscriptions:
   - cleanup obligatoriu (unsubscribe în cleanup)
   - nu porni subscription în render, doar în effect / hook corect
5. Evită loop-uri continue:
   - interzis polling agresiv
   - interzis setInterval fără clearInterval
   - interzis rerender cascades (inline fn, inline objects)
6. Bundle/perf:
   - code-splitting pe rute
   - importuri “small” (nu tot MUI dacă nu e necesar)
   - bundle analyzer folosit la audit

======================== 5) SUPABASE: AUTH + RBAC + RLS (obligatoriu)
========================
Context: ai 3 roluri: admin, operator, driver. Trebuie enforced atât în UI cât și în DB.

1. Auth flow:
   - login/forgot/optional register: hooks + states (loading/error)
   - nu expui secrets în client
2. RBAC în app:
   - rolul vine din Supabase (claims/profile table). UI route guard pe rol.
   - nu te baza pe “hidden UI” ca securitate.
3. RLS în DB:
   - toate tabelele sensibile trebuie să aibă RLS și politici pentru admin/operator/driver.
   - service role key NU ajunge în client.
4. Query rules:
   - operator vede doar datele operatorului lui
   - driver vede doar joburile/documentele lui
   - admin vede global
5. Securitate web:
   - previi XSS (sanitize where needed, avoid dangerouslySetInnerHTML)
   - CSP/CORS corecte (în config/headers)
   - nu loga PII/secrets
6. Validare:
   - Zod pentru forms + boundary validation la payloads

======================== 6) QUALITY GATES (auto-verificare obligatorie)
========================
La fiecare pas, înainte de “DONE”, rulezi și raportezi outputs (nu doar “am rulat”):
A. Type & lint:

- npm run check:ts (0 errors)
- npm run lint -- --max-warnings=0
  B. Dead/unused:
- npx ts-prune > dead.txt (scade sau rămâne, nu crește)
- npx depcheck > deps.txt
- npx madge --circular apps/admin packages > circular.txt (0 circular)
  C. Security:
- git-secrets --scan (0)
  D. Build/perf:
- npm run build -- --profile
- lighthouse (raport)
- webpack-bundle-analyzer (raport)
  E. Accessibility:
- axe-core passing (raportezi rezultatul)
  F. Runtime sanity:
- verifici manual flow-ul scopului (ex: login→dashboard, bookings list pagination, etc.)

======================== 7) EXECUȚIE “PE PAȘI” (nu sari)
========================
Regulă: Nu treci la pasul următor fără să finalizezi dovada pentru pasul curent.

Format output obligatoriu pentru fiecare pas:

1. Scope ales (ex: PAS 1 — AUTH — apps/admin/features/auth)
2. Fișiere modificate (listă)
3. Ce ai făcut (bullet)
4. Bugete respectate (menționezi fișierele + linii aproximative)
5. Dovadă verificări: comenzi + rezultate relevante (grep/outputs)
6. Git diff summary (ce s-a mutat/extras/șters)
7. Riscuri + cum ai evitat să strici funcționarea
8. Screenshot înainte/după (doar dacă UI s-a atins)

======================== 8) REGULI ANTI-“UITARE” (constrângeri pentru agent)
========================

1. Înainte să scrii cod, REPEȚI scurt contractul: “no behavior change, max-lines, no any, no hardcodes, no fetch in UI”.
2. Dacă apare tentația să adaugi logică nouă, oprești și spui: “în afara scope-ului”.
3. Dacă un fișier crește peste buget, oprești și refaci split-ul (obligatoriu).
4. Dacă ai creat ceva duplicat (un al doilea tabel/hook), e invalid: trebuie să refolosești.
5. Dacă nu poți dovedi checks (outputs), e invalid: nu marchezi DONE.

======================== 9) CHECKLIST DE REFERINȚĂ (din proiect)
========================

- fără any
- fără culori hardcodate
- fără px brute / fără valori fixe la layout
- tokens 100%
- responsive 320/375/768
- sticky header în tabel
- doar EnterpriseDataTable
- formatters centralizate
- filtre reutilizabile
- fără copy/paste pagini
- fără fetch în UI (doar hooks)
- fără inline functions în map
- fără re-fetch la re-render
- pagination limit/offset
- cleanup subscriptions/useEffect
- zero cod mort (ts-prune)
- zero deps nefolosite (depcheck)
- zero circular imports (madge)
- git diff prezentat + output brut (grep/rapoarte)

======================== 10) PRIMUL PAS (obligatoriu)
========================
Începi cu PAS 0 — SCAN AUTOMAT + alegi primul scope (AUTH sau EnterpriseDataTable), NU ambele.
Returnezi: rapoartele + planul pentru pasul 1 (fără implementare extra).

SFÂRȘIT PROMPT
