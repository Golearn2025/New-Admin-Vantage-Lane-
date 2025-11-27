/**
 * STRATUL 3 - SECURITY/RLS SANITY TESTS
 * 
 * Testează RLS policies prin cross-tenant queries (DOAR client keys, nu service role)
 */

import fs from 'fs';
import path from 'path';
import { 
  validateEnvironment,
  testBasicAuthentication,
  testCrossTenantBookings,
  testDriverDataIsolation,
  testAdminGlobalAccess
} from './audit-rls-helpers.mjs';

const ROOT = process.cwd();
const DATE_FOLDER = new Date().toISOString().split('T')[0];
const SECURITY_DIR = path.join(ROOT, 'docs/audit/outputs', DATE_FOLDER, 'security');

// Ensure security directory exists
fs.mkdirSync(SECURITY_DIR, { recursive: true });

// Initialize results with environment validation
const envConfig = validateEnvironment();
const results = {
  timestamp: new Date().toISOString(),
  scanDate: DATE_FOLDER,
  ...envConfig,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  }
};

function skipTest(name, reason) {
  console.log(`⏭️  Skipping: ${name} - ${reason}`);
  
  results.tests.push({
    name,
    status: 'SKIPPED',
    reason,
    timestamp: new Date().toISOString()
  });
  
  results.summary.skipped++;
  results.summary.total++;
}

async function runRLSTest(name, description, testFn) {
  console.log(`\n🔍 Running: ${name}`);
  
  const test = {
    name,
    description,
    status: 'RUNNING',
    startTime: new Date().toISOString(),
    duration: 0,
    error: null,
    details: {}
  };
  
  const startTime = Date.now();
  
  try {
    await testFn(test);
    test.status = 'PASSED';
    results.summary.passed++;
    console.log(`✅ ${name}: PASSED`);
  } catch (error) {
    test.error = error.message;
    test.status = 'FAILED';
    results.summary.failed++;
    console.log(`❌ ${name}: FAILED - ${error.message}`);
  }
  
  test.duration = Date.now() - startTime;
  test.endTime = new Date().toISOString();
  
  results.tests.push(test);
  results.summary.total++;
}

console.log('🚀 Starting RLS Security Audit...\n');
console.log(`📊 Available test users: ${results.availableUsers.join(', ')}`);

// Run all security tests using helpers
await testBasicAuthentication(results, runRLSTest);

const crossTenantResult = await testCrossTenantBookings(results, runRLSTest);
if (crossTenantResult?.skip) {
  skipTest('Cross-Tenant Bookings Access', crossTenantResult.reason);
}

const driverIsolationResult = await testDriverDataIsolation(results, runRLSTest);
if (driverIsolationResult?.skip) {
  skipTest('Driver Data Isolation', driverIsolationResult.reason);
}

const adminAccessResult = await testAdminGlobalAccess(results, runRLSTest);
if (adminAccessResult?.skip) {
  skipTest('Admin Global Access', adminAccessResult.reason);
}

// Save results
const resultsPath = path.join(SECURITY_DIR, 'rls.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

// Generate markdown report
const reportMd = `# RLS Security Audit Report - ${DATE_FOLDER}

**Generated:** ${results.timestamp}
**Supabase URL:** ${results.supabaseUrl}
**Available Users:** ${results.availableUsers.join(', ')}

## Summary

| Status | Count |
|--------|-------|
| ✅ Passed | ${results.summary.passed} |
| ❌ Failed | ${results.summary.failed} |
| ⏭️ Skipped | ${results.summary.skipped} |
| **Total** | **${results.summary.total}** |

## Test Results

${results.tests.map(test => {
  const statusIcon = {
    'PASSED': '✅',
    'FAILED': '❌', 
    'SKIPPED': '⏭️'
  }[test.status] || '❓';
  
  return `### ${statusIcon} ${test.name}

**Status:** ${test.status}
**Description:** ${test.description}
${test.duration ? `**Duration:** ${test.duration}ms` : ''}
${test.reason ? `**Reason:** ${test.reason}` : ''}
${test.error ? `**Error:** ${test.error}` : ''}

${test.details && Object.keys(test.details).length > 0 ? `**Details:**
\`\`\`json
${JSON.stringify(test.details, null, 2)}
\`\`\`` : ''}
`;
}).join('\n')}

## Overall Security Status

${results.summary.failed > 0 ? '❌ **FAILED** - Security issues detected' : 
  results.summary.passed > 0 ? '✅ **PASSED** - All security tests passed' : 
  '⚠️ **INCONCLUSIVE** - No tests could be executed'}

## Recommendations

${results.summary.failed > 0 ? `
⚠️ **Security issues found!** Review failed tests above and ensure:
- RLS policies are properly configured
- Row-level security is enabled on sensitive tables
- Users can only access data they're authorized to see
` : ''}

${results.summary.skipped > 0 ? `
📝 **Incomplete coverage:** Some tests were skipped due to missing credentials or configuration.
Set environment variables: ADMIN_TEST_PASSWORD, OPERATOR_TEST_PASSWORD, DRIVER_TEST_PASSWORD
` : ''}

## Files Generated

- Detailed results: \`${path.relative(ROOT, resultsPath)}\`
`;

const reportMdPath = path.join(SECURITY_DIR, 'rls.md');
fs.writeFileSync(reportMdPath, reportMd);

console.log(`\n📊 Security Audit Summary:`);
console.log(`   Passed: ${results.summary.passed}`);
console.log(`   Failed: ${results.summary.failed}`);
console.log(`   Skipped: ${results.summary.skipped}`);
console.log(`   Total: ${results.summary.total}`);
console.log(`\n📁 Reports saved to: ${SECURITY_DIR}`);

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);
