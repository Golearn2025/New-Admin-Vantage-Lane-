# DESIGN BRIEF - /login Page

## Obiectiv UX

Autentificare simplă și sigură pentru toate rolurile (admin, operator, driver, customer, auditor) cu feedback vizual clar și experiență optimizată pentru dispozitive mobile.

## Responsive Layout Strategy

### XS (≤480px) - Mobile First

- **Layout**: Card centrat vertical și orizontal
- **Logo**: Afișat în header-ul cardului, dimensiune 120px lățime
- **Form**: Inputs stacked vertical cu spacing generos (24px între câmpuri)
- **Reset link**: Sub form, aliniat la stânga
- **Padding**: 16px în interiorul cardului

### SM (≤768px) - Tablet Portrait

- **Layout**: Card mai larg (400px max-width)
- **Logo**: 140px lățime
- **Form**: Păstrează layout vertical
- **Spacing**: 32px între secțiuni

### MD (≤1024px) - Tablet Landscape

- **Layout**: Card centrat cu max-width 450px
- **Background**: Gradient subtil brand
- **Logo**: 160px lățime

### LG (≤1440px) - Desktop

- **Layout**: Card 500px lățime, centrat
- **Background**: Brand gradient + pattern subtil
- **Logo**: 180px lățime
- **Side content**: Posibil mesaj welcome lateral

### XL (>1440px) - Large Desktop

- **Layout**: Same as LG dar cu mai mult whitespace
- **Logo**: 200px lățime maximă

## Design Tokens Usage (STRICT - doar nume, nu HEX)

### Colors Used

- **Background**: `light.bg.secondary` (cream brand background)
- **Card surface**: `light.surface.primary` (white)
- **Card border**: `light.border.muted`
- **Text primary**: `light.text.primary`
- **Text secondary**: `light.text.secondary`
- **Focus states**: `light.border.focus` (brand gold)
- **Button primary**: `light.accent.500` (brand gold)
- **Button hover**: `light.accent2.500` (darker gold)
- **Error states**: `semantic.danger.default`
- **Success states**: `semantic.success.default`

### Spacing

- **Card padding**: `spacing.6` (24px)
- **Form gaps**: `spacing.4` (16px)
- **Section gaps**: `spacing.8` (32px)
- **Logo margin**: `spacing.4` (16px bottom)

### Typography

- **Headings**: `fontSize.xl` + `fontWeight.semibold`
- **Labels**: `fontSize.sm` + `fontWeight.medium`
- **Body text**: `fontSize.base` + `fontWeight.normal`
- **Links**: `fontSize.sm` + `fontWeight.medium`

## Core Components Required

### From shared/ui/core (NO custom variants)

- **Card**: `padding="lg"` + `shadow="md"` + `border={true}`
- **Input**: `type="email"` + `type="password"` cu `required={true}`
- **Button**: `variant="primary"` + `size="lg"` + `loading` state
- **Checkbox**: Pentru "Remember me" optional

### New Reusable Components (Build during implementation)

- **AuthCard**: Wrapper card cu logo header și form layout
- **FormRow**: Input cu label și error state consistent
- **ErrorBanner**: Pentru server errors și validation errors

## States & Behavior

### Idle State

- Form gol, button enabled
- Focus pe primul input (email)
- Logo și welcome message vizibile

### Loading State

- Button shows spinner + "Signing in..."
- Inputs disabled
- aria-live="polite" pentru screen readers

### Invalid Credentials

- ErrorBanner cu mesaj "Invalid email or password"
- Focus pe input-ul email pentru retry
- Button revine la starea normală

### Account Locked

- ErrorBanner cu mesaj "Account temporarily locked. Try again in 15 minutes."
- Inputs disabled cu countdown
- Link către support visible

### Server Error

- ErrorBanner cu mesaj "Service temporarily unavailable. Please try again."
- Retry button disponibil
- Form rămâne funcțional

## A11y Requirements (WCAG 2.1 AA)

### Semantic Structure

