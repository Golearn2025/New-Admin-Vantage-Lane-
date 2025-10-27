/**
 * DriversTable Component
 * 
 * Wrapper around UsersTableBase for drivers page
 */

import { UsersTableBase } from '@features/users-table-base';

export function DriversTable() {
  return (
    <UsersTableBase
      userType="driver"
      title="Drivers"
      createLabel="Create Driver"
      showCreateButton={true}
    />
  );
}
