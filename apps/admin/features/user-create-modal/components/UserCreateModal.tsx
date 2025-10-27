/**
 * UserCreateModal Component
 * 
 * Modal for creating new users (Customer/Driver/Operator/Admin)
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React from 'react';
import { Modal, Button, Input } from '@vantage-lane/ui-core';
import { useUserCreateModal } from '../hooks/useUserCreateModal';
import type { UserCreateModalProps, UserType } from '../types';
import styles from './UserCreateModal.module.css';

export function UserCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: UserCreateModalProps) {
  const {
    formData,
    isSubmitting,
    error,
    updateField,
    handleSubmit,
    resetForm,
  } = useUserCreateModal(onSuccess);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New User"
      size="lg"
    >
      <form onSubmit={onSubmit} className={styles.form}>
        {/* User Type Selector */}
        <div className={styles.formGroup}>
          <label className={styles.label}>User Type *</label>
          <select
            className={styles.select}
            value={formData.userType}
            onChange={(e) => updateField('userType', e.target.value as UserType)}
            required
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>

        {/* First Name & Last Name */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name *</label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Last Name *</label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+44 7700 900000"
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Temporary Password *</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
        </div>

        {/* Driver Specific: Operator Assignment */}
        {formData.userType === 'driver' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Assign to Operator</label>
            <select
              className={styles.select}
              value={formData.operatorId || ''}
              onChange={(e) => updateField('operatorId', e.target.value)}
            >
              <option value="">Select Operator (Optional)</option>
              {/* TODO: Load operators dynamically */}
            </select>
          </div>
        )}

        {/* Operator Specific: Commission */}
        {formData.userType === 'operator' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Commission %</label>
            <Input
              type="number"
              value={formData.commissionPct || 20}
              onChange={(e) =>
                updateField('commissionPct', parseFloat(e.target.value))
              }
              placeholder="20"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        )}

        {/* Admin Specific: Role */}
        {formData.userType === 'admin' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Admin Role *</label>
            <select
              className={styles.select}
              value={formData.role || 'admin'}
              onChange={(e) =>
                updateField(
                  'role',
                  e.target.value as 'super_admin' | 'admin' | 'support'
                )
              }
              required
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="support">Support</option>
            </select>
          </div>
        )}

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
