/**
 * Setup Test Users for E2E Security Testing
 * Creates dedicated test users that are isolated from production data
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const TEST_USERS = {
  admin: {
    id: '11111111-1111-1111-1111-111111111111', // Fixed UUID for tests
    email: 'e2e-admin@vantage-lane.test',
    password: 'TestPass123!',
    role: 'admin',
    name: 'E2E Test Admin'
  },
  operator: {
    id: '22222222-2222-2222-2222-222222222222', // Fixed UUID for tests
    email: 'e2e-operator@vantage-lane.test',
    password: 'TestPass123!', 
    role: 'operator',
    name: 'E2E Test Operator'
  }
};

const TEST_ORGANIZATION = {
  code: 'E2E-TEST-ORG',
  name: 'E2E Test Organization',
  description: 'Test organization for automated testing',
  org_type: 'operator',
  is_active: true
};

async function setupTestUsers() {
  console.log('🚀 Setting up test users for E2E testing...');
  
  try {
    // Step 1: Create admin user directly
    console.log('👤 Creating admin test user...');
    await createTestUserDirect(TEST_USERS.admin);
    
    // Step 2: Create operator user directly
    console.log('👤 Creating operator test user...');  
    await createTestUserDirect(TEST_USERS.operator);
    
    console.log('🎉 Test users setup completed successfully!');
    console.log('');
    console.log('📋 Test credentials:');
    console.log(`Admin: ${TEST_USERS.admin.email} / ${TEST_USERS.admin.password}`);
    console.log(`Operator: ${TEST_USERS.operator.email} / ${TEST_USERS.operator.password}`);
    console.log('');
    console.log('🧪 Ready to run E2E tests!');
    
  } catch (error) {
    console.error('❌ Failed to setup test users:', error.message);
    process.exit(1);
  }
}

async function createTestUserDirect(user) {
  console.log(`  📧 Creating user: ${user.email} with ID: ${user.id}`);
  
  // Create user in Supabase Auth with fixed ID
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_id: user.id  // Use fixed ID
  });
  
  if (authError && !authError.message.includes('already')) {
    console.warn(`  ⚠️ Auth user might already exist: ${authError.message}`);
  }
  
  // Add to admin_users table with fixed ID
  console.log(`  📝 Adding to admin_users table...`);
  const { error: adminError } = await supabase
    .from('admin_users')
    .upsert([{
      auth_user_id: user.id, // Use the fixed ID
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: true,
      created_at: new Date().toISOString()
    }], { onConflict: 'email' });
    
  if (adminError) {
    console.warn(`  ⚠️ Admin user might already exist: ${adminError.message}`);
  }
  
  console.log(`  ✅ User ready: ${user.email} (ID: ${user.id})`);
}

// Cleanup function
async function cleanupTestUsers() {
  console.log('🧹 Cleaning up test users...');
  
  for (const user of Object.values(TEST_USERS)) {
    try {
      console.log(`  🗑️ Deleting: ${user.email} (ID: ${user.id})`);
      
      // Delete from admin_users
      await supabase.from('admin_users').delete().eq('auth_user_id', user.id);
      
      // Delete auth user
      await supabase.auth.admin.deleteUser(user.id);
      
      console.log(`  ✅ Deleted: ${user.email}`);
    } catch (error) {
      console.warn(`  ⚠️ Failed to delete ${user.email}: ${error.message}`);
    }
  }
  
  console.log('✅ Cleanup completed');
}

// CLI interface
const command = process.argv[2];

if (command === 'setup') {
  setupTestUsers();
} else if (command === 'cleanup') {
  cleanupTestUsers();
} else {
  console.log('Usage:');
  console.log('  node scripts/setup-test-users.js setup   # Create test users');
  console.log('  node scripts/setup-test-users.js cleanup # Delete test users');
}
