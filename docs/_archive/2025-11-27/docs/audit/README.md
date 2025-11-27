# PROJECT AUDIT SYSTEM - SINGLE SOURCE OF TRUTH

**Created:** 2025-11-26  
**Purpose:** Comprehensive audit system for Vantage Lane Admin Dashboard  
**Scope:** Admin, Operator, Driver roles across entire codebase  

## 📋 How to Use This Audit System

### 1. **Global Rules First**
- Read `00-MASTER_CHECKLIST.md` for enterprise standards
- Understand baselines: Security, Performance, Responsive, Realtime

### 2. **Role-Based Audit**
- **Admin:** Full dashboard access (see `admin/README.md`)
- **Operator:** Limited operator dashboard (see `operator/README.md`) 
- **Driver:** Mobile-first driver interface (see `driver/README.md`)

### 3. **Page-by-Page Audit**
- Each role has `PAGES_MATRIX.md` with all pages
- Each page has individual audit file in `pages/`
- Focus on one page at a time for quality

### 4. **Evidence-Based Findings**
- All findings go in `findings/2025-11.md`
- Include screenshots, tool outputs, network traces
- Link back to specific page audit files

## 🛠️ Tools & Commands

See `01-TOOLS_AND_COMMANDS.md` for complete toolkit:
- **TypeScript:** `ts-prune`, `depcheck`, type checking
- **Architecture:** `madge` for circular dependencies  
- **Security:** `gitleaks`, auth/RLS testing
- **Performance:** Bundle analysis, React DevTools
- **Accessibility:** `axe-core`, keyboard navigation
- **Responsive:** Screenshots at 320/375/768px

## 🎯 Workflow

1. **Freeze Code Changes** (audit phase = no feature work)
2. **Complete PAGES_MATRIX** for each role (mark current status)
3. **Audit 1 Page at a Time** (micro-iterations)
4. **Create Findings** with evidence and fix priorities
5. **Fix in Small PRs** (1 category = 1 PR)
6. **Mark Complete** when all checkboxes pass

## 🔍 Current Status

**Last Updated:** 2025-11-26  
**Admin Pages:** TODO (see `admin/PAGES_MATRIX.md`)  
**Operator Pages:** TODO (see `operator/PAGES_MATRIX.md`)  
**Driver Pages:** TODO (see `driver/PAGES_MATRIX.md`)  
**Critical Findings:** 0 (see `findings/2025-11.md`)  

## 🚨 Definition of Done

A page is **AUDIT COMPLETE** when:
- [ ] All relevant checkboxes in page audit file are ✅
- [ ] All tools pass (no critical violations)
- [ ] Evidence attached (screenshots + tool outputs)
- [ ] Security tests verify role-based access
- [ ] No open findings for that page

**Next Action:** Start with `00-MASTER_CHECKLIST.md`
