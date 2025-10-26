# 🚗 Driver Portal

> Driver-focused portal for viewing profile, earnings, and bookings

---

## 📋 Overview

Driver Portal is a dedicated application for drivers to access their profile information and track their work. Currently in **minimal viable version** with profile functionality and placeholders for future features.

---

## 🎯 Features

### ✅ Implemented

- **Profile Page** - FUNCTIONAL
  - Personal information
  - Vehicle details
  - Driver statistics (rating, reviews)
  - Document status
  
- **Authentication** - Secure driver login
  - Driver role verification
  - Session management
  
- **Navigation** - Clean sidebar with feature roadmap

### 🚧 Placeholders (Coming Soon)

- **My Earnings** - Track daily, weekly, monthly earnings
- **My Bookings** - View upcoming and past bookings
- **Documents** - Upload and manage driver documents
- **Support** - Get help and contact support

---

## 🏗️ Architecture

```
apps/driver/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page (green theme)
│   ├── (driver)/
│   │   ├── layout.tsx          # Main layout with sidebar
│   │   ├── profile/            # ✅ FUNCTIONAL profile page
│   │   ├── earnings/           # 🚧 Placeholder
│   │   ├── bookings/           # 🚧 Placeholder
│   │   ├── documents/          # 🚧 Placeholder
│   │   ├── support/            # 🚧 Placeholder
│   │   └── placeholders.module.css
│   └── layout.tsx              # Root layout
├── shared/
│   └── lib/
│       └── supabase/           # Supabase client
└── package.json
```

---

## 🎨 Design

### Color Theme

```css
/* Driver Portal uses green theme */
--color-primary: #10b981;  /* Green-500 */
--color-success: #10b981;

/* Login page gradient */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Navigation Badge

Features marked "Soon" have yellow badge:

```tsx
{
  label: 'My Earnings',
  badge: 'Soon',  // Shows yellow badge
  active: false   // Disabled state
}
```

---

## 🔒 Security

Drivers can only access their own data:

```typescript
// Get current driver
const driver = await getCurrentDriver();

// Automatically filtered by auth_user_id
const vehicle = await supabase
  .from('vehicles')
  .eq('driver_id', driver.id)
  .single();
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
pnpm 9+
Supabase account
```

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
```

### Development

```bash
# Start development server (port 3002)
cd apps/driver
pnpm dev

# Open browser
open http://localhost:3002
```

### Build

```bash
pnpm build
pnpm start
```

---

## 📱 Profile Page (Functional)

### Information Displayed

**Personal Information Card:**
- Full name
- Email
- Phone
- License number
- Active/Inactive status

**Vehicle Card:**
- Make & Model
- License plate
- Color
- Year

**Stats Card:**
- Average rating ⭐
- Total reviews 📊

**Documents Status Card:**
- License verification ✅
- Insurance status ⏳
- Background check ✅

---

## 🎯 Roadmap

### Phase 2 (Next)

- [ ] Earnings dashboard with charts
- [ ] Bookings list with filters
- [ ] Document upload system
- [ ] Support ticket system
- [ ] Push notifications

### Phase 3 (Future)

- [ ] Real-time booking updates
- [ ] In-app messaging
- [ ] Navigation integration
- [ ] Offline mode
- [ ] Mobile app version

---

## 🎨 Design System

Uses shared design tokens:

```css
.card {
  padding: var(--spacing-6);
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg);
}
```

**Zero hardcoded values!**

---

## 🔗 Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@vantage-lane/formatters": "*",
  "@vantage-lane/ui-core": "*",
  "next": "14.2.33",
  "react": "^18.2.0"
}
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod

# Configure domain
# drivers.vantage-lane.com → Driver Portal
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_NAME="Driver Portal"
```

---

## 📝 Usage

### Login as Driver

1. Navigate to `/login`
2. Sign in with driver credentials
3. Must have valid driver record in `drivers` table
4. Redirects to `/profile`

### Navigation

```typescript
// Functional pages
✅ /profile      // Driver profile (WORKING)

// Placeholder pages (coming soon)
🚧 /earnings     // Earnings dashboard
🚧 /bookings     // Bookings list
🚧 /documents    // Document management
🚧 /support      // Support center
```

---

## 🧪 Testing

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build test
pnpm build
```

---

## 🎭 Placeholder Pages

All placeholder pages use shared styles:

```tsx
import styles from '../placeholders.module.css';

export default function PlaceholderPage() {
  return (
    <div className={styles.placeholder}>
      <p className={styles.icon}>💰</p>
      <p className={styles.message}>Coming soon...</p>
      <p className={styles.description}>Feature description</p>
    </div>
  );
}
```

---

## 📚 Related

- **Admin Portal** - `/apps/admin` - Full platform management
- **Fleet Portal** - `/apps/fleet` - Operator management
- **UI Core** - `/packages/ui-core` - Shared components
- **Database** - `/database/migrations` - SQL migrations

---

## 🤝 Contributing

1. Follow project rules in `/RULES.md`
2. Follow workflow in `/WORKFLOW.md`
3. Use design tokens (zero hardcoded values)
4. TypeScript strict mode
5. Files < 200 lines
6. Functions < 50 lines

---

## 📄 License

Proprietary - Vantage Lane Admin

---

**Version:** 1.0.0 (MVP)  
**Port:** 3002  
**Status:** Profile functional, other features in roadmap  
**Last Updated:** 2025-10-26
