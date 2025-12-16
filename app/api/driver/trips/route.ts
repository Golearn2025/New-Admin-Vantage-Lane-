/**
 * Driver Trips API
 * Returns recent trips for the authenticated driver
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get driver record
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (driverError || !driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    // Get recent booking legs for this driver with booking details
    const { data: bookingLegs, error: legsError } = await supabase
      .from('booking_legs')
      .select(`
        id,
        leg_number,
        pickup_location,
        destination,
        scheduled_at,
        status,
        leg_price,
        driver_payout,
        bookings!parent_booking_id (
          id,
          reference,
          customer_name
        )
      `)
      .eq('assigned_driver_id', driver.id)
      .order('scheduled_at', { ascending: false })
      .limit(10);

    if (legsError) {
      console.error('Error fetching trips:', legsError);
      return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
    }

    // Transform data for frontend
    const trips = (bookingLegs || []).map(leg => ({
      id: leg.id,
      reference: (leg.bookings as any)?.reference || `LEG-${leg.id}`,
      customerName: (leg.bookings as any)?.customer_name || 'Unknown Customer',
      pickup: leg.pickup_location,
      destination: leg.destination,
      scheduledAt: leg.scheduled_at,
      status: leg.status,
      earnings: leg.driver_payout || 0, // in pence
      legNumber: leg.leg_number
    }));

    return NextResponse.json({ trips });

  } catch (error) {
    console.error('Driver trips error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver trips' },
      { status: 500 }
    );
  }
}
