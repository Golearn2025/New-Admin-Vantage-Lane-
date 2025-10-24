#!/usr/bin/env node
/**
 * 🧩 Feature Generator - Vantage Lane Admin
 * Creates feature with components, hooks, columns following FSD architecture
 */

const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.log('❌ Please provide feature name: npm run aico:feature users-table');
  process.exit(1);
}

// Convert kebab-case to PascalCase
const pascalCase = featureName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

const basePath = path.join(__dirname, '../../../apps/admin/features', featureName);

// Create directory structure
const dirs = [
  'components',
  'hooks',
  'columns',
  'types'
];

dirs.forEach(dir => {
  const dirPath = path.join(basePath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Component template
const componentTemplate = `/**
 * ${pascalCase} Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React from 'react';
import { Button } from '@vantage-lane/ui-core';
import styles from './${pascalCase}.module.css';

export interface ${pascalCase}Props {
  className?: string;
}

export function ${pascalCase}({ className }: ${pascalCase}Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>${pascalCase}</h1>
      {/* Add your content here */}
    </div>
  );
}
`;

// CSS Module template
const cssTemplate = `/**
 * ${pascalCase} Styles
 * 
 * 100% design tokens - zero hardcoding
 */

.container {
  padding: var(--spacing-6);
  background: var(--color-bg-primary);
  min-height: 100vh;
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}
`;

// Hook template
const hookTemplate = `/**
 * use${pascalCase} Hook
 * 
 * Business logic and data fetching
 */

'use client';

import { useState, useEffect } from 'react';

export interface Use${pascalCase}Return {
  data: any[];
  loading: boolean;
  error: string | null;
}

export function use${pascalCase}(): Use${pascalCase}Return {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add your data fetching logic here
    setLoading(false);
  }, []);

  return { data, loading, error };
}
`;

// Types template
const typesTemplate = `/**
 * ${pascalCase} Types
 */

export interface ${pascalCase}Data {
  id: string;
  // Add your fields here
}
`;

// Index template
const indexTemplate = `/**
 * ${pascalCase} Feature - Public API
 */

export { ${pascalCase} } from './components/${pascalCase}';
export type { ${pascalCase}Props } from './components/${pascalCase}';
export { use${pascalCase} } from './hooks/use${pascalCase}';
export type * from './types';
`;

// Test template
const testTemplate = `/**
 * ${pascalCase} Tests
 */

import { describe, it, expect } from 'vitest';

describe('${pascalCase}', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
  
  // TODO: Add comprehensive tests
});
`;

// Write files
fs.writeFileSync(
  path.join(basePath, 'components', `${pascalCase}.tsx`),
  componentTemplate
);

fs.writeFileSync(
  path.join(basePath, 'components', `${pascalCase}.module.css`),
  cssTemplate
);

fs.writeFileSync(
  path.join(basePath, 'hooks', `use${pascalCase}.ts`),
  hookTemplate
);

fs.writeFileSync(
  path.join(basePath, 'types', 'index.ts'),
  typesTemplate
);

fs.writeFileSync(
  path.join(basePath, 'index.ts'),
  indexTemplate
);

fs.writeFileSync(
  path.join(basePath, `${featureName}.test.ts`),
  testTemplate
);

console.log(`✅ Created ${featureName} feature in apps/admin/features/${featureName}/`);
console.log(`📝 Files created:
  - components/${pascalCase}.tsx
  - components/${pascalCase}.module.css
  - hooks/use${pascalCase}.ts
  - types/index.ts
  - index.ts
  - ${featureName}.test.ts

📋 Next steps:
  1. Implement your component logic
  2. Add API calls in hooks
  3. Create columns if needed (for tables)
  4. Add tests
  5. Export from index.ts

✨ Import in page:
  import { ${pascalCase} } from '@features/${featureName}';
`);
