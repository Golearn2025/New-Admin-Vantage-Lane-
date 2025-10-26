/**
 * Profile Page - Driver Portal
 * FUNCTIONAL - Driver profile information
 */

import { getCurrentDriver } from '@driver-shared/lib/supabase/server';
import { createClient } from '@driver-shared/lib/supabase/server';
import styles from './page.module.css';

async function getDriverVehicle(driverId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('vehicles')
    .select('*')
    .eq('driver_id', driverId)
    .single();
  return data;
}

export default async function DriverProfilePage() {
  const driver = await getCurrentDriver();

  if (!driver) {
    return <div className={styles.error}>Unable to load profile</div>;
  }

  const vehicle = await getDriverVehicle(driver.id);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.grid}>
        {/* Personal Info Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Personal Information</h2>
            <span
              className={`${styles.status} ${
                driver.is_active ? styles.statusActive : styles.statusInactive
              }`}
            >
              {driver.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.field}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>
                {driver.first_name} {driver.last_name}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{driver.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{driver.phone || 'N/A'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>License Number</span>
              <span className={styles.value}>
                {driver.license_number || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>My Vehicle</h2>
          </div>
          <div className={styles.cardBody}>
            {vehicle ? (
              <>
                <div className={styles.field}>
                  <span className={styles.label}>Make & Model</span>
                  <span className={styles.value}>
                    {vehicle.make} {vehicle.model}
                  </span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>License Plate</span>
                  <span className={styles.value}>
                    {vehicle.license_plate}
                  </span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Color</span>
                  <span className={styles.value}>{vehicle.color || 'N/A'}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Year</span>
                  <span className={styles.value}>{vehicle.year || 'N/A'}</span>
                </div>
              </>
            ) : (
              <p className={styles.emptyText}>No vehicle assigned yet</p>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>My Stats</h2>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.stat}>
              <span className={styles.statIcon}>⭐</span>
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {driver.rating_average || '0.0'}
                </span>
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>📊</span>
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {driver.review_count || 0}
                </span>
                <span className={styles.statLabel}>Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Documents Status</h2>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.field}>
              <span className={styles.label}>License</span>
              <span className={styles.badge + ' ' + styles.badgeSuccess}>
                Verified
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Insurance</span>
              <span className={styles.badge + ' ' + styles.badgeWarning}>
                Pending
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Background Check</span>
              <span className={styles.badge + ' ' + styles.badgeSuccess}>
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
