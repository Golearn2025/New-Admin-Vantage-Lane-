/**
 * API Route: Send Notification to Driver
 * 
 * POST /api/v1/notifications/send-to-driver
 * 
 * Secure endpoint with:
 * - Authentication check
 * - Authorization (admin only)
 * - Input validation (Zod)
 * - Audit logging
 * - Error handling
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotificationToDriver } from '@entities/notification';
import { z } from 'zod';

// ✅ Schema validation
const SendNotificationSchema = z.object({
  driverId: z.string().uuid('Invalid driver ID format'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
  link: z.string().url('Invalid URL').optional(),
});


export async function POST(request: Request) {
  const supabase = createClient();
  
  try {
    // ✅ 1. AUTHENTICATION
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // eslint-disable-next-line no-console
      console.error('❌ Authentication failed:', authError?.message);
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to continue' },
        { status: 401 }
      );
    }
    
    // ✅ 2. AUTHORIZATION (verify admin role)
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();
    
    if (adminError || !adminUser) {
      // eslint-disable-next-line no-console
      console.error('❌ Admin user not found:', user.email);
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Check role permissions
    if (!['super_admin', 'admin'].includes(adminUser.role)) {
      // eslint-disable-next-line no-console
      console.error('❌ Insufficient permissions:', adminUser.role);
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Check if active
    if (!adminUser.is_active) {
      // eslint-disable-next-line no-console
      console.error('❌ Account inactive:', user.email);
      return NextResponse.json(
        { error: 'Forbidden', message: 'Account is inactive' },
        { status: 403 }
      );
    }
    
    // ✅ 3. INPUT VALIDATION
    const body = await request.json();
    const validatedData = SendNotificationSchema.parse(body);
    
    // ✅ 4. LOGGING
    // eslint-disable-next-line no-console
    console.log(`📧 Admin ${user.email} sending notification to driver ${validatedData.driverId}`);
    
    // ✅ 5. BUSINESS LOGIC (call existing function - SAFE!)
    await sendNotificationToDriver(
      validatedData.driverId,
      validatedData.title,
      validatedData.message,
      validatedData.link
    );
    
    // ✅ 6. AUDIT LOG
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'send_notification_to_driver',
      resource_type: 'notification',
      resource_id: null,
      details: {
        driverId: validatedData.driverId,
        title: validatedData.title,
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });
    
    // ✅ 7. SUCCESS RESPONSE
    // eslint-disable-next-line no-console
    console.log(`✅ Notification sent successfully to driver ${validatedData.driverId}`);
    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      driverId: validatedData.driverId,
    });
    
  } catch (error) {
    // ✅ 8. ERROR HANDLING
    // eslint-disable-next-line no-console
    console.error('❌ Send notification error:', error);
    
    // Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
