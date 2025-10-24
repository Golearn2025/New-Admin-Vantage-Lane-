#!/usr/bin/env node
/**
 * 🧠  TYPESCRIPT CHECKER v5.1 – Vantage Lane Edition
 *  Rulează compilatorul TS în mode strict, calculează scorul de calitate
 *  și salvează rapoarte în docs/TS-REPORT.*
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class TypeScriptChecker {
  constructor(projectRoot) {
    this.root = projectRoot || process.cwd();
    this.docsDir = path.join(this.root, 'docs');
    this.results = {
      errors: [],
      warnings: [],
      score: 100,
      strictMode: false,
      passed: true,
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir, { recursive: true });
  }

  runTSC() {
    console.log(chalk.cyan('\n🧠 Running TypeScript Audit (tsc --noEmit --pretty false)\n'));
    try {
      const output = execSync('npx tsc --noEmit --pretty false', {
        cwd: this.root,
        encoding: 'utf8',
        stdio: 'pipe',
      });
      if (output.trim()) this.parseOutput(output);
    } catch (err) {
      const out = err.stdout?.toString?.() || err.stderr?.toString?.() || '';
      this.parseOutput(out);
    }
  }

  parseOutput(output) {
    const lines = output.split('\n').filter(l => l.trim());
    for (const line of lines) {
      if (line.includes('error TS')) this.results.errors.push(line.trim());
      else if (line.includes('warning') || line.includes('deprecated')) this.results.warnings.push(line.trim());
    }
    const total = this.results.errors.length + this.results.warnings.length;
    this.results.score = Math.max(0, 100 - total * 0.5);
    this.results.passed = this.results.errors.length === 0;
  }

  checkStrictness() {
    const tsconfigPath = path.join(this.root, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) return;
    const json = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    const compilerOptions = json.compilerOptions || {};
    const strictFlags = [
      'strict',
      'noImplicitAny',
      'strictNullChecks',
      'strictFunctionTypes',
      'strictBindCallApply',
      'alwaysStrict',
    ];
    const enabled = strictFlags.filter(f => compilerOptions[f]);
    this.results.strictMode = enabled.length >= 4;
    if (!this.results.strictMode) {
      this.results.warnings.push('TypeScript strict mode not fully enabled');
      this.results.score -= 5;
    }
  }

  writeReports() {
    this.ensureDocsDir();
    const jsonPath = path.join(this.docsDir, 'ts-report.json');
    const mdPath = path.join(this.docsDir, 'TS-REPORT.md');
    const ts = new Date().toLocaleString('ro-RO');

    const md = `# 🧠 TYPESCRIPT REPORT – Vantage Lane 2.0
**Generated:** ${ts}  
**Strict Mode:** ${this.results.strictMode ? '✅ Enabled' : '⚠️ Partial'}  
**Score:** ${this.results.score.toFixed(1)} / 100  
**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}

---

## ❌ Errors (${this.results.errors.length})
${this.results.errors.length ? this.results.errors.slice(0, 30).map(e => `- ${e}`).join('\n') : '_None_'}

## ⚠️ Warnings (${this.results.warnings.length})
${this.results.warnings.length ? this.results.warnings.slice(0, 30).map(w => `- ${w}`).join('\n') : '_None_'}

---

### Tips
- Activează \`strict\` și \`noImplicitAny\` în tsconfig.json.  
- Evită tipul \`any\`; folosește generice sau tipuri explicite.  
- Corectează importurile nefolosite și exporturile nepotrivite.
`;

    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');
    fs.writeFileSync(mdPath, md, 'utf8');
    console.log(chalk.green(`📝 TS report saved: ${path.relative(this.root, mdPath)}`));
  }

  run() {
    this.runTSC();
    this.checkStrictness();
    this.writeReports();

    if (this.results.passed) console.log(chalk.green('✅ TypeScript checks PASSED\n'));
    else console.log(chalk.red('❌ TypeScript errors detected\n'));

    return this.results.passed;
  }
}

/* CLI */
if (require.main === module) {
  const checker = new TypeScriptChecker();
  const ok = checker.run();
  process.exit(ok ? 0 : 1);
}

module.exports = TypeScriptChecker;
