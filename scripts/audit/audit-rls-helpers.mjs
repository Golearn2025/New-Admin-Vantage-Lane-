/**
 * RLS AUDIT HELPERS - Reusable functions for security testing
 */

import { createClient } from '@supabase/supabase-js';

// Supabase config (from environment or defaults)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fmeonuvmlopkutbjejlo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Test users (from environment - FAIL FAST if missing)
const TEST_USERS = {
  admin: {
    email: process.env.ADMIN_TEST_PASSWORD ? 'catalin@vantage-lane.com' : null,
    password: process.env.ADMIN_TEST_PASSWORD
  },
  operator: {
    email: process.env.OPERATOR_TEST_PASSWORD ? 'den@vantage-lane.com' : null, 
    password: process.env.OPERATOR_TEST_PASSWORD
  },
  driver: {
    email: process.env.DRIVER_TEST_PASSWORD ? 'driver@test.com' : null,
    password: process.env.DRIVER_TEST_PASSWORD
  }
};

export async function authenticateUser(role) {
  const user = TEST_USERS[role];
  if (!user.email || !user.password) {
    throw new Error(`Missing credentials for ${role}`);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password
  });
  
  if (error) {
    throw new Error(`Failed to authenticate ${role}: ${error.message}`);
  }
  
  return { supabase, user: data.user };
}

export async function testBasicAuthentication(results, runRLSTest) {
  await runRLSTest(
    'Basic Authentication',
    'Verify all test users can authenticate',
    async (test) => {
      const authResults = {};
      
      for (const role of results.availableUsers) {
        const { supabase, user } = await authenticateUser(role);
        authResults[role] = {
          id: user.id,
          email: user.email,
          authenticated: true
        };
        await supabase.auth.signOut();
      }
      
      test.details.authResults = authResults;
    }
  );
}

export async function testCrossTenantBookings(results, runRLSTest) {
  if (results.availableUsers.includes('admin') && results.availableUsers.includes('operator')) {
    await runRLSTest(
      'Cross-Tenant Bookings Access',
      'Verify operators cannot access other operators bookings',
      async (test) => {
        // Test as admin (should see all)
        const { supabase: adminSupabase } = await authenticateUser('admin');
        const { data: adminBookings } = await adminSupabase
          .from('bookings')
          .select('id, organization_id')
          .limit(10);
        
        // Test as operator (should see filtered)
        const { supabase: operatorSupabase } = await authenticateUser('operator');
        const { data: operatorBookings } = await operatorSupabase
          .from('bookings')
          .select('id, organization_id')
          .limit(10);
        
        test.details.adminBookingsCount = adminBookings?.length || 0;
        test.details.operatorBookingsCount = operatorBookings?.length || 0;
        
        // RLS should filter results for operator
        if (adminBookings && operatorBookings) {
          const hasRLS = operatorBookings.length <= adminBookings.length;
          if (!hasRLS) {
            throw new Error('Operator sees more bookings than admin - possible RLS bypass');
          }
        }
        
        await adminSupabase.auth.signOut();
        await operatorSupabase.auth.signOut();
      }
    );
  } else {
    return { skip: true, reason: 'Need both admin and operator credentials' };
  }
}

export async function testDriverDataIsolation(results, runRLSTest) {
  if (results.availableUsers.includes('driver')) {
    await runRLSTest(
      'Driver Data Isolation',
      'Verify drivers can only see their own data',
      async (test) => {
        const { supabase: driverSupabase, user } = await authenticateUser('driver');
        
        // Try to read drivers table
        const { data: driversData, error } = await driverSupabase
          .from('drivers')
          .select('id, auth_user_id')
          .limit(10);
        
        if (error) {
          test.details.driversQueryError = error.message;
        } else {
          test.details.driversCount = driversData?.length || 0;
          
          // Check if driver can see others' data
          const otherDrivers = driversData?.filter(d => d.auth_user_id !== user.id) || [];
          test.details.otherDriversVisible = otherDrivers.length;
          
          if (otherDrivers.length > 0) {
            throw new Error(`Driver can see ${otherDrivers.length} other drivers - RLS may be missing`);
          }
        }
        
        await driverSupabase.auth.signOut();
      }
    );
  } else {
    return { skip: true, reason: 'Need driver credentials' };
  }
}

export async function testAdminGlobalAccess(results, runRLSTest) {
  if (results.availableUsers.includes('admin')) {
    await runRLSTest(
      'Admin Global Access',
      'Verify admin can access all data types',
      async (test) => {
        const { supabase: adminSupabase } = await authenticateUser('admin');
        
        const queries = [
          { table: 'admin_users', description: 'Admin users table' },
          { table: 'organizations', description: 'Organizations table' },
          { table: 'drivers', description: 'Drivers table' },
          { table: 'bookings', description: 'Bookings table' }
        ];
        
        const accessResults = {};
        
        for (const query of queries) {
          try {
            const { data, error } = await adminSupabase
              .from(query.table)
              .select('id')
              .limit(1);
            
            accessResults[query.table] = {
              accessible: !error,
              hasData: data && data.length > 0,
              error: error?.message
            };
          } catch (e) {
            accessResults[query.table] = {
              accessible: false,
              error: e.message
            };
          }
        }
        
        test.details.accessResults = accessResults;
        
        // Admin should be able to access core tables
        const coreTablesAccessible = ['admin_users', 'organizations'].every(
          table => accessResults[table]?.accessible
        );
        
        if (!coreTablesAccessible) {
          throw new Error('Admin cannot access core tables');
        }
        
        await adminSupabase.auth.signOut();
      }
    );
  } else {
    return { skip: true, reason: 'Need admin credentials' };
  }
}

export function validateEnvironment() {
  if (!SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_ANON_KEY not found in environment');
    process.exit(1);
  }
  
  const availableUsers = Object.keys(TEST_USERS).filter(
    role => TEST_USERS[role].email && TEST_USERS[role].password
  );
  
  if (availableUsers.length === 0) {
    console.error('❌ No test user credentials available. Set ADMIN_TEST_PASSWORD, OPERATOR_TEST_PASSWORD, DRIVER_TEST_PASSWORD');
    process.exit(1);
  }
  
  return {
    supabaseUrl: SUPABASE_URL,
    hasAnonKey: !!SUPABASE_ANON_KEY,
    availableUsers
  };
}
