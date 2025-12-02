module.exports = {
  extends: ["next/core-web-vitals", "plugin:jsx-a11y/recommended"],
  plugins: ["@typescript-eslint", "import", "jsx-a11y"],
  parser: "@typescript-eslint/parser",
  settings: {
    // Path aliases resolver pentru TypeScript paths
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json"
      }
    }
  },
  rules: {
    // 🚫 BLOCKERS (CI FAIL) - Enterprise critical
    "@typescript-eslint/no-explicit-any": "error", // REGULA 1: ZERO 'ANY' TYPES
    "no-console": ["error", { "allow": ["warn", "error"] }], // REGULA 9: ZERO CONSOLE LOGS
    "react-hooks/rules-of-hooks": "error", // REGULA 15: React hooks safety
    "import/no-cycle": "error", // ARCHITECTURE: No circular deps
    
    // 🟡 WARNINGS (trackable, fix gradual) - Quality improvements  
    "max-lines": ["warn", { max: 200, skipComments: true, skipBlankLines: true }], // REGULA 11
    "max-lines-per-function": ["warn", { max: 50, skipComments: true, skipBlankLines: true }], // REGULA 11
    "complexity": ["warn", { max: 10 }], // REGULA 11
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // REGULA 2
    "react-hooks/exhaustive-deps": "warn", // REGULA 15: Dependencies
    
    // 🎯 UI COMPONENT RESTRICTIONS - Zero fetch în UI
    "no-restricted-syntax": [
      "error",
      {
        selector: "CallExpression[callee.name='fetch']",
        message: "Direct fetch() calls not allowed in UI components. Use hooks pattern."
      }
    ],
    
    // 🏗️ ARCHITECTURE RULES
    "import/no-cycle": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "../../../!(apps)*",
              "../../../apps/!(admin)*", 
              "../../../apps/admin/!(features)*",
              "../../../apps/admin/features/!(dashboard-metrics|settings-profile)*",
              "../../../../*",
              "../../../../../*"
            ],
            message: "Use path aliases (@admin, @admin-shared, etc.) instead of deep relative imports"
          },
          {
            group: [
              "**/apps/admin/features/!(dashboard-metrics|settings-profile)/**",
              "**/apps/admin/entities/**"
            ],
            message: "Do not import from apps/admin/features (except dashboard-metrics and settings-profile) or entities - these folders are deprecated"
          },
          {
            group: ["**/shared/api/clients/**"],
            message: "UI components can only use contracts, not API clients"
          },
          {
            group: ["**/entities/**"],
            message: "UI components cannot import business entities"
          },
          {
            group: ["**/features/!(dashboard-metrics|settings-profile)/**"],
            message: "Shared UI cannot import features (except dashboard-metrics and settings-profile)"
          }
        ]
      }
    ]
  },
  overrides: [
    {
      "files": ["apps/admin/shared/ui/**/*.tsx", "apps/admin/shared/ui/**/*.ts"],
      "rules": {
        "max-lines": ["error", { "max": 200, "skipComments": true, "skipBlankLines": true }],
        "no-restricted-imports": [
          "error",
          {
            "patterns": [
              {
                "group": ["../../api/clients/**", "../../../api/clients/**"],
                "message": "UI components must not import API clients"
              },
              {
                "group": ["../../entities/**", "../../../entities/**"],
                "message": "UI components must not import business entities"
              }
            ]
          }
        ]
      }
    },
    {
      "files": ["apps/admin/shared/lib/**/*.ts"],
      "rules": {
        "max-lines": ["error", { "max": 150, "skipComments": true }]
      }
    },
    {
      "files": ["apps/admin/shared/hooks/**/*.ts"],
      "rules": {
        "max-lines": ["error", { "max": 80, "skipComments": true }]
      }
    }
  ]
}
