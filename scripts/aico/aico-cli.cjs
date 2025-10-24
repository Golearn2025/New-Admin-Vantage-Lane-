#!/usr/bin/env node

/**
 * 🤖 AICO CLI - AI Controlled Creation for Vantage Lane 2.0
 * 
 * Usage:
 *   npm run aico:create component LuxuryCard
 *   npm run aico:create feature BookingFlow
 *   npm run aico:create store UserPreferences
 *   npm run aico:create page about-us
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AICOCreator {
  constructor() {
    this.projectRoot = process.cwd();
    this.rulesPath = path.join(this.projectRoot, 'config/aico-creation-rules.json');
    this.extendedRulesPath = path.join(this.projectRoot, 'config/aico-extended-rules.json');
    this.registryPath = path.join(this.projectRoot, 'src/app/AppRegistry.json');
    
    // Load configuration
    this.rules = this.loadRules();
    this.extendedRules = this.loadExtendedRules();
    this.registry = this.loadRegistry();
  }

  loadRules() {
    try {
      return JSON.parse(fs.readFileSync(this.rulesPath, 'utf8'));
    } catch (error) {
      console.error('❌ Cannot load AICO rules:', error.message);
      process.exit(1);
    }
  }

  loadExtendedRules() {
    try {
      return JSON.parse(fs.readFileSync(this.extendedRulesPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Extended rules not found, using basic rules only');
      return { rules: {} };
    }
  }

  loadRegistry() {
    try {
      return JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Registry not found, creating new one');
      return { orchestrators: [], components: [], features: [] };
    }
  }

  generatePrompt(type, name, options = {}) {
    const rules = this.rules;
    const extendedRules = this.extendedRules;
    
    const basePrompt = `
🤖 AICO CREATION REQUEST - Follow STRICT Guidelines

📋 PROJECT CONTEXT:
- Project: ${rules.project}
- Stack: ${JSON.stringify(rules.stack, null, 2)}
- Architecture: ${rules.rules.structure.architecture}

🎯 CREATION TARGET:
- Type: ${type}
- Name: ${name}
- Options: ${JSON.stringify(options, null, 2)}

🏛️ ORCHESTRATION LAYERS (MANDATORY):
${this.formatOrchestrationRules(type, name)}

📐 CORE RULES:
${this.formatRules(type)}

🔧 EXTENDED RULES:
${this.formatExtendedRules(type)}

🏗️ STRUCTURE REQUIREMENTS:
${this.getStructureRequirements(type, name)}

🧩 ORCHESTRATION INTEGRATION:
- Layer: ${this.getOrchestrationLayer(type)}
- Must integrate with AppOrchestrator
- Auto-register in AppRegistry.json
- Required hooks: ${this.getRequiredHooks(type, name).join(', ')}

⚡ PERFORMANCE:
- Bundle size: max ${rules.rules.performance.bundleSize.maxComponentSize}
- Use dynamic imports for heavy components
- Implement proper memoization

♿ ACCESSIBILITY:
- WCAG AA compliance mandatory
- Include proper ARIA labels
- Keyboard navigation support

🧪 TESTING:
- Include unit tests (Vitest)
- Coverage threshold: ${rules.rules.testing.coverage.threshold}%
- Accessibility tests with jest-axe

📖 DOCUMENTATION:
- JSDoc for public APIs
- Update relevant README files
- Include usage examples

🚨 FORBIDDEN PATTERNS:
${rules.rules.typescript.forbidden.map(item => `- ${item}`).join('\n')}

✅ REQUIRED PATTERNS:
${rules.rules.typescript.required.map(item => `- ${item}`).join('\n')}

🎨 DESIGN SYSTEM:
- Use tokens from src/design-system/tokens/
- Follow brand guidelines
- Ensure theme compatibility

🔄 WORKFLOW:
1. Create base structure following rules
2. Implement orchestration layer if needed
3. Add to AppRegistry automatically
4. Create comprehensive tests
5. Update documentation
6. Run Guardian validation

CREATE THE FOLLOWING FILES AND ENSURE 100% COMPLIANCE:
`;

    return basePrompt;
  }

  formatRules(type) {
    const rules = this.rules.rules;
    let formatted = '';
    
    // TypeScript rules
    formatted += `\n📝 TYPESCRIPT:\n`;
    formatted += `- Strict mode: ${rules.typescript.strict}\n`;
    formatted += `- No 'any': ${rules.typescript.noAny}\n`;
    formatted += `- Max complexity: ${rules.typescript.maxComplexity}\n`;
    formatted += `- Naming: ${JSON.stringify(rules.typescript.namingConvention, null, 2)}\n`;
    
    // UI rules if component
    if (type === 'component') {
      formatted += `\n🎨 UI RULES:\n`;
      formatted += `- Design tokens mandatory: ${rules.ui.designTokens.mandatory}\n`;
      formatted += `- Theme system: ${rules.ui.themeSystem.provider}\n`;
      formatted += `- Animation library: ${rules.ui.componentStructure.animationLibrary}\n`;
      formatted += `- State pattern: ${rules.ui.componentStructure.statePattern}\n`;
    }
    
    // State rules
    if (type === 'feature' || type === 'store') {
      formatted += `\n🗃️ STATE MANAGEMENT:\n`;
      formatted += `- Library: ${rules.state.management}\n`;
      formatted += `- Store pattern: ${rules.state.patterns.storePattern}\n`;
      formatted += `- Mandatory fields: ${rules.state.patterns.mandatoryFields.join(', ')}\n`;
    }
    
    return formatted;
  }

  formatOrchestrationRules(type, name) {
    const orchestrationRules = this.extendedRules.rules?.orchestration;
    if (!orchestrationRules) return 'No orchestration rules defined';
    
    const layer = this.getOrchestrationLayer(type);
    const layerConfig = orchestrationRules.layers[layer];
    
    if (!layerConfig) return `Layer ${layer} not configured`;
    
    return `
Layer ${layer}: ${layerConfig.name}
- Pattern: ${layerConfig.pattern.replace('{Component}', name).replace('{Feature}', name).replace('{Page}', name)}
- Required hooks: ${layerConfig.requiredHooks?.map(h => h.replace('{Component}', name).replace('{Feature}', name).replace('{Page}', name)).join(', ') || 'None'}
- Path: ${layerConfig.path?.replace('{feature}', name.toLowerCase()).replace('{page}', name.toLowerCase()) || 'Auto-determined'}
${layerConfig.rule ? `- Rule: ${layerConfig.rule}` : ''}
${layerConfig.enforceSingleInstance ? '- ⚠️ SINGLE INSTANCE ONLY' : ''}
${layerConfig.errorBoundary ? '- ✅ Must include ErrorBoundary' : ''}
${layerConfig.loadingState ? '- ✅ Must include loading states' : ''}
`;
  }

  formatExtendedRules(type) {
    const extRules = this.extendedRules.rules;
    if (!extRules) return 'No extended rules available';
    
    let formatted = '';
    
    // Zustand rules
    if (type === 'store' || type === 'feature') {
      formatted += `\n🗃️ ZUSTAND RULES:\n`;
      formatted += `- Pattern: ${extRules.zustand?.pattern || 'use{Name}Store.ts'}\n`;
      formatted += `- Required fields: ${extRules.zustand?.fields?.join(', ') || 'isLoading, error'}\n`;
      formatted += `- Forbidden: ${extRules.zustand?.avoid?.join(', ') || 'useState, useReducer'}\n`;
    }
    
    // Form rules
    if (type === 'component' && name.toLowerCase().includes('form')) {
      formatted += `\n📝 FORM RULES:\n`;
      formatted += `- Multi-step: ${extRules.forms?.multiStepForm}\n`;
      formatted += `- Libraries: ${extRules.forms?.libraries?.join(', ') || 'react-hook-form, zod'}\n`;
      formatted += `- Schema naming: ${extRules.forms?.validation?.schemaNaming || '{FormName}Schema'}\n`;
    }
    
    // Design system rules
    formatted += `\n🎨 DESIGN SYSTEM:\n`;
    formatted += `- Enforce tokens: ${extRules.designSystem?.enforceTokens}\n`;
    formatted += `- Allowed: ${extRules.designSystem?.allow?.join(', ') || 'design tokens only'}\n`;
    formatted += `- Forbidden: ${extRules.designSystem?.forbid?.join(', ') || 'hardcoded values'}\n`;
    
    // Modularization rules
    formatted += `\n📦 MODULARIZATION:\n`;
    formatted += `- Max file lines: ${extRules.modularization?.maxFileLines || 250}\n`;
    formatted += `- Auto split logic: ${extRules.modularization?.splitLogic?.join(', ') || 'state, ui, events'}\n`;
    
    return formatted;
  }

  getOrchestrationLayer(type) {
    switch (type) {
      case 'app':
      case 'global':
        return '1';
      case 'page':
        return '2';
      case 'feature':
        return '3';
      case 'component':
        return '4';
      case 'integration':
      case 'service':
        return '5';
      default:
        return '4'; // Default to component layer
    }
  }

  getRequiredHooks(type, name) {
    const orchestrationRules = this.extendedRules.rules?.orchestration;
    if (!orchestrationRules) return [];
    
    const layer = this.getOrchestrationLayer(type);
    const layerConfig = orchestrationRules.layers[layer];
    
    if (!layerConfig?.requiredHooks) return [];
    
    return layerConfig.requiredHooks.map(hook => 
      hook
        .replace('{Component}', name)
        .replace('{Feature}', name)
        .replace('{Page}', name)
        .replace('{Service}', name)
    );
  }

  getStructureRequirements(type, name) {
    const basePath = this.getBasePath(type, name);
    
    switch (type) {
      case 'component':
        return `
📁 CREATE STRUCTURE:
${basePath}/
├── ${name}.tsx                    ← Main component
├── ${name}Orchestrator.tsx        ← Orchestration layer (if complex)
├── use${name}Manager.ts           ← Business logic hook
├── ${name}.types.ts               ← Type definitions  
├── ${name}.test.tsx               ← Unit tests
├── ${name}.stories.tsx            ← Storybook stories
└── index.ts                       ← Barrel export
`;
      
      case 'feature':
        return `
📁 CREATE STRUCTURE:
${basePath}/
├── components/                    ← Feature-specific UI
├── stores/                        ← Zustand stores
├── api/                          ← API layer
├── hooks/                        ← Feature hooks
├── types/                        ← Type definitions
├── utils/                        ← Utilities
├── ${name}Orchestrator.tsx       ← Feature orchestrator
├── index.ts                      ← Public API
└── README.md                     ← Feature documentation
`;
      
      case 'page':
        return `
📁 CREATE STRUCTURE:
${basePath}/
├── page.tsx                      ← Next.js page
├── layout.tsx                    ← Layout (if needed)
├── loading.tsx                   ← Loading UI
├── error.tsx                     ← Error boundary
├── ${name}.config.ts             ← Page configuration
├── ${name}.meta.ts               ← Metadata
└── components/                   ← Page-specific components
`;
      
      default:
        return `📁 Standard structure for ${type}`;
    }
  }

  getBasePath(type, name) {
    // Check if extended rules define custom paths
    const orchestrationRules = this.extendedRules.rules?.orchestration;
    if (orchestrationRules) {
      const layer = this.getOrchestrationLayer(type);
      const layerConfig = orchestrationRules.layers[layer];
      
      if (layerConfig?.path) {
        return layerConfig.path
          .replace('{feature}', name.toLowerCase())
          .replace('{page}', name.toLowerCase())
          .replace('{component}', name.toLowerCase());
      }
    }
    
    // Default paths
    switch (type) {
      case 'component':
        return `src/components/ui/${name}`;
      case 'feature':
        return `src/features/${name}`;
      case 'page':
        return `src/app/${name}`;
      case 'store':
        return `src/features/${name}/stores`;
      case 'integration':
      case 'service':
        return `src/lib/integrations/${name}`;
      default:
        return `src/${type}s`;
    }
  }

  async create(type, name, options = {}) {
    console.log(`🚀 AICO Creating ${type}: ${name}`);
    
    // Pre-creation validation
    this.validateCreationRequest(type, name);
    
    // Generate AI prompt
    const prompt = this.generatePrompt(type, name, options);
    
    console.log('📋 Generated creation prompt:');
    console.log('=====================================');
    console.log(prompt);
    console.log('=====================================');
    
    // Save prompt for reference
    const promptFile = path.join(this.projectRoot, `aico-prompt-${type}-${name}.md`);
    fs.writeFileSync(promptFile, prompt);
    
    // Generate quality checklist
    const checklist = this.generateQualityChecklist(type, name);
    const checklistFile = path.join(this.projectRoot, `aico-checklist-${type}-${name}.md`);
    fs.writeFileSync(checklistFile, checklist);
    
    console.log(`✅ Prompt saved to: ${promptFile}`);
    console.log(`✅ Quality checklist saved to: ${checklistFile}`);
    console.log('');
    console.log('🤖 Next steps:');
    console.log('1. Use this prompt with Claude to create the files');
    console.log('2. Run: npm run aico:validate to check compliance');
    console.log('3. Run: npm run ai:guardian to validate quality');
    console.log('4. Run: npm run guardian:registry to update registry');
    console.log('');
    
    return { prompt, checklist };
  }

  validateCreationRequest(type, name) {
    const extRules = this.extendedRules.rules;
    
    // Check naming conventions
    if (extRules?.naming) {
      const namingRules = extRules.naming;
      
      if (type === 'store' && !name.toLowerCase().includes('store')) {
        console.warn(`⚠️ Store name '${name}' should include 'Store' suffix`);
      }
      
      if (type === 'component' && name.includes('Orchestrator') && !name.endsWith('Orchestrator')) {
        console.warn(`⚠️ Orchestrator name '${name}' should end with 'Orchestrator'`);
      }
    }
    
    // Check if already exists
    const existingItems = this.registry[`${type}s`] || [];
    const exists = existingItems.find(item => item.name === name);
    
    if (exists) {
      console.warn(`⚠️ ${type} '${name}' already exists. Consider using a different name.`);
    }
  }

  generateQualityChecklist(type, name) {
    const requiredHooks = this.getRequiredHooks(type, name);
    const layer = this.getOrchestrationLayer(type);
    
    return `# AICO Quality Checklist - ${type}: ${name}

## 🏗️ Structure Compliance
- [ ] Files created in correct path: ${this.getBasePath(type, name)}
- [ ] Naming conventions followed
- [ ] Layer ${layer} orchestration pattern implemented

## 🧩 Orchestration Requirements
${requiredHooks.map(hook => `- [ ] Hook implemented: ${hook}`).join('\n')}
- [ ] Registered in AppRegistry.json
- [ ] Integrated with AppOrchestrator
- [ ] Error boundary included (if required)

## 📐 Code Quality
- [ ] TypeScript strict mode compliance
- [ ] No 'any' types used
- [ ] File under ${this.extendedRules.rules?.modularization?.maxFileLines || 250} lines
- [ ] Design tokens used (no hardcoded values)
- [ ] Proper JSDoc comments

## 🧪 Testing
- [ ] Unit tests created
- [ ] Accessibility tests included
- [ ] Coverage threshold met (${this.rules.rules?.testing?.coverage?.threshold || 85}%)

## ♿ Accessibility
- [ ] WCAG AA compliance
- [ ] Proper ARIA labels
- [ ] Keyboard navigation support

## ⚡ Performance
- [ ] Bundle size under limits
- [ ] Proper memoization
- [ ] Dynamic imports for heavy components

## 🎨 Design System
- [ ] Design tokens used exclusively
- [ ] Theme compatibility ensured
- [ ] Brand guidelines followed

---

**Quality Score Target:** ${this.extendedRules.rules?.quality?.threshold || 90}/100

**Generated:** ${new Date().toISOString()}
`;
  }

  updateRegistry(type, name, filePaths) {
    const timestamp = new Date().toISOString();
    
    const newEntry = {
      name,
      type,
      paths: filePaths,
      createdAt: timestamp,
      status: 'active'
    };
    
    if (!this.registry[`${type}s`]) {
      this.registry[`${type}s`] = [];
    }
    
    this.registry[`${type}s`].push(newEntry);
    this.registry.lastUpdated = timestamp;
    
    // Save updated registry
    fs.writeFileSync(this.registryPath, JSON.stringify(this.registry, null, 2));
    console.log(`✅ Registry updated with new ${type}: ${name}`);
  }

  listCreated(type) {
    const items = this.registry[`${type}s`] || [];
    console.log(`📋 ${type.toUpperCase()}S CREATED:`);
    
    if (items.length === 0) {
      console.log(`  No ${type}s found`);
      return;
    }
    
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.status}) - ${item.createdAt}`);
    });
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const type = args[1];
  const name = args[2];
  
  const aico = new AICOCreator();
  
  switch (command) {
    case 'create':
      if (!type || !name) {
        console.error('Usage: npm run aico:create <type> <name>');
        console.error('Types: component, feature, page, store');
        process.exit(1);
      }
      aico.create(type, name);
      break;
      
    case 'list':
      if (!type) {
        console.error('Usage: npm run aico:list <type>');
        process.exit(1);
      }
      aico.listCreated(type);
      break;
      
    case 'validate':
      if (!type || !name) {
        console.error('Usage: npm run aico:validate <type> <name>');
        process.exit(1);
      }
      aico.validateExisting(type, name);
      break;
      
    case 'score':
      aico.calculateQualityScore();
      break;
      
    default:
      console.log('🤖 AICO CLI - Available commands:');
      console.log('  npm run aico:create component <name>');
      console.log('  npm run aico:create feature <name>');
      console.log('  npm run aico:create page <name>');
      console.log('  npm run aico:create store <name>');
      console.log('  npm run aico:list <type>');
  }
}

if (require.main === module) {
  main();
}

module.exports = { AICOCreator };
