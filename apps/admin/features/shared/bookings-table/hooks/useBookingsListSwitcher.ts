/**
 * Bookings List Hook Switcher - STEP 3A Safety
 * Switches between old and React Query implementations via feature flag
 */

import { getFeatureFlag } from '@admin-shared/config/featureFlags';
import { useBookingsList } from './useBookingsList';
import { useBookingsListRQ } from './useBookingsListRQ';

interface Props {
  statusFilter?: string[];
  selectedStatus?: string;
  tripTypeFilter?: string | null;
  currentPage: number;
  pageSize: number;
}

interface Return {
  bookings: any[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchBookings: () => Promise<void>;
  newBookingIds?: Set<string>;
  dismissNewBooking?: (id: string) => void;
}

/**
 * Smart hook switcher - same interface, different implementation
 */
export function useBookingsListSwitcher(props: Props): Return {
  const useReactQuery = getFeatureFlag('USE_REACT_QUERY_BOOKINGS');
  
  // Log which implementation is being used
  if (typeof window !== 'undefined') {
    console.info(`🎛️ Using ${useReactQuery ? 'React Query' : 'Original'} bookings hook`);
  }
  
  if (useReactQuery) {
    return useBookingsListRQ(props);
  } else {
    return useBookingsList(props);
  }
}
