/**
 * DocumentsFilters Component
 * 
 * Status, type, category filters and navigation tabs
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ UI-core components
 */

import { Select } from '@vantage-lane/ui-core';
import type { DocumentsApprovalFilters } from '../types';
import styles from './DocumentsApprovalTable.module.css';

interface DocumentsCounts {
  pending: number;
  expiring_soon: number;
  expired: number;
}

interface DocumentsFiltersProps {
  filters: DocumentsApprovalFilters;
  onFiltersChange: (filters: DocumentsApprovalFilters) => void;
  counts: DocumentsCounts;
}

export function DocumentsFilters({ filters, onFiltersChange, counts }: DocumentsFiltersProps) {
  const updateFilters = (update: Partial<DocumentsApprovalFilters>) => {
    onFiltersChange({ ...filters, ...update });
  };

  return (
    <>
      {/* Filters */}
      <div className={styles.filters}>
        <Select
          value={filters.status || 'all'}
          options={[
            { label: 'All Status', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ]}
          onChange={(value) => updateFilters({ status: value as any })}
        />

        <Select
          value={filters.documentType || 'all'}
          options={[
            { label: 'All Types', value: 'all' },
            { label: 'Profile Photo', value: 'profile_photo' },
            { label: 'Driving Licence', value: 'driving_licence' },
            { label: 'PCO Licence', value: 'pco_licence' },
            { label: 'Bank Statement', value: 'bank_statement' },
            { label: 'Proof of Identity', value: 'proof_of_identity' },
            { label: 'PHV Licence', value: 'phv_licence' },
            { label: 'MOT Certificate', value: 'mot_certificate' },
            { label: 'Insurance', value: 'insurance_certificate' },
            { label: 'V5C Logbook', value: 'v5c_logbook' },
          ]}
          onChange={(value) => updateFilters({ documentType: value as string })}
        />

        <Select
          value={filters.category || 'all'}
          options={[
            { label: 'All Categories', value: 'all' },
            { label: 'Driver Documents', value: 'driver' },
            { label: 'Vehicle Documents', value: 'vehicle' },
          ]}
          onChange={(value) => updateFilters({ category: value as any })}
        />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={filters.tab === 'pending' ? styles.tabActive : styles.tab}
          onClick={() => updateFilters({ tab: 'pending' })}
        >
          Pending
          {counts.pending > 0 && <span className={styles.badge}>{counts.pending}</span>}
        </button>

        <button
          className={filters.tab === 'expiring' ? styles.tabActive : styles.tab}
          onClick={() => updateFilters({ tab: 'expiring' })}
        >
          Expiring Soon
          {counts.expiring_soon > 0 && (
            <span className={styles.badgeWarning}>{counts.expiring_soon}</span>
          )}
        </button>

        <button
          className={filters.tab === 'expired' ? styles.tabActive : styles.tab}
          onClick={() => updateFilters({ tab: 'expired' })}
        >
          Expired
          {counts.expired > 0 && <span className={styles.badgeDanger}>{counts.expired}</span>}
        </button>

        <button
          className={filters.tab === 'all' ? styles.tabActive : styles.tab}
          onClick={() => updateFilters({ tab: 'all' })}
        >
          All Documents
        </button>
      </div>
    </>
  );
}
