import React from 'react';
import { Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Building2 } from 'lucide-react';
import type { GeneralPolicies } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  policies: GeneralPolicies;
  editedPolicies: GeneralPolicies;
  setEditedPolicies: React.Dispatch<React.SetStateAction<GeneralPolicies>>;
}

export function CorporateDiscounts({ policies, editedPolicies, setEditedPolicies }: Props) {
  type CorporateRow = {
    id: 'tier1' | 'tier2';
    tier: string;
    description: string;
  };

  const data: CorporateRow[] = [
    { id: 'tier1', tier: 'Tier 1', description: 'Standard corporate accounts' },
    { id: 'tier2', tier: 'Tier 2', description: 'Premium corporate accounts' },
  ];

  const columns: Column<CorporateRow>[] = [
    {
      id: 'tier',
      header: 'Tier',
      accessor: (row) => row.tier,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${row.id === 'tier1' ? styles.statusBadgeSuccess : styles.statusBadgeSecondary}`}>
          {row.tier}
        </span>
      ),
    },
    {
      id: 'discount',
      header: 'Discount',
      accessor: () => '',
      cell: (row) => (
        <div className={styles.flexRow}>
          <Input
            type="number"
            value={(row.id === 'tier1' ? policies.corporate_discounts.tier1 : policies.corporate_discounts.tier2) * 100}
            onChange={(e) =>
              setEditedPolicies({
                ...editedPolicies,
                corporate_discounts: {
                  ...editedPolicies.corporate_discounts,
                  [row.id]: Number(e.target.value) / 100,
                } as GeneralPolicies['corporate_discounts'],
              })
            }
            min={0}
            max={50}
            step={1}
            className={styles.inputNarrow}
          />
          <span>%</span>
        </div>
      ),
    },
    { id: 'description', header: 'Description', accessor: (row) => row.description },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <div className={styles.flexRow}>
          <Building2 className="h-4 w-4" />
          Corporate Discounts
        </div>
      </h3>
      <EnterpriseDataTable<CorporateRow> columns={columns} data={data} stickyHeader />
    </div>
  );
}
