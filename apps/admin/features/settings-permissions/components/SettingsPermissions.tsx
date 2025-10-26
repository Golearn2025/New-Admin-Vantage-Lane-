/**
 * SettingsPermissions Component
 * Admin UI to manage role and user permissions
 */

'use client';

import { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { useSettingsPermissions } from '../hooks/useSettingsPermissions';
import type { SettingsPermissionsProps } from '../types';
import type { UserRole } from '@entities/permission';
import styles from './SettingsPermissions.module.css';

export function SettingsPermissions({ className }: SettingsPermissionsProps) {
  const {
    view,
    selectedRole,
    selectedUserId,
    pages,
    loading,
    saving,
    error,
    handleViewChange,
    handleRoleChange,
    handleUserChange,
    handleTogglePermission,
  } = useSettingsPermissions();

  const [searchUserId, setSearchUserId] = useState('');

  const rootPages = pages.filter((p) => !p.parentKey);
  const getChildPages = (parentKey: string) => pages.filter((p) => p.parentKey === parentKey);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Permissions Management</h1>
          <p className={styles.subtitle}>
            Control what each role or user can access in the admin panel
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewButton} ${view === 'role' ? styles.active : ''}`}
          onClick={() => handleViewChange('role')}
        >
          Role Permissions
        </button>
        <button
          className={`${styles.viewButton} ${view === 'user' ? styles.active : ''}`}
          onClick={() => handleViewChange('user')}
        >
          User Overrides
        </button>
      </div>

      {/* Role Selector */}
      {view === 'role' && (
        <div className={styles.selector}>
          <label className={styles.label}>Select Role:</label>
          <select
            className={styles.select}
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          >
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
            <option value="customer">Customer</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>
      )}

      {/* User Selector */}
      {view === 'user' && (
        <div className={styles.selector}>
          <label className={styles.label}>User ID:</label>
          <div className={styles.userInput}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter user UUID"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={() => handleUserChange(searchUserId)}
              disabled={!searchUserId}
            >
              Load Permissions
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Permissions List */}
      {loading ? (
        <div className={styles.loading}>Loading permissions...</div>
      ) : (
        <div className={styles.permissionsList}>
          <div className={styles.listHeader}>
            <span className={styles.headerLabel}>Page</span>
            <span className={styles.headerEnabled}>Enabled</span>
          </div>

          {rootPages.map((page) => {
            const children = getChildPages(page.pageKey);
            const hasChildren = children.length > 0;

            return (
              <div key={page.pageKey} className={styles.permissionGroup}>
                {/* Parent Page */}
                <div className={styles.permissionItem}>
                  <div className={styles.pageInfo}>
                    <span className={styles.pageIcon}>{page.icon}</span>
                    <div>
                      <div className={styles.pageLabel}>{page.label}</div>
                      {page.description && (
                        <div className={styles.pageDescription}>{page.description}</div>
                      )}
                      {page.hasOverride && (
                        <span className={styles.overrideBadge}>Custom Override</span>
                      )}
                    </div>
                  </div>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={page.enabled}
                      onChange={(e) => handleTogglePermission(page.pageKey, e.target.checked)}
                      disabled={saving}
                    />
                    <span className={styles.checkmark}></span>
                  </label>
                </div>

                {/* Child Pages */}
                {hasChildren && (
                  <div className={styles.childPages}>
                    {children.map((child) => (
                      <div key={child.pageKey} className={styles.permissionItem}>
                        <div className={styles.pageInfo}>
                          <span className={styles.childIndicator}>└─</span>
                          <div>
                            <div className={styles.pageLabel}>{child.label}</div>
                            {child.hasOverride && (
                              <span className={styles.overrideBadge}>Custom Override</span>
                            )}
                          </div>
                        </div>
                        <label className={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={child.enabled}
                            onChange={(e) =>
                              handleTogglePermission(child.pageKey, e.target.checked)
                            }
                            disabled={saving}
                          />
                          <span className={styles.checkmark}></span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className={styles.infoBox}>
        <h3 className={styles.infoTitle}>How it works:</h3>
        <ul className={styles.infoList}>
          <li>
            <strong>Role Permissions:</strong> Set default permissions for all users with this
            role
          </li>
          <li>
            <strong>User Overrides:</strong> Grant or revoke specific permissions for individual
            users
          </li>
          <li>User overrides take precedence over role permissions</li>
          <li>Changes apply immediately after toggling</li>
          <li>Users will see only the pages they have access to in the sidebar</li>
        </ul>
      </div>
    </div>
  );
}
