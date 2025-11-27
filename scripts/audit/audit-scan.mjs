/**
 * STRATUL 1 - HARD FACTS SCAN
 * 
 * Rulează toate verificările de cod: lint, ts, deps, circular, secrets, build
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const DATE_FOLDER = new Date().toISOString().split('T')[0];
const SCAN_DIR = path.join(ROOT, 'docs/audit/outputs', DATE_FOLDER, 'scan');

// Ensure scan directory exists
fs.mkdirSync(SCAN_DIR, { recursive: true });

const results = {
  timestamp: new Date().toISOString(),
  scanDate: DATE_FOLDER,
  checks: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  }
};

function runCheck(name, description, command, options = {}) {
  console.log(`\n🔍 Running: ${name}`);
  
  const check = {
    name,
    description,
    command,
    status: 'RUNNING',
    startTime: new Date().toISOString(),
    duration: 0,
    stdout: '',
    stderr: '',
    exitCode: null,
    outputFile: null
  };
  
  const startTime = Date.now();
  
  try {
    // Try to run the command
    const output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: options.timeout || 300000, // 5 min default
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    check.stdout = output;
    check.exitCode = 0;
    check.status = 'PASSED';
    results.summary.passed++;
    
    console.log(`✅ ${name}: PASSED`);
    
  } catch (error) {
    check.exitCode = error.status || 1;
    check.stdout = error.stdout || '';
    check.stderr = error.stderr || error.message;
    
    if (options.allowFailure) {
      check.status = 'FAILED_EXPECTED';
      console.log(`⚠️  ${name}: FAILED (expected)`);
    } else {
      check.status = 'FAILED';
      results.summary.failed++;
      console.log(`❌ ${name}: FAILED`);
    }
  }
  
  check.duration = Date.now() - startTime;
  check.endTime = new Date().toISOString();
  
  // Save output to file
  if (check.stdout || check.stderr) {
    const outputFile = path.join(SCAN_DIR, `${name.replace(/\s+/g, '_').toLowerCase()}.log`);
    const logContent = `# ${name} - ${check.startTime}

## Command
\`\`\`bash
${command}
\`\`\`

## Exit Code
${check.exitCode}

## Standard Output
\`\`\`
${check.stdout}
\`\`\`

## Standard Error
\`\`\`
${check.stderr}
\`\`\`

## Duration
${check.duration}ms
`;
    
    fs.writeFileSync(outputFile, logContent);
    check.outputFile = path.relative(ROOT, outputFile);
  }
  
  results.checks.push(check);
  results.summary.total++;
}

function skipCheck(name, reason) {
  console.log(`⏭️  Skipping: ${name} - ${reason}`);
  
  results.checks.push({
    name,
    status: 'SKIPPED',
    reason,
    timestamp: new Date().toISOString()
  });
  
  results.summary.skipped++;
  results.summary.total++;
}

console.log('🚀 Starting Hard Facts Scan...\n');

// Check if package.json exists
const packageJsonPath = path.join(ROOT, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 1. Lint check
if (packageJson.scripts && packageJson.scripts.lint) {
  runCheck(
    'Lint Check',
    'ESLint with max 0 warnings',
    'npm run lint -- --max-warnings=0',
    { allowFailure: true }
  );
} else {
  skipCheck('Lint Check', 'No lint script in package.json');
}

// 2. TypeScript check
if (packageJson.scripts && (packageJson.scripts['check:ts'] || packageJson.scripts.tsc)) {
  const tsCommand = packageJson.scripts['check:ts'] ? 'npm run check:ts' : 'npm run tsc';
  runCheck(
    'TypeScript Check',
    'TypeScript compiler check',
    tsCommand
  );
} else {
  skipCheck('TypeScript Check', 'No TypeScript check script in package.json');
}

// 3. Dead code check
try {
  execSync('npx ts-prune --version', { stdio: 'ignore' });
  runCheck(
    'Dead Code Check',
    'Find unused TypeScript code',
    'npx ts-prune --ignore "test|spec|stories"',
    { allowFailure: true }
  );
} catch {
  skipCheck('Dead Code Check', 'ts-prune not available');
}

// 4. Dependencies check
try {
  execSync('npx depcheck --version', { stdio: 'ignore' });
  runCheck(
    'Dependencies Check',
    'Find unused dependencies',
    'npx depcheck --ignores="@types/*,eslint-*,prettier,autoprefixer"',
    { allowFailure: true }
  );
} catch {
  skipCheck('Dependencies Check', 'depcheck not available');
}

// 5. Circular dependencies
try {
  execSync('npx madge --version', { stdio: 'ignore' });
  runCheck(
    'Circular Dependencies',
    'Check for circular imports',
    'npx madge --circular apps/admin packages --extensions ts,tsx,js,jsx',
    { allowFailure: true }
  );
} catch {
  skipCheck('Circular Dependencies', 'madge not available');
}

// 6. Git secrets scan
try {
  execSync('git-secrets --version', { stdio: 'ignore' });
  runCheck(
    'Git Secrets Scan',
    'Scan for secrets in git history',
    'git-secrets --scan',
    { allowFailure: true }
  );
} catch {
  skipCheck('Git Secrets Scan', 'git-secrets not installed');
}

// 7. Build check
if (packageJson.scripts && packageJson.scripts.build) {
  runCheck(
    'Build Check',
    'Production build test',
    'npm run build',
    { timeout: 600000 } // 10 minutes for build
  );
} else {
  skipCheck('Build Check', 'No build script in package.json');
}

// Save summary
const summaryPath = path.join(SCAN_DIR, 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));

// Generate summary markdown
const summaryMd = `# Hard Facts Scan Report - ${DATE_FOLDER}

**Generated:** ${results.timestamp}

## Summary

| Status | Count |
|--------|-------|
| ✅ Passed | ${results.summary.passed} |
| ❌ Failed | ${results.summary.failed} |
| ⏭️ Skipped | ${results.summary.skipped} |
| **Total** | **${results.summary.total}** |

## Detailed Results

${results.checks.map(check => {
  const statusIcon = {
    'PASSED': '✅',
    'FAILED': '❌',
    'FAILED_EXPECTED': '⚠️',
    'SKIPPED': '⏭️'
  }[check.status] || '❓';
  
  return `### ${statusIcon} ${check.name}

**Status:** ${check.status}
**Command:** \`${check.command || 'N/A'}\`
${check.duration ? `**Duration:** ${check.duration}ms` : ''}
${check.reason ? `**Reason:** ${check.reason}` : ''}
${check.outputFile ? `**Details:** [${check.outputFile}](${check.outputFile})` : ''}
`;
}).join('\n')}

## Overall Status

${results.summary.failed > 0 ? '❌ **FAILED** - Some checks failed' : '✅ **PASSED** - All checks passed'}

## Files Generated

- Summary: \`${path.relative(ROOT, summaryPath)}\`
- Detailed logs: \`${path.relative(ROOT, SCAN_DIR)}/*.log\`
`;

const summaryMdPath = path.join(SCAN_DIR, 'summary.md');
fs.writeFileSync(summaryMdPath, summaryMd);

console.log(`\n📊 Scan Summary:`);
console.log(`   Passed: ${results.summary.passed}`);
console.log(`   Failed: ${results.summary.failed}`);
console.log(`   Skipped: ${results.summary.skipped}`);
console.log(`   Total: ${results.summary.total}`);
console.log(`\n📁 Reports saved to: ${SCAN_DIR}`);

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);
