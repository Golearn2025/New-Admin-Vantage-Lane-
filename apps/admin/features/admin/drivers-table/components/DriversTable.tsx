/**
 * DriversTable Component
 * 
 * RBAC-compliant drivers table:
 * - Admin: sees ALL drivers
 * - Operator: sees ONLY drivers assigned to their organization
 */

'use client';

import { useRouter } from 'next/navigation';
import { UsersTableBase } from '@features/admin/users-table-base';
import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import type { UnifiedUser } from '@entities/user';

export function DriversTable() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const isOperator = user?.role === 'operator';

  const handleViewDriver = (user: UnifiedUser) => {
    router.push(`/users/drivers/${user.id}`);
  };

  return (
    <UsersTableBase
      userType="driver"
      title={isOperator ? "My Drivers" : "Drivers"}
      createLabel="Create Driver"
      showCreateButton={true}
      onViewCustom={handleViewDriver}
      // ✅ RBAC: Operators see only their organization's drivers
      useOperatorFilter={isOperator}
    />
  );
}
