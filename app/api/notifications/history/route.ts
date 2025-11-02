/**
 * Notifications History API
 * Server-side endpoint to bypass RLS
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Use RPC function to bypass RLS
    const { data, error } = await supabase.rpc('get_notification_history', {
      limit_count: 100,
    });

    if (error) {
      console.error('Fetch history error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
