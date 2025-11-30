/**
 * OperatorsTable Component
 * 
 * Wrapper around UsersTableBase for operators page
 */

import React, { useMemo } from 'react';
import { UsersTableBase } from '@features/admin/users-table-base';

export function OperatorsTable() {
  return (
    <UsersTableBase
      userType="operator"
      title="Operators"
      createLabel="Create Operator"
      showCreateButton={true}
    />
  );
}
