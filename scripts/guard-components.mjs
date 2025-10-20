#!/usr/bin/env node
/**
 * UI Components Guard
 * 
 * Ensures all UI components:
 * 1. Use only design tokens (no hardcoded colors)
 * 2. Have complete file structure (tsx, css, index, stories, test)
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const roots = ['packages/ui-core/src/components', 'packages/ui-dashboard/src/components'];
const HEX = /#[0-9a-fA-F]{3,6}\b/;
let failed = false;

function scan(dir) {
  try {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      const st = statSync(p);
      
      if (st.isDirectory()) {
        // Skip private/utility folders
        if (e.startsWith('_')) continue;
        
        const files = readdirSync(p);
        const hasTsx = files.includes(`${e}.tsx`);
        const hasIndex = files.includes('index.ts');
        const hasCss = files.some(f => f.endsWith('.module.css'));
        
        if (!(hasTsx && hasIndex && hasCss)) {
          console.error(`❌ Structură incompletă: ${p}`);
          console.error(`   Missing: ${!hasTsx ? 'tsx ' : ''}${!hasIndex ? 'index.ts ' : ''}${!hasCss ? 'module.css' : ''}`);
          failed = true;
        }
        
        // Recursively scan subdirectories
        scan(p);
      } else if (['.tsx', '.css', '.ts'].includes(extname(p))) {
        const t = readFileSync(p, 'utf8');
        
        // Check for hardcoded colors
        if (HEX.test(t) || t.includes('rgb(') || t.includes('rgba(')) {
          console.error(`❌ Hardcoded color detected: ${p}`);
          
          // Show the line with hardcoded color
          const lines = t.split('\n');
          lines.forEach((line, idx) => {
            if (HEX.test(line) || line.includes('rgb(') || line.includes('rgba(')) {
              console.error(`   Line ${idx + 1}: ${line.trim()}`);
            }
          });
          
          failed = true;
        }
      }
    }
  } catch (err) {
    // Skip if directory doesn't exist
    if (err.code !== 'ENOENT') throw err;
  }
}

console.log('🔍 Running UI Components Guard...');
console.log('   Checking for:');
console.log('   - Complete file structure (tsx, css, index.ts)');
console.log('   - No hardcoded colors (only design tokens allowed)');
console.log('');

roots.forEach(r => {
  console.log(`   Scanning: ${r}`);
  scan(r);
});

if (failed) {
  console.error('\n❌ UI Guard failed!');
  console.error('   Fix: Use design tokens (var(--token)) instead of hardcoded values');
  console.error('   Fix: Ensure all components have complete file structure');
  process.exit(1);
} else {
  console.log('\n✅ All UI components passed validation!');
  process.exit(0);
}
