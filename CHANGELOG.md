# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

## [0.4.1] - 2025-10-18 - Design Tokens Refactoring (M0.4)

### Refactored - Complete Token-Based System
- **Design tokens system** in `packages/ui-core/src/tokens/` (6 categories)
  - `colors.css` - 50+ CSS variables (primary, accent, danger, success, borders, backgrounds)
  - `spacing.css` - Scale 4px-80px (--spacing-1 to --spacing-20)
  - `typography.css` - Font sizes, weights, line heights, letter spacing
  - `borders.css` - Border radius (sm, md, lg, xl, 2xl, full) and widths (1, 2, 4, 8)
  - `shadows.css` - Box shadows, glows (gold, purple, card, danger, text)
  - `animations.css` - Keyframes (fadeIn, slideIn, spin), transitions, durations, easing
  - `index.css` - Centralized import for all tokens

### Components Refactored (Zero Hardcoded Values)
- **ProfileCard**: 37 hardcoded values → 0 (100% tokens)
- **FormField**: 33 hardcoded values → 0 (100% tokens)
- **Tabs**: 26 hardcoded values → 0 (100% tokens)
- **ProfileSection**: 19 hardcoded values → 0 (100% tokens)
- **SaveButton**: 17 hardcoded values → 0 (100% tokens)
- **Input**: 5 hardcoded values → 0 (100% tokens)
- **TOTAL**: Eliminated 137 hardcoded values across 6 components

### Infrastructure
- **Centralized export** in `packages/ui-core/src/index.ts`
- **Global import** in `app/globals.css` for all tokens
- **Theme change capability**: Modify 1 token variable, entire app updates instantly
- **Fully reusable system**: Ready to copy to any project

### Quality
- **Zero TypeScript errors**: `npm run check:ts` passed
- **Zero inline colors/values**: 100% token-based CSS
- **No hardcoded spacing**: All using `var(--spacing-*)` pattern
- **No hardcoded fonts**: All using `var(--font-*)` pattern
- **No hardcoded colors**: All using `var(--color-*)` pattern

### Documentation
- `/REFACTORING-REPORT.md` - Complete refactoring report with statistics
- `/packages/ui-core/REFACTORING-COMPLETE.md` - UI-Core specific summary
- Memory saved for future reference

### Impact
- **Maintainability**: Single source of truth for all design values
- **Consistency**: Impossible to have design inconsistencies
- **Theme support**: Ready for light/dark/custom themes
- **Portability**: Copy `packages/ui-core` to any project

## [0.4.0] - 2025-10-17 - Settings Profile Implementation (M0.5)

### Added - Profile Management
- **ProfileForm component** with 3 tabs (Personal Info, Account Info, Security)
- **PersonalInfoTab**: Editable fields (full name, email, phone, bio)
- **AccountTab**: Read-only fields (ID, email, role, organization, timestamps)
- **SecurityTab**: Password change and 2FA enable placeholders
- **useProfileData hook**: Data fetching and mutations with Supabase
- **AdminProfile interface**: Type-safe profile structure

### Features
- **Save functionality**: Updates profile data to Supabase
- **Success/error notifications**: User feedback for save operations
- **Responsive design**: Mobile cards, desktop grid layout
- **Dark theme**: Premium gold accents matching app design
- **Zero hardcoded values**: 100% design tokens (already prepared)
- **/settings/profile page**: Fully functional profile management

### Quality
- **Type-safe**: Strict TypeScript with AdminProfile interface
- **Error handling**: Try-catch with user-friendly messages
- **Loading states**: Disabled inputs during save operations
- **Supabase integration**: Direct table updates with RLS

### Technical
- **Feature-sliced structure**: `apps/admin/features/settings-profile/`
- **Hook-based data**: Separation of concerns (UI vs data logic)
- **Reusable components**: FormField, ProfileSection, SaveButton from ui-core

## [0.3.2] - 2024-10-14 - Login Page Implementation

### Added - Authentication System
- **AuthCard component**: Reusable auth wrapper cu responsive logo (120px→200px)
- **FormRow component**: Input wrapper cu A11y compliance complet
- **ErrorBanner component**: Server errors cu retry actions și live regions  
- **Checkbox component**: Touch-friendly cu 44px hit areas
- **Login page (/login)**: Single authentication pentru toate rolurile

### Authentication Features
- **5 stări complete**: idle, loading, invalid_creds, locked, server_error
- **Role-based redirects**: admin→dashboard, operator→bookings/active
- **A11y WCAG 2.1 AA**: aria-live, focus rings, semantic HTML
- **Mobile responsive**: Card centrat pe XS, scaling până la XL
- **Brand integration**: Gold accent colors cu hover states

