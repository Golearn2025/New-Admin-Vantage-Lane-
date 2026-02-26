/**
 * Driver Location API Route
 * 
 * POST /api/driver/location - Update driver current location
 * Called from mobile app every 30 seconds when driver is online
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateDriverLocation } from '@entities/driver-location';
import { UpdateLocationPayloadSchema } from '@entities/driver-location';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    // Get auth token from mobile app
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' }, 
        { status: 401 }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient();
    
    // Verify driver authentication and get driver ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' }, 
        { status: 401 }
      );
    }

    // Get driver record from auth user
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('id, is_active, online_status')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        { error: 'Driver not found or inactive' }, 
        { status: 404 }
      );
    }

    // Only update location if driver is online
    if (driver.online_status === 'offline') {
      return NextResponse.json(
        { error: 'Driver is offline. Cannot update location.' }, 
        { status: 400 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = UpdateLocationPayloadSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid location data', 
          details: validation.error.issues 
        }, 
        { status: 400 }
      );
    }

    // Update driver location
    await updateDriverLocation(driver.id, validation.data);

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
