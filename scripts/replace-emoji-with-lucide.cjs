#!/usr/bin/env node
/**
 * Replace Emoji Icons with Lucide React Components
 * 
 * This script replaces emoji icons with lucide-react components in TSX/TS files.
 * Only replaces emojis in JSX, not in console.log() or alert() calls.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Emoji to Lucide mapping
const EMOJI_MAP = {
  // Vehicles
  '🚗': { component: 'Car', size: 18 },
  '🚕': { component: 'Car', size: 18 },
  '🚙': { component: 'Truck', size: 18 },
  '🚐': { component: 'Bus', size: 18 },
  
  // Transport
  '✈️': { component: 'Plane', size: 18 },
  '🛩️': { component: 'Plane', size: 18 },
  
  // People
  '👨‍✈️': { component: 'UserCheck', size: 18 },
  '👤': { component: 'User', size: 18 },
  
  // Location
  '📍': { component: 'MapPin', size: 18 },
  '🗺️': { component: 'Map', size: 18 },
  
  // Time
  '⏰': { component: 'Clock', size: 18 },
  '⏱️': { component: 'Timer', size: 18 },
  '⏱': { component: 'Timer', size: 18 },
  '⏳': { component: 'Hourglass', size: 18 },
  '🕐': { component: 'Clock', size: 18 },
  
  // Actions
  '✅': { component: 'CheckCircle', size: 18 },
  '❌': { component: 'XCircle', size: 18 },
  '🔄': { component: 'RefreshCw', size: 18 },
  '➡️': { component: 'ArrowRight', size: 18 },
  
  // Status
  '🟢': { component: 'Circle', size: 12, className: 'text-green-500' },
  '🔴': { component: 'Circle', size: 12, className: 'text-red-500' },
  
  // Other
  '💰': { component: 'DollarSign', size: 18 },
  '📋': { component: 'ClipboardList', size: 18 },
  '✨': { component: 'Sparkles', size: 18 },
  '🔢': { component: 'Hash', size: 18 },
};

// Extract unique lucide components needed
function getRequiredImports(content) {
  const components = new Set();
  
  Object.entries(EMOJI_MAP).forEach(([emoji, { component }]) => {
    if (content.includes(emoji)) {
      components.add(component);
    }
  });
  
  return Array.from(components).sort();
}

// Check if file already imports lucide-react
function hasLucideImport(content) {
  return /import\s+{[^}]*}\s+from\s+['"]lucide-react['"]/.test(content);
}

// Add lucide-react import to file
function addLucideImport(content, components) {
  if (components.length === 0) return content;
  
  const importStatement = `import { ${components.join(', ')} } from 'lucide-react';\n`;
  
  // Find first import statement
  const firstImportMatch = content.match(/^import\s/m);
  if (firstImportMatch) {
    const insertPos = firstImportMatch.index;
    return content.slice(0, insertPos) + importStatement + content.slice(insertPos);
  }
  
  // No imports found, add at top after comments
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Skip initial comments
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('/**') && !line.startsWith('*') && !line.startsWith('//')) {
      insertIndex = i;
      break;
    }
  }
  
  lines.splice(insertIndex, 0, importStatement);
  return lines.join('\n');
}

// Replace emoji in JSX-like contexts only
function replaceEmojisInFile(content) {
  let modified = content;
  let hasChanges = false;
  
  Object.entries(EMOJI_MAP).forEach(([emoji, { component, size, className }]) => {
    // Pattern 1: icon: '🚗' in objects
    const pattern1 = new RegExp(`(icon:\\s*['"\`])${emoji}(['"\`])`, 'g');
    if (pattern1.test(modified)) {
      modified = modified.replace(
        pattern1,
        `$1<${component} size={${size}} strokeWidth={2}${className ? ` className="${className}"` : ''} />$2`
      );
      hasChanges = true;
    }
    
    // Pattern 2: {variable.icon} where icon is emoji string
    // This requires updating the type definition
    
    // Pattern 3: <span>🚗</span> or similar
    const pattern3 = new RegExp(`(>)${emoji}(<)`, 'g');
    if (pattern3.test(modified)) {
      modified = modified.replace(
        pattern3,
        `$1<${component} size={${size}} strokeWidth={2}${className ? ` className="${className}"` : ''} />$2`
      );
      hasChanges = true;
    }
    
    // Pattern 4: label: '⏰ Hours' - label with emoji prefix
    const pattern4 = new RegExp(`(['"\`])${emoji}\\s+([^'"\`]+)(['"\`])`, 'g');
    if (pattern4.test(modified)) {
      // Skip this for now - too complex
    }
  });
  
  return { content: modified, hasChanges };
}

// Update type definitions for icon: string to icon: React.ReactNode
function updateIconTypes(content) {
  return content.replace(
    /icon:\s*string/g,
    'icon: React.ReactNode'
  );
}

// Process a single file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if file doesn't contain any emojis
  const hasEmojis = Object.keys(EMOJI_MAP).some(emoji => content.includes(emoji));
  if (!hasEmojis) {
    return { processed: false, reason: 'no emojis' };
  }
  
  // Skip if emoji is only in comments or console.log/alert
  const codeWithoutLogs = content
    .replace(/console\.(log|error|warn|debug)\([^)]*\)/g, '')
    .replace(/alert\([^)]*\)/g, '');
  
  const hasEmojisInCode = Object.keys(EMOJI_MAP).some(emoji => codeWithoutLogs.includes(emoji));
  if (!hasEmojisInCode) {
    return { processed: false, reason: 'emojis only in logs' };
  }
  
  let modified = content;
  
  // Replace emojis
  const { content: replacedContent, hasChanges } = replaceEmojisInFile(modified);
  if (!hasChanges) {
    return { processed: false, reason: 'no changes needed' };
  }
  
  modified = replacedContent;
  
  // Update type definitions
  modified = updateIconTypes(modified);
  
  // Add lucide-react import if needed
  const requiredImports = getRequiredImports(modified);
  if (requiredImports.length > 0 && !hasLucideImport(modified)) {
    modified = addLucideImport(modified, requiredImports);
  }
  
  // Write file
  fs.writeFileSync(filePath, modified, 'utf8');
  
  return { processed: true, changes: requiredImports.length };
}

// Find all TSX/TS files
function findFiles(dir, pattern = /\.(tsx|ts)$/) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, dist, .next, etc
        if (!['node_modules', 'dist', '.next', 'build', '.git'].includes(item)) {
          traverse(fullPath);
        }
      } else if (stat.isFile() && pattern.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
function main() {
  const rootDir = path.join(__dirname, '..');
  const appsDir = path.join(rootDir, 'apps');
  
  console.log('🔍 Finding TSX/TS files with emojis...\n');
  
  const files = findFiles(appsDir);
  console.log(`Found ${files.length} TSX/TS files\n`);
  
  let processedCount = 0;
  let skippedCount = 0;
  const results = [];
  
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const result = processFile(file);
    
    if (result.processed) {
      processedCount++;
      console.log(`✅ ${relativePath} (${result.changes} icons)`);
      results.push({ file: relativePath, changes: result.changes });
    } else {
      skippedCount++;
      // console.log(`⏭️  ${relativePath} (${result.reason})`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Processed: ${processedCount} files`);
  console.log(`⏭️  Skipped: ${skippedCount} files`);
  console.log(`\n🎉 Done! Run 'npm run check:ts' to verify.`);
}

main();
