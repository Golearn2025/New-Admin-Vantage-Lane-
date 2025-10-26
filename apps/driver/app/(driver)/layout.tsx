/**
 * Driver Layout - AppShell Integration
 *
 * Layout global pentru toate paginile driver.
 * Wraps children în AppShell cu navigation.
 */

'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '../../shared/ui/composed/appshell';

interface DriverLayoutProps {
  children: React.ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const pathname = usePathname();

  // Mock user data - in production would come from auth context
  const user = {
    id: '1',
    name: 'Test Driver',
    email: 'driver@vantage-lane.com',
  };

  return (
    <AppShell role="driver" currentPath={pathname} user={user}>
      {children}
    </AppShell>
  );
}
