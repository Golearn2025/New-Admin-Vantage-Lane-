/**
 * Force Delete Notification API Route
 * Bypasses RLS using service role key for admin operations
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    console.log('🚨 FORCE DELETE API CALL:', notificationId);

    // Use server client with service role (bypasses RLS)
    const supabase = createClient();
    
    // First verify notification exists
    const { data: existing, error: checkError } = await supabase
      .from('notifications')
      .select('id, user_id, created_at')
      .eq('id', notificationId)
      .single();

    if (checkError || !existing) {
      console.error('❌ FORCE DELETE: Notification not found:', checkError);
      return NextResponse.json({ 
        error: 'Notification not found',
        details: checkError?.message 
      }, { status: 404 });
    }

    console.log('✅ FORCE DELETE: Found notification:', existing);
    
    // Now delete it
    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .select();

    if (error) {
      console.error('❌ FORCE DELETE API ERROR:', error);
      return NextResponse.json({ 
        error: `Force delete failed: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('❌ FORCE DELETE: NO ROWS AFFECTED');
      return NextResponse.json({ 
        error: 'No notification found with that ID or already deleted' 
      }, { status: 404 });
    }

    console.log('✅ FORCE DELETE API SUCCESS:', data);

    return NextResponse.json({ 
      success: true, 
      deleted: data[0],
      message: 'Notification force deleted successfully' 
    });

  } catch (error) {
    console.error('❌ FORCE DELETE API EXCEPTION:', error);
    return NextResponse.json({ 
      error: 'Internal server error during force delete',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
