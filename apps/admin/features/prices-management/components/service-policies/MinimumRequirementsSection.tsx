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

export function MinimumRequirementsSection({ policies, editedPolicies, setEditedPolicies }: Props) {
  type MinimumRow = { id: 'distance' | 'time'; requirement: string; description: string };
  const data: MinimumRow[] = [
    { id: 'distance', requirement: 'Minimum Distance', description: 'Minimum billable distance for pricing' },
    { id: 'time', requirement: 'Minimum Time', description: 'Minimum billable time for pricing' },
  ];
  const columns: Column<MinimumRow>[] = [
    { id: 'requirement', header: 'Requirement', accessor: (row) => row.requirement },
    {
      id: 'value',
      header: 'Value',
      accessor: () => '',
      cell: (row) => (
        row.id === 'distance' ? (
          <div className={styles.flexRow}>
            <Input
              type="number"
              value={policies.minimum_distance_miles}
              onChange={(e) =>
                setEditedPolicies({
                  ...editedPolicies,
                  minimum_distance_miles: Number(e.target.value),
                })
              }
              min={0}
              step={0.5}
              className={styles.inputNarrow}
            />
            <span>miles</span>
          </div>
        ) : (
          <div className={styles.flexRow}>
            <Input
              type="number"
              value={policies.minimum_time_minutes}
              onChange={(e) =>
                setEditedPolicies({
                  ...editedPolicies,
                  minimum_time_minutes: Number(e.target.value),
                })
              }
              min={0}
              step={5}
              className={styles.inputNarrow}
            />
            <span>minutes</span>
          </div>
        )
      ),
    },
    { id: 'description', header: 'Description', accessor: (row) => row.description },
  ];
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>📏 Minimum Requirements</h3>
      <EnterpriseDataTable<MinimumRow> columns={columns} data={data} stickyHeader />
    </div>
  );
}
