/**
 * Verify Driver API
 * Activate driver with vehicle categories
 */

import { createClient } from '@/lib/supabase/client';
import { createNotification } from '@entities/notification';

export interface VerifyDriverParams {
  driverId: string;
  categories: string[]; // ['EXEC', 'LUX', 'VAN', 'SUV']
  operatorId?: string;
}

/**
 * Verify and activate driver with vehicle categories
 */
export async function verifyDriver({
  driverId,
  categories,
  operatorId,
}: VerifyDriverParams): Promise<{ success: boolean }> {
  const supabase = createClient();

  try {
    // Update driver status
    const { error: driverError } = await supabase
      .from('drivers')
      .update({
        verification_status: 'verified',
        is_active: true,
        vehicle_categories: categories,
        operator_id: operatorId || null,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId);

    if (driverError) {
      console.error('Verify driver error:', driverError);
      throw new Error(`Failed to verify driver: ${driverError.message}`);
    }

    // Create notification for driver
    await createNotification({
      userId: driverId,
      type: 'driver_verified',
      title: 'Account Verified!',
      message: `Your driver account has been verified. Categories: ${categories.join(', ')}`,
    });

    // If assigned to operator, notify operator
    if (operatorId) {
      await createNotification({
        userId: operatorId,
        type: 'driver_assigned',
        title: 'New Driver Assigned',
        message: `A new driver has been assigned to your operator account`,
        link: `/operator/drivers`,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Verify driver error:', error);
    throw error;
  }
}
