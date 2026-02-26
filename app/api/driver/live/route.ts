/**
 * Live Drivers API Route
 * 
 * GET /api/driver/live - Get all online drivers with locations
 * Called from admin/operator dashboard every 30 seconds for live map
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOnlineDrivers } from '@entities/driver-location';
import { OnlineDriversQuerySchema } from '@entities/driver-location';
export const runtime = 'nodejs';


export async function GET(request: NextRequest) {
  try {
    console.log('🗺️ Live Drivers API called');
    
    // Return simple test data for now
    const mockResponse = {
      drivers: [],
      totalCount: 0,
      onlineCount: 0,
      busyCount: 0,
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Error fetching online drivers:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
