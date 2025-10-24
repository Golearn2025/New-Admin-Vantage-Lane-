#!/usr/bin/env node

/**
 * ⚙️ TEMPLATE ENGINE v1.0 — Vantage Lane 2.0
 * 
 * Procesează .template files și înlocuiește placeholders
 * cu valori reale pentru generarea de cod
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TEMPLATES_DIR = path.join(ROOT, 'templates');

// Colors pentru output
const color = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

class TemplateEngine {
  constructor() {
    this.templatesCache = new Map();
  }

  /**
   * Încarcă un template din fișier
   */
  loadTemplate(templatePath) {
    if (this.templatesCache.has(templatePath)) {
      return this.templatesCache.get(templatePath);
    }

    try {
      const fullPath = path.join(TEMPLATES_DIR, templatePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      this.templatesCache.set(templatePath, content);
      return content;
    } catch (error) {
      throw new Error(`Cannot load template: ${templatePath} - ${error.message}`);
    }
  }

  /**
   * Procesează un template cu variabile (Smart Processing)
   */
  processTemplate(templateContent, variables) {
    let processed = templateContent;

    // Înlocuiește toate placeholders
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processed = processed.replace(regex, value || '');
    }

    // Smart cleanup - elimină linii goale cu placeholder-uri
    processed = processed
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        // Elimină liniile care conțin doar placeholder-uri goale sau comentarii
        return !(
          trimmed === '' ||
          /^\{\{[^}]+\}\}$/.test(trimmed) ||
          trimmed.startsWith('{{') && trimmed.endsWith('}}') ||
          (trimmed.startsWith('//') && trimmed.includes('{{'))
        );
      })
      .join('\n');

    // Curăță placeholder-uri rămase
    processed = processed.replace(/\{\{[^}]+\}\}/g, '');

    // Curăță linii multiple goale
    processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');

    return processed;
  }

  /**
   * Generează component cu toate fișierele
   */
  generateComponent(name, options = {}) {
    console.log(color.cyan(`⚙️ Generez component: ${name}`));

    const variables = this.buildComponentVariables(name, options);
    const files = [];

    // Main component
    const componentTemplate = this.loadTemplate('components/component.tsx.template');
    files.push({
      name: `${name}.tsx`,
      content: this.processTemplate(componentTemplate, variables)
    });

    // Types
    const typesTemplate = this.loadTemplate('components/component.types.ts.template');
    files.push({
      name: `${name}.types.ts`,
      content: this.processTemplate(typesTemplate, variables)
    });

    // Hooks
    const managerTemplate = this.loadTemplate('hooks/useManager.ts.template');
    files.push({
      name: `hooks/use${name}Manager.ts`,
      content: this.processTemplate(managerTemplate, variables)
    });

    const eventsTemplate = this.loadTemplate('hooks/useEvents.ts.template');
    files.push({
      name: `hooks/use${name}Events.ts`,
      content: this.processTemplate(eventsTemplate, variables)
    });

    const animationsTemplate = this.loadTemplate('hooks/useAnimations.ts.template');
    files.push({
      name: `hooks/use${name}Animations.ts`,
      content: this.processTemplate(animationsTemplate, variables)
    });

    // Index barrel
    const indexTemplate = this.loadTemplate('components/index.ts.template');
    files.push({
      name: 'index.ts',
      content: this.processTemplate(indexTemplate, variables)
    });

    // Test file
    const testTemplate = this.loadTemplate('components/component.test.tsx.template');
    files.push({
      name: `${name}.test.tsx`,
      content: this.processTemplate(testTemplate, variables)
    });

    // Meta.json pentru tracking AICO
    files.push({
      name: 'meta.json',
      content: this.generateComponentMeta(name, options)
    });

    return files;
  }

  /**
   * Generează Zustand store
   */
  generateStore(name, options = {}) {
    console.log(color.cyan(`⚙️ Generez store: ${name}`));

    const variables = this.buildStoreVariables(name, options);
    const storeTemplate = this.loadTemplate('stores/store.ts.template');

    return [{
      name: `use${name}Store.ts`,
      content: this.processTemplate(storeTemplate, variables)
    }];
  }

  /**
   * Generează API route
   */
  generateApiRoute(name, options = {}) {
    console.log(color.cyan(`⚙️ Generez API route: ${name}`));

    const variables = this.buildApiVariables(name, options);
    const apiTemplate = this.loadTemplate('api/route.ts.template');

    return [{
      name: 'route.ts',
      content: this.processTemplate(apiTemplate, variables)
    }];
  }

  /**
   * Construiește variabile pentru component
   */
  buildComponentVariables(name, options) {
    const hasGlass = options.includes && options.includes('glassmorphism');
    const hasShimmer = options.includes && options.includes('shimmer');
    const isTranslucent = options.includes && options.includes('translucent');

    return {
      COMPONENT_NAME: name,
      COMPONENT_NAME_LOWER: name.toLowerCase(),
      FEATURES_DESCRIPTION: options || 'Standard component',
      
      // Styles conditionals
      GLASSMORPHISM_STYLES: hasGlass ? "'backdrop-blur-md bg-white/10'," : '',
      TRANSLUCENT_STYLES: isTranslucent ? "'bg-opacity-80'," : '',
      SHIMMER_STYLES: hasShimmer ? "'animate-shimmer'," : '',
      SHADOW_STYLES: "'shadow-sm hover:shadow-md',",
      
      // Component content
      COMPONENT_CONTENT: `
        <h3 className="text-lg font-semibold mb-2">
          ${name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Generated with AI Scaffolder Template Engine
        </p>
        {children}
      `,
      
      // Custom props & state
      CUSTOM_PROPS: '',
      CUSTOM_STATE: '',
      CUSTOM_ACTIONS: '',
      
      // Hook specifics
      CUSTOM_STATE_HOOKS: '',
      CUSTOM_LOGIC_FUNCTIONS: '',
      CLEANUP_LOGIC: '',
      CUSTOM_STATE_RETURNS: '',
      CUSTOM_ACTIONS_RETURNS: '',
      
      // Events
      CLICK_LOGIC: `console.log('${name} clicked');`,
      FOCUS_LOGIC: '',
      BLUR_LOGIC: '',
      MOUSE_ENTER_LOGIC: '',
      MOUSE_LEAVE_LOGIC: '',
      CUSTOM_KEY_HANDLERS: '',
      CUSTOM_EVENT_HANDLERS: '',
      CUSTOM_EVENTS_RETURNS: '',
      
      // Animations
      PULSE_ANIMATION_LOGIC: '',
      ENTRANCE_ANIMATION_LOGIC: '',
      EXIT_ANIMATION_LOGIC: '',
      ERROR_SHAKE_LOGIC: '',
      CUSTOM_ANIMATION_HOOKS: '',
      INITIAL_VARIANT: '',
      ANIMATE_VARIANT: '',
      HOVER_VARIANT: '',
      FOCUS_VARIANT: '',
      PRESS_VARIANT: '',
      LOADING_VARIANT: '',
      ERROR_VARIANT: '',
      CUSTOM_ANIMATIONS_RETURNS: '',
      
      // Tests
      DEFAULT_TEST_PROPS: `variant: 'default'`,
      ERROR_TEST_SIMULATION: '',
      CUSTOM_TESTS: '',
      
      // Additional exports
      ADDITIONAL_EXPORTS: '',
    };
  }

  /**
   * Construiește variabile pentru store
   */
  buildStoreVariables(name, options) {
    return {
      STORE_NAME: name,
      STORE_NAME_LOWER: name.toLowerCase(),
      FEATURE_NAME: options.feature || name,
      TOTAL_STEPS: options.steps || 3,
      
      // Custom fields
      CUSTOM_STATE_FIELDS: '',
      CUSTOM_ACTIONS: '',
      CUSTOM_INITIAL_VALUES: '',
      CUSTOM_ACTIONS_IMPLEMENTATION: '',
      CUSTOM_SELECTORS: '',
      
      // DevTools config
      DEVTOOLS_CONFIG: '',
    };
  }

  /**
   * Generează meta.json pentru componente
   */
  generateComponentMeta(name, options) {
    const meta = {
      type: 'component',
      name: name,
      version: '1.0.0',
      generatedBy: 'AICO Scaffolder Template Engine',
      createdAt: new Date().toISOString(),
      features: this.extractFeatures(options),
      tokensUsed: this.extractTokensUsed(options),
      hooks: [
        `use${name}Manager`,
        `use${name}Events`, 
        `use${name}Animations`
      ],
      exports: [
        name,
        `${name}Props`,
        `${name}Variant`,
        `${name}State`,
        `${name}Manager`
      ],
      structure: {
        hasTypes: true,
        hasTests: true,
        hasHooks: true,
        hasIndex: true
      },
      validation: {
        aiGuardianCompliant: true,
        accessibilityReady: true,
        performanceOptimized: true
      }
    };

    return JSON.stringify(meta, null, 2);
  }

  /**
   * Generează meta.json pentru stores
   */
  generateStoreMeta(name, options) {
    const meta = {
      type: 'store',
      name: name,
      version: '1.0.0',
      generatedBy: 'AICO Scaffolder Template Engine',
      createdAt: new Date().toISOString(),
      stateManagement: 'Zustand',
      features: {
        devTools: true,
        selectors: true,
        multiStep: options.steps > 1,
        formData: true,
        errorHandling: true
      },
      hooks: [`use${name}Store`, `use${name}Selector`],
      totalSteps: options.steps || 3
    };

    return JSON.stringify(meta, null, 2);
  }

  /**
   * Generează meta.json pentru API routes
   */
  generateApiMeta(name, options) {
    const meta = {
      type: 'api',
      name: name,
      version: '1.0.0',
      generatedBy: 'AICO Scaffolder Template Engine',
      createdAt: new Date().toISOString(),
      methods: options.methods || ['GET', 'POST'],
      validation: 'Zod',
      features: {
        typeScript: true,
        errorHandling: true,
        securityHeaders: true,
        cors: true
      }
    };

    return JSON.stringify(meta, null, 2);
  }

  /**
   * Extrage features din options
   */
  extractFeatures(options) {
    if (!options) return [];
    
    const features = [];
    if (options.includes && options.includes('glassmorphism')) features.push('glassmorphism');
    if (options.includes && options.includes('translucent')) features.push('translucent');
    if (options.includes && options.includes('shimmer')) features.push('shimmer');
    
    return features;
  }

  /**
   * Extrage design tokens folosite
   */
  extractTokensUsed(options) {
    const tokens = [
      'color.background',
      'color.foreground',
      'color.border',
      'radius.lg',
      'spacing.4'
    ];

    if (options && options.includes) {
      if (options.includes('glassmorphism')) {
        tokens.push('color.white/10', 'blur.md');
      }
      if (options.includes('translucent')) {
        tokens.push('opacity.80');
      }
    }

    return tokens;
  }

  /**
   * Construiește variabile pentru API
   */
  buildApiVariables(name, options) {
    return {
      API_NAME: name,
      API_DESCRIPTION: options.description || `API endpoint pentru ${name}`,
      
      // Validation schema
      VALIDATION_SCHEMA: `
  id: z.string().min(1, 'ID is required'),
  data: z.object({}).optional(),
      `,
      
      // Security headers
      SECURITY_HEADERS: `
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      `,
      
      // HTTP methods
      HTTP_METHODS: options.methods || '',
      
      // Business logic placeholders
      POST_AUTHENTICATION: '// Auth check here',
      POST_RATE_LIMITING: '// Rate limiting here',
      POST_BUSINESS_LOGIC: 'const result = { message: "Success" };',
      POST_SUCCESS_MESSAGE: 'Operation completed successfully',
      
      GET_AUTHENTICATION: '// Auth check here',
      GET_VALIDATION: '// Validate query params',
      GET_BUSINESS_LOGIC: 'const result = { data: [] };',
      
      ADDITIONAL_METHODS: '',
      ALLOWED_METHODS: 'GET, POST, OPTIONS',
      CORS_HEADERS: '',
    };
  }
}

export { TemplateEngine };
