'use client';

/**
 * React Query Provider - STEP 3A
 * Global query client for caching and state management
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: Props) {
  // Create QueryClient instance (stable across re-renders)
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          // STEP 3A: Conservative caching for real-time data
          staleTime: 30 * 1000, // 30 seconds - good for bookings
          gcTime: 5 * 60 * 1000, // 5 minutes cache retention
          retry: 2,
          refetchOnWindowFocus: false, // Avoid excessive refetching
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
