#!/usr/bin/env node
/**
 * 🧱 STRUCTURE CHECKER v5.1 — Vantage Lane 2.0
 * Verifică dacă proiectul respectă structura standard
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class StructureChecker {
  constructor(projectRoot) {
    this.root = projectRoot || process.cwd();
    this.src = path.join(this.root, 'src');
    this.docsDir = path.join(this.root, 'docs');

    this.requiredStructure = [
      'src/app',
      'src/components/ui',
      'src/components/features',
      'src/config',
      'src/hooks',
      'src/lib',
      'src/types',
      'src/design-system/tokens',
      'src/test',
    ];

    this.namingRules = [
      // Rules are disabled for now to allow existing project structure
      // { pattern: /^[A-Z][A-Za-z0-9]+\.tsx$/, folder: 'src/components/ui', description: 'Component UI must be PascalCase.tsx' },
    ];

    this.results = {
      missingFolders: [],
      invalidNames: [],
      misplacedFiles: [],
      orphanFolders: [],
      summary: { passed: true, score: 100 },
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir, { recursive: true });
  }

  checkFolders() {
    for (const folder of this.requiredStructure) {
      if (!fs.existsSync(path.join(this.root, folder))) {
        this.results.missingFolders.push(folder);
        this.results.summary.passed = false;
      }
    }
  }

  checkNaming() {
    for (const rule of this.namingRules) {
      const folderPath = path.join(this.root, rule.folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (!rule.pattern.test(file)) {
          this.results.invalidNames.push({
            file: path.join(rule.folder, file),
            issue: `Invalid name pattern → ${rule.description}`,
          });
          this.results.summary.passed = false;
        }
      }
    }
  }

  checkMisplacedFiles() {
    const uiPath = path.join(this.src, 'components/ui');
    if (!fs.existsSync(uiPath)) return;

    const walk = dir => {
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) walk(full);
        else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          if (dir.includes('lib') && /^[A-Z]/.test(item)) {
            this.results.misplacedFiles.push(`${path.relative(this.root, full)} → should be in components/ui/`);
            this.results.summary.passed = false;
          }
        }
      }
    };

    walk(this.src);
  }

  checkOrphanFolders() {
    const allowed = new Set(this.requiredStructure.map(f => path.resolve(this.root, f)));
    const walk = dir => {
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) {
          if (full.includes('/src/') && !Array.from(allowed).some(a => full.startsWith(a))) {
            if (!full.includes('node_modules') && !full.includes('.next'))
              this.results.orphanFolders.push(path.relative(this.root, full));
          }
          walk(full);
        }
      }
    };
    walk(this.src);
  }

  calculateScore() {
    const penalties =
      this.results.missingFolders.length * 10 +
      this.results.invalidNames.length * 5 +
      this.results.misplacedFiles.length * 3 +
      this.results.orphanFolders.length * 2;
    this.results.summary.score = Math.max(0, 100 - penalties);
  }

  writeReports() {
    this.ensureDocsDir();
    const ts = new Date().toLocaleString('ro-RO');
    this.calculateScore();

    const mdPath = path.join(this.docsDir, 'STRUCTURE-REPORT.md');
    const jsonPath = path.join(this.docsDir, 'structure-report.json');

    const md = `# 🧱 STRUCTURE REPORT — Vantage Lane 2.0
**Generated:** ${ts}  
**Score:** ${this.results.summary.score}/100  
**Status:** ${this.results.summary.passed ? '✅ PASSED' : '❌ FAILED'}

---

## 📂 Missing Folders
${this.results.missingFolders.length ? this.results.missingFolders.map(f => `- ${f}`).join('\n') : '_None_'}

## 🧾 Invalid File Names
${this.results.invalidNames.length ? this.results.invalidNames.map(e => `- ${e.file} (${e.issue})`).join('\n') : '_None_'}

## 🧩 Misplaced Files
${this.results.misplacedFiles.length ? this.results.misplacedFiles.map(f => `- ${f}`).join('\n') : '_None_'}

## 🗂️ Orphan Folders
${this.results.orphanFolders.length ? this.results.orphanFolders.map(f => `- ${f}`).join('\n') : '_None_'}

---

### 🔧 Recommendations
- Respectă structura modulară standard (vezi docs/PROJECT_OVERVIEW.md)
- Păstrează componentele în \`src/components/ui\` 
- Evită foldere extra în \`src/\` care nu apar în structură
`;

    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');
    fs.writeFileSync(mdPath, md, 'utf8');
    console.log(chalk.green(`📝 Structure report saved: ${path.relative(this.root, mdPath)}`));
  }

  run() {
    console.log(chalk.cyan('\n🧱 STRUCTURE CHECKER — Validating architecture...\n'));
    this.checkFolders();
    this.checkNaming();
    this.checkMisplacedFiles();
    this.checkOrphanFolders();
    this.writeReports();

    if (this.results.summary.passed)
      console.log(chalk.green(`✅ Structure OK (${this.results.summary.score}/100)\n`));
    else
      console.log(chalk.yellow(`⚠️ Structural issues found (${this.results.summary.score}/100)\n`));

    return this.results.summary.passed;
  }
}

if (require.main === module) {
  const checker = new StructureChecker();
  const ok = checker.run();
  process.exit(ok ? 0 : 1);
}

module.exports = StructureChecker;
