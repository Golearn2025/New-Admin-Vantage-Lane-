# Shell Specification - Admin/Operator/Driver

**Generated:** 2025-11-27  
**Owner:** Engineering Team  
**Status:** ACTIVE

## Overview

Define reusable Shell architecture for all 3 roles with consistent mobile behavior and clean separation of concerns.

## Architecture Principles

### Single Responsibility
- **Shell:** Layout, navigation, user menu, responsive behavior
- **Pages:** Content only, no layout concerns
- **Zero Logic Duplication:** Shell logic shared, role data configurable

### Mobile-First Design
- **Mobile:** 320px-767px (Drawer navigation)
- **Tablet:** 768px-1023px (Collapsible sidebar)  
- **Desktop:** 1024px+ (Persistent sidebar)

## Shell Components per Role

### AdminShell
```typescript
interface AdminShellProps {
  children: React.ReactNode;
  currentPath: string;
  user: AdminUser;
}

// Navigation Items
const adminNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/users/all', label: 'All Users', icon: 'Users' },
  { path: '/bookings', label: 'Bookings', icon: 'Calendar' },
  { path: '/payments', label: 'Payments', icon: 'CreditCard' },
  { path: '/organizations', label: 'Organizations', icon: 'Building' },
  { path: '/reports', label: 'Reports', icon: 'BarChart3' },
  { path: '/reviews-management', label: 'Reviews', icon: 'MessageSquare' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];
```

### OperatorShell  
```typescript
interface OperatorShellProps {
  children: React.ReactNode;
  currentPath: string;
  user: OperatorUser;
}

// Navigation Items (Limited set)
const operatorNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/drivers', label: 'My Drivers', icon: 'Users' },
  { path: '/bookings', label: 'Bookings', icon: 'Calendar' },
  { path: '/notifications', label: 'Notifications', icon: 'Bell' },
  { path: '/profile', label: 'Profile', icon: 'User' },
];
```

### DriverShell
```typescript
interface DriverShellProps {
  children: React.ReactNode;
  currentPath: string;
  user: DriverUser;
}

// Navigation Items (Minimal set)
const driverNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/bookings', label: 'My Bookings', icon: 'Calendar' },
  { path: '/earnings', label: 'Earnings', icon: 'DollarSign' },
  { path: '/documents', label: 'Documents', icon: 'FileText' },
  { path: '/notifications', label: 'Notifications', icon: 'Bell' },
  { path: '/profile', label: 'Profile', icon: 'User' },
];
```

## Unified Shell Contract

### BaseShell Component
```typescript
interface BaseShellProps {
  children: React.ReactNode;
  currentPath: string;
  user: User;
  navItems: NavItem[];
  role: 'admin' | 'operator' | 'driver';
  branding?: {
    logo: string;
    title: string;
    subtitle?: string;
  };
}

interface NavItem {
  path: string;
  label: string;
  icon: string; // lucide-react icon name
  badge?: number; // notification count
  disabled?: boolean;
  children?: NavItem[]; // sub-navigation
}
```

## Mobile Behavior Specification

### Breakpoint Rules
```css
/* Mobile: Drawer Navigation */
@media (max-width: 767px) {
  .sidebar { 
    transform: translateX(-100%);
    position: fixed;
    z-index: 50;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-content {
    margin-left: 0;
  }
}

/* Tablet: Collapsible Sidebar */
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar {
    width: var(--sidebar-collapsed-width, 60px);
  }
  .sidebar.expanded {
    width: var(--sidebar-width, 240px);
  }
}

/* Desktop: Persistent Sidebar */
@media (min-width: 1024px) {
  .sidebar {
    position: static;
    width: var(--sidebar-width, 240px);
  }
}
```

### Header Behavior
```typescript
// Sticky header across all viewports
const Header = {
  mobile: {
    height: '56px',
    elements: ['menu-button', 'logo', 'user-menu'],
    position: 'sticky',
  },
  tablet: {
    height: '64px', 
    elements: ['sidebar-toggle', 'breadcrumbs', 'notifications', 'user-menu'],
    position: 'sticky',
  },
  desktop: {
    height: '64px',
    elements: ['breadcrumbs', 'search', 'notifications', 'user-menu'],
    position: 'sticky',
  }
};
```

