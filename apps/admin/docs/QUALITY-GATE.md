# Quality Gate

Cerințe obligatorii pentru fiecare PR.

## TypeScript

- [x] **Strict mode**: fără `any`, fără `ts-ignore`
- [x] **Exact types**: `exactOptionalPropertyTypes: true`
- [x] **No unchecked access**: `noUncheckedIndexedAccess: true`

## Limite de fișiere

- [x] **UI Components**: ≤200 linii
- [x] **Business Logic**: ≤150 linii
- [x] **React Hooks**: ≤80 linii
- [x] **Utils/Helpers**: ≤100 linii

## Styling (CRITICAL - M0.2 ÎNGHEȚAT)

- [x] **ZERO culori inline**: doar CSS variables din design tokens (RESPINS automat la PR)
- [x] **ZERO duplicate components**: interzis "Button_v2", "PrimaryButton_alt" etc.
- [x] **CSS Modules obligatorii**: pentru styling local, nu global styles
- [x] **Design tokens obligatorii**: folosește var(--color-_), var(--spacing-_) etc.
- [x] **Responsive mobile-first**: design pornind de la XS breakpoint

## Data Fetching

- [x] **Zero logică de business în UI**: fetch doar via `shared/api/clients`
- [x] **Paginare server-side**: pentru toate listele
- [x] **Keyset pagination**: pentru liste mari (>1000 items)
- [x] **Sort standard**: `(created_at, id)` DESC
- [x] **Filtre în URL**: pentru shareability

## Database

- [x] **Indexuri documentate**: în `docs/SCHEMA.md` pentru sort/filtru
- [x] **RLS enabled**: toate tabelele cu Row Level Security
- [x] **No N+1**: optimizare query-uri

## Testing (minimale per PR)

- [x] **1 contract test**: pentru endpoint folosit
- [x] **1 RLS test**: pentru permisiuni
- [x] **1 component test**: pentru UI nou/modificat

## Performance

- [x] **LCP <2s**: pentru pagini accesate
- [x] **CLS <0.1**: layout shift minim
- [x] **TBT <200ms**: timpul de blocare
- [x] **Bundle Δ <+20KB gz**: sau justificare

## Accessibility

- [x] **WCAG 2.1 AA**: compliance obligatoriu
- [x] **Focus vizibil**: pentru toate elementele interactive
- [x] **Alt/ARIA**: pentru imagini și componente complexe
- [x] **Contrast**: minim 4.5:1 pentru text

## Documentation

- [x] **Docs actualizate**: secțiunile relevante
- [x] **CHANGELOG**: entry pentru schimbări
- [x] **ADR**: pentru decizii arhitecturale

## Frozen Modules (M0.2 UPDATE)

- [x] **No freeze violations**: fără modificări în `FREEZE-LIST` fără excepție
- [x] **Design System frozen**: fără modificări în design-tokens sau UI core fără ADR
- [x] **Freeze exception**: cu ADR pentru modificări critice
- [x] **Component consistency**: folosește doar componentele din `shared/ui/core`

## Security

- [x] **No hardcoded secrets**: toate în environment variables
- [x] **Input validation**: pentru toate formularele
- [x] **XSS prevention**: sanitization pentru user input
