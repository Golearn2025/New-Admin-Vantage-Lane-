# PROMPT UNIC (ENTERPRISE v2) PENTRU CLAUDE/CASCADE — VANTAGE LANE

**Owner:** Engineering Team  
**Scope:** All development work  
**Last Updated:** 2025-11-27  
**Status:** ACTIVE

Stack: TypeScript/React/Node + Supabase (Auth + DB deja create) + deploy pe Render.  
Roluri: admin / operator / driver.  
Scop: Audit + refactor incremental, FĂRĂ să strici funcționarea, cu performanță, securitate, cost control, observability și pregătire de deploy.

## 0) CONTRACT NON-NEGOCIABIL (HARD RULES)

A) **ZERO behavior change:** nu schimbi logica, flow-uri, UI output, texte, permisiuni, decât dacă repari un bug clar (și îl descrii).  
B) **Lucrezi incremental:** 1 singur scope/pas (un feature/folder/ecran). Interzis "big bang refactor".  
C) **Bugete anti-fișiere:**
   - max 250 linii/fișier, max 150 linii/componentă UI, max 80 linii/hook, max 120 linii/server function.
   - Dacă depășești -> split (types/constants/utils/hooks/components). NU ai voie să crești la 500 linii.  
D) **Interzis:** `any` , culori hardcodate (#fff/#000/rgb/hex), px brute în layout, inline styles, `!important` ,
   copy/paste între pagini, fetch în UI, subscriptions fără cleanup, re-fetch la re-render, query keys duplicate,
   cod mort, deps nefolosite, circular imports.  
E) **INTERZIS să ștergi documentație/reguli existente** fără instrucțiune explicită.
   - NU ștergi rules.md / docs/00_RULES.md / checklist-uri. Dacă trebuie "docs cleanup", le muți în archive, nu le distrugi.  
F) **Totul trebuie să fie verificabil:** la final livrezi dovezi (comenzi, outputs, diff summary).

## 1) RULES UI/UX (Design System)

**DO:**
- Tokens 100% pentru: culori, spacing, font-size, radius, shadows, motion.
- Responsive obligatoriu: 320px, 375px, 768px.
- Accesibilitate: ARIA, focus, Tab/Enter/Esc, focus trap în modals, contrast WCAG AA.
- Folosești ui-core pentru Button/Input/Select/Modal/Card/Badge/Avatar.

