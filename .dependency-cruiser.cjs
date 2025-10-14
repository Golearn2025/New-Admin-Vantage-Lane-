/**
 * Dependency Cruiser Config - Enterprise Architecture Boundaries
 * Enforces clean architecture layers and prevents layer violations
 */

module.exports = {
  forbidden: [
    // UI nu poate importa business logic
    {
      name: "ui-to-domain",
      severity: "error",
      from: { path: "^app|^apps/admin/shared/ui" },
      to: { path: "^apps/admin/(entities|shared/api/clients)" },
      comment: "UI components must not import business logic or API clients"
    },
    
    // UI poate folosi DOAR contracts (nu clients)
    {
      name: "ui-to-clients",
      severity: "error", 
      from: { path: "^app" },
      to: { path: "shared/api/clients" },
      comment: "Pages can use contracts but not API clients directly"
    },
    
    // Features nu importă app/*
    {
      name: "feature-to-app",
      severity: "error",
      from: { path: "^apps/admin/features" },
      to: { path: "^app/" },
      comment: "Features layer cannot import from app layer"
    },
    
    // Core UI nu poate depinde de composed
    {
      name: "core-to-composed",
      severity: "error",
      from: { path: "^apps/admin/shared/ui/core" },
      to: { path: "^apps/admin/shared/ui/composed" },
      comment: "Core components cannot depend on composed components"
    }
  ],
  
  // Exclude dependencies externe
  options: {
    doNotFollow: {
      path: "node_modules"
    }
  }
};
