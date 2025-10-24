#!/usr/bin/env node
/**
 * 🔒 SECURITY PRO SCANNER v6.0 – Vantage Lane 2.0
 * Advanced security scanning: npm audit, env leaks, OWASP compliance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class SecurityProScanner {
  constructor(projectRoot) {
    this.root = projectRoot || process.cwd();
    this.srcDir = path.join(this.root, 'src');
    this.docsDir = path.join(this.root, 'docs');
    this.results = {
      vulnerabilities: [],
      envLeaks: [],
      owaspIssues: [],
      apiSecurity: [],
      score: 100,
      passed: true,
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir, { recursive: true });
  }

  runCommand(cmd) {
    try {
      return execSync(cmd, { cwd: this.root, encoding: 'utf8', stdio: 'pipe' });
    } catch (err) {
      return err.stdout?.toString() || err.stderr?.toString() || '';
    }
  }

  getAllFiles() {
    const files = [];
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.name.includes('node_modules') || entry.name.includes('.git')) continue;
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js') || full.endsWith('.env'))) {
          files.push(full);
        }
      }
    };
    walk(this.root);
    return files;
  }

  runNpmAudit() {
    console.log('🔍 Running npm audit...');
    const auditOutput = this.runCommand('npm audit --json');
    
    if (auditOutput) {
      try {
        const auditData = JSON.parse(auditOutput);
        const vulnerabilities = auditData.vulnerabilities || {};
        
        for (const [name, vuln] of Object.entries(vulnerabilities)) {
          if (vuln.severity === 'critical' || vuln.severity === 'high') {
            this.results.vulnerabilities.push({
              package: name,
              severity: vuln.severity,
              via: vuln.via || [],
              range: vuln.range,
              fixAvailable: vuln.fixAvailable || false
            });
            
            if (vuln.severity === 'critical') this.results.score -= 10;
            else if (vuln.severity === 'high') this.results.score -= 5;
          }
        }
      } catch (error) {
        console.log('⚠️ Could not parse npm audit output');
      }
    }
  }

  checkEnvironmentLeaks() {
    console.log('🔍 Checking for environment variable leaks...');
    const files = this.getAllFiles().filter(f => !f.includes('.env'));
    
    const envPatterns = [
      /process\.env\.[\w_]+/g,
      /["']API_KEY["']\s*:\s*["'][^"']+["']/g,
      /["']SECRET["']\s*:\s*["'][^"']+["']/g,
      /["']TOKEN["']\s*:\s*["'][^"']+["']/g,
      /["']PASSWORD["']\s*:\s*["'][^"']+["']/g,
    ];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        envPatterns.forEach((pattern, i) => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              // Skip safe patterns
              if (match.includes('process.env.NODE_ENV') || 
                  match.includes('process.env.NEXT_PUBLIC_')) return;
              
              this.results.envLeaks.push({
                file: path.relative(this.root, file),
                leak: match.slice(0, 100),
                type: ['env_access', 'api_key', 'secret', 'token', 'password'][i],
                severity: 'high'
              });
              this.results.score -= 8;
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  checkOwaspCompliance() {
    console.log('🔍 Checking OWASP compliance...');
    const files = this.getAllFiles();

    const owaspPatterns = [
      { 
        pattern: /eval\s*\(/g, 
        name: 'Code Injection Risk', 
        severity: 'critical',
        owasp: 'A03:2021 – Injection' 
      },
      { 
        pattern: /innerHTML\s*=/g, 
        name: 'XSS Vulnerability', 
        severity: 'high',
        owasp: 'A03:2021 – Injection' 
      },
      { 
        pattern: /document\.write\s*\(/g, 
        name: 'XSS Risk', 
        severity: 'medium',
        owasp: 'A03:2021 – Injection' 
      },
      { 
        pattern: /localStorage\.setItem\s*\(\s*["'][^"']*(?:token|key|secret)/gi, 
        name: 'Sensitive Data Exposure', 
        severity: 'high',
        owasp: 'A02:2021 – Cryptographic Failures' 
      },
      { 
        pattern: /fetch\s*\(\s*["'][^"']*["']\s*,\s*\{[^}]*method\s*:\s*["'](?:POST|PUT|DELETE)["'][^}]*\}/g, 
        name: 'Missing CSRF Protection', 
        severity: 'medium',
        owasp: 'A01:2021 – Broken Access Control' 
      },
    ];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        owaspPatterns.forEach(({ pattern, name, severity, owasp }) => {
          const matches = content.match(pattern);
          if (matches) {
            this.results.owaspIssues.push({
              file: path.relative(this.root, file),
              issue: name,
              severity,
              owaspCategory: owasp,
              instances: matches.length,
              examples: matches.slice(0, 2).map(m => m.slice(0, 80))
            });
            
            const penalty = severity === 'critical' ? 10 : severity === 'high' ? 7 : 4;
            this.results.score -= penalty;
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  checkApiSecurity() {
    console.log('🔍 Checking API security patterns...');
    const files = this.getAllFiles();

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for missing input validation
        if (content.includes('req.body') && !content.includes('validate')) {
          this.results.apiSecurity.push({
            file: path.relative(this.root, file),
            issue: 'Missing Input Validation',
            severity: 'high',
            description: 'API endpoint uses req.body without validation'
          });
          this.results.score -= 6;
        }

        // Check for missing rate limiting
        if (content.includes('app.') && (content.includes('.post(') || content.includes('.put(')) 
            && !content.includes('rateLimit')) {
          this.results.apiSecurity.push({
            file: path.relative(this.root, file),
            issue: 'Missing Rate Limiting',
            severity: 'medium', 
            description: 'API endpoint without rate limiting'
          });
          this.results.score -= 3;
        }

        // Check for hardcoded URLs
        const urlPattern = /https?:\/\/[^\s"']+/g;
        const urls = content.match(urlPattern);
        if (urls && urls.some(url => !url.includes('localhost') && !url.includes('example'))) {
          this.results.apiSecurity.push({
            file: path.relative(this.root, file),
            issue: 'Hardcoded API URLs',
            severity: 'low',
            description: 'Consider using environment variables for API endpoints'
          });
          this.results.score -= 2;
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  run() {
    console.log(chalk.cyan('\n🔒 SECURITY PRO SCANNER — analyzing security...\n'));
    this.ensureDocsDir();

    this.runNpmAudit();
    this.checkEnvironmentLeaks();
    this.checkOwaspCompliance();
    this.checkApiSecurity();

    this.results.passed = this.results.score >= 70;
    this.writeReports();

    if (this.results.passed)
      console.log(chalk.green(`✅ Security scan OK (${this.results.score}/100)\n`));
    else
      console.log(chalk.red(`🚨 Security issues found (${this.results.score}/100)\n`));

    return this.results.passed;
  }

  writeReports() {
    const ts = new Date().toLocaleString('ro-RO');
    const mdPath = path.join(this.docsDir, 'SECURITY-PRO-REPORT.md');
    const jsonPath = path.join(this.docsDir, 'security-pro.json');

    const md = `# 🔒 SECURITY PRO REPORT — Vantage Lane 2.0
**Generated:** ${ts}  
**Score:** ${this.results.score}/100  
**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}

## 🚨 NPM Vulnerabilities (${this.results.vulnerabilities.length})
${this.results.vulnerabilities.length ? this.results.vulnerabilities.map(v => `- **${v.severity.toUpperCase()}**: ${v.package} ${v.fixAvailable ? '(fix available)' : '(no fix)'}`).join('\n') : '_None_'}

## 🔑 Environment Leaks (${this.results.envLeaks.length})
${this.results.envLeaks.length ? this.results.envLeaks.map(e => `- ${e.file}: ${e.type} → ${e.leak}`).join('\n') : '_None_'}

## 🛡️ OWASP Issues (${this.results.owaspIssues.length})
${this.results.owaspIssues.length ? this.results.owaspIssues.map(o => `- **${o.severity.toUpperCase()}**: ${o.issue} in ${o.file} (${o.owaspCategory})`).join('\n') : '_None_'}

## 🌐 API Security (${this.results.apiSecurity.length})
${this.results.apiSecurity.length ? this.results.apiSecurity.map(a => `- **${a.severity.toUpperCase()}**: ${a.issue} in ${a.file}`).join('\n') : '_None_'}

---

### 🔧 Security Recommendations
- Fix all critical and high vulnerabilities immediately
- Use environment variables for sensitive data
- Implement input validation on all API endpoints
- Add rate limiting to prevent abuse
- Enable CSRF protection for state-changing operations
- Regularly update dependencies
`;

    fs.writeFileSync(mdPath, md, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');
    console.log(chalk.green(`📝 Security Pro report: ${path.relative(this.root, mdPath)}`));
  }
}

if (require.main === module) {
  const scanner = new SecurityProScanner();
  const ok = scanner.run();
  process.exit(ok ? 0 : 1);
}

module.exports = SecurityProScanner;
