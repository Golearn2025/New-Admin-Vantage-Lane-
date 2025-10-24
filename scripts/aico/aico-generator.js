#!/usr/bin/env node

/**
 * ⚙️ AICO GENERATOR v1.0 — Vantage Lane 2.0
 * 
 * Interfața CLI finală care folosește TemplateEngine și scrie efectiv fișierele pe disc.
 * 
 * Usage:
 *   node aico-generator.js component MenuCard --glassmorphism --translucent
 *   node aico-generator.js store BookingForm --steps 4
 *   node aico-generator.js api stripe --description "Stripe webhook handler"
 */

import fs from 'fs';
import path from 'path';
import { TemplateEngine } from './template-engine.js';
import { StructureValidator } from './structure-validator.js';
import { BarrelSync } from './barrel-sync.js';

const ROOT = process.cwd();

// Colors pentru output
const color = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

class AICOGenerator {
  constructor() {
    this.templateEngine = new TemplateEngine();
    this.validator = new StructureValidator();
    this.barrelSync = new BarrelSync();
  }

  /**
   * Generează o componentă și scrie fișierele pe disc
   */
  async generateComponent(name, options = []) {
    console.log(color.cyan(`🚀 Generez componenta: ${name}`));
    
    try {
      // Verifică dacă componenta există deja
      const outputDir = path.join(ROOT, 'src/components/ui', name);
      if (fs.existsSync(outputDir)) {
        console.log(color.yellow(`⚠️ Componenta ${name} există deja. Suprascriu...`));
      }

      // Generează conținutul cu TemplateEngine
      const files = this.templateEngine.generateComponent(name, options);
      
      // Creează directoarele necesare
      fs.mkdirSync(outputDir, { recursive: true });
      fs.mkdirSync(path.join(outputDir, 'hooks'), { recursive: true });

      // Scrie fișierele pe disc
      const createdFiles = [];
      for (const file of files) {
        const filePath = path.join(outputDir, file.name);
        fs.writeFileSync(filePath, file.content);
        createdFiles.push(filePath);
        console.log(color.green(`  ✅ Created: ${path.relative(ROOT, filePath)}`));
      }

      // Auto-sync barrel exports
      console.log(color.blue(`📦 Sincronizez barrel exports...`));
      await this.barrelSync.syncComponents();

      // Validează componenta creată
      console.log(color.blue(`🏗️ Validez structura AICO...`));
      const validationResults = await this.validateComponent(name);

      // Raportează rezultatele
      this.reportComponentResults(name, createdFiles, validationResults);

      return {
        name,
        type: 'component',
        files: createdFiles,
        validation: validationResults,
        success: validationResults.issues.length === 0
      };

    } catch (error) {
      console.error(color.red(`❌ Eroare la generarea componentei ${name}: ${error.message}`));
      throw error;
    }
  }

  /**
   * Generează un Zustand store și scrie fișierul pe disc
   */
  async generateStore(name, options = {}) {
    console.log(color.cyan(`🗃️ Generez store-ul: ${name}`));
    
    try {
      // Creează directorul stores dacă nu există
      const storesDir = path.join(ROOT, 'src/stores');
      if (!fs.existsSync(storesDir)) {
        fs.mkdirSync(storesDir, { recursive: true });
      }

      // Generează conținutul cu TemplateEngine
      const files = this.templateEngine.generateStore(name, options);
      
      // Scrie fișierele pe disc
      const createdFiles = [];
      for (const file of files) {
        const filePath = path.join(storesDir, file.name);
        fs.writeFileSync(filePath, file.content);
        createdFiles.push(filePath);
        console.log(color.green(`  ✅ Created: ${path.relative(ROOT, filePath)}`));
      }

      // Adaugă meta.json pentru store
      const metaContent = this.templateEngine.generateStoreMeta(name, options);
      const metaPath = path.join(storesDir, `${name}Store.meta.json`);
      fs.writeFileSync(metaPath, metaContent);
      createdFiles.push(metaPath);
      console.log(color.green(`  ✅ Created: ${path.relative(ROOT, metaPath)}`));

      // Auto-sync barrel exports
      console.log(color.blue(`📦 Sincronizez barrel exports...`));
      await this.barrelSync.syncStores();

      console.log(color.green(`✨ Store ${name} generat cu succes!`));

      return {
        name,
        type: 'store',
        files: createdFiles,
        success: true
      };

    } catch (error) {
      console.error(color.red(`❌ Eroare la generarea store-ului ${name}: ${error.message}`));
      throw error;
    }
  }

