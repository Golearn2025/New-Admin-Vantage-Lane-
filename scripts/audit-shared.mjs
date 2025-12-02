/**
 * Shared Components Audit Script
 * 
 * Analyzes what's shared between admin/operator/driver roles
 * Output: docs/audit/shared/ with intersection analysis
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROLE_ROOTS = {
  admin: "apps/admin/features/admin",
  operator: "apps/admin/features/operator", 
  driver: "apps/admin/features/driver",
};

const SHARED_CANDIDATES = {
  "ui-core": "packages/ui-core/src",
  "shared": "apps/admin/shared",
  "entities": "apps/admin/entities",
  "formatters": "packages/formatters/src"
};

const exts = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.isFile() && exts.has(path.extname(e.name))) acc.push(full);
  }
  return acc;
}

function readImports(file) {
  try {
    const src = fs.readFileSync(file, "utf8");
    const imports = [];
    
    // Match ES6 imports: from 'module' or from "module"
    const re = /\bfrom\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) {
      imports.push(m[1]);
    }
    
    return imports;
  } catch (error) {
    console.warn(`⚠️ Could not read ${file}: ${error.message}`);
    return [];
  }
}

function normalizeImport(imp, fromFile) {
  // Ignore all node_modules dependencies
  const nodeModuleDeps = [
    'react', 'next', '@mui', '@supabase', 'lucide-react', 
    'clsx', 'date-fns', 'zod', '@hookform', 'tailwindcss'
  ];
  
  if (nodeModuleDeps.some(dep => imp.startsWith(dep))) {
    return null; // Exclude external deps
  }
  
  // Handle relative imports - resolve to actual file path
  if (imp.startsWith("./") || imp.startsWith("../")) {
    const fromDir = path.dirname(fromFile);
    const resolved = path.resolve(fromDir, imp);
    const relativePath = path.relative(ROOT, resolved);
    return relativePath.startsWith('.') ? null : relativePath;
  }
  
  // Handle alias imports - resolve to real paths
  if (imp.startsWith("@/")) return imp.replace("@/", "apps/admin/");
  if (imp.startsWith("@features/")) return imp.replace("@features/", "apps/admin/features/");
  if (imp.startsWith("@entities/")) return imp.replace("@entities/", "apps/admin/entities/");
  if (imp.startsWith("@vantage-lane/ui-core")) return "packages/ui-core/src";
  if (imp.startsWith("@formatters/")) return imp.replace("@formatters/", "packages/formatters/src/");
  if (imp.startsWith("@admin-shared/")) return imp.replace("@admin-shared/", "apps/admin/shared/");
  
  // Keep internal project paths only
  if (imp.startsWith("packages/") || imp.startsWith("apps/")) return imp;
  
  return null; // Exclude everything else
}

function collectRoleData(role, roleDir) {
  console.log(`🔍 Analyzing ${role} (${roleDir})`);
  
  const abs = path.resolve(roleDir);
  const files = walk(abs);
  const imports = new Set();
  const importCount = {};
  
  console.log(`   Found ${files.length} files`);
  
  for (const f of files) {
    for (const rawImport of readImports(f)) {
      const normalized = normalizeImport(rawImport, f);
      if (normalized) {
        imports.add(normalized);
        importCount[normalized] = (importCount[normalized] || 0) + 1;
      }
    }
  }
  
  const sortedImports = [...imports].sort();
  const topImports = Object.entries(importCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);
  
  console.log(`   Found ${sortedImports.length} unique imports`);
  
  return { 
    files: files.length,
    imports: sortedImports, 
    importCount,
    topImports
  };
}

function intersect(a, b) {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x));
}

function analyzeSharedCandidates() {
  console.log("\n🔍 Analyzing shared candidates...");
  
  const candidateUsage = {};
  
  for (const [name, dir] of Object.entries(SHARED_CANDIDATES)) {
    candidateUsage[name] = {
      path: dir,
      exists: fs.existsSync(dir),
      files: fs.existsSync(dir) ? walk(path.resolve(dir)).length : 0
    };
  }
  
  return candidateUsage;
}

console.log("🚀 Starting Shared Components Audit...\n");

const data = {};
for (const [role, dir] of Object.entries(ROLE_ROOTS)) {
  data[role] = collectRoleData(role, dir);
}

// Calculate intersections
console.log("\n📊 Calculating shared imports...");

const sharedAll = intersect(
  intersect(data.admin.imports, data.operator.imports), 
  data.driver.imports
);

const sharedAO = intersect(data.admin.imports, data.operator.imports);
const sharedAD = intersect(data.admin.imports, data.driver.imports);
const sharedOD = intersect(data.operator.imports, data.driver.imports);

// Analyze shared candidates
const candidates = analyzeSharedCandidates();

// Ensure output directory
fs.mkdirSync("docs/audit/shared", { recursive: true });

// Save JSON data
const jsonReport = {
  timestamp: new Date().toISOString(),
  roles: data,
  shared: {
    all: sharedAll,
    adminOperator: sharedAO,
    adminDriver: sharedAD,
    operatorDriver: sharedOD
  },
  candidates
};

fs.writeFileSync("docs/audit/shared/shared.json", JSON.stringify(jsonReport, null, 2));
fs.writeFileSync("docs/audit/shared/shared-files.json", JSON.stringify({
  timestamp: new Date().toISOString(),
  sharedFiles: {
    all: sharedAll,
    adminOperator: sharedAO,
    adminDriver: sharedAD,
    operatorDriver: sharedOD
  },
  roleData: {
    admin: { files: data.admin.files, imports: data.admin.imports.length },
    operator: { files: data.operator.files, imports: data.operator.imports.length },
    driver: { files: data.driver.files, imports: data.driver.imports.length }
  }
}, null, 2));

// Generate markdown reports
function generateMarkdown(title, imports, context = "") {
  let md = `# ${title}\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Total:** ${imports.length} shared imports\n\n`;
  
  if (context) {
    md += `${context}\n\n`;
  }
  
  if (imports.length === 0) {
    md += `*No shared imports found*\n`;
  } else {
    md += `## Shared Imports\n\n`;
    for (const imp of imports) {
      md += `- \`${imp}\`\n`;
    }
  }
  
  return md;
}

// Write individual markdown files
fs.writeFileSync(
  "docs/audit/shared/SHARED_ALL.md", 
  generateMarkdown(
    "Shared imports (admin + operator + driver)", 
    sharedAll,
    "These imports are used by ALL three roles and are good candidates for shared libraries."
  )
);

fs.writeFileSync(
  "docs/audit/shared/SHARED_AO.md", 
  generateMarkdown(
    "Shared imports (admin + operator)", 
    sharedAO,
    "These imports are shared between admin and operator roles."
  )
);

fs.writeFileSync(
  "docs/audit/shared/SHARED_AD.md", 
  generateMarkdown(
    "Shared imports (admin + driver)", 
    sharedAD,
    "These imports are shared between admin and driver roles."
  )
);

fs.writeFileSync(
  "docs/audit/shared/SHARED_OD.md", 
  generateMarkdown(
    "Shared imports (operator + driver)", 
    sharedOD,
    "These imports are shared between operator and driver roles."
  )
);

// Generate comprehensive inventory
const inventoryMd = `# Shared Inventory - Complete Analysis

**Generated:** ${new Date().toISOString()}

## Summary

- **Admin Files:** ${data.admin.files} (${data.admin.imports.length} unique imports)
- **Operator Files:** ${data.operator.files} (${data.operator.imports.length} unique imports)  
- **Driver Files:** ${data.driver.files} (${data.driver.imports.length} unique imports)

## Shared Analysis

- **All 3 Roles:** ${sharedAll.length} shared imports
- **Admin + Operator:** ${sharedAO.length} shared imports
- **Admin + Driver:** ${sharedAD.length} shared imports
- **Operator + Driver:** ${sharedOD.length} shared imports

## Shared Candidates Analysis

${Object.entries(candidates)
  .map(([name, info]) => `- **${name}:** ${info.exists ? `✅ ${info.files} files` : "❌ Missing"} (\`${info.path}\`)`)
  .join("\n")}

## Top Imports by Role

### Admin Top Imports
${data.admin.topImports.slice(0, 10).map(([imp, count]) => `- \`${imp}\` (${count} times)`).join("\n")}

### Operator Top Imports  
${data.operator.topImports.slice(0, 10).map(([imp, count]) => `- \`${imp}\` (${count} times)`).join("\n")}

### Driver Top Imports
${data.driver.topImports.slice(0, 10).map(([imp, count]) => `- \`${imp}\` (${count} times)`).join("\n")}

## Recommendations

### Extract to Shared
${sharedAll.length > 0 ? `
**High Priority (All 3 roles):**
${sharedAll.slice(0, 10).map(imp => `- \`${imp}\``).join("\n")}
` : "*No imports shared by all 3 roles*"}

### Consolidate Similar
${sharedAO.length > 5 ? `
**Admin + Operator overlap suggests shared admin-like functionality:**
${sharedAO.slice(0, 5).map(imp => `- \`${imp}\``).join("\n")}
` : ""}

## Files Generated
- \`shared.json\` - Complete data export
- \`SHARED_ALL.md\` - All 3 roles
- \`SHARED_AO.md\` - Admin + Operator  
- \`SHARED_AD.md\` - Admin + Driver
- \`SHARED_OD.md\` - Operator + Driver
`;

fs.writeFileSync("docs/audit/shared/SHARED_INVENTORY.md", inventoryMd);

console.log("\n✅ Shared analysis complete!");
console.log(`📊 Results:`);
console.log(`   All 3 roles: ${sharedAll.length} shared imports`);
console.log(`   Admin + Operator: ${sharedAO.length} shared imports`);
console.log(`   Admin + Driver: ${sharedAD.length} shared imports`);
console.log(`   Operator + Driver: ${sharedOD.length} shared imports`);
console.log(`📁 Output: docs/audit/shared/`);
