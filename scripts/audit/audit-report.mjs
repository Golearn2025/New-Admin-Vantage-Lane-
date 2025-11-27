/**
 * RAPORT GENERATOR - Agregă toate output-urile într-un REPORT.md master
 * 
 * Colectează rezultate din: archive, scan, rls, screenshots, routes, shared
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const DATE_FOLDER = new Date().toISOString().split('T')[0];
const OUTPUTS_DIR = path.join(ROOT, 'docs/audit/outputs', DATE_FOLDER);

// Ensure directories exist
fs.mkdirSync(path.join(ROOT, 'docs/audit'), { recursive: true });

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
  }
  return null;
}

function getGitInfo() {
  try {
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
    return { hash, branch, dirty };
  } catch {
    return { hash: 'unknown', branch: 'unknown', dirty: false };
  }
}

function generateReport() {
  console.log('🚀 Generating unified audit report...\n');

  const git = getGitInfo();
  const timestamp = new Date().toISOString();

  // Read all available data
  const archiveData = readJsonSafe(path.join(OUTPUTS_DIR, 'archive-moves.json'));
  const scanData = readJsonSafe(path.join(OUTPUTS_DIR, 'scan/summary.json'));
  const rlsData = readJsonSafe(path.join(OUTPUTS_DIR, 'security/rls.json'));
  const routesData = readJsonSafe(path.join(ROOT, 'docs/audit/routes/routes.json'));
  const sharedData = readJsonSafe(path.join(ROOT, 'docs/audit/shared/shared.json'));

  // Collect UI issues from Playwright
  const uiIssuesFiles = [];
  const uiIssuesDir = path.join(OUTPUTS_DIR);
  if (fs.existsSync(uiIssuesDir)) {
    const files = fs.readdirSync(uiIssuesDir).filter(f => f.startsWith('ui-issues-') && f.endsWith('.json'));
    for (const file of files) {
      const issueData = readJsonSafe(path.join(uiIssuesDir, file));
      if (issueData) {
        uiIssuesFiles.push(issueData);
      }
    }
  }

  const totalUIIssues = uiIssuesFiles.reduce((sum, file) => sum + file.issuesFound, 0);

  // Calculate overall status
  const strats = [
    { name: 'Archive', status: archiveData ? (archiveData.errors.length === 0 ? 'PASSED' : 'FAILED') : 'SKIPPED' },
    { name: 'Code Scan', status: scanData ? (scanData.summary.failed === 0 ? 'PASSED' : 'FAILED') : 'SKIPPED' },
    { name: 'UI Smoke', status: totalUIIssues === 0 ? 'PASSED' : 'FAILED' },
    { name: 'Security RLS', status: rlsData ? (rlsData.summary.failed === 0 ? 'PASSED' : 'FAILED') : 'SKIPPED' }
  ];

  const overallStatus = strats.every(s => s.status === 'PASSED') ? 'PASSED' : 
                       strats.some(s => s.status === 'FAILED') ? 'FAILED' : 'INCOMPLETE';

  // Generate report markdown
  const report = `# Enterprise Audit Report

**Generated:** ${timestamp}  
**Date Folder:** ${DATE_FOLDER}  
**Git:** ${git.branch}@${git.hash}${git.dirty ? ' (dirty)' : ''}  
**Overall Status:** ${overallStatus === 'PASSED' ? '✅ PASSED' : 
                                  overallStatus === 'FAILED' ? '❌ FAILED' : 
                                  '⚠️ INCOMPLETE'}

## Summary

| Layer | Status | Details |
|-------|--------|---------|
| **0. Archive** | ${strats[0].status === 'PASSED' ? '✅' : strats[0].status === 'FAILED' ? '❌' : '⏭️'} ${strats[0].status} | ${archiveData ? `${archiveData.movedFiles} files moved` : 'No data'} |
| **1. Code Scan** | ${strats[1].status === 'PASSED' ? '✅' : strats[1].status === 'FAILED' ? '❌' : '⏭️'} ${strats[1].status} | ${scanData ? `${scanData.summary.passed}/${scanData.summary.total} checks` : 'No data'} |
| **2. UI Smoke** | ${strats[2].status === 'PASSED' ? '✅' : strats[2].status === 'FAILED' ? '❌' : '⏭️'} ${strats[2].status} | ${totalUIIssues} issues found |
| **3. Security RLS** | ${strats[3].status === 'PASSED' ? '✅' : strats[3].status === 'FAILED' ? '❌' : '⏭️'} ${strats[3].status} | ${rlsData ? `${rlsData.summary.passed}/${rlsData.summary.total} tests` : 'No data'} |

---

## Layer 0: Archive & Cleanup

${archiveData ? `
**Files Moved:** ${archiveData.movedFiles}  
**Errors:** ${archiveData.errors.length}  
**Archive Location:** \`docs/_archive/${archiveData.archiveDate}/\`

${archiveData.movedFiles > 0 ? `### Archived Files (Top 10)

${archiveData.moved.slice(0, 10).map((file, i) => 
  `${i + 1}. \`${file.from}\` → \`${file.to}\``
).join('\n')}

${archiveData.movedFiles > 10 ? `\n_...and ${archiveData.movedFiles - 10} more files_` : ''}` : ''}

📁 **Details:** [archive-moves.md](outputs/${DATE_FOLDER}/archive-moves.md)
` : '⏭️ **Skipped** - No archive data available'}

---

## Layer 1: Code Quality Scan

${scanData ? `
**Status:** ${scanData.summary.failed === 0 ? '✅ All Checks Passed' : `❌ ${scanData.summary.failed} Checks Failed`}

### Results Summary

| Check | Status | Duration |
|-------|--------|----------|
${scanData.checks.map(check => {
  const statusIcon = {
    'PASSED': '✅',
    'FAILED': '❌',
    'FAILED_EXPECTED': '⚠️',
    'SKIPPED': '⏭️'
  }[check.status] || '❓';
  
  return `| ${check.name} | ${statusIcon} ${check.status} | ${check.duration || 'N/A'}ms |`;
}).join('\n')}

📁 **Details:** [scan/summary.md](outputs/${DATE_FOLDER}/scan/summary.md)
` : '⏭️ **Skipped** - No scan data available'}

---

## Layer 2: UI Smoke Testing

**Total Issues Found:** ${totalUIIssues}  
**Test Files:** ${uiIssuesFiles.length}

${totalUIIssues > 0 ? `
### Issue Breakdown

${uiIssuesFiles.map(file => `
#### ${file.role}/${file.viewport}
- **Routes Tested:** ${file.totalRoutes}
- **Issues Found:** ${file.issuesFound}

${file.issues.slice(0, 5).map(issue => 
  `- **${issue.type}** in \`${issue.route}\`: ${issue.details}`
).join('\n')}

${file.issuesFound > 5 ? `_...and ${file.issuesFound - 5} more issues_` : ''}
`).join('\n')}
` : '✅ **All Routes Working** - No issues detected'}

📁 **Screenshots:** \`outputs/${DATE_FOLDER}/\` (*.png files)  
📁 **Issue Details:** \`outputs/${DATE_FOLDER}/ui-issues-*.json\`

---

## Layer 3: Security & RLS Testing

${rlsData ? `
**Status:** ${rlsData.summary.failed === 0 ? '✅ Security Tests Passed' : `❌ ${rlsData.summary.failed} Security Issues`}  
**Available Users:** ${rlsData.availableUsers.join(', ')}

### Security Test Results

| Test | Status | Details |
|------|--------|---------|
${rlsData.tests.map(test => {
  const statusIcon = {
    'PASSED': '✅',
    'FAILED': '❌',
    'SKIPPED': '⏭️'
  }[test.status] || '❓';
  
  return `| ${test.name} | ${statusIcon} ${test.status} | ${test.error || test.reason || 'OK'} |`;
}).join('\n')}

📁 **Details:** [security/rls.md](outputs/${DATE_FOLDER}/security/rls.md)
` : '⏭️ **Skipped** - No RLS data available (check credentials)'}

---

## Additional Data

### Route Inventory
${routesData ? `
- **Admin Routes:** ${routesData.admin?.length || 0}
- **Operator Routes:** ${routesData.operator?.length || 0}  
- **Driver Routes:** ${routesData.driver?.length || 0}

📁 **Details:** [routes/routes.json](routes/routes.json)
` : 'No route data available'}

### Shared Component Analysis
${sharedData ? `
- **Admin Components:** ${sharedData.admin?.imports || 0} imports
- **Operator Components:** ${sharedData.operator?.imports || 0} imports
- **Driver Components:** ${sharedData.driver?.imports || 0} imports
- **Shared Between All:** ${sharedData.shared?.all || 0} components

📁 **Details:** [shared/SHARED_FILES.md](shared/SHARED_FILES.md)
` : 'No shared analysis data available'}

---

## Next Steps

${overallStatus === 'FAILED' ? `
### 🔴 Critical Issues to Fix

${strats.filter(s => s.status === 'FAILED').map(s => `- **${s.name}**: Review detailed logs and fix failing checks`).join('\n')}
${totalUIIssues > 0 ? `- **UI Issues**: Fix ${totalUIIssues} route/shell problems` : ''}
` : ''}

${strats.some(s => s.status === 'SKIPPED') ? `
### ⚠️ Incomplete Coverage

${strats.filter(s => s.status === 'SKIPPED').map(s => `- **${s.name}**: Configure and run missing audit layer`).join('\n')}
` : ''}

### 📋 Regular Maintenance

1. Run audit pipeline weekly: \`node scripts/audit/audit-all.mjs\`
2. Review security tests when changing permissions
3. Update route inventory after adding new pages
4. Monitor shared component growth

---

## Files Generated

- **This Report:** \`docs/audit/REPORT.md\`
- **Dated Outputs:** \`docs/audit/outputs/${DATE_FOLDER}/\`
- **Route Inventory:** \`docs/audit/routes/\`
- **Shared Analysis:** \`docs/audit/shared/\`
- **Archived Docs:** \`docs/_archive/${DATE_FOLDER}/\`

**Pipeline completed at:** ${timestamp}
`;

  // Write the report
  const reportPath = path.join(ROOT, 'docs/audit/REPORT.md');
  fs.writeFileSync(reportPath, report);

  console.log(`📊 Report Summary:`);
  console.log(`   Overall Status: ${overallStatus}`);
  console.log(`   Archive: ${strats[0].status} (${archiveData?.movedFiles || 0} files)`);
  console.log(`   Code Scan: ${strats[1].status} (${scanData?.summary.failed || '?'} failures)`);
  console.log(`   UI Issues: ${totalUIIssues} found`);
  console.log(`   Security: ${strats[3].status} (${rlsData?.summary.failed || '?'} failures)`);
  console.log(`\n📁 Master Report: ${reportPath}`);

  return { overallStatus, strats, totalIssues: totalUIIssues };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const result = generateReport();
    process.exit(result.overallStatus === 'FAILED' ? 1 : 0);
  } catch (error) {
    console.error('❌ Report generation failed:', error.message);
    process.exit(1);
  }
}

export { generateReport };
