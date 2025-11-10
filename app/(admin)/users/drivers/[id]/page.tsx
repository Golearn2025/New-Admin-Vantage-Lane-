/**
 * Driver Profile Page
 * 
 * Routing only - zero logic
 * Import feature component from @features/
 */

'use client';

import { DriverProfile } from '@features/driver-profile';

interface DriverProfilePageProps {
  params: {
    id: string;
  };
}

export default function DriverProfilePage({ params }: DriverProfilePageProps) {
  return <DriverProfile driverId={params.id} />;
}