  /**
   * Generează un API route și scrie fișierul pe disc
   */
  async generateApiRoute(name, options = {}) {
    console.log(color.cyan(`🌐 Generez API route: ${name}`));
    
    try {
      // Creează directorul API
      const apiDir = path.join(ROOT, 'src/app/api', name.toLowerCase());
      fs.mkdirSync(apiDir, { recursive: true });

      // Generează conținutul cu TemplateEngine
      const files = this.templateEngine.generateApiRoute(name, options);
      
      // Scrie fișierele pe disc
      const createdFiles = [];
      for (const file of files) {
        const filePath = path.join(apiDir, file.name);
        fs.writeFileSync(filePath, file.content);
        createdFiles.push(filePath);
        console.log(color.green(`  ✅ Created: ${path.relative(ROOT, filePath)}`));
      }

      // Adaugă meta.json pentru API
      const metaContent = this.templateEngine.generateApiMeta(name, options);
      const metaPath = path.join(apiDir, 'meta.json');
      fs.writeFileSync(metaPath, metaContent);
      createdFiles.push(metaPath);
      console.log(color.green(`  ✅ Created: ${path.relative(ROOT, metaPath)}`));

      // Auto-sync barrel exports
      console.log(color.blue(`📦 Sincronizez barrel exports...`));
      await this.barrelSync.syncApiRoutes();

      console.log(color.green(`✨ API route ${name} generat cu succes!`));

      return {
        name,
        type: 'api',
        files: createdFiles,
        success: true
      };

    } catch (error) {
      console.error(color.red(`❌ Eroare la generarea API route-ului ${name}: ${error.message}`));
      throw error;
    }
  }

  /**
   * Validează o componentă specifică
   */
  async validateComponent(name) {
    const validator = new StructureValidator();
    
    // Validează doar componenta specificată
    await validator.validateComponent(name);
    
    return {
      issues: validator.issues.filter(issue => issue.component === name),
      warnings: validator.warnings.filter(warning => warning.component === name),
      score: validator.issues.filter(issue => issue.component === name).length === 0 ? 100 : 0
    };
  }

  /**
   * Raportează rezultatele pentru componentă
   */
  reportComponentResults(name, files, validation) {
    console.log(color.bold(`\n📊 REZULTATE GENERARE - ${name}:`));
    console.log(`📁 Fișiere create: ${files.length}`);
    console.log(`🎯 AICO Score: ${validation.score}/100`);
    
    if (validation.issues.length === 0) {
      console.log(color.green(`✅ ${name} e AICO compliant! Zero erori detectate.`));
    } else {
      console.log(color.red(`❌ Issues detectate: ${validation.issues.length}`));
      validation.issues.forEach(issue => {
        console.log(color.red(`  • ${issue.message}`));
      });
    }

    if (validation.warnings.length > 0) {
      console.log(color.yellow(`⚠️ Warnings: ${validation.warnings.length}`));
      validation.warnings.forEach(warning => {
        console.log(color.yellow(`  • ${warning.message}`));
      });
    }
  }

  /**
   * Parsează argumentele CLI
   */
  parseCliArgs(args) {
    const [type, name, ...options] = args;
    
    if (!type || !name) {
      throw new Error('Usage: node aico-generator.js <type> <name> [options...]');
    }

    const parsedOptions = {
      features: [],
      params: {}
    };

    // Parsează opțiunile
    for (const option of options) {
      if (option.startsWith('--steps=')) {
        parsedOptions.params.steps = parseInt(option.split('=')[1]);
      } else if (option.startsWith('--description=')) {
        parsedOptions.params.description = option.split('=')[1];
      } else if (option.startsWith('--')) {
        parsedOptions.features.push(option.substring(2));
      }
    }

    return { type, name, options: parsedOptions };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(color.cyan(`⚙️ AICO Generator - Available commands:`));
    console.log(`  node aico-generator.js component <Name> [--glassmorphism] [--translucent] [--shimmer]`);
    console.log(`  node aico-generator.js store <Name> [--steps=4]`);
    console.log(`  node aico-generator.js api <Name> [--description="API description"]`);
    console.log(`\n💡 Examples:`);
    console.log(`  node aico-generator.js component MenuCard --glassmorphism --translucent`);
    console.log(`  node aico-generator.js store BookingForm --steps=5`);
    console.log(`  node aico-generator.js api webhook --description="Stripe webhook handler"`);
    process.exit(0);
  }

  const generator = new AICOGenerator();
  
  try {
    const { type, name, options } = generator.parseCliArgs(args);
    
    let result;
    switch (type) {
      case 'component':
        result = await generator.generateComponent(name, options.features);
        break;
      case 'store':
        result = await generator.generateStore(name, options.params);
        break;
      case 'api':
        result = await generator.generateApiRoute(name, options.params);
        break;
      default:
        throw new Error(`Tip invalid: ${type}. Folosește: component | store | api`);
    }

    if (result.success) {
      console.log(color.green(`\n🎉 Generare completă cu succes!`));
      process.exit(0);
    } else {
      console.log(color.yellow(`\n⚠️ Generare completă cu warnings.`));
      process.exit(0);
    }

  } catch (error) {
    console.error(color.red(`\n❌ Eroare: ${error.message}`));
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AICOGenerator };
