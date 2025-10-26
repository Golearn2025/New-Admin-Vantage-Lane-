/**
 * Fleet Layout - AppShell Integration
 *
 * Layout global pentru toate paginile fleet operator.
 * Wraps children în AppShell cu navigation.
 */

'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '../../shared/ui/composed/appshell';

interface FleetLayoutProps {
  children: React.ReactNode;
}

export default function FleetLayout({ children }: FleetLayoutProps) {
  const pathname = usePathname();

  // Mock user data - in production would come from auth context
  const user = {
    id: '1',
    name: 'Test Operator',
    email: 'den@vantage-lane.com',
  };

  return (
    <AppShell role="operator" currentPath={pathname} user={user}>
      {children}
    </AppShell>
  );
}