### Performance & Bundle
- **Bundle size**: 3.62kB (sub target 20kB) ✅
- **First Load JS**: 90.9kB (optimizat pentru authentication)
- **Logo preload**: Pentru LCP optimization
- **TypeScript strict**: Zero `any`, zero erori

### Security & Architecture  
- **Zero logică business în UI**: Doar state management local
- **Doar design tokens**: Zero culori inline (#hex interzis)
- **Component reuse**: Doar din shared/ui/core și shared/ui/composed
- **Proper imports**: Nu accesează direct supabase/fetch

### FROZEN After This Release
- `/app/login/` - Authentication pages
- `/shared/ui/composed/AuthCard/` - Auth wrapper
- `/shared/ui/composed/FormRow/` - Form input wrapper  
- `/shared/ui/composed/ErrorBanner/` - Error display
- `/shared/ui/core/Checkbox/` - Checkbox input

**Modificări în aceste zone necesită freeze-exception + ADR**

## [0.3.1] - 2024-10-14 - R0 RBAC Cleanup

### Removed
- **super_admin role**: Completely eliminated from all documentation and contracts
- **corporate role**: Deprecated in favor of cleaner role structure

### Changed  
- **admin role**: Consolidated from super_admin, now has complete system access
- **Role enum**: Updated to final 5 roles (admin, operator, driver, customer, auditor)
- **RLS policies**: Simplified from IN ('admin', 'super_admin') to = 'admin'
- **API contracts**: Updated users.ts with final role definitions

### Added
- **auditor role**: New compliance and audit role with read-only global access
- **Scoped operator access**: Operators now have regional/company-specific permissions
- **Role migration tests**: Validation for super_admin → admin migration
- **Enhanced RLS policies**: Separate policies for each role type

### Updated Documentation
- SECURITY.md: Final role definitions and permissions matrix
- SCHEMA.md: Updated user_role enum and RLS policy examples
- ARCHITECTURE.md: Role structure and permission mapping
- OWNERS.md: Application user roles vs team roles mapping
- CHECKLIST.md: R0 completion tracking

### Migration Notes
- All existing super_admin users should be migrated to admin role
- Audit log entry required for role consolidation
- RLS policies updated to use exact role matching instead of IN clauses

## [0.3.0] - 2024-10-14 - M0.3 Contracte de listare v1

### Added
- Complete API contracts for all listing endpoints (bookings, users, documents, tickets, payments)
- TypeScript strict types for request/response structures (zero `any` types)
- Keyset pagination support with optimized cursor structures
- Database index specifications for optimal query performance (40+ indexes total)
- Cache strategy documentation with TTL and invalidation patterns
- Performance targets per endpoint (P95 <100ms response times)
- Financial summary support in payments endpoint
- Document expiry tracking and renewal alerts
- SLA-based ticket priority sorting
- Multi-currency payment support

### Updated
- SCHEMA.md with complete index specifications for all endpoints
- ARCHITECTURE.md with "list request → cache → database" flow documentation
- Cache invalidation patterns and performance targets
- Standard list API implementation pattern

### Tests Added
- Contract validation tests for bookings, users, and payments endpoints
- RLS policy test scaffolding (implementation in M0.4)
- TypeScript type safety validation

### Documentation
- Performance targets: >70% cache hit rates, <100ms P95 response times
- Index requirements: 6-8 indexes per major entity for optimal filtering
- Cache strategy: Hot data 2min TTL, warm data 5min TTL, cold data 15min TTL

## [0.2.0] - 2024-10-14 - M0.2 Design System

### Added
- Complete design system with frozen tokens (8 JSON files)
- UI core components: Button, Input, Card with stable APIs
- CSS custom properties for all design tokens
- /ui-kit showcase page for QA testing and visual validation
- A11y guidelines (WCAG 2.1 AA compliance)
- Table virtualization specifications (>200 rows)
- Responsive design rules (XS→cards, MD→compact, LG→full)

### Updated
- DESIGN-SYSTEM.md with complete specifications and frozen boundaries
- QUALITY-GATE.md with inline colors rejection and component consistency rules
- TypeScript configuration for CSS modules support

### Frozen (Cannot be modified without freeze-exception + ADR)
- Design tokens in `/shared/config/design-tokens/`
- UI core components in `/shared/ui/core/`
- Global CSS variables in `app/globals.css`

## [0.1.0] - 2024-10-14 - M0.1 Structure + Freeze

### Added
- Initial project structure following Feature-Sliced Design
- Folder architecture with frozen module boundaries
- CODEOWNERS configuration for team ownership
- Complete documentation framework (16 docs files)
- Quality gates and development guidelines
- ADR-0001: Feature-Sliced Design + Keyset pagination
