/**
 * STRATUL 0 - ARHIVARE SAFE
 * 
 * Mută toate fișierele audit vechi în docs/_archive/YYYY-MM-DD/
 * Păstrează docs/audit/ ca single source of truth
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATE_FOLDER = new Date().toISOString().split('T')[0];
const ARCHIVE_DIR = path.join(ROOT, 'docs/_archive', DATE_FOLDER);

// Patterns pentru fișiere audit vechi de arhivat
const AUDIT_PATTERNS = [
  // Fișiere .md relevante (case insensitive)
  /audit.*\.md$/i,
  /checklist.*\.md$/i,
  /.*audit.*\.md$/i,
  /rules\.md$/i, // vechiul rules.md (nu docs/audit/RULES.md)
  /workflow\.md$/i,
];

// Foldere/fișiere de exclus (NU arhiva)
const EXCLUDE_PATTERNS = [
  /^docs\/audit\//,      // păstrăm docs/audit/ nou
  /^docs\/_archive\//,   // nu arhiva arhiva
  /^node_modules\//,
  /^\.next\//,
  /^\.git\//
];

const moved = [];
const errors = [];

function shouldArchive(filePath) {
  // Exclude paths that should not be archived
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }
  
  // Check if matches audit patterns
  const fileName = path.basename(filePath);
  return AUDIT_PATTERNS.some(pattern => pattern.test(fileName));
}

function findFilesToArchive(dir, basePath = '') {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (EXCLUDE_PATTERNS.some(pattern => pattern.test(relativePath + '/'))) {
          continue;
        }
        files.push(...findFilesToArchive(fullPath, relativePath));
      } else if (entry.isFile()) {
        if (shouldArchive(relativePath)) {
          files.push({
            fullPath,
            relativePath,
            size: fs.statSync(fullPath).size
          });
        }
      }
    }
  } catch (error) {
    errors.push(`Could not scan directory ${dir}: ${error.message}`);
  }
  
  return files;
}

function moveToArchive(file) {
  try {
    const archivePath = path.join(ARCHIVE_DIR, file.relativePath);
    fs.mkdirSync(path.dirname(archivePath), { recursive: true });
    
    if (process.env.CONFIRM_ARCHIVE === '1') {
      // MOVE mode: actually move the file
      fs.renameSync(file.fullPath, archivePath);
    } else {
      // COPY mode: copy file, leave original
      fs.copyFileSync(file.fullPath, archivePath);
    }
    
    moved.push({
      from: file.relativePath,
      to: path.join('docs/_archive', DATE_FOLDER, file.relativePath),
      size: file.size
    });
    
    console.log(`✅ Moved: ${file.relativePath}`);
  } catch (error) {
    errors.push(`Failed to move ${file.relativePath}: ${error.message}`);
    console.error(`❌ Failed: ${file.relativePath} - ${error.message}`);
  }
}

// SAFETY: COPY by default, MOVE doar cu CONFIRM_ARCHIVE=1
const CONFIRM_ARCHIVE = process.env.CONFIRM_ARCHIVE === '1';
const OPERATION = CONFIRM_ARCHIVE ? 'MOVE' : 'COPY';

console.log(`🚀 Starting audit archive process (${OPERATION} mode)...\n`);

if (!CONFIRM_ARCHIVE) {
  console.log('⚠️  SAFETY MODE: Files will be COPIED (not moved)');
  console.log('   To actually move files, run: CONFIRM_ARCHIVE=1 node scripts/audit/audit-archive.mjs\n');
}

// Create outputs directory
const outputDir = path.join(ROOT, 'docs/audit/outputs', DATE_FOLDER);
fs.mkdirSync(outputDir, { recursive: true });

// Find all files to archive
console.log('🔍 Scanning for audit files to archive...');
const filesToArchive = findFilesToArchive(ROOT);

console.log(`Found ${filesToArchive.length} files to archive\n`);

// Move files to archive
if (filesToArchive.length > 0) {
  for (const file of filesToArchive) {
    moveToArchive(file);
  }
}

// Generate archive report
const archiveReport = {
  timestamp: new Date().toISOString(),
  archiveDate: DATE_FOLDER,
  totalFiles: filesToArchive.length,
  movedFiles: moved.length,
  errors: errors.length,
  moved,
  errors
};

// Save JSON report
const reportPath = path.join(outputDir, 'archive-moves.json');
fs.writeFileSync(reportPath, JSON.stringify(archiveReport, null, 2));

// Generate markdown report
const mdReport = `# Archive Report - ${DATE_FOLDER}

**Generated:** ${new Date().toISOString()}

## Summary

- **Files Scanned:** ${filesToArchive.length} audit-related files found
- **Successfully Moved:** ${moved.length} files
- **Errors:** ${errors.length} issues

## Archived Files

${moved.length > 0 ? moved.map((file, i) => 
  `${i + 1}. \`${file.from}\` → \`${file.to}\` (${(file.size / 1024).toFixed(1)} KB)`
).join('\n') : '*No files were archived*'}

## Errors

${errors.length > 0 ? errors.map((error, i) => 
  `${i + 1}. ${error}`
).join('\n') : '*No errors occurred*'}

## Archive Location

All files moved to: \`docs/_archive/${DATE_FOLDER}/\`

## Next Steps

1. Run \`git status\` to review changes
2. Verify archived files are accessible in archive directory
3. Update any references to archived files in documentation
`;

const mdPath = path.join(outputDir, 'archive-moves.md');
fs.writeFileSync(mdPath, mdReport);

console.log(`\n📊 Archive Report:`);
console.log(`   Files moved: ${moved.length}`);
console.log(`   Errors: ${errors.length}`);
console.log(`   Report saved: ${reportPath}`);
console.log(`   Markdown: ${mdPath}`);

// Exit with appropriate code
process.exit(errors.length > 0 ? 1 : 0);
