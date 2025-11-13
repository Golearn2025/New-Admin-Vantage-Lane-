import React from 'react';
import { Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import type { ServicePolicies } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  policies: ServicePolicies;
  editedPolicies: ServicePolicies;
  setEditedPolicies: React.Dispatch<React.SetStateAction<ServicePolicies>>;
}

export function AdditionalServicesSection({ policies, editedPolicies, setEditedPolicies }: Props) {
  type ServiceRow = { id: 'multi_stop_fee'; service: string; description: string };
  const data: ServiceRow[] = [
    { id: 'multi_stop_fee', service: 'Multi-Stop Fee', description: 'Fee per additional stop' },
  ];
  const columns: Column<ServiceRow>[] = [
    { id: 'service', header: 'Service', accessor: (row) => row.service },
    {
      id: 'fee',
      header: 'Fee',
      accessor: () => '',
      cell: () => (
        <div className={styles.flexRow}>
          <span>£</span>
          <Input
            type="number"
            value={policies.multi_stop_fee}
            onChange={(e) =>
              setEditedPolicies({
                ...editedPolicies,
                multi_stop_fee: Number(e.target.value),
              })
            }
            min={0}
            step={1}
            className={styles.inputNarrow}
          />
        </div>
      ),
    },
    { id: 'description', header: 'Description', accessor: (row) => row.description },
  ];
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>➕ Additional Services</h3>
      <EnterpriseDataTable<ServiceRow> columns={columns} data={data} stickyHeader />
    </div>
  );
}
