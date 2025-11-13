/**
 * DriversTable Component
 * 
 * Wrapper around UsersTableBase for drivers page
 * Navigates to driver profile page on view
 */

'use client';

import { useRouter } from 'next/navigation';
import { UsersTableBase } from '@features/admin/users-table-base';
import type { UnifiedUser } from '@entities/user';

export function DriversTable() {
  const router = useRouter();

  const handleViewDriver = (user: UnifiedUser) => {
    router.push(`/users/drivers/${user.id}`);
  };

  return (
    <UsersTableBase
      userType="driver"
      title="Drivers"
      createLabel="Create Driver"
      showCreateButton={true}
      onViewCustom={handleViewDriver}
    />
  );
}
