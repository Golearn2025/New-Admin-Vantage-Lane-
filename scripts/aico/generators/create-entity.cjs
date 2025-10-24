#!/usr/bin/env node
/**
 * 🔧 Entity Generator - Vantage Lane Admin
 * Creates entity with API, schemas, types following FSD architecture
 */

const fs = require('fs');
const path = require('path');

const entityName = process.argv[2];

if (!entityName) {
  console.log('❌ Please provide entity name: npm run aico:entity payment');
  process.exit(1);
}

// Convert to PascalCase
const pascalCase = entityName.charAt(0).toUpperCase() + entityName.slice(1);

const basePath = path.join(__dirname, '../../../apps/admin/entities', entityName);

// Create directory structure
const dirs = [
  'api',
  'model',
  'lib'
];

dirs.forEach(dir => {
  const dirPath = path.join(basePath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Schema template
const schemaTemplate = `/**
 * ${pascalCase} Entity - Zod Schemas
 * 
 * Type-safe validation schemas
 */

import { z } from 'zod';

export const ${pascalCase}Schema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Add your fields here
});

export type ${pascalCase} = z.infer<typeof ${pascalCase}Schema>;
`;

// Types template
const typesTemplate = `/**
 * ${pascalCase} Entity - Type Definitions
 */

export interface ${pascalCase}Data {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Add your fields here
}

export interface Create${pascalCase}Payload {
  // Add required fields for creation
}

export interface Update${pascalCase}Payload {
  // Add optional fields for update
}
`;

// API template
const apiTemplate = `/**
 * ${pascalCase} Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { ${pascalCase}Data, Create${pascalCase}Payload, Update${pascalCase}Payload } from '../model/types';

/**
 * List all ${entityName}s
 */
export async function list${pascalCase}s(): Promise<${pascalCase}Data[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('${entityName}s')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  return data || [];
}

/**
 * Get ${entityName} by ID
 */
export async function get${pascalCase}ById(id: string): Promise<${pascalCase}Data | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('${entityName}s')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create new ${entityName}
 */
export async function create${pascalCase}(
  payload: Create${pascalCase}Payload
): Promise<${pascalCase}Data> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('${entityName}s')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update ${entityName}
 */
export async function update${pascalCase}(
  id: string,
  payload: Update${pascalCase}Payload
): Promise<${pascalCase}Data> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('${entityName}s')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete ${entityName}
 */
export async function delete${pascalCase}(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('${entityName}s')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
`;

// Validation helper template
const validatorTemplate = `/**
 * ${pascalCase} Entity - Validation
 */

import { ${pascalCase}Schema } from './schema';
import type { ${pascalCase} } from './schema';

export function validate${pascalCase}(data: unknown): ${pascalCase} {
  return ${pascalCase}Schema.parse(data);
}

export function is${pascalCase}(data: unknown): data is ${pascalCase} {
  return ${pascalCase}Schema.safeParse(data).success;
}
`;

// Index template
const indexTemplate = `/**
 * ${pascalCase} Entity - Public API
 */

export * from './model/schema';
export * from './model/types';
export * from './api/${entityName}Api';
export * from './lib/validate${pascalCase}';
`;

// Test template
const testTemplate = `/**
 * ${pascalCase} Entity - Tests
 */

import { describe, it, expect } from 'vitest';
import { validate${pascalCase} } from './lib/validate${pascalCase}';

describe('${pascalCase} Entity', () => {
  it('should validate correct ${entityName} data', () => {
    const valid${pascalCase} = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(() => validate${pascalCase}(valid${pascalCase})).not.toThrow();
  });

  // TODO: Add comprehensive validation and API tests
});
`;

// Write files
fs.writeFileSync(
  path.join(basePath, 'model', 'schema.ts'),
  schemaTemplate
);

fs.writeFileSync(
  path.join(basePath, 'model', 'types.ts'),
  typesTemplate
);

fs.writeFileSync(
  path.join(basePath, 'api', `${entityName}Api.ts`),
  apiTemplate
);

fs.writeFileSync(
  path.join(basePath, 'lib', `validate${pascalCase}.ts`),
  validatorTemplate
);

fs.writeFileSync(
  path.join(basePath, 'index.ts'),
  indexTemplate
);

fs.writeFileSync(
  path.join(basePath, `${entityName}.test.ts`),
  testTemplate
);

console.log(`✅ Created ${entityName} entity in apps/admin/entities/${entityName}/`);
console.log(`📝 Files created:
  - model/schema.ts (Zod schemas)
  - model/types.ts (TypeScript types)
  - api/${entityName}Api.ts (CRUD operations)
  - lib/validate${pascalCase}.ts (Validation helpers)
  - index.ts (Public exports)
  - ${entityName}.test.ts (Tests)

📋 Next steps:
  1. Update schema with actual fields
  2. Adjust Supabase table name if different
  3. Add business logic in lib/
  4. Write comprehensive tests
  5. Use in features

✨ Import in features:
  import { list${pascalCase}s, ${pascalCase}Schema } from '@entities/${entityName}';
`);
