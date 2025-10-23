# Bookings Table Feature

> **Enterprise-grade booking management table with tabs, filtering, and detailed row expansion**

## 📋 Overview

Full-featured data table for managing transportation bookings with real-time updates, status filtering, and comprehensive booking details.

## 🎯 Features

- ✅ **Tab Navigation**: Filter by booking status (All, Pending, Active, Completed, Cancelled)
- ✅ **Real-time Counts**: Badge indicators showing count per tab
- ✅ **Expandable Rows**: Detailed booking information with assignment, services, and route details
- ✅ **Bulk Actions**: Select multiple bookings for batch operations
- ✅ **Status Management**: Update booking and payment status
- ✅ **Driver Assignment**: Assign/reassign drivers to bookings
- ✅ **Trip Type Support**: ONE WAY, RETURN, HOURLY, FLEET bookings
- ✅ **Responsive Design**: Works on desktop and mobile

## 📦 Usage

### Basic Usage

```typescript
import { BookingsTable } from '@features/bookings-table';

export default function BookingsPage() {
  return <BookingsTable />;
}
```

### With Tab Navigation

```typescript
import { BookingsWithTabs } from '@features/bookings-table';

export default function ActiveBookingsPage() {
  return (
    <BookingsWithTabs
      statusFilter={['pending', 'assigned']}
      title="Active Bookings"
      description="Current bookings in progress"
      showStatusFilter={true}
    />
  );
}
```

### Custom Filtering

```typescript
import { BookingsTable } from '@features/bookings-table';

export default function CompletedBookingsPage() {
  return (
    <BookingsTable 
      statusFilter={['completed']} 
      title="Completed Trips"
    />
  );
}
```

## 🔧 Components

### BookingsTable

Main table component with data fetching and row expansion.

**Props:**
- `statusFilter?: string[]` - Array of booking statuses to filter
- `title?: string` - Optional table title
- `description?: string` - Optional description

### BookingsWithTabs

Wrapper combining tabs with table for status-based filtering.

**Props:**
- `statusFilter?: string[]` - Initial status filter
- `title: string` - Page title
- `description?: string` - Page description
- `showStatusFilter?: boolean` - Show/hide status filter dropdown

### BookingTabs

Tab navigation with real-time count badges.

**Props:**
- `activeTab: BookingTabValue` - Currently active tab
- `onTabChange: (tab: BookingTabValue) => void` - Tab change handler
- `tabs: BookingTab[]` - Array of tab configurations
- `isLoading?: boolean` - Loading state

### BookingExpandedRow

Detailed row view showing all booking information.

**Props:**
- `booking: BookingListItem` - Booking data to display

## 🪝 Hooks

### useBookingsList

Fetches and manages booking list data.

```typescript
const { 
  bookings, 
  isLoading, 
  error, 
  refetch 
} = useBookingsList({ statusFilter: ['pending'] });
```

**Returns:**
- `bookings: BookingListItem[]` - Array of bookings
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error if fetch failed
- `refetch: () => Promise<void>` - Manually refetch data

### useBookingCounts

Fetches booking counts for each status tab.

```typescript
const { 
  counts, 
  isLoading, 
  error, 
  refetch 
} = useBookingCounts();
```

**Returns:**
- `counts: BookingCounts | null` - Count object with all, pending, active, completed, cancelled
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error if fetch failed
- `refetch: () => Promise<void>` - Manually refetch counts

## 📊 Data Types

### BookingListItem

```typescript
interface BookingListItem {
  id: string;
  reference: string;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  destination: string;
  scheduled_at: string;
  trip_type: 'oneway' | 'return' | 'hourly' | 'fleet';
  vehicle_model: string | null;
  hours: number | null;
  fleet_executive: number | null;
  fleet_s_class: number | null;
  fleet_v_class: number | null;
  fleet_suv: number | null;
  // ... more fields
}
```

### BookingStatus

```typescript
type BookingStatus = 
  | 'NEW' 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'EN_ROUTE' 
  | 'ARRIVED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';
```

## 🔗 API Dependencies

Uses booking list API from:
```typescript
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
```

**Endpoints:**
- `GET /api/bookings/list` - Fetch bookings list
- `GET /api/bookings/counts` - Fetch status counts

## 🎨 Styling

All components use CSS Modules with 100% design tokens:
- `BookingsTable.module.css`
- `BookingTabs.module.css`
- `BookingExpandedRow.module.css`
- `TripTypeSection.module.css`

**Design tokens used:**
- `var(--spacing-*)` - All spacing
- `var(--color-*)` - All colors
- `var(--border-radius-*)` - Border radius
- `var(--shadow-*)` - Box shadows
- `var(--transition-*)` - Animations

## ✅ Compliance

- [x] TypeScript strict mode
- [x] Design tokens 100%
- [x] Feature Sliced Design architecture
- [x] Zero hardcoded values
- [x] Client components properly marked
- [x] Accessible (ARIA labels)
- [x] Responsive design

## 🧪 Testing

Run tests:
```bash
npm run test:run
```

Test files:
- `components/BookingTabs.test.tsx`
- `components/BookingsWithTabs.test.tsx`
- `components/expanded/TripTypeSection.test.tsx`
- `hooks/useBookingCounts.test.ts`

## 📝 Notes

- All components are client components (`'use client'`)
- Uses React Server Components for page.tsx files
- Real-time updates via polling (5 second interval)
- Optimistic UI updates for better UX
- Error boundaries handle failed API calls

## 🔮 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Export to CSV/Excel
- [ ] Advanced filtering (date range, price range, etc.)
- [ ] Bulk actions (assign multiple, cancel multiple)
- [ ] Keyboard shortcuts
- [ ] Column customization
