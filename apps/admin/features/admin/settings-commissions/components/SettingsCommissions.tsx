/**
 * SettingsCommissions Component
 * 
 * Manage platform and operator commission percentages
 * TAB 1: Platform Commission (%)
 * TAB 2: Operator Commission (%)
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { formatCurrency } from '@/shared/utils/formatters';
import { useSettingsCommissions } from '../hooks/useSettingsCommissions';
import styles from './SettingsCommissions.module.css';

type TabType = 'platform' | 'operators';

export function SettingsCommissions() {
  const [activeTab, setActiveTab] = useState<TabType>('platform');
  const {
    platformCommission,
    operatorCommission,
    operatorCommissions,
    loading,
    updatePlatformCommission,
    updateOperatorCommission,
    updateSpecificOperatorCommission,
    saveChanges,
  } = useSettingsCommissions();

  const [hasChanges, setHasChanges] = useState(false);

  const handlePlatformChange = (value: number) => {
    updatePlatformCommission(value);
    setHasChanges(true);
  };

  const handleOperatorChange = (value: number) => {
    updateOperatorCommission(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await saveChanges();
    setHasChanges(false);
  };

  const calculateExample = () => {
    const customerPrice = 151.25;
    const platformAmount = (customerPrice * platformCommission) / 100;
    const afterPlatform = customerPrice - platformAmount;
    const operatorAmount = (customerPrice * operatorCommission) / 100;
    const driverAmount = afterPlatform - operatorAmount;

    return {
      customerPrice,
      platformAmount,
      afterPlatform,
      operatorAmount,
      driverAmount,
    };
  };

  const example = calculateExample();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Commission Settings</h1>
          <p className={styles.subtitle}>
            Configure platform and operator commission percentages
          </p>
        </div>
        {hasChanges && (
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'platform' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('platform')}
        >
          Platform Commission
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'operators' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('operators')}
        >
          Operator Commissions
        </button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {!loading && activeTab === 'platform' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Platform Commission</h3>
            <p className={styles.description}>
              Platform commission is deducted from every booking before operator and driver payments
            </p>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Commission Percentage</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={platformCommission}
                  onChange={(e) => handlePlatformChange(parseFloat(e.target.value) || 0)}
                />
                <span className={styles.unit}>%</span>
              </div>
            </div>
          </div>

          {/* Example Calculation */}
          <div className={styles.example}>
            <h4>Example Calculation</h4>
            <div className={styles.calc}>
              <div className={styles.calcRow}>
                <span>Customer Pays:</span>
                <strong>{formatCurrency(example.customerPrice)}</strong>
              </div>
              <div className={styles.calcRow}>
                <span>Platform Commission ({platformCommission}%):</span>
                <strong className={styles.deduct}>-{formatCurrency(example.platformAmount)}</strong>
              </div>
              <div className={`${styles.calcRow} ${styles.highlight}`}>
                <span>After Platform:</span>
                <strong>{formatCurrency(example.afterPlatform)}</strong>
              </div>
              <div className={styles.calcRow}>
                <span>Operator Commission ({operatorCommission}%):</span>
                <strong className={styles.add}>+{formatCurrency(example.operatorAmount)}</strong>
              </div>
              <div className={`${styles.calcRow} ${styles.highlight}`}>
                <span>Driver Gets:</span>
                <strong>{formatCurrency(example.driverAmount)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'operators' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Default Operator Commission</h3>
            <p className={styles.description}>
              Default commission for all operators (can be overridden per operator)
            </p>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Default Commission Percentage</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={operatorCommission}
                  onChange={(e) => handleOperatorChange(parseFloat(e.target.value) || 0)}
                />
                <span className={styles.unit}>%</span>
              </div>
            </div>
          </div>

          {/* Operator-specific commissions */}
          {operatorCommissions.length > 0 && (
            <div className={styles.section}>
              <h3>Operator-Specific Commissions</h3>
              <div className={styles.operatorsList}>
                {operatorCommissions.map((op) => (
                  <div key={op.operatorId} className={styles.operatorRow}>
                    <span className={styles.operatorName}>{op.operatorName}</span>
                    <div className={styles.inputWrapper}>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={op.commissionPercent}
                        onChange={(e) => {
                          updateSpecificOperatorCommission(
                            op.operatorId,
                            parseFloat(e.target.value) || 0
                          );
                          setHasChanges(true);
                        }}
                      />
                      <span className={styles.unit}>%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
