/**
 * Earnings Page - Driver Portal
 * Track earnings and performance
 */

import { getCurrentDriver } from '../../../shared/lib/supabase/server';
import { createClient } from '../../../shared/lib/supabase/server';
import styles from './page.module.css';

async function getDriverEarnings(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      created_at,
      pricing:booking_pricing(driver_payout)
    `)
    .eq('assigned_driver_id', driverId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching earnings:', error);
    return [];
  }

  return data || [];
}

function calculateStats(earnings: any[]) {
  const total = earnings.reduce(
    (sum, booking) => sum + (booking.pricing?.[0]?.driver_payout || 0),
    0
  );

  const thisWeek = earnings.filter((booking) => {
    const date = new Date(booking.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  const weeklyEarnings = thisWeek.reduce(
    (sum, booking) => sum + (booking.pricing?.[0]?.driver_payout || 0),
    0
  );

  return {
    total,
    weekly: weeklyEarnings,
    completed: earnings.length,
    average: earnings.length > 0 ? total / earnings.length : 0,
  };
}

export default async function DriverEarningsPage() {
  const driver = await getCurrentDriver();

  if (!driver) {
    return <div className={styles.error}>Unable to load earnings</div>;
  }

  const earnings = await getDriverEarnings(driver.id);
  const stats = calculateStats(earnings);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Earnings</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>💰</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>Total Earnings</p>
            <p className={styles.cardValue}>£{stats.total.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📅</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>This Week</p>
            <p className={styles.cardValue}>£{stats.weekly.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>✅</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>Completed Rides</p>
            <p className={styles.cardValue}>{stats.completed}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>Average per Ride</p>
            <p className={styles.cardValue}>£{stats.average.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Earnings</h2>
        {earnings.length === 0 ? (
          <div className={styles.empty}>
            <p>No completed rides yet</p>
            <p className={styles.emptySubtext}>
              Your earnings will appear here after completing rides
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {earnings.slice(0, 10).map((booking: any) => (
              <div key={booking.id} className={styles.listItem}>
                <div className={styles.listItemDate}>
                  {new Date(booking.created_at).toLocaleDateString()}
                </div>
                <div className={styles.listItemId}>
                  #{booking.id.slice(0, 8)}
                </div>
                <div className={styles.listItemAmount}>
                  £{(booking.pricing?.[0]?.driver_payout || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
