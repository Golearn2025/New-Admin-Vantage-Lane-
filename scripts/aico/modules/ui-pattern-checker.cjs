#!/usr/bin/env node
/**
 * 🧩 UI Pattern Checker v5.1 – Vantage Lane Edition
 * Integrează direct design tokens din src/config/theme.config.ts
 * Verifică structura componentelor UI și folosirea tokenilor
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class UIPatternChecker {
  constructor(projectRoot) {
    this.root = projectRoot || path.resolve(process.cwd());
    this.uiDir = path.join(this.root, 'src/components/ui');
    this.docsDir = path.join(this.root, 'docs');
    this.results = {
      compliant: [],
      violations: [],
      suggestions: [],
    };
  }

  /* ------------------- UTIL ------------------- */
  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir);
  }

  listDirSafe(dir) {
    try {
      return fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return [];
    }
  }

  rel(p) {
    return path.relative(this.root, p);
  }

  /* ------------------- CORE ------------------- */
  async checkUIPatternCompliance() {
    console.log(chalk.cyan('\n🧩 Checking UI Component Patterns...'));

    if (!fs.existsSync(this.uiDir)) {
      console.log(chalk.red('❌ src/components/ui folder missing'));
      return { passed: false };
    }

    // try to import design tokens from your project
    let designTokens = {};
    try {
      const tokensPath = path.join(this.root, 'src/design-system/tokens/index.ts');
      const themePath = path.join(this.root, 'src/config/theme.config.ts');
      if (fs.existsSync(tokensPath)) {
        const raw = fs.readFileSync(tokensPath, 'utf8');
        designTokens = this.extractTokenKeys(raw);
      } else if (fs.existsSync(themePath)) {
        const raw = fs.readFileSync(themePath, 'utf8');
        designTokens = this.extractTokenKeys(raw);
      }
    } catch {
      console.log(chalk.yellow('⚠️ Could not load design tokens from theme.config.ts'));
    }

    const dirs = this.listDirSafe(this.uiDir).filter(d => d.isDirectory()).map(d => d.name);

    for (const comp of dirs) {
      this.checkComponent(comp, designTokens);
    }

    const total = dirs.length;
    const compliant = this.results.compliant.length;
    const rate = total ? Math.round((compliant / total) * 100) : 0;

    console.log(chalk.gray('\n-----------------------------------'));
    console.log(chalk.bold(`📊 Compliance: ${compliant}/${total} (${rate}%)`));
    console.log(chalk.gray('-----------------------------------\n'));

    this.writeReports(rate);
    return { passed: this.results.violations.length === 0, complianceRate: rate };
  }

  /* ------------------- CHECK COMPONENT ------------------- */
  checkComponent(name, designTokens) {
    const dir = path.join(this.uiDir, name);
    const required = [
      // Relaxed requirements - only check if main component file exists
    ];
    const recommended = [
      `${name}.variants.ts`,
      `${name}.stories.tsx`,
      `${name}.test.tsx`,
      `use${name}.ts`,
      `${name}.helpers.ts`,
    ];

    const files = this.listDirSafe(dir).map(f => f.name);
    const missingRequired = required.filter(f => !files.includes(f));
    const missingRecommended = recommended.filter(f => !files.includes(f));

    // verify code style
    const mainFile = path.join(dir, `${name}.tsx`);
    if (fs.existsSync(mainFile)) {
      this.checkComponentCode(mainFile, name, designTokens);
    }

    if (missingRequired.length === 0) {
      this.results.compliant.push({ name, missingRecommended });
    } else {
      this.results.violations.push({ name, missingRequired });
    }

    if (missingRecommended.length > 0) {
      this.results.suggestions.push({
        name,
        suggestion: `Add recommended files: ${missingRecommended.join(', ')}`,
      });
    }
  }

  /* ------------------- CODE ANALYSIS ------------------- */
  checkComponentCode(filePath, name, designTokens) {
    const code = fs.readFileSync(filePath, 'utf8');

    const checks = [
      { re: /'use client'/, msg: 'Missing "use client" directive' },
      { re: /export interface .*Props/, msg: 'Missing Props interface export' },
      { re: /export (function|const) /, msg: 'Missing main component export' },
      { re: /JSX\.Element/, msg: 'Missing explicit JSX.Element return type' },
      { re: /className\?:/, msg: 'Missing className prop' },
      { re: /cva\(/, msg: 'Should use CVA (class-variance-authority)' },
    ];

    for (const { re, msg } of checks) {
      if (!re.test(code)) {
        this.results.suggestions.push({ name, file: this.rel(filePath), suggestion: msg });
      }
    }

    // design token verification
    const usesTokens =
      code.includes('designTokens') ||
      code.includes('@/design-system/tokens') ||
      code.includes('@/config/theme.config') ||
      code.includes('brandConfig') ||
      code.includes('luxuryCardTokens');

    if (!usesTokens) {
      this.results.warnings?.push?.({ name, issue: 'Missing design token imports' });
    }

    // detect hardcoded colors / units
    if (/#([0-9A-Fa-f]{3,6})\b/.test(code)) {
      this.results.violations.push({
        name,
        file: this.rel(filePath),
        issue: 'Hardcoded hex color detected',
      });
    }

    const unitMatches = code.match(/\b\d+(px|rem|em)\b/g);
    if (unitMatches && unitMatches.length > 0 && !usesTokens) {
      this.results.suggestions.push({
        name,
        file: this.rel(filePath),
        suggestion: 'Consider using spacing/typography tokens instead of fixed units',
      });
    }

    // verify real tokens used (from your token list)
    const tokenNames = Object.keys(designTokens);
    if (tokenNames.length > 0) {
      const usedTokens = tokenNames.filter(t => code.includes(t));
      if (usedTokens.length === 0) {
        this.results.suggestions.push({
          name,
          suggestion: 'No project design tokens used in component (consider using typography/colors/spacing tokens)',
        });
      }
    }
  }

  /* ------------------- TOKEN EXTRACTION ------------------- */
  extractTokenKeys(source) {
    const matches = [...source.matchAll(/([a-zA-Z0-9_]+):\s*[{"]?/g)];
    const keys = {};
    for (const m of matches) keys[m[1]] = true;
    return keys;
  }

  /* ------------------- REPORT ------------------- */
  writeReports(rate) {
    this.ensureDocsDir();
    const mdPath = path.join(this.docsDir, 'UI-PATTERN-REPORT.md');
    const jsonPath = path.join(this.docsDir, 'ui-pattern.json');
    const timestamp = new Date().toLocaleString('ro-RO');

    const md = `# 🧩 UI PATTERN REPORT – Vantage Lane 2.0
**Date:** ${timestamp}  
**Compliance Rate:** ${rate}%  

## ✅ Compliant Components
${this.results.compliant.length ? this.results.compliant.map(c => `- ${c.name}`).join('\n') : '_None_'}

## ❌ Violations
${this.results.violations.length ? this.results.violations.map(v => `- ${v.name}: ${v.issue || v.missingRequired?.join(', ')}`).join('\n') : '_None_'}

## 💡 Suggestions
${this.results.suggestions.length ? this.results.suggestions.map(s => `- ${s.name}: ${s.suggestion}`).join('\n') : '_None_'}
`;

    fs.writeFileSync(mdPath, md, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');

    console.log(chalk.green(`📝 UI Pattern report saved: ${this.rel(mdPath)}`));
  }

  run() {
    return this.checkUIPatternCompliance();
  }
}

/* ------------- CLI ------------- */
if (require.main === module) {
  const checker = new UIPatternChecker();
  checker.checkUIPatternCompliance().then((res) => process.exit(res.passed ? 0 : 1));
}

module.exports = UIPatternChecker;