### User Menu
```typescript
// Consistent across all roles
const userMenuItems = [
  { label: 'Profile Settings', path: '/profile', icon: 'User' },
  { label: 'Change Password', path: '/password', icon: 'Lock' },
  { divider: true },
  { label: 'Logout', action: 'logout', icon: 'LogOut', variant: 'danger' },
];
```

## Implementation Guidelines

### Shell Composition
```typescript
// apps/admin/app/(admin)/layout.tsx
export default function AdminLayout({ children }) {
  const user = useCurrentUser();
  const pathname = usePathname();
  
  return (
    <BaseShell
      currentPath={pathname}
      user={user}
      navItems={adminNavItems}
      role="admin"
      branding={{
        logo: "/brand/logo.png",
        title: "Vantage Lane",
        subtitle: "Admin Dashboard"
      }}
    >
      {children}
    </BaseShell>
  );
}
```

### Responsive Navigation
```typescript
// BaseShell internal state
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

// Auto-close mobile menu on route change
const pathname = usePathname();
useEffect(() => {
  setIsMobileMenuOpen(false);
}, [pathname]);

// Auto-collapse on mobile
const isMobile = useMediaQuery('(max-width: 767px)');
useEffect(() => {
  if (isMobile) {
    setIsSidebarCollapsed(true);
  }
}, [isMobile]);
```

## Content Area Contract

### Page Component Rules
```typescript
// ✅ GOOD: Page only handles content
export function UsersPage() {
  return (
    <div className="page-content">
      <PageHeader title="All Users" />
      <UsersTable />
    </div>
  );
}

// ❌ BAD: Page handles shell concerns  
export function UsersPage() {
  return (
    <AdminShell> {/* Shell handled by layout */}
      <Sidebar /> {/* Duplicate shell logic */}
      <div className="content">
        <UsersTable />
      </div>
    </AdminShell>
  );
}
```

### Page Header Pattern
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

// Consistent page header across all roles
<PageHeader 
  title="All Users"
  subtitle="Manage system users and permissions"
  actions={<Button>Create User</Button>}
  breadcrumbs={[
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'All Users' }
  ]}
/>
```

## Accessibility Requirements

### Keyboard Navigation
- **Tab:** Navigate through interactive elements
- **Enter/Space:** Activate buttons/links
- **Escape:** Close mobile menu/modals
- **Arrow Keys:** Navigate within menus

### Screen Reader Support
```typescript
// ARIA labels for navigation
<nav aria-label="Main navigation">
  <button 
    aria-label="Open navigation menu"
    aria-expanded={isMobileMenuOpen}
  >
    Menu
  </button>
</nav>

// Skip links
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### Focus Management
- Focus trap in mobile drawer
- Focus return after menu close
- Visible focus indicators

## Testing Requirements

### Visual Regression Tests
```typescript
// Playwright tests per role per viewport
test.describe('Shell Components', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];
  
  for (const viewport of viewports) {
    test(`Admin shell - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');
      await expect(page).toHaveScreenshot(`admin-shell-${viewport.name}.png`);
      
      // Test mobile menu toggle
      if (viewport.name === 'mobile') {
        await page.click('[aria-label="Open navigation menu"]');
        await expect(page).toHaveScreenshot(`admin-shell-${viewport.name}-menu-open.png`);
      }
    });
  }
});
```

### Interaction Tests
- Mobile menu open/close
- Sidebar collapse/expand
- User menu dropdown
- Navigation between pages
- Route protection per role

## Performance Considerations

### Code Splitting
```typescript
// Lazy load shell components
const AdminShell = lazy(() => import('./AdminShell'));
const OperatorShell = lazy(() => import('./OperatorShell'));
const DriverShell = lazy(() => import('./DriverShell'));
```

### Bundle Optimization
- Shared BaseShell component (~5KB)
- Role-specific navigation configs (~1KB each)
- Icons loaded on-demand from lucide-react

### Memory Management
- Cleanup resize listeners
- Debounce viewport change handlers
- Cache navigation items

---

**This specification ensures consistent, accessible, and performant shell behavior across all roles with clean separation of concerns.**
