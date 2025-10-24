#!/usr/bin/env node
/**
 * 📄 Page Generator - Vantage Lane Admin
 * Creates Next.js page with routing only (zero logic)
 */

const fs = require('fs');
const path = require('path');

const pagePath = process.argv[2];

if (!pagePath) {
  console.log('❌ Please provide page path: npm run aico:page users/all');
  process.exit(1);
}

// Parse path
const pathParts = pagePath.split('/');

// Create directory structure
const basePath = path.join(__dirname, '../../../app/(admin)', pagePath);

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

// Convert path to feature name
const featureName = pathParts[pathParts.length - 1];
const pascalName = featureName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

const parentFeature = pathParts.length > 1 ? pathParts[0] : featureName;

// Page template - ROUTING ONLY!
const pageTemplate = `/**
 * ${pascalName} Page
 * 
 * Routing only - zero logic
 * Import feature component from @features/
 */

import { ${pascalName}Table } from '@features/${parentFeature}-table';

export default function ${pascalName}Page() {
  return <${pascalName}Table />;
}
`;

// Write page.tsx
fs.writeFileSync(
  path.join(basePath, 'page.tsx'),
  pageTemplate
);

console.log(`✅ Created page at app/(admin)/${pagePath}/page.tsx`);
console.log(`📝 Routing only - zero logic!

📋 Next steps:
  1. Create feature component: npm run aico:feature ${parentFeature}-table
  2. Implement ${pascalName}Table in features
  3. Test at http://localhost:3000/${pagePath}

✨ This page only imports and renders - all logic in features!
`);
