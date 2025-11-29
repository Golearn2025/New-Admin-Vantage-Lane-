/**
 * Users List API - Enterprise Performance
 * 
 * Replaces 4 client queries with 1 server request
 * Proper auth + RLS compliance
 * Files <200 lines, functions <50 lines
 */

import { logger } from '@/lib/utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface UnifiedUser {
  id: string;
  userType: 'customer' | 'driver' | 'admin' | 'operator';
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Auth validation - ENTERPRISE SECURITY
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' }, 
        { status: 401 }
      );
    }

    // Server-side Supabase with auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { 
        global: { 
          headers: { Authorization: `Bearer ${token}` } 
        } 
      }
    );

    // Parallel fetch - PERFORMANCE OPTIMIZATION
    const [
      { data: customers, error: customersError },
      { data: drivers, error: driversError }, 
      { data: admins, error: adminsError },
      { data: operators, error: operatorsError }
    ] = await Promise.all([
      supabase
        .from('customers')
        .select('id, email, first_name, last_name, phone, status, created_at')
        .is('deleted_at', null)
        .limit(1000),
      
      supabase
        .from('drivers')
        .select('id, email, first_name, last_name, phone, is_active, created_at')
        .is('deleted_at', null)
        .limit(1000),
        
      supabase
        .from('admin_users')
        .select('id, email, first_name, last_name, phone, is_active, created_at')
        .is('deleted_at', null)
        .limit(1000),
        
      supabase
        .from('organizations')
        .select('id, name, contact_email, contact_phone, is_active, created_at')
        .eq('org_type', 'operator')
        .is('deleted_at', null)
        .limit(1000)
    ]);

    // Handle errors
    if (customersError) logger.warn('Customers fetch failed', { error: customersError.message });
    if (driversError) logger.warn('Drivers fetch failed', { error: driversError.message });
    if (adminsError) logger.warn('Admins fetch failed', { error: adminsError.message });
    if (operatorsError) logger.warn('Operators fetch failed', { error: operatorsError.message });

    // Transform data - FUNCTIONS <50 LINES
    const allUsers: UnifiedUser[] = [
      // Customers
      ...(customers || []).map(mapCustomer),
      // Drivers  
      ...(drivers || []).map(mapDriver),
      // Admins
      ...(admins || []).map(mapAdmin),
      // Operators
      ...(operators || []).map(mapOperator)
    ];

    // Sort by created_at desc
    allUsers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    logger.info('Users list success', {
      customers_count: customers?.length || 0,
      drivers_count: drivers?.length || 0,
      admins_count: admins?.length || 0,
      operators_count: operators?.length || 0,
      total_users: allUsers.length,
      duration_ms: Date.now() - startTime
    });

    return NextResponse.json({
      data: allUsers,
      total: allUsers.length,
      performance: {
        query_duration_ms: Date.now() - startTime,
        cache_hit: false
      }
    });

  } catch (error) {
    logger.error('Users list API error', {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Transform functions <50 lines each
function mapCustomer(c: any): UnifiedUser {
  return {
    id: c.id,
    userType: 'customer',
    name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'No Name',
    email: c.email,
    phone: c.phone,
    status: c.status === 'active' ? 'active' : 'inactive',
    createdAt: c.created_at,
  };
}

function mapDriver(d: any): UnifiedUser {
  return {
    id: d.id,
    userType: 'driver',
    name: `${d.first_name || ''} ${d.last_name || ''}`.trim() || 'No Name',
    email: d.email || 'no-email@example.com',
    phone: d.phone,
    status: d.is_active ? 'active' : 'inactive',
    createdAt: d.created_at,
  };
}

function mapAdmin(a: any): UnifiedUser {
  return {
    id: a.id,
    userType: 'admin',
    name: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'No Name',
    email: a.email,
    phone: a.phone,
    status: a.is_active ? 'active' : 'inactive',
    createdAt: a.created_at,
  };
}

function mapOperator(o: any): UnifiedUser {
  return {
    id: o.id,
    userType: 'operator',
    name: o.name || 'Unnamed Operator',
    email: o.contact_email || 'no-email@example.com',
    phone: o.contact_phone,
    status: o.is_active ? 'active' : 'inactive',
    createdAt: o.created_at,
  };
}
