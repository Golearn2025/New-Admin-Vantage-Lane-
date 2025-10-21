# GitHub Actions Workflows

## CI Pipeline (`ci.yml`)

**Purpose:** Automated quality checks on every push and pull request.

### What it checks:

1. **🛡️ UI Component Guard** (`pnpm guard:ui`)
   - Verifies all UI components have complete file structure (tsx, css, index.ts)
   - Ensures no hardcoded colors (only design tokens allowed)
   - Prevents component structure violations

2. **🔍 ESLint** (`pnpm lint`)
   - Catches code quality issues
   - Enforces consistent code style
   - Detects unused variables, console statements, etc.

3. **🏗️ Next.js Build** (`pnpm build`)
   - Verifies the app builds successfully
   - Catches TypeScript errors
   - Validates all imports and dependencies

### Triggers:

- **Push:** Any commit to `main`, `develop`, or feature branches (`chore/**`, `feat/**`, `fix/**`)
- **Pull Request:** Any PR targeting `main` or `develop`

### Local Testing:

Before pushing, run the full CI pipeline locally:

```bash
pnpm check:ci
```

This runs the exact same checks as the CI pipeline.

### Configuration:

- **Node.js version:** 20.x
- **Package manager:** pnpm 10
- **Lock file:** Frozen during CI (no auto-updates)

### If CI fails:

1. Check the GitHub Actions logs for specific errors
2. Run `pnpm check:ci` locally to reproduce
3. Fix the issues:
   - Hardcoded colors → Use design tokens
   - ESLint errors → Fix or add exception
   - Build errors → Fix TypeScript/import issues
4. Commit and push again

### Performance:

Typical CI run time: **2-3 minutes**
- Install dependencies: ~30s
- UI Guard: ~1s
- ESLint: ~5s
- Build: ~60-90s
