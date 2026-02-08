/**
 * Premium Services Tab Component
 * 
 * Displays and allows editing of premium service options and pricing
 */

'use client';

import React, { useState } from 'react';
import { Button, Input, DataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Edit, Save, X } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, PremiumServiceOption, PremiumService } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function PremiumServicesTab({ config }: Props) {
  const { updatePremiumServices, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<Record<string, PremiumService>>(config.premium_services);

  const handleSave = async () => {
    try {
      await updatePremiumServices(edited);
      setIsEditing(false);
    } catch { /* handled in hook */ }
  };

  const handleCancel = () => {
    setEdited(config.premium_services);
    setIsEditing(false);
  };

  const handleOptionChange = (serviceKey: string, optionKey: string, field: 'label' | 'price', value: string | number) => {
    const svc = edited[serviceKey];
    if (!svc) return;
    const opt = svc[optionKey] as PremiumServiceOption;
    setEdited({
      ...edited,
      [serviceKey]: {
        ...svc,
        [optionKey]: { ...opt, [field]: field === 'price' ? Number(value) : value },
      },
    });
  };

  const data = isEditing ? edited : config.premium_services;
  const services = Object.entries(data);

  const columns: Column<{ id: string; label: string; price: number; serviceKey: string }>[] = [
    {
      id: 'label', header: 'Option', accessor: (r) => r.label,
      cell: (r) => isEditing
        ? <Input type="text" value={r.label} onChange={(e: any) => handleOptionChange(r.serviceKey, r.id, 'label', e.target.value)} />
        : r.label,
    },
    {
      id: 'price', header: 'Price', accessor: (r) => r.price,
      cell: (r) => isEditing
        ? <Input type="number" value={r.price} onChange={(e: any) => handleOptionChange(r.serviceKey, r.id, 'price', e.target.value)} min={0} step={1} />
        : `£${r.price.toFixed(2)}`,
    },
  ];

  return (
    <div className={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h2 className={styles.sectionTitle}>Premium Services</h2>
          <p className={styles.sectionDescription}>Additional premium services and their pricing</p>
        </div>
        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4" /> Save</Button>
              <Button variant="secondary" onClick={handleCancel}><X className="h-4 w-4" /> Cancel</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /> Edit</Button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {services.map(([key, service]) => {
          const options = Object.entries(service).filter(
            ([k, v]) => k !== 'name' && typeof v === 'object'
          ) as [string, PremiumServiceOption][];

          const tableData = options.map(([optionKey, option]) => ({
            id: optionKey,
            serviceKey: key,
            label: option.label,
            price: option.price,
          }));

          return (
            <div key={key} className={styles.section}>
              <h3 className={styles.sectionTitle}>{service.name}</h3>
              <DataTable columns={columns} data={tableData} />
            </div>
          );
        })}
      </div>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Executive with Premium Champagne</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£127.50</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Moët &amp; Chandon:</span>
          <span className={styles.exampleValue}>
            £{(config.premium_services.champagne?.premium as PremiumServiceOption)?.price.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £{(127.5 + ((config.premium_services.champagne?.premium as PremiumServiceOption)?.price || 0)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
