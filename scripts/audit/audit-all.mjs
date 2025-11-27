/**
 * AUDIT RUNNER UNIC - Pipeline complet 0-1-2-3
 * 
 * Rulează în ordine: archive → routes → shared → scan → rls → playwright → report
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATE_FOLDER = new Date().toISOString().split('T')[0];

const pipeline = [
  {
    name: '0. Archive Legacy Files',
    script: 'scripts/audit/audit-archive.mjs',
    required: false,
    description: 'Move old audit files to archive'
  },
  {
    name: '1. Route Inventory',
    script: 'scripts/audit-routes.mjs',
    required: false,
    description: 'Generate route inventory per role'
  },
  {
    name: '2. Shared Analysis',
    script: 'scripts/audit-shared.mjs',
    required: false,
    description: 'Analyze shared components between roles'
  },
  {
    name: '3. Code Quality Scan',
    script: 'scripts/audit/audit-scan.mjs',
    required: false,
    description: 'Lint, TypeScript, dependencies, build checks'
  },
  {
    name: '4. Security RLS Tests',
    script: 'scripts/audit/audit-rls.mjs',
    required: false,
    description: 'Row-level security and cross-tenant tests'
  },
  {
    name: '5. UI Smoke Tests',
    command: 'npx playwright test tests/smoke/shell-audit.spec.ts --reporter=line',
    required: false,
    description: 'Shell responsiveness and route navigation'
  },
  {
    name: '6. Generate Report',
    script: 'scripts/audit/audit-report.mjs',
    required: true,
    description: 'Aggregate all results into unified report'
  }
];

const results = {
  timestamp: new Date().toISOString(),
  pipeline: [],
  summary: {
    total: pipeline.length,
    passed: 0,
    failed: 0,
    skipped: 0
  },
  overallStatus: 'RUNNING'
};

function runStep(step) {
  console.log(`\n🚀 ${step.name}`);
  console.log(`   Description: ${step.description}`);
  
  const stepResult = {
    name: step.name,
    status: 'RUNNING',
    startTime: new Date().toISOString(),
    duration: 0,
    output: '',
    error: null
  };
  
  const startTime = Date.now();
  
  try {
    let command;
    if (step.script) {
      // Check if script exists
      const scriptPath = path.join(ROOT, step.script);
      if (!fs.existsSync(scriptPath)) {
        throw new Error(`Script not found: ${step.script}`);
      }
      command = `node ${step.script}`;
    } else if (step.command) {
      command = step.command;
    } else {
      throw new Error('No script or command specified');
    }
    
    console.log(`   Running: ${command}`);
    
    const output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 600000 // 10 minutes max
    });
    
    stepResult.output = output;
    stepResult.status = 'PASSED';
    results.summary.passed++;
    
    console.log(`✅ ${step.name}: PASSED`);
    
  } catch (error) {
    stepResult.error = error.message;
    stepResult.output = error.stdout || '';
    
    if (step.required) {
      stepResult.status = 'FAILED';
      results.summary.failed++;
      console.log(`❌ ${step.name}: FAILED (required) - ${error.message}`);
    } else {
      stepResult.status = 'SKIPPED';
      results.summary.skipped++;
      console.log(`⚠️  ${step.name}: SKIPPED - ${error.message}`);
    }
  }
  
  stepResult.duration = Date.now() - startTime;
  stepResult.endTime = new Date().toISOString();
  
  results.pipeline.push(stepResult);
}

console.log('🚀 Starting Enterprise Audit Pipeline...\n');
console.log(`📅 Date: ${DATE_FOLDER}`);
console.log(`📂 Outputs will be saved to: docs/audit/outputs/${DATE_FOLDER}/\n`);

// Create output directory
const outputDir = path.join(ROOT, 'docs/audit/outputs', DATE_FOLDER);
fs.mkdirSync(outputDir, { recursive: true });

// Validate environment for Playwright step
console.log('🔍 Pre-flight checks...');

const requiredEnvVars = ['ADMIN_TEST_PASSWORD', 'OPERATOR_TEST_PASSWORD', 'DRIVER_TEST_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('   Some security and UI tests may be skipped');
}

// Check if Playwright is available
try {
  execSync('npx playwright --version', { stdio: 'ignore' });
  console.log('✅ Playwright available');
} catch {
  console.warn('⚠️  Playwright not available - UI tests will be skipped');
}

// Run pipeline steps
for (const step of pipeline) {
  runStep(step);
  
  // Stop on critical failures
  if (step.required && results.pipeline[results.pipeline.length - 1].status === 'FAILED') {
    console.error(`\n💥 Critical step failed: ${step.name}`);
    console.error('   Pipeline stopped to prevent cascading failures');
    break;
  }
}

// Calculate overall status
if (results.summary.failed > 0) {
  results.overallStatus = 'FAILED';
} else if (results.summary.skipped > 0) {
  results.overallStatus = 'INCOMPLETE';
} else {
  results.overallStatus = 'PASSED';
}

// Save pipeline results
const pipelineResultPath = path.join(outputDir, 'pipeline.json');
fs.writeFileSync(pipelineResultPath, JSON.stringify(results, null, 2));

// Generate pipeline summary
const summaryMd = `# Pipeline Execution Summary - ${DATE_FOLDER}

**Started:** ${results.timestamp}  
**Status:** ${results.overallStatus === 'PASSED' ? '✅ PASSED' : 
                results.overallStatus === 'FAILED' ? '❌ FAILED' : 
                '⚠️ INCOMPLETE'}

## Execution Results

| Step | Status | Duration | Notes |
|------|--------|----------|-------|
${results.pipeline.map((step, i) => {
  const statusIcon = {
    'PASSED': '✅',
    'FAILED': '❌',
    'SKIPPED': '⏭️'
  }[step.status] || '❓';
  
  return `| ${i + 1}. ${step.name} | ${statusIcon} ${step.status} | ${step.duration}ms | ${step.error || 'OK'} |`;
}).join('\n')}

## Summary

- **Total Steps:** ${results.summary.total}
- **Passed:** ${results.summary.passed}
- **Failed:** ${results.summary.failed}
- **Skipped:** ${results.summary.skipped}

## Next Steps

${results.overallStatus === 'FAILED' ? `
### 🔴 Fix Critical Issues
${results.pipeline.filter(s => s.status === 'FAILED').map(s => `- **${s.name}**: ${s.error}`).join('\n')}
` : ''}

${results.overallStatus === 'INCOMPLETE' ? `
### ⚠️ Complete Missing Steps
${results.pipeline.filter(s => s.status === 'SKIPPED').map(s => `- **${s.name}**: ${s.error}`).join('\n')}
` : ''}

### 📋 View Results
- **Master Report:** \`docs/audit/REPORT.md\`
- **Pipeline Details:** \`${path.relative(ROOT, pipelineResultPath)}\`
- **All Outputs:** \`docs/audit/outputs/${DATE_FOLDER}/\`

**Run again:** \`node scripts/audit/audit-all.mjs\`
`;

const summaryMdPath = path.join(outputDir, 'pipeline-summary.md');
fs.writeFileSync(summaryMdPath, summaryMd);

// Final summary
console.log(`\n📊 Pipeline Complete!`);
console.log(`   Status: ${results.overallStatus}`);
console.log(`   Passed: ${results.summary.passed}/${results.summary.total}`);
console.log(`   Failed: ${results.summary.failed}/${results.summary.total}`);
console.log(`   Skipped: ${results.summary.skipped}/${results.summary.total}`);
console.log(`\n📁 Results:`);
console.log(`   Master Report: docs/audit/REPORT.md`);
console.log(`   Pipeline Log: ${pipelineResultPath}`);
console.log(`   All Outputs: docs/audit/outputs/${DATE_FOLDER}/`);

if (results.overallStatus === 'FAILED') {
  console.log(`\n💡 To debug failures, check individual step logs in outputs folder`);
  process.exit(1);
} else if (results.overallStatus === 'INCOMPLETE') {
  console.log(`\n💡 Some steps were skipped - check environment and dependencies`);
  process.exit(0);
} else {
  console.log(`\n🎉 All audit checks passed!`);
  process.exit(0);
}
