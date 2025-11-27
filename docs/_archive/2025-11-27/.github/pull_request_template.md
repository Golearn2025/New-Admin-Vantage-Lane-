# PR Checklist - Vantage Lane Admin

## 🔍 Code Quality Gates
- [ ] **no-any**: Zero `any` types în cod (`grep -r "any" --include="*.ts" --include="*.tsx" .`)
- [ ] **tokens only**: Zero culori inline/HEX (`grep -r "color:\s*#\|rgb(\|hsl(" --include="*.css" .`)
- [ ] **file-limits OK**: UI files ≤200 linii (`find . -name "*.tsx" -exec wc -l {} \; | awk '$1>200'`)
- [ ] **a11y AA**: WCAG 2.1 AA compliance (aria-*, focus rings, semantic HTML)

## 📊 Performance & Build
- [ ] **TypeScript**: Zero erori (`npm run check:ts`)
- [ ] **ESLint**: Zero erori critice (`npm run check:lint`)
- [ ] **Build**: Success (`npm run check:next`)
- [ ] **Bundle Δ**: <+20KB față de main branch

## 📱 Lighthouse Mobile (OBLIGATORIU pentru /login și pages publice)
- [ ] **Performance**: ≥90 score
- [ ] **Accessibility**: ≥95 score  
- [ ] **LCP Mobile**: <2s
- [ ] **Screenshots**: Atașate pentru xs/md/lg breakpoints

## 📚 Documentation
- [ ] **DESIGN-SYSTEM.md**: Actualizat pentru componente noi
- [ ] **CHECKLIST.md**: Bifat cu progress și completări
- [ ] **API contracts**: Actualizate dacă modificări backend
- [ ] **README**: Actualizat dacă setup nou

## 🧪 Testing
- [ ] **Unit tests**: Adăugate pentru logică nouă
- [ ] **E2E tests**: Actualizate pentru flows critice
- [ ] **Manual QA**: Testat pe Chrome/Safari/Firefox

## 🔒 Security & Architecture  
- [ ] **Zero secrets**: Nu există API keys/passwords în cod
- [ ] **Proper imports**: Doar din shared/ui/*, shared/lib/*
- [ ] **Feature flags**: Folosite pentru features experimentale
- [ ] **RLS policies**: Actualizate dacă modificări permisiuni

## 📋 PR Artifacts (Atașează)
- [ ] QA reports din `/reports/` (tsc.log, eslint.log, next-build.log)
- [ ] Lighthouse raport mobile (JSON + screenshots)
- [ ] Bundle analyzer output dacă modificări bundle
- [ ] Screenshots responsive (320px, 768px, 1440px) pentru UI changes

---

**Reviewer notes**: Toate checkbox-urile trebuie bifate pentru merge. Pentru excepții, creează ADR.
