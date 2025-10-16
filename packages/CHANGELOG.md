# Changelog

All notable changes to Vantage Lane UI packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Package structure for `@vantage-lane/*` packages
- TypeScript path aliases in root `tsconfig.json`
- Build configuration with `tsup` for ESM + CJS
- Workspace support in root `package.json`
- README documentation for each package

### Changed
- **PR #1.1**: Standardized build configuration across all packages
  - Updated target to ES2017 (from ES2015)
  - Changed format order to ESM-first: `['esm', 'cjs']`
  - Added `sideEffects: false` for better tree-shaking
  - Simplified package.json exports (removed redundant types field)
  - Added `recharts` to external dependencies
  - Removed unnecessary tsup options (splitting, minify)

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

---

## [0.1.0] - 2025-01-16

### Added
- **PR #1**: Initial package structure
  - `@vantage-lane/ui-core` - Core UI primitives (placeholder)
  - `@vantage-lane/ui-icons` - SVG icons (placeholder)
  - `@vantage-lane/styles` - Design tokens (placeholder)
  - `@vantage-lane/formatters` - Formatters + i18n (placeholder)
  - `@vantage-lane/contracts` - TypeScript types (placeholder)
  
### Notes
- All packages are placeholders with basic structure
- No breaking changes to existing `apps/admin` code
- Build infrastructure ready for component migration

---

## Package-Specific Changes

### @vantage-lane/ui-core

#### [0.1.0] - 2025-01-16
- Initial package structure
- Build config with tsup
- Placeholder exports

### @vantage-lane/ui-icons

#### [0.1.0] - 2025-01-16
- Initial package structure
- Build config with tsup
- Placeholder exports

### @vantage-lane/styles

#### [0.1.0] - 2025-01-16
- Initial package structure
- Placeholder CSS file

### @vantage-lane/formatters

#### [0.1.0] - 2025-01-16
- Initial package structure
- Build config with tsup
- Placeholder exports

### @vantage-lane/contracts

#### [0.1.0] - 2025-01-16
- Initial package structure
- Build config with tsup
- Placeholder types

---

## Migration Timeline

- **PR #1** (2025-01-16): ✅ Package structure setup
- **PR #2** (Future): Move `ui-core` components
- **PR #3** (Future): Move `ui-icons` components
- **PR #4** (Future): Create CardKit/ChartKit
- **PR #5** (Future): Move styles + formatters
- **PR #6** (Future): Cleanup `apps/admin` (optional)
