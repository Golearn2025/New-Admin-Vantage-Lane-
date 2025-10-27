/**
 * Premium Services Tab Component
 * 
 * Displays premium service options and pricing
 */

'use client';

import React from 'react';
import type { PricingConfig, PremiumServiceOption } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function PremiumServicesTab({ config }: Props) {
  const services = Object.entries(config.premium_services);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Premium Services</h2>
      <p className={styles.sectionDescription}>
        Additional premium services and their pricing
      </p>

      <div className={styles.grid}>
        {services.map(([key, service]) => {
          const options = Object.entries(service).filter(
            ([k, v]) => k !== 'name' && typeof v === 'object'
          ) as [string, PremiumServiceOption][];

          return (
            <div key={key} className={styles.section}>
              <h3 className={styles.sectionTitle}>{service.name}</h3>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Option</th>
                    <th className={styles.tableHeaderCell}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map(([optionKey, option]) => (
                    <tr key={optionKey} className={styles.tableRow}>
                      <td className={styles.tableCell}>{option.label}</td>
                      <td className={styles.tableCell}>£{option.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <span className={styles.exampleLabel}>Moët & Chandon:</span>
          <span className={styles.exampleValue}>
            £
            {
              (config.premium_services.champagne?.premium as PremiumServiceOption)?.price.toFixed(2) || '0.00'
            }
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £
            {
              (
                127.5 + ((config.premium_services.champagne?.premium as PremiumServiceOption)?.price || 0)
              ).toFixed(2)
            }</span>
        </div>
      </div>
    </div>
  );
}
