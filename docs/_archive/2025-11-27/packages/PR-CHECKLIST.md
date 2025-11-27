# PR #1: Packages Structure Setup - Checklist

## 📋 Pre-Commit Verification

### ✅ Structure Created

- [ ] `packages/ui-core/` - package.json, tsconfig.json, tsup.config.ts, src/index.ts, README.md
- [ ] `packages/ui-icons/` - package.json, tsconfig.json, tsup.config.ts, src/index.ts, README.md
- [ ] `packages/styles/` - package.json, globals.css (placeholder), README.md
- [ ] `packages/formatters/` - package.json, tsconfig.json, tsup.config.ts, src/index.ts, README.md
- [ ] `packages/contracts/` - package.json, tsconfig.json, tsup.config.ts, src/index.ts, README.md
- [ ] `packages/README.md` - Main documentation
- [ ] `packages/CHANGELOG.md` - Version history

### ✅ Configuration Updated

- [ ] `package.json` - workspaces includes `"packages/*"`
- [ ] `package.json` - devDependencies includes `tsup@^8.0.0`
- [ ] `tsconfig.json` - paths includes `@vantage-lane/*` aliases
- [ ] `tsconfig.json` - existing `@admin/*` aliases UNCHANGED

### ✅ Build Infrastructure

- [ ] All packages have `tsup.config.ts` with ESM + CJS output
- [ ] All TypeScript packages have valid `tsconfig.json` extending root
- [ ] All packages have `dist/` in `.gitignore` (check root .gitignore)
- [ ] All packages have placeholder exports to prevent build errors

---

## 🧪 Local Verification

Run the verification script:

```bash
./scripts/verify-pr1.sh
```

**Manual checks if script unavailable:**

### 1. Clean Install

```bash
npm ci
```

✅ Should complete without errors

### 2. Existing Build Still Works

```bash
npm run build
```

✅ `apps/admin` build MUST succeed (no changes to it)

### 3. TypeScript Compilation

```bash
npx tsc --noEmit
```

✅ Should pass (placeholders are valid TypeScript)

### 4. Lint Check

```bash
npm run lint
```

✅ Should pass or have expected warnings (empty src/ folders)

### 5. Package Builds

```bash
npm run build -w @vantage-lane/ui-core
npm run build -w @vantage-lane/ui-icons
npm run build -w @vantage-lane/formatters
npm run build -w @vantage-lane/contracts
```

✅ All should build successfully (create `dist/` folders)

### 6. No Import Changes

```bash
grep -R "@vantage-lane" apps/admin --include="*.ts" --include="*.tsx"
```

✅ Should return NO results (we haven't changed any imports yet)

### 7. Path Aliases Configured

```bash
grep "@vantage-lane/ui-core" tsconfig.json
```

✅ Should find the path alias entry

### 8. Workspaces Configured

```bash
grep "packages/\*" package.json
```

✅ Should find workspaces entry

---

## 🚫 What This PR Does NOT Do

- ❌ Does NOT move any files from `apps/admin`
- ❌ Does NOT change any imports in existing code
- ❌ Does NOT modify `app/globals.css`
- ❌ Does NOT delete anything
- ❌ Does NOT affect existing functionality

---

## ✅ Acceptance Criteria

| Criteria                                 | Status | Notes                    |
| ---------------------------------------- | ------ | ------------------------ |
| `npm run build` succeeds                 | ☐      | Existing app builds      |
| `npx tsc --noEmit` passes                | ☐      | No TypeScript errors     |
| Package builds succeed                   | ☐      | All 5 packages build     |
| No `@vantage-lane` imports in apps/admin | ☐      | Zero breaking changes    |
| Path aliases in `tsconfig.json`          | ☐      | New + old both present   |
| Workspaces in `package.json`             | ☐      | Includes `packages/*`    |
| All READMEs present                      | ☐      | Documentation complete   |
| CHANGELOG created                        | ☐      | Version 0.1.0 documented |

---

## 📝 Commit Message

```
feat: Setup packages structure for UI component library

- Add 5 new packages: ui-core, ui-icons, styles, formatters, contracts
- Configure TypeScript path aliases for @vantage-lane/* imports
- Add workspaces support in root package.json
- Setup tsup build configuration for ESM + CJS output
- Add placeholder exports to prevent build errors
- Document each package with README
- Zero breaking changes to existing apps/admin code

Packages are placeholders ready for component migration in PR #2+

Related: PR #1 - Packages Structure Setup
```

---

## 🔍 Review Checklist (for Reviewer)

- [ ] Verify no changes to `apps/admin/**/*.tsx` files
- [ ] Verify no changes to `app/**/*.tsx` files
- [ ] Check `tsconfig.json` has both old and new aliases
- [ ] Confirm `npm run build` succeeds
- [ ] Check each package has complete structure
- [ ] Review README documentation clarity
- [ ] Verify CHANGELOG follows semantic versioning

---

## 🚀 Post-Merge

After this PR merges:

1. **PR #2**: Move `ui-core` components (Button, Input, Card, Checkbox)
2. **PR #3**: Move `ui-icons` components
3. **PR #4**: Create CardKit/ChartKit per specs
4. **PR #5**: Move styles + implement formatters
5. **PR #6**: Cleanup old structure (optional)

---

## ⚠️ Rollback Plan

If anything breaks:

```bash
# Revert commit
git revert HEAD

# OR manually:
rm -rf packages/
git checkout package.json tsconfig.json
npm ci
```

Impact: **Zero** - no code depends on packages yet.