- `<main>` wrapper pentru login form
- `<form>` cu proper `action` și `method`
- Labels asociate cu `for` attribute
- Fieldset pentru form grouping

### Screen Reader Support

- `aria-live="polite"` pentru error announcements
- `aria-describedby` pentru input hints și errors
- `aria-invalid` pentru inputs cu erori
- Alt text pentru logo: "Vantage Lane Admin"

### Keyboard Navigation

- **Tab order**: Logo (focusable pentru context) → Email → Password → Remember Me → Sign In → Forgot Password
- **Enter key**: Submite form-ul din orice input
- **Focus ring**: 2px solid brand gold (`light.border.focus`)
- **Escape key**: Curăță error states

### Touch/Click Targets

- **Minimum hit area**: 44×44px pentru toate interactive elements
- **Button spacing**: 8px minim între elements
- **Input spacing**: 24px pe mobile pentru easy typing

## Performance Requirements

### Bundle Size

- **Target Δ**: <+20KB față de baseline
- **Login page**: <10KB specific code
- **Assets**: Logo optimizat <50KB
- **Third-party**: Zero dependencies noi

### Core Web Vitals

- **LCP Mobile**: <2s (logo + form visible)
- **FID**: <100ms (form interactions responsive)
- **CLS**: <0.1 (stable layout, no shifts)

### Loading Strategy

- **Above fold**: Logo + form inline
- **Below fold**: Lazy load links și footer
- **Fonts**: Preload Inter font cu font-display: swap

## Branding Integration

### Logo Display

- **Source**: `/public/brand/logo.png`
- **Position**: Centrat în header-ul AuthCard-ului
- **Sizing**: Responsive (120px XS → 200px XL)
- **Alt text**: "Vantage Lane Admin Dashboard"
- **Loading**: Eager (critical above fold)

### Brand Colors

- **Primary CTA**: Brand gold pentru Sign In button
- **Focus states**: Brand gold pentru inputs și links
- **Background**: Subtle cream brand pe body
- **Accents**: Darker gold pentru hover states

## Post-Authentication Flow

### Role-Based Redirects

- **admin**: `/dashboard` (overview toate operațiunile)
- **operator**: `/bookings/active` (operațiuni curente)
- **driver**: `/bookings` (propriile rezervări)
- **customer**: `/bookings` (istoric personal)
- **auditor**: `/dashboard` (read-only overview)

### Single Login for All Roles

- **Un singur form**: Nu diferențiere UI per rol
- **Role detection**: Server-side după authentication
- **Redirect logic**: Bazat pe `user.role` din JWT response

## Implementation Constraints

### Technology Stack

- **DOAR shared/ui/core components**: Button, Input, Card, Checkbox
- **DOAR design tokens**: ZERO culori inline (#hex interzis)
- **CSS Modules**: Pentru styling local
- **TypeScript strict**: Fără any, fără ts-ignore

### Freezing Rules

- **După aprobare BRIEF**: Implementation frozen
- **Modificări**: Doar prin freeze-exception + ADR
- **Components**: Nu creez variante noi de core components

## PR Artifacts (Required)

### Screenshots

- **XS (320px)**: Mobile portrait cu form complet
- **MD (768px)**: Tablet landscape cu background
- **LG (1440px)**: Desktop cu full layout

### Performance Reports

- **Lighthouse Mobile**: Performance + A11y + Best Practices scores
- **Bundle analysis**: Size impact delta report
- **Core Web Vitals**: LCP, FID, CLS measurements

### Documentation Updates

- **DESIGN-SYSTEM.md**: Login component patterns adăugate
- **CHECKLIST.md**: Login implementation bifat
- **CHANGELOG.md**: Entry pentru login page

---

## Aprobare Necesară

**Dacă acest BRIEF este aprobat** → Implementez imediat cu componentele și constraints-urile specificate.

**Dacă BRIEF-ul necesită modificări** → Revin cu propunere revizuită bazată pe feedback.

**Status**: ⏳ **WAITING FOR APPROVAL**
