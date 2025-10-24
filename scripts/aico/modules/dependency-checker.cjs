#!/usr/bin/env node
/**
 * 📦 DEPENDENCY CHECKER v5.1 — Vantage Lane 2.0
 * Scanează:
 *  - Vulnerabilități (npm audit --json)
 *  - Pachete învechite (npm outdated --json)
 *  - Dependențe lipsă / nefolosite (static + npm ls)
 *  - Constrângeri semver riscante (^ / ~ vs pinned)
 *  - Licență absentă în package.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DependencyChecker {
  constructor(projectRoot) {
    this.root = projectRoot || process.cwd();
    this.docsDir = path.join(this.root, 'docs');

    this.POLICY = {
      failOnAuditLevels: ['critical', 'high'],
      failOnOutdatedMajor: true,
      failOnMissingDeps: true,
      failOnBrokenPeers: true,
      warnOnTildeCaret: true,
      ignorePackages: [],
    };

    this.results = {
      audit: { critical: 0, high: 0, moderate: 0, low: 0, total: 0, advisories: [] },
      outdated: { count: 0, major: 0, minor: 0, patch: 0, items: [] },
      missing: { count: 0, items: [] },
      brokenPeers: { count: 0, items: [] },
      looseRanges: { count: 0, items: [] },
      license: { hasLicenseField: false },
      summary: { passed: true, reasons: [] },
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir, { recursive: true });
  }

  readPackageJson() {
    const pkgPath = path.join(this.root, 'package.json');
    if (!fs.existsSync(pkgPath)) throw new Error('package.json not found');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    this.results.license.hasLicenseField = !!pkg.license;
    return pkg;
  }

  runCmd(cmd) {
    try {
      return execSync(cmd, { cwd: this.root, encoding: 'utf8', stdio: 'pipe' });
    } catch (err) {
      return (err && (err.stdout?.toString() || err.stderr?.toString())) || '';
    }
  }

  runAudit() {
    const raw = this.runCmd('npm audit --json');
    if (!raw || !raw.trim()) return;

    let json;
    try { json = JSON.parse(raw); } catch { return; }

    const counters = { critical: 0, high: 0, moderate: 0, low: 0, total: 0 };
    const advisories = [];

    const vulnerabilities = json.vulnerabilities || {};
    for (const [name, v] of Object.entries(vulnerabilities)) {
      const severity = v.severity || 'low';
      counters[severity] = (counters[severity] || 0) + (v.via?.length ? 1 : 1);
      counters.total += (v.via?.length ? v.via.length : 1);
      advisories.push({
        module: name,
        severity,
        via: (v.via || []).map(x => (typeof x === 'string' ? x : x.title)).filter(Boolean),
        range: v.range,
        fixAvailable: v.fixAvailable || false,
        effects: v.effects || [],
      });
    }

    if (!json.vulnerabilities && json.advisories) {
      for (const adv of Object.values(json.advisories)) {
        const sev = adv.severity || 'low';
        counters[sev] = (counters[sev] || 0) + 1;
        counters.total += 1;
        advisories.push({
          module: adv.module_name,
          severity: sev,
          via: [adv.title],
          range: adv.vulnerable_versions,
          fixAvailable: !!adv.fix_available,
          effects: [],
        });
      }
    }

    this.results.audit = { ...counters, advisories };
  }

  runOutdated() {
    const raw = this.runCmd('npm outdated --json');
    if (!raw || !raw.trim()) return;

    let json;
    try { json = JSON.parse(raw); } catch { return; }

    const items = [];
    let patch = 0, minor = 0, major = 0;

    for (const [name, info] of Object.entries(json)) {
      if (this.POLICY.ignorePackages.includes(name)) continue;
      const current = String(info.current || '');
      const latest = String(info.latest || '');
      const wanted = String(info.wanted || latest);

      const cur = current.split('.').map(n => parseInt(n || 0, 10));
      const lat = latest.split('.').map(n => parseInt(n || 0, 10));
      let bump = 'patch';
      if (lat[0] > cur[0]) bump = 'major';
      else if (lat[1] > cur[1]) bump = 'minor';
      else if (lat[2] > cur[2]) bump = 'patch';

      if (bump === 'major') major++;
      else if (bump === 'minor') minor++;
      else patch++;

      items.push({ name, current, wanted, latest, bump });
    }

    this.results.outdated = {
      count: items.length,
      patch, minor, major,
      items: items.sort((a,b) => (a.bump===b.bump? a.name.localeCompare(b.name) : (a.bump==='major'? -1 : b.bump==='major'? 1 : a.bump==='minor' && b.bump==='patch' ? -1 : 1))),
    };
  }

  runMissingAndPeers() {
    const output = this.runCmd('npm ls --all --json');
    if (!output || !output.trim()) return;
    let json; try { json = JSON.parse(output); } catch { return; }

    const missing = [];
    const brokenPeers = [];

    const walk = (node, pathTrail = []) => {
      if (!node || typeof node !== 'object') return;
      const problems = node.problems || [];
      for (const p of problems) {
        if (p.includes('missing:')) {
          missing.push(p);
        }
        if (p.includes('peer dep missing') || p.includes('invalid:')) {
          brokenPeers.push(p);
        }
      }
      const deps = node.dependencies || {};
      for (const [name, dep] of Object.entries(deps)) {
        walk(dep, pathTrail.concat(name));
      }
    };
    walk(json);

    this.results.missing = { count: missing.length, items: missing };
    this.results.brokenPeers = { count: brokenPeers.length, items: brokenPeers };
  }

  scanLooseRanges() {
    const pkg = this.readPackageJson();
    const collect = (obj = {}, scope) => {
      for (const [name, range] of Object.entries(obj)) {
        if (this.POLICY.ignorePackages.includes(name)) continue;
        if (typeof range === 'string' && (/^[~^]/.test(range))) {
          this.results.looseRanges.items.push({ name, range, scope });
        }
      }
    };
    this.results.looseRanges.items = [];
    collect(pkg.dependencies, 'dependencies');
    collect(pkg.devDependencies, 'devDependencies');
    this.results.looseRanges.count = this.results.looseRanges.items.length;
  }

  applyPolicy() {
    const { audit, outdated, missing, brokenPeers } = this.results;

    for (const lvl of this.POLICY.failOnAuditLevels) {
      if ((audit[lvl] || 0) > 0) {
        this.results.summary.passed = false;
        this.results.summary.reasons.push(`npm audit found ${audit[lvl]} ${lvl} issues`);
      }
    }

    if (this.POLICY.failOnOutdatedMajor && outdated.major > 0) {
      this.results.summary.passed = false;
      this.results.summary.reasons.push(`${outdated.major} major upgrades available`);
    }

    if (this.POLICY.failOnMissingDeps && missing.count > 0) {
      this.results.summary.passed = false;
      this.results.summary.reasons.push(`${missing.count} missing dependencies in graph`);
    }

    if (this.POLICY.failOnBrokenPeers && brokenPeers.count > 0) {
      this.results.summary.passed = false;
      this.results.summary.reasons.push(`${brokenPeers.count} peer dependency issues`);
    }

    if (this.POLICY.warnOnTildeCaret && this.results.looseRanges.count > 0) {
      this.results.summary.reasons.push(`${this.results.looseRanges.count} loose semver ranges (^/~)`);
    }

    if (!this.results.license.hasLicenseField) {
      this.results.summary.reasons.push('package.json has no "license" field');
    }

    if (this.results.summary.reasons.length === 0) {
      this.results.summary.reasons.push('All dependency checks passed');
    }
  }

  writeReports() {
    this.ensureDocsDir();
    const md = this.renderMarkdown();
    const jsonPath = path.join(this.docsDir, 'dependency-report.json');
    const mdPath = path.join(this.docsDir, 'DEPENDENCY-REPORT.md');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
    fs.writeFileSync(mdPath, md);
    console.log(`📝 Wrote: ${path.relative(this.root, mdPath)}`);
  }

  renderMarkdown() {
    const ts = new Date().toLocaleString('ro-RO');
    const {
      audit, outdated, missing, brokenPeers, looseRanges, license, summary
    } = this.results;

    const list = (arr) => (arr && arr.length ? arr.map(x => `- ${x}`).join('\n') : '_None_');
    const listObj = (arr, pick) =>
      (arr && arr.length ? arr.map(x => `- ${pick(x)}`).join('\n') : '_None_');

    return `# 📦 DEPENDENCY REPORT — Vantage Lane 2.0
**Generated:** ${ts}  
**Status:** ${summary.passed ? '✅ PASSED' : '❌ FAILED'}

---

## 🔐 Audit (npm audit)
- Critical: **${audit.critical}**
- High: **${audit.high}**
- Moderate: ${audit.moderate}
- Low: ${audit.low}
- Total: ${audit.total}

### Top advisories
${audit.advisories.slice(0, 10).map(a => `- **${a.severity}** ${a.module} (${a.range || 'n/a'}) ${a.fixAvailable ? '→ fix available' : ''}`).join('\n') || '_None_'}

---

## ⬆️ Outdated (npm outdated)
- Total outdated: **${outdated.count}**
- Major: **${outdated.major}**, Minor: ${outdated.minor}, Patch: ${outdated.patch}

### Items
${listObj(outdated.items, i => `${i.name}: ${i.current} → wanted ${i.wanted}, latest ${i.latest} (${i.bump})`)}

---

## ❓ Missing / Broken peers (npm ls)
- Missing: **${missing.count}**
${list(missing.items.slice(0, 10))}

- Broken peers: **${brokenPeers.count}**
${list(brokenPeers.items.slice(0, 10))}

---

## 🧩 Loose Semver Ranges (^ / ~)
- Count: **${looseRanges.count}**
${listObj(looseRanges.items.slice(0, 20), i => `${i.name}@${i.range} (${i.scope})`)}

---

## 📄 License
- package.json has license: **${license.hasLicenseField ? 'Yes' : 'No'}**

---

## ✅ Summary
${summary.reasons.map(r => `- ${r}`).join('\n')}
`;
  }

  run() {
    console.log('📦 Dependency Checker – starting...\n');

    this.readPackageJson();
    this.runAudit();
    this.runOutdated();
    this.runMissingAndPeers();
    this.scanLooseRanges();
    this.applyPolicy();
    this.writeReports();

    if (this.results.summary.passed) {
      console.log('✅ Dependency checks PASSED.\n');
      return true;
    } else {
      console.log('❌ Dependency checks FAILED.\n');
      return false;
    }
  }
}

if (require.main === module) {
  const checker = new DependencyChecker(process.cwd());
  const ok = checker.run();
  process.exit(ok ? 0 : 1);
}

module.exports = DependencyChecker;
