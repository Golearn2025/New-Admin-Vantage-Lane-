/**
 * AdminsTable Component
 * 
 * Wrapper around UsersTableBase for admins page
 */

import { UsersTableBase } from '@features/users-table-base';

export function AdminsTable() {
  return (
    <UsersTableBase
      userType="admin"
      title="Admins"
      createLabel="Create Admin"
      showCreateButton={true}
    />
  );
}
