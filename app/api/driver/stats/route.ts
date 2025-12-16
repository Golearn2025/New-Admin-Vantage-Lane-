/**
 * Driver Statistics API
 * Returns driver-specific metrics for dashboard cards
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

    // Get driver record to find auth_user_id connection
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('id, auth_user_id')
      .eq('auth_user_id', user.id)
      .single();

    if (driverError || !driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    // Get booking legs assigned to this driver
    const { data: bookingLegs, error: legsError } = await supabase
      .from('booking_legs')
      .select('id, status, leg_price, driver_payout, scheduled_at')
      .eq('assigned_driver_id', driver.id);

    if (legsError) {
      console.error('Error fetching booking legs:', legsError);
    }

    const legs = bookingLegs || [];

    // Calculate stats
    const totalTrips = legs.length;
    const completedTrips = legs.filter(leg => leg.status === 'completed').length;
    const upcomingTrips = legs.filter(leg => 
      ['pending', 'assigned', 'en_route', 'arrived', 'in_progress'].includes(leg.status)
    ).length;

    // Calculate earnings (driver payout)
    const totalEarnings = legs
      .filter(leg => leg.driver_payout && leg.status === 'completed')
      .reduce((sum, leg) => sum + (leg.driver_payout || 0), 0);

    // Get document status
    const { data: documents, error: docsError } = await supabase
      .from('driver_documents')
      .select('id, status, document_type')
      .eq('driver_id', driver.id);

    if (docsError) {
      console.error('Error fetching documents:', docsError);
    }

    const docs = documents || [];
    const approvedDocs = docs.filter(doc => doc.status === 'approved').length;
    const totalRequiredDocs = 4; // Driving license, insurance, MOT, profile photo

    return NextResponse.json({
      totalTrips,
      completedTrips,
      upcomingTrips,
      totalEarnings, // in pence
      documentsApproved: approvedDocs,
      documentsTotal: totalRequiredDocs,
      documentsComplete: approvedDocs >= totalRequiredDocs
    });

  } catch (error) {
    console.error('Driver stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver statistics' },
      { status: 500 }
    );
  }
}
