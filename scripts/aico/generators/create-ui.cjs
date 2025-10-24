#!/usr/bin/env node
/**
 * 🧩 UI Component Generator - Vantage Lane 2.0
 * AI-optimized for enterprise development
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const componentName = process.argv[2];
const componentType = process.argv.find(arg => arg.startsWith('--type='))?.split('=')[1] || 'foundation';

if (!componentName) {
  console.log(chalk.red('❌ Please provide component name: npm run create:ui MyComponent'));
  process.exit(1);
}

const basePath = path.join(__dirname, '../../src/components/ui', componentName);

// Create component directory
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

// Component template
const componentTemplate = `'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ${componentName}Props } from './${componentName}.types';

export function ${componentName}({ 
  className,
  children,
  ...props 
}: ${componentName}Props) {
  return (
    <div 
      className={cn(
        // Base styles
        "relative",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

${componentName}.displayName = "${componentName}";
`;

// Types template
const typesTemplate = `export interface ${componentName}Props 
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}
`;

// Index template
const indexTemplate = `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}.types';
`;

// Write files
fs.writeFileSync(path.join(basePath, `${componentName}.tsx`), componentTemplate);
fs.writeFileSync(path.join(basePath, `${componentName}.types.ts`), typesTemplate);
fs.writeFileSync(path.join(basePath, 'index.ts'), indexTemplate);

console.log(chalk.green(`✅ Created ${componentName} component in src/components/ui/${componentName}/`));
console.log(chalk.cyan(`📝 Files created:
  - ${componentName}.tsx
  - ${componentName}.types.ts
  - index.ts`));
