/**
 * Size Limit Config - Bundle Budget Enforcement
 * Prevents bundle bloat and monitors performance impact
 */

module.exports = [
  {
    name: "Login Page",
    path: ".next/static/chunks/pages/login.js",
    limit: "5 KB",
    webpack: false
  },
  {
    name: "AppShell Components", 
    path: "apps/admin/shared/ui/composed/appshell/**/*.tsx",
    limit: "20 KB",
    webpack: false
  },
  {
    name: "Icons Bundle",
    path: "apps/admin/shared/ui/icons/**/*.tsx", 
    limit: "3 KB",
    webpack: false
  },
  {
    name: "Core UI Components",
    path: "apps/admin/shared/ui/core/**/*.tsx",
    limit: "15 KB", 
    webpack: false
  },
  {
    name: "Total Bundle (First Load)",
    path: ".next/static/chunks/pages/**/*.js",
    limit: "100 KB",
    webpack: false
  }
];
