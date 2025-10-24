#!/usr/bin/env node
/**
 * 💀 DEAD CODE CHECKER v5.1 – Vantage Lane Edition
 * Detectează exporturi nefolosite, duplicate și dependențe orfane
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('chalk');

class DeadCodeChecker {
  constructor(projectRoot) {
    this.root = projectRoot || path.resolve(process.cwd());
    this.srcDir = path.join(this.root, 'src');
    this.docsDir = path.join(this.root, 'docs');
    this.IGNORED = ['node_modules', 'dist', 'build', '.next', '.turbo', 'test', 'docs'];

    this.results = {
      unusedExports: [],
      duplicateBlocks: [],
      unusedDeps: [],
      missingDeps: [],
      orphanUIComponents: [],
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir);
  }

  listFiles(dir) {
    const out = [];
    const walk = (d) => {
      for (const f of fs.readdirSync(d)) {
        const full = path.join(d, f);
        if (this.IGNORED.some(x => full.includes(x))) continue;
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(full)) out.push(full);
      }
    };
    walk(dir);
    return out;
  }

  /* ---------------- EXPORT SCAN ---------------- */
  findExports() {
    const map = new Map();
    for (const file of this.listFiles(this.srcDir)) {
      const code = fs.readFileSync(file, 'utf8');
      const exports = [...code.matchAll(/export\s+(?:const|function|class|interface|type)\s+(\w+)/g)]
        .map((m) => m[1]);
      if (exports.length) map.set(file, exports);
    }
    return map;
  }

  findImports() {
    const imports = new Set();
    for (const file of this.listFiles(this.srcDir)) {
      const code = fs.readFileSync(file, 'utf8');
      for (const m of code.matchAll(/['"]@?[^'"]+['"]/g)) imports.add(m[0].replace(/['"]/g, ''));
    }
    return imports;
  }

  checkUnusedExports() {
    const exportsMap = this.findExports();
    const allCode = this.listFiles(this.srcDir).map(f => fs.readFileSync(f, 'utf8')).join('\n');
    for (const [file, exps] of exportsMap.entries()) {
      for (const name of exps) {
        if (!new RegExp(`\\b${name}\\b`).test(allCode)) {
          this.results.unusedExports.push(`${path.relative(this.root, file)} → ${name}`);
        }
      }
    }
  }

  /* ---------------- DUPLICATE DETECTOR ---------------- */
  checkDuplicates() {
    const blocks = new Map();
    for (const file of this.listFiles(this.srcDir)) {
      const code = fs.readFileSync(file, 'utf8')
        .replace(/\s+/g, ' ')
        .slice(0, 10000); // limit
      const chunks = code.match(/.{200,400}/g) || [];
      for (const chunk of chunks) {
        const hash = crypto.createHash('md5').update(chunk).digest('hex');
        if (blocks.has(hash)) {
          blocks.get(hash).push(file);
        } else {
          blocks.set(hash, [file]);
        }
      }
    }

    for (const [hash, files] of blocks.entries()) {
      if (files.length > 1) {
        this.results.duplicateBlocks.push({
          hash,
          files: [...new Set(files.map(f => path.relative(this.root, f)))],
        });
      }
    }
  }

  /* ---------------- DEPENDENCY AUDIT ---------------- */
  checkDependencies() {
    const pkgPath = path.join(this.root, 'package.json');
    if (!fs.existsSync(pkgPath)) return;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});
    const devDeps = Object.keys(pkg.devDependencies || {});
    const allImports = Array.from(this.findImports()).join('\n');

    for (const dep of deps.concat(devDeps)) {
      const re = new RegExp(dep.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
      if (!re.test(allImports)) this.results.unusedDeps.push(dep);
    }

    for (const m of allImports.matchAll(/from ['"]([^'"]+)['"]/g)) {
      const name = m[1];
      if (name.startsWith('.') || name.startsWith('@/')) continue;
      const main = name.split('/')[0];
      if (![...deps, ...devDeps].includes(main)) this.results.missingDeps.push(main);
    }
  }

  /* ---------------- ORPHAN UI COMPONENTS ---------------- */
  checkOrphanUI() {
    const uiDir = path.join(this.srcDir, 'components/ui');
    if (!fs.existsSync(uiDir)) return;
    const uiFolders = fs.readdirSync(uiDir).filter(f => fs.statSync(path.join(uiDir, f)).isDirectory());
    const allCode = this.listFiles(this.srcDir).map(f => fs.readFileSync(f, 'utf8')).join('\n');
    for (const folder of uiFolders) {
      const regex = new RegExp(folder, 'i');
      if (!regex.test(allCode)) {
        this.results.orphanUIComponents.push(folder);
      }
    }
  }

  /* ---------------- REPORT ---------------- */
  writeReports() {
    this.ensureDocsDir();
    const ts = new Date().toLocaleString('ro-RO');
    const mdPath = path.join(this.docsDir, 'DEAD-CODE-REPORT.md');
    const jsonPath = path.join(this.docsDir, 'dead-code.json');

    const md = `# 💀 DEAD CODE REPORT – Vantage Lane 2.0
**Date:** ${ts}

## ⚙️ Unused Exports
${this.results.unusedExports.length ? this.results.unusedExports.map(e => `- ${e}`).join('\n') : '_None_'}

## ⚠️ Duplicate Blocks
${this.results.duplicateBlocks.length ? this.results.duplicateBlocks.map(d => `- ${d.files.join(', ')}`).join('\n') : '_None_'}

## 📦 Unused Dependencies
${this.results.unusedDeps.length ? this.results.unusedDeps.map(d => `- ${d}`).join('\n') : '_None_'}

## 🚫 Missing Dependencies
${this.results.missingDeps.length ? this.results.missingDeps.map(d => `- ${d}`).join('\n') : '_None_'}

## 🧩 Orphan UI Components
${this.results.orphanUIComponents.length ? this.results.orphanUIComponents.map(f => `- ${f}`).join('\n') : '_None_'}
`;

    fs.writeFileSync(mdPath, md, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');

    console.log(chalk.green(`📝 Dead code report saved: ${path.relative(this.root, mdPath)}`));
  }

  runAllChecks() {
    console.log(chalk.bold.cyan('\n💀 DEAD CODE CHECKER – Vantage Lane 2.0'));
    console.log(chalk.gray('=========================================\n'));

    this.checkUnusedExports();
    this.checkDuplicates();
    this.checkDependencies();
    this.checkOrphanUI();

    this.writeReports();

    const totalIssues =
      this.results.unusedExports.length +
      this.results.duplicateBlocks.length +
      this.results.unusedDeps.length +
      this.results.missingDeps.length +
      this.results.orphanUIComponents.length;

    if (totalIssues === 0) console.log(chalk.green('✅ No dead code found.\n'));
    else console.log(chalk.yellow(`⚠️ ${totalIssues} potential issues detected.\n`));

    return totalIssues === 0;
  }

  run() {
    return this.runAllChecks();
  }
}

/* CLI */
if (require.main === module) {
  const checker = new DeadCodeChecker();
  process.exit(checker.run() ? 0 : 1);
}

module.exports = DeadCodeChecker;
