#!/usr/bin/env node
/**
 * Production Performance Test Script
 * 
 * Compară performance între development și production mode
 */

console.log('🚀 PRODUCTION vs DEVELOPMENT PERFORMANCE TEST\n');

const { execSync } = require('child_process');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log('cyan', `\n📋 ${description}...`);
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log('green', `✅ Success: ${description}`);
    return result;
  } catch (error) {
    log('red', `❌ Failed: ${description}`);
    log('red', `Error: ${error.message}`);
    return null;
  }
}

console.log(`${colors.blue}STEP 1: PREPARATION${colors.reset}`);
console.log('═══════════════════════════════════════════════════');

// Check current status
log('yellow', '🔍 Checking current development server...');
try {
  const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3001', { encoding: 'utf8' });
  if (response.trim() === '200') {
    log('green', '✅ Development server is running on port 3001');
  } else {
    log('yellow', '⚠️  Development server not responding');
  }
} catch (error) {
  log('yellow', '⚠️  Development server not accessible');
}

console.log(`\n${colors.blue}STEP 2: BUILD PRODUCTION VERSION${colors.reset}`);
console.log('═══════════════════════════════════════════════════');

// Stop development server first (if running)
log('yellow', '🛑 Stopping development server...');
try {
  execSync('pkill -f "next dev"', { stdio: 'pipe' });
  log('green', '✅ Development server stopped');
} catch (error) {
  log('yellow', '⚠️  No development server to stop');
}

// Build production version
const buildResult = runCommand('pnpm build', 'Building production version');
if (!buildResult) {
  log('red', '❌ Build failed! Cannot test production mode.');
  process.exit(1);
}

console.log(`\n${colors.blue}STEP 3: START PRODUCTION SERVER${colors.reset}`);
console.log('═══════════════════════════════════════════════════');

log('yellow', '🚀 Starting production server...');
log('cyan', 'This will start the server on port 3000');
log('cyan', 'Keep this terminal open and test in browser');

console.log(`\n${colors.green}PERFORMANCE TESTING INSTRUCTIONS:${colors.reset}`);
console.log('═══════════════════════════════════════════════════');

console.log(`
${colors.yellow}📱 BROWSER TESTING:${colors.reset}
1. Open: ${colors.cyan}http://localhost:3000${colors.reset}
2. Login cu: catalin@vantage-lane.com
3. Test navigation în sidebar

${colors.yellow}⏱️  MĂSOARĂ TIMPII:${colors.reset}
   🟡 Development (port 3001): 2-3 secunde delay
   🟢 Production  (port 3000):  <300ms expected

${colors.yellow}🔍 CE SĂ VERIFICI:${colors.reset}
   ✅ Login speed
   ✅ Menu navigation speed  
   ✅ Page loading time
   ✅ API response time
   ✅ No compilation messages in console

${colors.yellow}📊 CONSOLE MONITORING:${colors.reset}
   - Deschide F12 → Network tab
   - Watch API response times
   - Expected: Much faster than development

${colors.yellow}🎯 SUCCESS CRITERIA:${colors.reset}
   ✅ Navigation < 300ms
   ✅ No "Compiling..." messages
   ✅ Instant page transitions
   ✅ Fast API responses

${colors.red}⏹️  TO STOP PRODUCTION SERVER:${colors.reset}
   Ctrl+C în acest terminal

${colors.blue}🔄 TO RESTART DEVELOPMENT:${colors.reset}
   pnpm dev (va porni pe port 3001)
`);

console.log(`${colors.green}🚀 Starting production server now...${colors.reset}\n`);

// Start production server
try {
  execSync('pnpm start', { stdio: 'inherit' });
} catch (error) {
  log('red', '❌ Failed to start production server');
  console.log('\nTo manually start production server:');
  console.log('pnpm start');
}
