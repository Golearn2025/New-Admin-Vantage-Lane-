#!/usr/bin/env node
/**
 * CI Guard: Fail if empty directories are found
 * 
 * Prevents empty feature/entity folders from being committed.
 * Run this in CI pipeline before build.
 * 
 * Usage: node scripts/ci/fail-empty-dirs.mjs
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Only check critical folders that should never be empty
const CRITICAL_ROOTS = [
  'apps/admin/features',
  'apps/admin/entities',
];

let fail = false;

function isEmpty(dir) {
  try {
    const list = readdirSync(dir).filter(n => !n.startsWith('.'));
    return list.length === 0;
  } catch (err) {
    // Directory doesn't exist or can't be read
    return false;
  }
}

function walk(dir) {
  if (!statSync(dir, { throwIfNoEntry: false })) {
    return;
  }

  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath, { throwIfNoEntry: false });
    
    if (!stat || !stat.isDirectory()) continue;

    if (isEmpty(fullPath)) {
      console.error(`❌ Empty directory found: ${fullPath}`);
      console.error(`   Empty directories are not allowed in this project.`);
      console.error(`   Either add files or remove the directory.`);
      fail = true;
    } else {
      walk(fullPath);
    }
  }
}

console.log('🔍 Checking for empty feature/entity directories...');
CRITICAL_ROOTS.forEach(root => {
  console.log(`   Scanning: ${root}`);
  if (statSync(root, { throwIfNoEntry: false })) {
    walk(root);
  } else {
    console.log(`   ⚠️  ${root} does not exist (OK)`);
  }
});

if (fail) {
  console.error('\n❌ CI Guard failed: Empty directories found');
  console.error('   Fix: Remove empty directories or add files to them');
  process.exit(1);
} else {
  console.log('✅ No empty directories found');
  process.exit(0);
}
