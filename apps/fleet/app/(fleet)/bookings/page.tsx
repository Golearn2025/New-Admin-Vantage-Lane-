/**
 * Bookings Page - Fleet Portal
 * View and manage bookings (scoped to operator)
 */

import { getCurrentOperatorId } from '../../../shared/lib/supabase/server';
import { createClient } from '../../../shared/lib/supabase/server';
import styles from './page.module.css';

async function getOperatorBookings(operatorId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:customer_id(first_name, last_name),
      driver:assigned_driver_id(first_name, last_name),
      pricing:booking_pricing(operator_net, driver_payout)
    `)
    .eq('organization_id', operatorId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: 'statusPending',
    confirmed: 'statusConfirmed',
    in_progress: 'statusInProgress',
    completed: 'statusCompleted',
    cancelled: 'statusCancelled',
  };
  return styles[status] || 'statusPending';
}

export default async function FleetBookingsPage() {
  const operatorId = await getCurrentOperatorId();

  if (!operatorId) {
    return <div className={styles.error}>Unable to load bookings</div>;
  }

  const bookings = await getOperatorBookings(operatorId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings</h1>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: {bookings.length}
          </span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>No bookings yet</p>
          <p className={styles.emptySubtext}>
            Bookings will appear here once drivers start accepting rides
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Driver</th>
                <th>Pickup</th>
                <th>Status</th>
                <th>Revenue</th>
                <th>Driver Pay</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td className={styles.idCell}>
                    {booking.id.slice(0, 8)}
                  </td>
                  <td>
                    {booking.customer?.first_name} {booking.customer?.last_name}
                  </td>
                  <td>
                    {booking.driver?.first_name} {booking.driver?.last_name}
                  </td>
                  <td className={styles.addressCell}>
                    {booking.pickup_address || 'N/A'}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[getStatusBadge(booking.status)]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className={styles.priceCell}>
                    £{(booking.pricing?.[0]?.operator_net || 0).toFixed(2)}
                  </td>
                  <td className={styles.priceCell}>
                    £{(booking.pricing?.[0]?.driver_payout || 0).toFixed(2)}
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
