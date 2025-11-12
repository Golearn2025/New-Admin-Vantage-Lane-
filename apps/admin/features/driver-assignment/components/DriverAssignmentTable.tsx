/**
 * Driver Assignment Table
 * 
 * Premium table with tabs for managing driver-operator assignments
 * Uses EnterpriseDataTable + Tabs from ui-core - 100% reusable
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Tabs, ErrorBanner, Card, Button, Badge, Input, Pagination } from '@vantage-lane/ui-core';
import { Users } from 'lucide-react';
import { useDriverAssignment } from '../hooks/useDriverAssignment';
import { useOperators } from '../hooks/useOperators';
import { AssignDriverModal } from './AssignDriverModal';
import type { DriverAssignment, TabId } from '../types';
import styles from './DriverAssignmentTable.module.css';

export function DriverAssignmentTable() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [selectedDriver, setSelectedDriver] = useState<DriverAssignment | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { drivers, counts, loading, error, assignDriver, unassignDriver } =
    useDriverAssignment(activeTab);
  const { operators } = useOperators();

  // Debug
  console.log('DriverAssignmentTable:', { drivers, counts, loading, error, operators });

  // Create tabs with counts
  const tabs = useMemo(
    () => [
      {
        id: 'all' as TabId,
        label: 'All Drivers',
        count: counts.all,
      },
      {
        id: 'assigned' as TabId,
        label: 'Assigned',
        count: counts.assigned,
      },
      {
        id: 'unassigned' as TabId,
        label: 'Unassigned',
        count: counts.unassigned,
      },
    ],
    [counts]
  );

  // Handle assign button click
  const handleAssignClick = useCallback((driver: DriverAssignment) => {
    setSelectedDriver(driver);
    setIsAssignModalOpen(true);
  }, []);

  // Handle unassign button click
  const handleUnassignClick = useCallback(
    async (driver: DriverAssignment) => {
      if (!confirm(`Are you sure you want to unassign ${driver.driver_name}?`)) {
        return;
      }

      const result = await unassignDriver(driver.driver_id);
      if (!result.success) {
        alert(result.error || 'Failed to unassign driver');
      }
    },
    [unassignDriver]
  );

  // Handle assign confirmation
  const handleAssignConfirm = useCallback(
    async (operatorId: string, notes: string) => {
      if (!selectedDriver) return;

      setAssignLoading(true);
      const result = await assignDriver(selectedDriver.driver_id, operatorId, notes);
      setAssignLoading(false);

      if (result.success) {
        setIsAssignModalOpen(false);
        setSelectedDriver(null);
      } else {
        alert(result.error || 'Failed to assign driver');
      }
    },
    [selectedDriver, assignDriver]
  );

  // Filter drivers by search
  const filteredDrivers = useMemo(() => {
    if (!searchQuery) return drivers;
    const query = searchQuery.toLowerCase();
    return drivers.filter(
      (d) =>
        d.driver_name.toLowerCase().includes(query) ||
        d.driver_email.toLowerCase().includes(query) ||
        d.operator_name?.toLowerCase().includes(query)
    );
  }, [drivers, searchQuery]);

  // Paginate
  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDrivers.slice(start, start + pageSize);
  }, [filteredDrivers, currentPage]);

  const totalPages = Math.ceil(filteredDrivers.length / pageSize);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Users size={24} />
          </div>
          <div>
            <h1 className={styles.title}>Assign Drivers to Operators</h1>
            <p className={styles.subtitle}>Manage driver-operator relationships</p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={styles.errorWrapper}>
          <ErrorBanner message={error} />
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <Input
          type="search"
          placeholder="Search drivers by name, email, or operator..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          size="md"
        />
      </div>

      {/* Drivers Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {loading ? (
          <Card>
            <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              Loading drivers...
            </div>
          </Card>
        ) : paginatedDrivers.length === 0 ? (
          <Card>
            <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No drivers found
            </div>
          </Card>
        ) : (
          paginatedDrivers.map((driver) => (
            <Card key={driver.id}>
              <div style={{ padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
                {/* Driver Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>
                    {driver.driver_name}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
                    {driver.driver_email}
                  </div>
                </div>

                {/* Operator */}
                <div style={{ flex: 1 }}>
                  {driver.operator_name ? (
                    <>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Operator</div>
                      <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        {driver.operator_name}
                      </div>
                    </>
                  ) : (
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Not assigned</span>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Badge color={driver.status === 'active' ? 'success' : driver.status === 'inactive' ? 'neutral' : 'warning'}>
                    {driver.status === 'active' ? 'Active' : driver.status === 'inactive' ? 'Inactive' : 'Pending'}
                  </Badge>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  {driver.operator_id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleAssignClick(driver)}>
                        Reassign
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleUnassignClick(driver)}>
                        Unassign
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleAssignClick(driver)}>
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredDrivers.length > pageSize && (
        <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDrivers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Assign Modal */}
      <AssignDriverModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedDriver(null);
        }}
        onConfirm={handleAssignConfirm}
        driver={selectedDriver}
        operators={operators}
        loading={assignLoading}
      />
    </div>
  );
}
