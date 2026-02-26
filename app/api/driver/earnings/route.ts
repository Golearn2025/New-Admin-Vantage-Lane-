/**
 * Driver Earnings API
 * Returns earnings data for charts (monthly/weekly breakdown)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export const runtime = 'nodejs';


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

    // Get completed bookings with earnings for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: bookingLegs, error: legsError } = await supabase
      .from('booking_legs')
      .select('driver_payout, scheduled_at, status')
      .eq('assigned_driver_id', driver.id)
      .eq('status', 'completed')
      .gte('scheduled_at', sixMonthsAgo.toISOString())
      .not('driver_payout', 'is', null)
      .order('scheduled_at', { ascending: true });

    if (legsError) {
      console.error('Error fetching earnings:', legsError);
      return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
    }

    // Group by month
    const monthlyEarnings = (bookingLegs || []).reduce((acc, leg) => {
      const date = new Date(leg.scheduled_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          earnings: 0,
          trips: 0
        };
      }
      
      acc[monthKey]!.earnings += leg.driver_payout || 0;
      acc[monthKey]!.trips += 1;
      
      return acc;
    }, {} as Record<string, { month: string; earnings: number; trips: number }>);

    // Convert to array and sort
    const earningsData = Object.values(monthlyEarnings)
      .sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({ earningsData });

  } catch (error) {
    console.error('Driver earnings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver earnings' },
      { status: 500 }
    );
  }
}
