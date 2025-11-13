/**
 * SettingsPermissions Component
 * Admin UI to manage role and user permissions
 */

'use client';

import { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Lock, Users, User, Building2, Crown, Car, BarChart3, AlertCircle } from 'lucide-react';
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

  // Stats
  const enabledCount = pages.filter((p) => p.enabled).length;
  const totalCount = pages.length;

  // Sort pages alphabetically
  const sortedPages = [...pages].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Lock className="h-5 w-5" style={{ display: 'inline-block', marginRight: 'var(--spacing-2)', verticalAlign: 'middle' }} />
            Permissions Management
          </h1>
          <p className={styles.subtitle}>
            Control exactly which pages each role can access in the admin panel
          </p>
        </div>
        {!loading && (
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{enabledCount}</div>
              <div className={styles.statLabel}>Enabled</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalCount - enabledCount}</div>
              <div className={styles.statLabel}>Disabled</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalCount}</div>
              <div className={styles.statLabel}>Total Pages</div>
            </div>
          </div>
        )}
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewButton} ${view === 'role' ? styles.active : ''}`}
          onClick={() => handleViewChange('role')}
        >
          <Users className="h-4 w-4" style={{ display: 'inline-block', marginRight: 'var(--spacing-2)', verticalAlign: 'middle' }} />
          Role Permissions
        </button>
        <button
          className={`${styles.viewButton} ${view === 'user' ? styles.active : ''}`}
          onClick={() => handleViewChange('user')}
        >
          <User className="h-4 w-4" style={{ display: 'inline-block', marginRight: 'var(--spacing-2)', verticalAlign: 'middle' }} />
          User Overrides
        </button>
      </div>

      {/* Role Selector */}
      {view === 'role' && (
        <div className={styles.selector}>
          <div className={styles.selectorHeader}>
            <label className={styles.label}>Select Role to Configure:</label>
            <p className={styles.selectorHelp}>
              Choose a role to see all available pages and control which ones they can access
            </p>
          </div>
          <select
            className={styles.select}
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          >
            <option value="operator">Operator - Fleet Management</option>
            <option value="admin">Admin - Full Access</option>
            <option value="driver">Driver - Driver Portal</option>
            <option value="customer">Customer - Customer Portal</option>
            <option value="auditor">Auditor - Read-Only Access</option>
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
          <AlertCircle className="h-4 w-4" style={{ display: 'inline-block', marginRight: 'var(--spacing-2)', verticalAlign: 'middle' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Permissions List */}
      {loading ? (
        <div className={styles.loading}>Loading permissions...</div>
      ) : (
        <div className={styles.permissionsList}>
          <div className={styles.listHeader}>
            <div className={styles.col1}>Page Name</div>
            <div className={styles.col2}>Path</div>
            <div className={styles.col3}>Category</div>
            <div className={styles.col4}>Access</div>
          </div>

          {sortedPages.map((page) => (
            <div key={page.pageKey} className={styles.tableRow}>
              <div className={styles.col1}>
                <div className={styles.pageName}>{page.label}</div>
                {page.description && (
                  <div className={styles.pageDesc}>{page.description}</div>
                )}
              </div>
              <div className={styles.col2}>
                <code className={styles.pagePath}>{page.href}</code>
              </div>
              <div className={styles.col3}>
                <span className={styles.categoryBadge}>
                  {page.pageKey.startsWith('operator-')
                    ? 'Operator'
                    : page.pageKey.startsWith('settings-')
                      ? 'Settings'
                      : page.pageKey.startsWith('users-')
                        ? 'Users'
                        : page.pageKey.startsWith('bookings-')
                          ? 'Bookings'
                          : 'General'}
                </span>
              </div>
              <div className={styles.col4}>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={page.enabled}
                    onChange={(e) => handleTogglePermission(page.pageKey, e.target.checked)}
                    disabled={saving}
                  />
                  <span className={styles.toggleSlider}></span>
                  <span className={styles.toggleLabel}>
                    {page.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>
          ))}
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
