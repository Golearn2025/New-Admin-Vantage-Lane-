/**
 * UserViewModal Component
 * 
 * Display user details in a modal
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React from 'react';
import { Modal } from '@vantage-lane/ui-core';
import type { UserViewModalProps } from '../types';
import styles from './UserViewModal.module.css';

export function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  const isActive = user.status === 'active';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className={styles.container}>
        {/* User Type Badge */}
        <div className={styles.section}>
          <div className={styles.badge}>
            {user.userType.toUpperCase()}
          </div>
        </div>

        {/* Basic Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <p className={styles.value}>{user.name}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <p className={styles.value}>{user.email}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <p className={styles.value}>{user.phone || 'N/A'}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <p className={isActive ? styles.statusActive : styles.statusInactive}>
                {isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account Information</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>User ID</label>
              <p className={styles.valueCode}>{user.id}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Created At</label>
              <p className={styles.value}>
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
