/**
 * Driver Status API Route
 * 
 * POST /api/driver/status - Update driver online status
 * Called from mobile app when driver goes online/offline/busy
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateDriverStatus } from '@entities/driver-location';
import { UpdateStatusPayloadSchema } from '@entities/driver-location';

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
      .select('id, is_active')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        { error: 'Driver not found or inactive' }, 
        { status: 404 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = UpdateStatusPayloadSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validation.error.issues 
        }, 
        { status: 400 }
      );
    }

    const { status, latitude, longitude, accuracy } = validation.data;

    // Prepare location data if provided
    const locationData = (latitude && longitude) ? {
      latitude,
      longitude, 
      accuracy
    } : undefined;

    // Update driver status
    await updateDriverStatus(driver.id, status, locationData);

    return NextResponse.json({
      success: true,
      message: `Driver status updated to ${status}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating driver status:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
