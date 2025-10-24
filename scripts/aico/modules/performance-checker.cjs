#!/usr/bin/env node
/**
 * ⚡ PERFORMANCE CHECKER v5.1 – Vantage Lane 2.0
 * Evaluează performanța generală a proiectului:
 *  - timpul de build
 *  - dimensiunea bundle-urilor (Next.js .next/)
 *  - numărul de importuri și module
 *  - dimensiunea fișierelor cheie (components/ui)
 *  - calculează un "Performance Health Score"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PerformanceChecker {
  constructor(projectRoot) {
    this.root = projectRoot || process.cwd();
    this.docsDir = path.join(this.root, 'docs');
    this.results = {
      buildTimeMs: 0,
      bundleSizeMb: 0,
      fileSizes: [],
      importCount: 0,
      moduleCount: 0,
      performanceScore: 100,
      passed: true,
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir, { recursive: true });
  }

  measureBuildTime() {
    console.log(chalk.cyan('\n⚙️ Measuring build performance...\n'));
    const start = Date.now();
    try {
      execSync('npm run build --silent', {
        cwd: this.root,
        stdio: 'pipe',
      });
      this.results.buildTimeMs = Date.now() - start;
      console.log(`✅ Build completed in ${this.results.buildTimeMs} ms`);
    } catch (error) {
      this.results.buildTimeMs = Date.now() - start;
      console.log(`❌ Build failed after ${this.results.buildTimeMs} ms`);
      this.results.passed = false;
    }
  }

  analyzeBundle() {
    const nextDir = path.join(this.root, '.next');
    if (fs.existsSync(nextDir)) {
      const totalBytes = this.getDirectorySize(nextDir);
      this.results.bundleSizeMb = (totalBytes / (1024 * 1024)).toFixed(2);
      console.log(`📦 Bundle size: ${this.results.bundleSizeMb} MB`);
    } else {
      console.log('⚠️ .next directory not found — skipping bundle size check');
    }
  }

  getDirectorySize(dirPath) {
    let total = 0;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const full = path.join(dirPath, item);
      const stats = fs.statSync(full);
      if (stats.isDirectory()) total += this.getDirectorySize(full);
      else total += stats.size;
    }
    return total;
  }

  analyzeImports() {
    const srcDir = path.join(this.root, 'src');
    let importCount = 0;
    let moduleCount = 0;

    const walk = dir => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) walk(full);
        else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(full, 'utf8');
          const matches = content.match(/import\s.+?from\s.+?['"]/g);
          if (matches) importCount += matches.length;
          moduleCount++;
        }
      }
    };

    walk(srcDir);
    this.results.importCount = importCount;
    this.results.moduleCount = moduleCount;
    console.log(`📚 ${moduleCount} modules, ${importCount} imports total`);
  }

  analyzeFileSizes() {
    const uiDir = path.join(this.root, 'src/components/ui');
    if (!fs.existsSync(uiDir)) return;

    const files = [];
    const walk = dir => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (item.endsWith('.tsx')) {
          const sizeKb = (stat.size / 1024).toFixed(1);
          if (sizeKb > 25) {
            this.results.fileSizes.push({
              file: path.relative(this.root, full),
              sizeKb,
            });
          }
        }
      }
    };

    walk(uiDir);
    console.log(`🧩 ${this.results.fileSizes.length} large UI files detected (>25KB)`);
  }

  calculateScore() {
    let score = 100;
    if (this.results.buildTimeMs > 15000) score -= 15;
    if (this.results.bundleSizeMb > 50) score -= 15;
    if (this.results.importCount > 2000) score -= 10;
    if (this.results.fileSizes.length > 20) score -= 10;
    if (!this.results.passed) score -= 20;
    this.results.performanceScore = Math.max(0, score);
  }

  writeReports() {
    this.ensureDocsDir();
    const ts = new Date().toLocaleString('ro-RO');
    this.calculateScore();

    const mdPath = path.join(this.docsDir, 'PERFORMANCE-REPORT.md');
    const jsonPath = path.join(this.docsDir, 'performance-report.json');

    const md = `# ⚡ PERFORMANCE REPORT — Vantage Lane 2.0
**Generated:** ${ts}  
**Performance Score:** ${this.results.performanceScore}/100  
**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}

---

## 🧮 Build Metrics
- Build Time: ${this.results.buildTimeMs} ms
- Bundle Size: ${this.results.bundleSizeMb} MB
- Imports: ${this.results.importCount}
- Modules: ${this.results.moduleCount}

## 🧩 Large UI Components (>25KB)
${this.results.fileSizes.length ? this.results.fileSizes.map(f => `- ${f.file} (${f.sizeKb} KB)`).join('\n') : '_None_'}

---

### 🔧 Recommendations
- Optimizează componentele UI (split, lazy loading)
- Evită importurile circulare și redundante
- Menține bundle sub 50 MB
- Optimizează animațiile și librăriile nefolosite
`;

    fs.writeFileSync(mdPath, md, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');
    console.log(chalk.green(`📝 Performance report saved: ${path.relative(this.root, mdPath)}`));
  }

  run() {
    console.log(chalk.cyan('\n⚡ PERFORMANCE CHECKER — analyzing system...\n'));
    this.measureBuildTime();
    this.analyzeBundle();
    this.analyzeImports();
    this.analyzeFileSizes();
    this.writeReports();

    if (this.results.performanceScore >= 80)
      console.log(chalk.green(`✅ Performance OK (${this.results.performanceScore}/100)\n`));
    else
      console.log(chalk.yellow(`⚠️ Performance optimization needed (${this.results.performanceScore}/100)\n`));

    return this.results.performanceScore >= 70;
  }
}

if (require.main === module) {
  const checker = new PerformanceChecker();
  const ok = checker.run();
  process.exit(ok ? 0 : 1);
}

module.exports = PerformanceChecker;
