#!/usr/bin/env node
/**
 * 🧠 ADVANCED CODE QUALITY CHECKER v6.0 – Vantage Lane 2.0
 * Detectează complexity, code smells, SOLID violations, AI patterns
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AdvancedCodeQuality {
  constructor(projectRoot) {
    this.root = projectRoot || process.cwd();
    this.srcDir = path.join(this.root, 'src');
    this.docsDir = path.join(this.root, 'docs');
    this.results = {
      complexity: [],
      longFunctions: [],
      manyParameters: [],
      solidViolations: [],
      aiPatterns: [],
      score: 100,
      passed: true,
    };
  }

  ensureDocsDir() {
    if (!fs.existsSync(this.docsDir)) fs.mkdirSync(this.docsDir, { recursive: true });
  }

  getAllTsFiles() {
    const files = [];
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.name.includes('node_modules')) continue;
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
          files.push(full);
        }
      }
    };
    walk(this.srcDir);
    return files;
  }

  checkCyclomaticComplexity(content, filePath) {
    const complexityKeywords = /\b(if|else|for|while|switch|case|catch|&&|\|\||\?)\b/g;
    const lines = content.split('\n');
    
    lines.forEach((line, i) => {
      const matches = line.match(complexityKeywords);
      if (matches && matches.length > 5) {
        this.results.complexity.push({
          file: path.relative(this.root, filePath),
          line: i + 1,
          complexity: matches.length,
          content: line.trim().slice(0, 80)
        });
        this.results.score -= 2;
      }
    });
  }

  checkFunctionLength(content, filePath) {
    const functionMatches = content.match(/(function\s+\w+|const\s+\w+\s*=\s*\(|\w+\s*\([^)]*\)\s*=>|\w+\s*\([^)]*\)\s*\{)/g);
    if (!functionMatches) return;

    const lines = content.split('\n');
    let inFunction = false;
    let functionStart = 0;
    let braceCount = 0;

    lines.forEach((line, i) => {
      if (line.includes('function ') || line.includes('=>') || line.includes(') {')) {
        if (!inFunction) {
          inFunction = true;
          functionStart = i;
          braceCount = 0;
        }
      }
      
      if (inFunction) {
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        if (braceCount === 0 && i > functionStart) {
          const functionLength = i - functionStart;
          if (functionLength > 50) {
            this.results.longFunctions.push({
              file: path.relative(this.root, filePath),
              startLine: functionStart + 1,
              length: functionLength,
              name: lines[functionStart].trim().slice(0, 50)
            });
            this.results.score -= 3;
          }
          inFunction = false;
        }
      }
    });
  }

  checkParameterCount(content, filePath) {
    const functionPattern = /\(([^)]*)\)\s*(?:=>|{)/g;
    let match;
    
    while ((match = functionPattern.exec(content)) !== null) {
      const params = match[1].split(',').filter(p => p.trim().length > 0);
      if (params.length > 6) {
        this.results.manyParameters.push({
          file: path.relative(this.root, filePath),
          paramCount: params.length,
          signature: match[0].slice(0, 80)
        });
        this.results.score -= 2;
      }
    }
  }

  checkSOLIDViolations(content, filePath) {
    // Single Responsibility - clase/funcții cu prea multe responsabilități
    const classMatches = content.match(/class\s+\w+[\s\S]*?(?=class|\$)/g);
    if (classMatches) {
      classMatches.forEach(classContent => {
        const methods = (classContent.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
        if (methods > 15) {
          this.results.solidViolations.push({
            file: path.relative(this.root, filePath),
            violation: 'Single Responsibility',
            issue: `Class has ${methods} methods (should be < 15)`,
            severity: 'high'
          });
          this.results.score -= 5;
        }
      });
    }

    // Detectează God Objects
    if (content.length > 5000 && content.includes('class ')) {
      this.results.solidViolations.push({
        file: path.relative(this.root, filePath),
        violation: 'God Object',
        issue: `File too large (${content.length} chars) - consider splitting`,
        severity: 'medium'
      });
      this.results.score -= 3;
    }
  }

  checkAIPatterns(content, filePath) {
    // Detectează pattern-uri comune în codul generat de AI
    const aiPatterns = [
      { pattern: /\/\*\*[\s\S]*?\*\/\s*(?:function|const|class)/g, name: 'AI Documentation Pattern' },
      { pattern: /TODO:\s*(?:Implement|Add|Fix)/gi, name: 'AI TODO Pattern' },
      { pattern: /\/\/\s*AI[-\s]generated/gi, name: 'AI Comment Pattern' },
      { pattern: /interface\s+\w+Props\s*\{[\s\S]*?\}/g, name: 'AI Props Pattern' },
    ];

    aiPatterns.forEach(({ pattern, name }) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        this.results.aiPatterns.push({
          file: path.relative(this.root, filePath),
          pattern: name,
          count: matches.length,
          examples: matches.slice(0, 2).map(m => m.slice(0, 100))
        });
      }
    });
  }

  run() {
    console.log(chalk.cyan('\n🧠 ADVANCED CODE QUALITY — analyzing complexity...\n'));
    this.ensureDocsDir();

    const files = this.getAllTsFiles();
    console.log(`Analyzing ${files.length} TypeScript files...`);

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        this.checkCyclomaticComplexity(content, file);
        this.checkFunctionLength(content, file);
        this.checkParameterCount(content, file);
        this.checkSOLIDViolations(content, file); 
        this.checkAIPatterns(content, file);
      } catch (error) {
        // Skip files that can't be read
      }
    }

    this.results.passed = this.results.score >= 70;
    this.writeReports();

    if (this.results.passed)
      console.log(chalk.green(`✅ Advanced Code Quality OK (${this.results.score}/100)\n`));
    else
      console.log(chalk.yellow(`⚠️ Code quality issues found (${this.results.score}/100)\n`));

    return this.results.passed;
  }

  writeReports() {
    const ts = new Date().toLocaleString('ro-RO');
    const mdPath = path.join(this.docsDir, 'ADVANCED-CODE-QUALITY-REPORT.md');
    const jsonPath = path.join(this.docsDir, 'advanced-code-quality.json');

    const md = `# 🧠 ADVANCED CODE QUALITY REPORT — Vantage Lane 2.0
**Generated:** ${ts}  
**Score:** ${this.results.score}/100  
**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}

## 🔄 Cyclomatic Complexity (${this.results.complexity.length})
${this.results.complexity.length ? this.results.complexity.map(c => `- ${c.file}:${c.line} (complexity: ${c.complexity}) → ${c.content}`).join('\n') : '_None_'}

## 📏 Long Functions (${this.results.longFunctions.length}) 
${this.results.longFunctions.length ? this.results.longFunctions.map(f => `- ${f.file}:${f.startLine} (${f.length} lines) → ${f.name}`).join('\n') : '_None_'}

## 📋 Many Parameters (${this.results.manyParameters.length})
${this.results.manyParameters.length ? this.results.manyParameters.map(p => `- ${p.file} (${p.paramCount} params) → ${p.signature}`).join('\n') : '_None_'}

## 🏗️ SOLID Violations (${this.results.solidViolations.length})
${this.results.solidViolations.length ? this.results.solidViolations.map(v => `- ${v.file}: ${v.violation} - ${v.issue}`).join('\n') : '_None_'}

## 🤖 AI Patterns (${this.results.aiPatterns.length})
${this.results.aiPatterns.length ? this.results.aiPatterns.map(p => `- ${p.file}: ${p.pattern} (${p.count} instances)`).join('\n') : '_None_'}

---

### 💡 Recommendations
- Keep functions under 50 lines
- Limit parameters to 6 or fewer  
- Split large classes (Single Responsibility)
- Reduce cyclomatic complexity (< 5 per function)
`;

    fs.writeFileSync(mdPath, md, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');
    console.log(chalk.green(`📝 Advanced Code Quality report: ${path.relative(this.root, mdPath)}`));
  }
}

if (require.main === module) {
  const checker = new AdvancedCodeQuality();
  const ok = checker.run();
  process.exit(ok ? 0 : 1);
}

module.exports = AdvancedCodeQuality;
