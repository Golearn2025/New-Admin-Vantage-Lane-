/**
 * Booking Legs API Route
 * 
 * GET /api/bookings/[id]/legs - Fetch legs for a booking
 * 
 * Architecture: app/api/bookings/[id]/legs/route.ts
 * Compliant: Server-side only, TypeScript strict
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const runtime = 'nodejs';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data, error } = await supabase
      .from('booking_legs')
      .select('*')
      .eq('parent_booking_id', bookingId)
      .order('leg_number', { ascending: true });

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ legs: data || [] });
  } catch (error) {
    console.error('Failed to fetch booking legs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking legs' },
      { status: 500 }
    );
  }
}
