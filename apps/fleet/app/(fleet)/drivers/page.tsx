/**
 * Drivers Page - Fleet Portal
 * List and manage fleet drivers
 */

import { createClient } from '@fleet-shared/lib/supabase/server';
import { getCurrentOperatorId } from '@fleet-shared/lib/supabase/server';
import styles from './page.module.css';

async function getOperatorDrivers(operatorId: string) {
  const supabase = createClient();

  // RLS will automatically filter by organization_id
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('organization_id', operatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }

  return data || [];
}

export default async function FleetDriversPage() {
  const operatorId = await getCurrentOperatorId();

  if (!operatorId) {
    return <div className={styles.error}>Unable to load drivers</div>;
  }

  const drivers = await getOperatorDrivers(operatorId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Drivers</h1>
        <button className={styles.addButton}>+ Add Driver</button>
      </div>

      {drivers.length === 0 ? (
        <div className={styles.empty}>
          <p>No drivers yet</p>
          <p className={styles.emptySubtext}>
            Add your first driver to start managing your fleet
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {drivers.map((driver) => (
            <div key={driver.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.driverName}>
                  {driver.first_name} {driver.last_name}
                </h3>
                <span
                  className={`${styles.status} ${
                    driver.is_active ? styles.statusActive : styles.statusInactive
                  }`}
                >
                  {driver.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.detail}>
                  <span className={styles.label}>Email:</span> {driver.email}
                </p>
                <p className={styles.detail}>
                  <span className={styles.label}>Phone:</span>{' '}
                  {driver.phone || 'N/A'}
                </p>
                <p className={styles.detail}>
                  <span className={styles.label}>License:</span>{' '}
                  {driver.license_number || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
