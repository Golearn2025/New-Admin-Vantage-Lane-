#!/usr/bin/env node
/**
 * 📄 Page Generator - Vantage Lane 2.0
 * AI-optimized for Next.js 15 App Router
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const pageName = process.argv[2];
const layout = process.argv.find(arg => arg.startsWith('--layout='))?.split('=')[1] || 'marketing';

if (!pageName) {
  console.log(chalk.red('❌ Please provide page name: npm run create:page about'));
  process.exit(1);
}

const basePath = path.join(__dirname, '../../src/app', pageName);

// Create page directory
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

// Page template
const pageTemplate = `import type { Metadata } from 'next';
import { ${pascalCase(pageName)}Config } from './${pascalCase(pageName)}.config';

export const metadata: Metadata = ${pascalCase(pageName)}Config.metadata;

export default function ${pascalCase(pageName)}Page() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to the ${pageName} page.
        </p>
      </div>
    </main>
  );
}
`;

// Config template
const configTemplate = `import type { Metadata } from 'next';

export const ${pascalCase(pageName)}Config = {
  metadata: {
    title: '${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Vantage Lane',
    description: '${pageName.charAt(0).toUpperCase() + pageName.slice(1)} page for Vantage Lane platform.',
  } as Metadata,
  
  layout: '${layout}',
  
  seo: {
    keywords: ['${pageName}', 'vantage-lane', 'platform'],
    openGraph: {
      title: '${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Vantage Lane',
      description: '${pageName.charAt(0).toUpperCase() + pageName.slice(1)} page for Vantage Lane platform.',
    },
  },
};
`;

function pascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Write files
fs.writeFileSync(path.join(basePath, 'page.tsx'), pageTemplate);
fs.writeFileSync(path.join(basePath, `${pascalCase(pageName)}.config.ts`), configTemplate);

console.log(chalk.green(`✅ Created ${pageName} page in src/app/${pageName}/`));
console.log(chalk.cyan(`📝 Files created:
  - page.tsx
  - ${pascalCase(pageName)}.config.ts`));
console.log(chalk.yellow(`💡 Consider adding:
  - ${pascalCase(pageName)}.meta.ts
  - ${pascalCase(pageName)}.test.tsx
  - HeroSection.tsx
  - BaseSection.tsx`));
