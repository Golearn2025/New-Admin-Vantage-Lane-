> ⚠️ DEPRECATED – Regulile și checklist-urile din acest fișier au fost migrate (parțial sau complet) în `docs/AUDIT_ENTERPRISE.md`.  
> Te rog folosește DOAR `docs/AUDIT_ENTERPRISE.md` ca sursă de adevăr pentru reguli și audit.

# Audit Checklist

## Pre-PR Checklist

### Code Quality

- [ ] **No TypeScript `any`**: toate type-urile sunt explicit
- [ ] **No `ts-ignore`**: fără suppress-uri de erori
- [ ] **File size limits**: UI ≤200 lines, logic ≤150 lines, hooks ≤80 lines
- [ ] **ESLint clean**: zero warnings sau errors
- [ ] **Prettier formatted**: consistent code formatting

### Styling & UI

- [ ] **No inline colors**: doar design tokens din `shared/config/design-tokens`
- [ ] **CSS Modules**: pentru styling local, nu global styles
- [ ] **Responsive design**: tested pe mobile, tablet, desktop
- [ ] **A11y compliance**: focus visible, ARIA labels, alt text

### Performance

- [ ] **Bundle impact**: <+20KB gzipped sau justificare
- [ ] **Core Web Vitals**: LCP <2s, CLS <0.1, TBT <200ms
- [ ] **Query optimization**: database queries <200ms p95
- [ ] **Pagination**: server-side pentru liste >100 items, keyset pentru >1000

### Security

- [ ] **RLS enabled**: toate query-urile cu Row Level Security
- [ ] **Input validation**: schema validation pentru toate forms
- [ ] **No hardcoded secrets**: environment variables only
- [ ] **XSS prevention**: user input sanitized

### Testing Requirements

- [ ] **Contract test**: pentru endpoint-uri noi/modificate
- [ ] **RLS test**: pentru policy-uri noi/modificate
- [ ] **Component test**: pentru UI nou/modificat
- [ ] **Test coverage**: minimum 80% pentru module nou

## Documentation Updates

### Required Updates

- [ ] **CHANGELOG.md**: entry pentru user-facing changes
- [ ] **API docs**: pentru endpoint changes
- [ ] **Component docs**: pentru UI changes
- [ ] **Schema docs**: pentru database changes

### Architecture Changes

- [ ] **ADR created**: pentru significant architectural decisions
- [ ] **Migration guide**: pentru breaking changes
- [ ] **Performance impact**: documented pentru optimization changes

## Database Changes

### Schema Modifications

- [ ] **Migration script**: up și down migrations
- [ ] **Index analysis**: performance impact evaluated
- [ ] **RLS policies**: updated pentru new tables/columns
- [ ] **Backup verification**: migration tested în staging

### Data Integrity

- [ ] **Foreign key constraints**: referential integrity maintained
- [ ] **Data validation**: check constraints pentru business rules
- [ ] **Migration rollback**: plan pentru reverting changes

## Security Review

### Access Control

- [ ] **Permission matrix**: updated pentru new features
- [ ] **Role validation**: RBAC working correctly
- [ ] **API security**: rate limiting și authentication
- [ ] **Data exposure**: minimal necessary data returned

### Vulnerability Check

- [ ] **Dependency audit**: npm audit clean
- [ ] **OWASP compliance**: common vulnerabilities addressed
- [ ] **Penetration test**: pentru sensitive features
- [ ] **Security headers**: CSP, HSTS, etc. configured

## Frozen Module Compliance

### Freeze Violations

- [ ] **No changes** în `/apps/admin/schema/**` fără freeze exception
- [ ] **No changes** în `/apps/admin/security/**` fără security review
- [ ] **No changes** în `/apps/admin/shared/api/contracts/**` fără API review
- [ ] **No changes** în core UI components fără design review

### Exception Process

- [ ] **Freeze exception request**: cu ADR pentru justification
- [ ] **Multi-approver**: toate review-urile necesare completed
- [ ] **Impact analysis**: downstream effects evaluated

## Performance Audit

### Frontend Metrics

- [ ] **Lighthouse score**: Performance >90, A11y >90
- [ ] **Bundle analysis**: tree shaking effective
- [ ] **Image optimization**: WebP/AVIF formats, lazy loading
- [ ] **Caching strategy**: appropriate cache headers

### Backend Performance

- [ ] **Query analysis**: EXPLAIN ANALYZE pentru complex queries
- [ ] **N+1 prevention**: efficient data fetching
- [ ] **Connection pooling**: database connections optimized
- [ ] **API response times**: p95 <200ms maintained

## Production Readiness

### Deployment

- [ ] **Environment variables**: all configs externalized
- [ ] **Health checks**: monitoring endpoints functional
- [ ] **Logging**: appropriate log levels și structured logging
- [ ] **Error handling**: graceful degradation implemented

### Monitoring

- [ ] **Metrics collection**: business și technical metrics
- [ ] **Alert configuration**: appropriate thresholds set
- [ ] **Dashboard updates**: monitoring dashboards current
- [ ] **Runbook updates**: operational procedures documented
