#!/usr/bin/env node

/**
 * 🏗️ STRUCTURE VALIDATOR v1.0 — Vantage Lane 2.0
 * 
 * Validează structura AICO pentru:
 * - Componente UI complete (hooks, types, tests, meta.json)
 * - Zustand stores cu selectors și DevTools
 * - API routes cu validare Zod
 * - Barrel exports sincronizate
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const ROOT = process.cwd();

// Colors pentru output
const color = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

class StructureValidator {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.compliant = [];
  }

  /**
   * Validează întreaga structură AICO
   */
  async validateAll() {
    console.log(color.cyan('🏗️ Validez structura AICO...'));
    
    await this.validateComponents();
    await this.validateStores(); 
    await this.validateApiRoutes();
    await this.validateBarrels();
    
    this.reportResults();
    
    return {
      issues: this.issues,
      warnings: this.warnings,
      compliant: this.compliant,
      score: this.calculateScore()
    };
  }

  /**
   * Validează componente UI
   */
  async validateComponents() {
    const componentsDir = path.join(ROOT, 'src/components/ui');
    
    if (!fs.existsSync(componentsDir)) {
      this.issues.push({
        type: 'MISSING_DIR',
        path: 'src/components/ui',
        message: 'Directorul UI components lipsește'
      });
      return;
    }

    const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const componentName of componentDirs) {
      await this.validateComponent(componentName);
    }
  }

  /**
   * Validează o componentă specifică
   */
  async validateComponent(name) {
    const componentDir = path.join(ROOT, 'src/components/ui', name);
    const requiredFiles = [
      `${name}.tsx`,
      `${name}.types.ts`,
      'index.ts',
      'meta.json',
      `${name}.test.tsx`
    ];

    const requiredHooks = [
      `hooks/use${name}Manager.ts`,
      `hooks/use${name}Events.ts`,
      `hooks/use${name}Animations.ts`
    ];

    // Verifică fișiere principale
    for (const file of requiredFiles) {
      const filePath = path.join(componentDir, file);
      
      if (!fs.existsSync(filePath)) {
        this.issues.push({
          type: 'MISSING_FILE',
          component: name,
          path: `src/components/ui/${name}/${file}`,
          message: `Fișier obligatoriu lipsă: ${file}`
        });
      } else {
        await this.validateComponentFile(name, file, filePath);
      }
    }

    // Verifică hooks
    for (const hook of requiredHooks) {
      const hookPath = path.join(componentDir, hook);
      
      if (!fs.existsSync(hookPath)) {
        this.issues.push({
          type: 'MISSING_HOOK',
          component: name,
          path: `src/components/ui/${name}/${hook}`,
          message: `Hook obligatoriu lipsă: ${hook}`
        });
      }
    }

    // Verifică meta.json structure
    await this.validateComponentMeta(name, componentDir);

    // Dacă toate checks au trecut, marchează ca fiind compliant
    if (!this.issues.some(issue => issue.component === name)) {
      this.compliant.push({
        type: 'component',
        name: name,
        path: `src/components/ui/${name}`
      });
    }
  }

  /**
   * Validează un fișier de componentă
   */
  async validateComponentFile(componentName, fileName, filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Verificări comune
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
      // Verifică 'use client' doar pentru componente principale (nu hooks, tests, sau server-side)
      const shouldHaveUseClient = fileName.endsWith('.tsx') && 
        !fileName.includes('.test.') && 
        !fileName.includes('hooks/') &&
        !fileName.includes('api/') &&
        !fileName.includes('stores/') &&
        !fileName.includes('services/') &&
        fileName === `${componentName}.tsx`;
      
      if (shouldHaveUseClient && !content.includes("'use client'")) {
        this.warnings.push({
          type: 'MISSING_CLIENT_DIRECTIVE',
          component: componentName,
          file: fileName,
          message: "Lipsește 'use client' directive"
        });
      }

      // Verifică pattern-uri interzise
      const forbiddenPatterns = [
        { pattern: /\bany\b/, message: 'Folosește tipuri any interzise' },
        { pattern: /console\.log/, message: 'Conține console.log statements' },
        { pattern: /#[0-9A-Fa-f]{3,8}/, message: 'Conține culori hardcodate (HEX)' }
      ];

      for (const { pattern, message } of forbiddenPatterns) {
        if (pattern.test(content)) {
          this.issues.push({
            type: 'FORBIDDEN_PATTERN',
            component: componentName,
            file: fileName,
            message: message
          });
        }
      }
    }

    // Verificări specifice pentru index.ts
    if (fileName === 'index.ts') {
      const expectedExports = [
        `export { ${componentName}`,
        `export type`,
        `from './${componentName}'`,
        `from './${componentName}.types'`
      ];

      for (const expectedExport of expectedExports) {
        if (!content.includes(expectedExport)) {
          this.issues.push({
            type: 'MISSING_EXPORT',
            component: componentName,
            file: fileName,
            message: `Export lipsă: ${expectedExport}`
          });
        }
      }
    }
  }

  /**
   * Validează meta.json pentru o componentă
   */
  async validateComponentMeta(name, componentDir) {
    const metaPath = path.join(componentDir, 'meta.json');
    
    if (!fs.existsSync(metaPath)) return;

    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      
      const requiredFields = ['type', 'name', 'version', 'generatedBy', 'createdAt'];
      
      for (const field of requiredFields) {
        if (!meta[field]) {
          this.issues.push({
            type: 'INVALID_META',
            component: name,
            file: 'meta.json',
            message: `Camp obligatoriu lipsă: ${field}`
          });
        }
      }

      if (meta.name !== name) {
        this.issues.push({
          type: 'META_NAME_MISMATCH',
          component: name,
          file: 'meta.json',
          message: `Nume în meta.json (${meta.name}) nu corespunde cu numele componentei (${name})`
        });
      }

    } catch (error) {
      this.issues.push({
        type: 'INVALID_JSON',
        component: name,
        file: 'meta.json',
        message: `JSON invalid: ${error.message}`
      });
    }
  }

  /**
   * Validează Zustand stores
   */
  async validateStores() {
    const storesDir = path.join(ROOT, 'src/stores');
    
    if (!fs.existsSync(storesDir)) {
      this.warnings.push({
        type: 'MISSING_DIR',
        path: 'src/stores',
        message: 'Directorul stores lipsește (optional)'
      });
      return;
    }

    const storeFiles = await glob('use*Store.ts', { cwd: storesDir });
    
    for (const storeFile of storeFiles) {
      await this.validateStore(storeFile, path.join(storesDir, storeFile));
    }
  }

  /**
   * Validează un store Zustand
   */
  async validateStore(fileName, filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const storeName = path.basename(fileName, '.ts');

    // Verifică imports Zustand
    if (!content.includes("from 'zustand'")) {
      this.issues.push({
        type: 'MISSING_ZUSTAND_IMPORT',
        store: storeName,
        message: 'Import Zustand lipsă'
      });
    }

    // Verifică DevTools
    if (!content.includes('devtools')) {
      this.warnings.push({
        type: 'MISSING_DEVTOOLS',
        store: storeName,
        message: 'DevTools integration lipsă'
      });
    }

    // Verifică mandatory fields
    const mandatoryFields = ['isLoading', 'error', 'setLoading', 'reset'];
    
    for (const field of mandatoryFields) {
      if (!content.includes(field)) {
        this.issues.push({
          type: 'MISSING_STORE_FIELD',
          store: storeName,
          field: field,
          message: `Camp obligatoriu lipsă în store: ${field}`
        });
      }
    }

    // Verifică selectors
    if (!content.includes('Selectors')) {
      this.warnings.push({
        type: 'MISSING_SELECTORS',
        store: storeName,
        message: 'Selectors pentru optimizare lipsă'
      });
    }
  }

  /**
   * Validează API routes
   */
  async validateApiRoutes() {
    const apiDir = path.join(ROOT, 'src/app/api');
    
    if (!fs.existsSync(apiDir)) {
      this.warnings.push({
        type: 'MISSING_DIR',
        path: 'src/app/api',
        message: 'Directorul API routes lipsește (optional)'
      });
      return;
    }

    const routeDirs = fs.readdirSync(apiDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const routeName of routeDirs) {
      await this.validateApiRoute(routeName);
    }
  }

  /**
   * Validează un API route
   */
  async validateApiRoute(routeName) {
    const routePath = path.join(ROOT, 'src/app/api', routeName, 'route.ts');
    
    if (!fs.existsSync(routePath)) {
      this.issues.push({
        type: 'MISSING_ROUTE_FILE',
        route: routeName,
        message: 'Fișier route.ts lipsă'
      });
      return;
    }

    const content = fs.readFileSync(routePath, 'utf8');

    // Verifică imports Next.js
    if (!content.includes('NextRequest') || !content.includes('NextResponse')) {
      this.issues.push({
        type: 'MISSING_NEXTJS_IMPORTS',
        route: routeName,
        message: 'Imports Next.js lipsă (NextRequest, NextResponse)'
      });
    }

    // Verifică Zod validation
    if (!content.includes("from 'zod'")) {
      this.warnings.push({
        type: 'MISSING_ZOD_VALIDATION',
        route: routeName,
        message: 'Validare Zod lipsă'
      });
    }

    // Verifică error handling
    if (!content.includes('try') || !content.includes('catch')) {
      this.issues.push({
        type: 'MISSING_ERROR_HANDLING',
        route: routeName,
        message: 'Error handling (try/catch) lipsă'
      });
    }
  }

  /**
   * Validează barrel exports
   */
  async validateBarrels() {
    const barrels = [
      { path: 'src/components/ui/index.ts', name: 'Components' },
      { path: 'src/stores/index.ts', name: 'Stores' },
      { path: 'src/app/api/index.ts', name: 'API' }
    ];

    for (const barrel of barrels) {
      const fullPath = path.join(ROOT, barrel.path);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (!content.includes('Auto-generated Barrel Export') && !content.includes('Auto-generated Documentation')) {
          this.warnings.push({
            type: 'MANUAL_BARREL',
            barrel: barrel.name,
            message: 'Barrel export manual (nu auto-generat)'
          });
        }
      } else {
        this.warnings.push({
          type: 'MISSING_BARREL',
          barrel: barrel.name,
          message: `Barrel export lipsă: ${barrel.path}`
        });
      }
    }
  }

  /**
   * Calculează scorul de compliance
   */
  calculateScore() {
    const totalChecks = this.issues.length + this.warnings.length + this.compliant.length;
    
    if (totalChecks === 0) return 100;

    const score = Math.max(0, 100 - (this.issues.length * 10 + this.warnings.length * 2));
    return Math.round(score);
  }

  /**
   * Raportează rezultatele
   */
  reportResults() {
    const score = this.calculateScore();
    
    console.log(color.cyan(`\n📊 REZULTATE VALIDARE STRUCTURĂ:`));
    console.log(`🎯 Scor AICO Compliance: ${score}/100`);
    console.log(`✅ Compliant: ${this.compliant.length}`);
    console.log(`⚠️ Warnings: ${this.warnings.length}`);
    console.log(`❌ Issues: ${this.issues.length}`);

    if (this.issues.length > 0) {
      console.log(color.red(`\n❌ ISSUES CRITICE:`));
      this.issues.slice(0, 10).forEach(issue => {
        console.log(`  • ${issue.component || issue.store || issue.route || 'Global'}: ${issue.message}`);
      });
      if (this.issues.length > 10) {
        console.log(`  ... +${this.issues.length - 10} issues`);
      }
    }

    if (this.warnings.length > 0) {
      console.log(color.yellow(`\n⚠️ WARNINGS:`));
      this.warnings.slice(0, 5).forEach(warning => {
        console.log(`  • ${warning.component || warning.store || warning.route || 'Global'}: ${warning.message}`);
      });
      if (this.warnings.length > 5) {
        console.log(`  ... +${this.warnings.length - 5} warnings`);
      }
    }

    if (this.compliant.length > 0) {
      console.log(color.green(`\n✅ COMPLIANT ENTITIES:`));
      this.compliant.forEach(entity => {
        console.log(`  • ${entity.type}: ${entity.name}`);
      });
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'validate';
  
  const validator = new StructureValidator();
  
  switch (command) {
    case 'validate':
      const results = await validator.validateAll();
      process.exit(results.issues.length > 0 ? 1 : 0);
      break;
      
    default:
      console.log('🏗️ AICO Structure Validator - Available commands:');
      console.log('  npm run structure:validate - Validate AICO compliance');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { StructureValidator };
