#!/usr/bin/env node
/**
 * 📊 Code Audit v5.1 – Vantage Lane Edition
 * Securitate, structură, hardcodări, convenții pagini & rute
 * Scrie rapoarte în docs/CODE-AUDIT-REPORT.md și docs/code-audit.json
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class CodeAuditor {
  constructor(projectRoot) {
    this.root = projectRoot || path.resolve(process.cwd());
    this.srcDir = path.join(this.root, 'src');
    this.docsDir = path.join(this.root, 'docs');

    this.MAX_LINES = 250;
    this.IGNORED_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.turbo', '.git']);
    this.PAGE_REQUIRED = ['page.tsx']; // cerințe minime
    this.PAGE_RECOMMENDED = (pageNamePascal) => ([
      `${pageNamePascal}.config.ts`,
      `${pageNamePascal}.meta.ts`,
      `${pageNamePascal}.test.tsx`,
      'HeroSection.tsx',
      'BaseSection.tsx'
    ]);

    // contorizări
    this.errors = [];
    this.warnings = [];

    // cache
    this._allTsFilesCache = null;
  }

  /* ------------------------ Helpers ------------------------ */

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

  isIgnored(fullPath) {
    const parts = fullPath.split(path.sep);
    return parts.some((p) => this.IGNORED_DIRS.has(p));
  }

  toPascalCase(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getAllTsFiles() {
    if (this._allTsFilesCache) return this._allTsFilesCache;

    const files = [];
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of this.listDirSafe(dir)) {
        const full = path.join(dir, entry.name);
        if (this.isIgnored(full)) continue;

        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
          files.push(full);
        }
      }
    };
    walk(this.srcDir);
    this._allTsFilesCache = files;
    return files;
  }

  rel(p) {
    return path.relative(this.root, p);
  }

  /* ------------------------ Checks ------------------------ */

  checkFolderStructure() {
    const required = [
      'src/app',
      'src/components/ui',
      'src/components/features',
      'src/lib',
      'src/hooks',
      'src/types',
      'src/design-system/tokens',
      'src/config',
    ];
    for (const folder of required) {
      const full = path.join(this.root, folder);
      if (!fs.existsSync(full)) {
        this.errors.push(`Required folder missing: ${folder}`);
      }
    }
  }

  checkFileSizes() {
    for (const file of this.getAllTsFiles()) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n').length;
        if (lines > this.MAX_LINES) {
          this.errors.push(`File too large: ${this.rel(file)} (${lines} lines > ${this.MAX_LINES})`);
        }
      } catch {
        // ignore
      }
    }
  }

  checkForbiddenPatterns() {
    const patterns = [
      { re: /:\s*any\b/g, type: 'error', msg: 'Any type usage found' },
      { re: /console\.(log|error|warn|info)\s*\(/g, type: 'error', msg: 'Console statements found' },
      { re: /\b(TODO|FIXME|HACK)\b/gi, type: 'warning', msg: 'TODO/FIXME/HACK comments found' },
      { re: /#[0-9a-fA-F]{3,6}\b/g, type: 'warning', msg: 'Hardcoded hex colors found' },
      { re: /style\s*=\s*\{\{/g, type: 'warning', msg: 'Inline styles found (consider tokens/Tailwind)' },
    ];

    for (const file of this.getAllTsFiles()) {
      let content = '';
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch { continue; }

      for (const { re, type, msg } of patterns) {
        const matches = content.match(re);
        if (matches && matches.length) {
          const lineInfo = `${this.rel(file)} – ${matches.length} occurrence(s)`;
          if (type === 'error') this.errors.push(`${msg}: ${lineInfo}`);
          else this.warnings.push(`${msg}: ${lineInfo}`);
        }
      }
    }
  }

  checkSecurity() {
    const sec = [
      { re: /\bpassword\s*=\s*['"][^'"]*['"]/gi, msg: 'Potential hardcoded password' },
      { re: /\bapi[_-]?key\s*=\s*['"][^'"]*['"]/gi, msg: 'Potential hardcoded API key' },
      { re: /\bsecret\s*=\s*['"][^'"]*['"]/gi, msg: 'Potential hardcoded secret' },
      { re: /\btoken\s*=\s*['"][^'"]*['"]/gi, msg: 'Potential hardcoded token' },
    ];

    for (const file of this.getAllTsFiles()) {
      let content = '';
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch { continue; }

      for (const { re, msg } of sec) {
        if (re.test(content)) {
          this.errors.push(`Security issue: ${msg} in ${this.rel(file)}`);
        }
      }
    }
  }

  checkImports() {
    for (const file of this.getAllTsFiles()) {
      let content = '';
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch { continue; }

      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('import') && line.includes('../../../')) {
          this.warnings.push(
            `Deep relative import in ${this.rel(file)}:${i + 1} → use "@/..." alias instead` 
          );
        }
      });
    }
  }

  /* ------------------------ Pages & Routes ------------------------ */

  getPageDirs() {
    const appDir = path.join(this.srcDir, 'app');
    const out = [];
    for (const entry of this.listDirSafe(appDir)) {
      const full = path.join(appDir, entry.name);
      if (!entry.isDirectory() || this.isIgnored(full)) continue;
      const files = this.listDirSafe(full).map((d) => d.name);
      if (files.includes('page.tsx')) out.push({ name: entry.name, dir: full, files });
    }
    return out;
  }

  checkPagesAndRoutes() {
    const routesPath = path.join(this.srcDir, 'config', 'routes.config.ts');
    let routesContent = '';
    if (fs.existsSync(routesPath)) {
      try { routesContent = fs.readFileSync(routesPath, 'utf8'); } catch { /* ignore */ }
    }

    const pages = this.getPageDirs();

    for (const { name, dir, files } of pages) {
      // required
      for (const req of this.PAGE_REQUIRED) {
        if (!files.includes(req)) {
          this.errors.push(`Page ${name}/ missing required file: ${req}`);
        }
      }

      // recommended
      const pascal = this.toPascalCase(name);
      for (const rec of this.PAGE_RECOMMENDED(pascal)) {
        if (!files.includes(rec)) {
          this.warnings.push(`Page ${name}/ missing recommended file: ${rec}`);
        }
      }

      // design tokens usage in hero/base if există
      const checkDesignTokenFile = (fileName) => {
        const fp = path.join(dir, fileName);
        if (!fs.existsSync(fp)) return;
        try {
          const c = fs.readFileSync(fp, 'utf8');
          const hasImports =
            c.includes('designTokens') ||
            c.includes('@/design-system/tokens') ||
            c.includes('@/config/brand.config') ||
            c.includes('brandConfig') ||
            (c.includes('colors') && c.includes('from'));
          const usesTokens =
            c.includes('designTokens.') || c.includes('brandConfig.') || c.includes('colors.') || c.includes('tokens.');

          if (!hasImports) {
            this.warnings.push(`Page ${name}/${fileName} – missing design token imports`);
          }
          if (c.includes('style={{') && !usesTokens) {
            this.warnings.push(`Page ${name}/${fileName} – inline style without tokens`);
          }
          if (/#([0-9A-Fa-f]{3,6})\b/.test(c)) {
            this.warnings.push(`Page ${name}/${fileName} – hardcoded hex color detected`);
          }
        } catch { /* ignore */ }
      };

      checkDesignTokenFile('HeroSection.tsx');
      checkDesignTokenFile('BaseSection.tsx');

      // routes
      if (!routesContent) {
        this.warnings.push('routes.config.ts missing – cannot validate page registrations');
      } else {
        const slug = name.toLowerCase();
        if (!routesContent.includes(`'${slug}'`) && !routesContent.includes(`"${slug}"`)) {
          this.warnings.push(`Route missing for page: ${name} in routes.config.ts`);
        }
      }
    }
  }

  /* ------------------------ Run & Report ------------------------ */

  runAuditSync() {
    console.log(chalk.bold.cyan('\n📊 CODE AUDIT – Vantage Lane 2.0'));
    console.log(chalk.gray('================================================\n'));

    this.ensureDocsDir();
    this.checkFolderStructure();
    this.checkFileSizes();
    this.checkForbiddenPatterns();
    this.checkSecurity();
    this.checkImports();
    this.checkPagesAndRoutes();

    const errorsCount = this.errors.length;
    const warningsCount = this.warnings.length;

    if (errorsCount === 0 && warningsCount === 0) {
      console.log(chalk.green('✅ Code audit passed! No issues found.\n'));
    } else {
      if (errorsCount > 0) {
        console.log(chalk.red(`❌ ERRORS (${errorsCount}):`));
        this.errors.slice(0, 50).forEach((e) => console.log(`  - ${e}`));
        if (errorsCount > 50) console.log(`  ... and ${errorsCount - 50} more\n`);
        else console.log('');
      }
      if (warningsCount > 0) {
        console.log(chalk.yellow(`⚠️  WARNINGS (${warningsCount}):`));
        this.warnings.slice(0, 80).forEach((w) => console.log(`  - ${w}`));
        if (warningsCount > 80) console.log(`  ... and ${warningsCount - 80} more\n`);
        else console.log('');
      }
    }

    // Write reports
    this.writeReports();

    // return boolean for orchestrator
    return errorsCount === 0;
  }

  async runAudit() {
    return this.runAuditSync();
  }

  writeReports() {
    const timestamp = new Date().toLocaleString('ro-RO');
    const jsonPath = path.join(this.docsDir, 'code-audit.json');
    const mdPath = path.join(this.docsDir, 'CODE-AUDIT-REPORT.md');

    const payload = {
      timestamp,
      errors: this.errors,
      warnings: this.warnings,
      totals: { errors: this.errors.length, warnings: this.warnings.length },
      filesChecked: this.getAllTsFiles().length,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');

    const md = `# 📊 CODE AUDIT REPORT – Vantage Lane 2.0
**Date:** ${timestamp}  
**Files Checked:** ${payload.filesChecked}  

## ✅ Summary
- Errors: **${payload.totals.errors}**
- Warnings: **${payload.totals.warnings}**

${
  payload.totals.errors > 0
    ? `\n## ❌ Errors\n${this.errors.map((e) => `- ${e}`).join('\n')}\n` 
    : '\n✅ No errors found.\n'
}
${
  payload.totals.warnings > 0
    ? `\n## ⚠️ Warnings\n${this.warnings.map((w) => `- ${w}`).join('\n')}\n` 
    : '\n✅ No warnings found.\n'
}

---

### Tips
- Folosește aliasul \`@/...\` pentru importuri adânci
- Evită \`any\`, \`console.*\`, culori hex hardcodate, \`style={{}}\` 
- Asigură-te că paginile au \`*.config.ts\`, \`*.meta.ts\`, \`*.test.tsx\` 
- Înregistrează rutele în \`src/config/routes.config.ts\` 
`;

    fs.writeFileSync(mdPath, md, 'utf8');

    console.log(chalk.green(`📝 Code audit JSON: ${this.rel(jsonPath)}`));
    console.log(chalk.green(`📝 Code audit MD:   ${this.rel(mdPath)}\n`));
  }
}

/* ------------- CLI ------------- */
if (require.main === module) {
  const auditor = new CodeAuditor();
  auditor.runAudit().then((passed) => process.exit(passed ? 0 : 1));
}

module.exports = CodeAuditor;
