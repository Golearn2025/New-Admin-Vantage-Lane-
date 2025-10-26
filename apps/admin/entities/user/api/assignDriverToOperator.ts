/**
 * Assign Driver to Operator API
 */

import { createClient } from '@/lib/supabase/client';
import { createNotification } from '@entities/notification';

export interface AssignDriverParams {
  driverId: string;
  operatorId: string;
}

/**
 * Assign driver to operator
 */
export async function assignDriverToOperator({
  driverId,
  operatorId,
}: AssignDriverParams): Promise<{ success: boolean }> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('drivers')
      .update({
        operator_id: operatorId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId);

    if (error) {
      console.error('Assign driver error:', error);
      throw new Error(`Failed to assign driver: ${error.message}`);
    }

    // Notify operator
    await createNotification({
      userId: operatorId,
      type: 'driver_assigned',
      title: 'New Driver Assigned',
      message: 'A new driver has been assigned to your account',
      link: `/operator/drivers`,
    });

    // Notify driver
    await createNotification({
      userId: driverId,
      type: 'driver_assigned',
      title: 'Assigned to Operator',
      message: 'You have been assigned to an operator',
    });

    return { success: true };
  } catch (error) {
    console.error('Assign driver error:', error);
    throw error;
  }
}