**DON'T:**
- Nu folosi culori brute (#/rgb/hex).
- Nu folosi px brute în layout.
- Nu crea "încă un button/table/card".

**AUTO-CHECK:**
- grep pentru: "#", "rgb(", "px", "!important", "style={{"
- axe-core passing (raportezi)

## 2) ENTERPRISE DATATABLE (adevăr unic)

**DO:**
- Un singur tabel: EnterpriseDataTable pentru toate listările.
- sticky header, scroll doar tbody, colgroup widths, resize fără flicker.
- sort/pagination/selection în hooks.
- pagination reală limit/offset (sau cursor).

**DON'T:**
- Nu crea versiuni alternative de tabel.
- Nu încărca tot și "slice" pe client.

**AUTO-CHECK:**
- caută usage: nu există alte DataTable local duplicate.
- requests count pe list page: stabile la re-render.

## 3) ARCHITECTURE & MODULARITATE (scalabil)

**DO:**
- UI doar consumă hooks/services. Nicio logică business în UI.
- Straturi: ui/ model/ api/ lib/
- Single source: formatters centralizate + filtre reutilizabile + query keys centralizate.
- Dacă un pattern apare de 2 ori -> extragi.

**DON'T:**
- Nu duplica hooks/formatters/filters între pagini.

**AUTO-CHECK:**
- depcheck/ts-prune nu trebuie să crească după refactor.

## 4) DATA FETCHING & PERFORMANCE (anti loop, cost control)

**DO:**
- Fără fetch în UI. Doar hooks (useBookingsList/useUsersList/useDashboardMetrics).
- Query keys stabile, fără obiecte inline în deps.
- Caching activ: staleTime, keepPreviousData, dedupe.
- Realtime doar unde e necesar + cleanup obligatoriu.
- Limit/offset peste tot.

**DON'T:**
- Nu face polling agresiv.
- Nu lăsa intervale/timeouts fără cleanup.
- Nu declanșa re-fetch la fiecare render (inline deps / unstable keys).

**AUTO-CHECK:**
- număr request-uri la load + la re-render (trebuie să fie stabil).
- verifică în cod: unsubscribe/cleanup în hooks.

## 5) SUPABASE SECURITY: AUTH + RBAC + RLS (autoritatea finală)

Context: DB + Auth există deja. Nu inventa scheme noi decât dacă ți se cere.

**DO:**
- UI route guards pe rol (admin/operator/driver), rolul vine din Supabase (claims/profile).
- RLS activ pe tabele sensibile + politici corecte:
  - admin: global
  - operator: doar datele lui (operator_id)
  - driver: doar datele lui (driver_id)
- Service role key doar pe server (edge/functions). Niciodată în client.
- Validare Zod la forms + boundary validation la payloads.
- Protecții web: XSS (fără dangerouslySetInnerHTML), CSP/CORS corecte, no PII/secrets în logs.

**DON'T:**
- Nu te baza pe "ascund UI" pentru securitate.
- Nu pune chei/secrets în public env.

**AUTO-CHECK:**
- documentezi RLS matrix (tabel × rol × CRUD).
- grep "service_role", "SUPABASE_SERVICE_ROLE" și confirmi că nu e în client.

## 6) DATABASE & MIGRATIONS (lipsă în v1, obligatoriu)

**DO:**
- Nu schimba schema DB fără migrație controlată.
- Orice query critic pe operator_id/driver_id/status/created_at trebuie să aibă index (documentat).
- Evită N+1: list endpoints trebuie să returneze tot pentru tabel fără fetch per row.
- Backup/rollback plan (minim: notezi ce migrații s-au aplicat și cum revii).

**DON'T:**
- Nu edita direct tabel în mod "manual" fără tracking.
- Nu crea RPC/functions fără documentare + permisiuni.

**AUTO-CHECK:**
- notezi ce tabele sunt atinse și ce indexuri există/trebuie.

## 7) OBSERVABILITY & ERROR HANDLING (lipsă în v1)

**DO:**
- Error boundary consistent (UI).
- Logging controlat (fără PII), nivele, rate limits.
- Sentry (sau echivalent) integrat pentru errors + performance traces (dacă e deja în plan).
- Web vitals tracking (minim documentat).

**DON'T:**
- Nu spama console.log în production.
- Nu lăsa errors swallow fără UI state.

**AUTO-CHECK:**
- confirmi că există: error states, skeleton/loading states.

## 8) DEPLOY READINESS (Render) (lipsă în v1)

**DO:**
- Fără loop-uri continue, fără polling agresiv.
- Env vars clar separate: server-only vs client-safe.
- Build trebuie să treacă reproducibil (npm/pnpm lock).
- Bundle budgets și code-splitting.

**DON'T:**
- Nu introduce dependențe grele fără justificare.
- Nu introduce side effects la import (care rulează pe server la build).

**AUTO-CHECK:**
- build --profile + bundle analyzer raportat.
- lighthouse raportat (target >= 90 unde posibil).

## 9) QUALITY GATES (auto-verificare cu dovezi)

Obligatoriu, înainte de DONE:
- npm run check:ts (0 errors)
- npm run lint -- --max-warnings=0
- npx ts-prune > dead.txt (nu crește)
- npx depcheck > deps.txt
- npx madge --circular apps/admin packages > circular.txt (0)
- git-secrets --scan (0)
- npm run build -- --profile
- lighthouse raport
- webpack-bundle-analyzer raport
- axe-core passing
- manual smoke flow pentru scope

## 10) EXECUȚIE PE PAȘI (format output obligatoriu)

La fiecare pas livrezi exact:
1) Scope ales
2) Fișiere modificate
3) Ce ai făcut
4) Bugete respectate (fișiere + linii aproximative)
5) Dovadă verificări (outputs relevante)
6) Git diff summary (mutat/extras/șters)
7) Riscuri + mitigări
8) Screenshot înainte/după (doar dacă UI s-a atins)

## 11) PRIMUL PAS OBLIGATORIU

PAS 0: Rapoarte + alegi primul scope (AUTH SAU EnterpriseDataTable, NU ambele).
Returnezi doar: outputs + plan pas 1 (fără refactor suplimentar).

---

**PROMPT ENTERPRISE v2 - Acoperă: DB/migrations/observability/Render deploy readiness**
