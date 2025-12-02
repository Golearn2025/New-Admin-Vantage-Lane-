/**
 * Route Inventory Script - Next.js App Router
 * 
 * Scans app/ directory and generates route inventory per role
 * Output: docs/audit/routes/ with admin/operator/driver breakdowns
 */

import fs from "node:fs";
import path from "node:path";

const ROOTS = [
  "app", // Next.js App Router root
];

const isRouteFile = (name) => name === "page.tsx" || name === "page.jsx" || name === "page.ts" || name === "page.js";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && isRouteFile(entry.name)) acc.push(full);
  }
  return acc;
}

function toRoute(appRoot, filePath) {
  const rel = path.relative(appRoot, path.dirname(filePath));
  const segments = rel.split(path.sep).filter(Boolean);

  // ignore group segments like (admin), (operator), (driver)
  const cleaned = segments
    .filter((s) => !(s.startsWith("(") && s.endsWith(")")))
    .map((s) => (s.startsWith("[") ? s : s)); // keep dynamic segments

  return "/" + cleaned.join("/");
}

function roleFromPath(p) {
  const s = p.replaceAll("\\", "/");
  
  // Check for explicit role paths
  if (s.includes("/(admin)/")) return "admin";
  if (s.includes("/(operator)/")) return "operator"; 
  if (s.includes("/(driver)/")) return "driver";
  
  // Check feature paths
  if (s.includes("/features/admin/")) return "admin";
  if (s.includes("/features/operator/")) return "operator";
  if (s.includes("/features/driver/")) return "driver";
  
  // Default fallback - root pages are usually admin
  return "shared"; // or "admin" if you prefer
}

function analyzeRoute(route, filePath) {
  // Additional analysis for each route
  const isDynamic = route.includes("[");
  const isNested = route.split("/").length > 2;
  const hasAuth = !route.includes("/login") && !route.includes("/signup") && route !== "/";
  
  return {
    route,
    file: path.relative(process.cwd(), filePath),
    isDynamic,
    isNested, 
    hasAuth,
    depth: route.split("/").length - 1
  };
}

const results = { 
  admin: [], 
  operator: [], 
  driver: [], 
  shared: [] 
};

console.log("🔍 Scanning for Next.js routes...");

for (const root of ROOTS) {
  const appRoot = path.resolve(root);
  console.log(`   Scanning: ${appRoot}`);
  
  const pages = walk(appRoot);
  console.log(`   Found ${pages.length} page files`);
  
  for (const file of pages) {
    const route = toRoute(appRoot, file);
    const role = roleFromPath(file);
    const analysis = analyzeRoute(route, file);
    
    results[role].push(analysis);
  }
}

// Sort routes for better readability
for (const k of Object.keys(results)) {
  results[k].sort((a, b) => a.route.localeCompare(b.route));
}

// Ensure output directory exists
fs.mkdirSync("docs/audit/routes", { recursive: true });

// Generate machine-readable JSON
fs.writeFileSync("docs/audit/routes/routes.json", JSON.stringify(results, null, 2));

// Generate human-readable markdown files
function generateMarkdown(role, routes) {
  const total = routes.length;
  const dynamic = routes.filter(r => r.isDynamic).length;
  const nested = routes.filter(r => r.isNested).length;
  const protectedRoutes = routes.filter(r => r.hasAuth).length;
  
  let md = `# Routes (${role.toUpperCase()})\n\n`;
  md += `**Total:** ${total} routes\n`;
  md += `**Dynamic:** ${dynamic} routes (with parameters)\n`;
  md += `**Nested:** ${nested} routes (depth > 1)\n`;
  md += `**Protected:** ${protectedRoutes} routes (require auth)\n\n`;
  
  md += `## Route List\n\n`;
  
  if (routes.length === 0) {
    md += `*No routes found for ${role} role*\n`;
  } else {
    for (const route of routes) {
      const badges = [];
      if (route.isDynamic) badges.push("🔗 Dynamic");
      if (route.isNested) badges.push("📁 Nested");
      if (route.hasAuth) badges.push("🔒 Protected");
      
      const badgeStr = badges.length > 0 ? ` ${badges.join(" ")}` : "";
      md += `- \`${route.route}\` → \`${route.file}\`${badgeStr}\n`;
    }
  }
  
  return md;
}

// Write markdown files for each role
for (const [role, routes] of Object.entries(results)) {
  const markdown = generateMarkdown(role, routes);
  fs.writeFileSync(`docs/audit/routes/${role}.md`, markdown);
}

// Generate summary report
const summary = {
  total: Object.values(results).flat().length,
  byRole: Object.fromEntries(
    Object.entries(results).map(([role, routes]) => [role, routes.length])
  ),
  dynamic: Object.values(results).flat().filter(r => r.isDynamic).length,
  protectedRoutes: Object.values(results).flat().filter(r => r.hasAuth).length
};

const summaryMd = `# Route Inventory Summary

**Generated:** ${new Date().toISOString()}

## Overview
- **Total Routes:** ${summary.total}
- **Dynamic Routes:** ${summary.dynamic}
- **Protected Routes:** ${summary.protectedRoutes}

## By Role
${Object.entries(summary.byRole)
  .map(([role, count]) => `- **${role.toUpperCase()}:** ${count} routes`)
  .join("\n")}

## Files Generated
- \`routes.json\` - Machine-readable route data
- \`admin.md\` - Admin routes list
- \`operator.md\` - Operator routes list  
- \`driver.md\` - Driver routes list
- \`shared.md\` - Shared routes list

## Usage
\`\`\`bash
# Re-run route inventory
node scripts/audit-routes.mjs

# View route data
cat docs/audit/routes/routes.json | jq
\`\`\`
`;

fs.writeFileSync("docs/audit/routes/README.md", summaryMd);

console.log("✅ Route inventory generated in docs/audit/routes/");
console.log(`📊 Found ${summary.total} total routes:`);
for (const [role, count] of Object.entries(summary.byRole)) {
  console.log(`   ${role}: ${count} routes`);
}
