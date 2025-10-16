#!/bin/bash
# PR #1 Verification Script
# Ensures packages structure doesn't break existing build

set -e  # Exit on error

echo "🔍 PR #1 Verification - Packages Structure"
echo "=========================================="
echo ""

echo "✅ Step 1: Clean install"
npm ci
echo ""

echo "✅ Step 2: Build apps/admin (existing)"
echo "This MUST succeed without changes..."
npm run build
echo ""

echo "✅ Step 3: TypeScript check"
npx tsc --noEmit
echo ""

echo "✅ Step 4: Lint check"
npm run lint
echo ""

echo "✅ Step 5: Build packages (expect success with placeholders)"
echo "Building ui-core..."
npm run build -w @vantage-lane/ui-core
echo ""

echo "Building ui-icons..."
npm run build -w @vantage-lane/ui-icons
echo ""

echo "Building formatters..."
npm run build -w @vantage-lane/formatters
echo ""

echo "Building contracts..."
npm run build -w @vantage-lane/contracts
echo ""

echo "✅ Step 6: Verify no changes to apps/admin imports"
if grep -R "@vantage-lane" apps/admin --include="*.ts" --include="*.tsx"; then
  echo "❌ ERROR: Found @vantage-lane imports in apps/admin (should not exist yet)"
  exit 1
else
  echo "✅ No @vantage-lane imports in apps/admin (correct)"
fi
echo ""

echo "✅ Step 7: Verify tsconfig.json aliases"
if grep -q "@vantage-lane/ui-core" tsconfig.json; then
  echo "✅ Path aliases added to tsconfig.json"
else
  echo "❌ ERROR: Path aliases missing in tsconfig.json"
  exit 1
fi
echo ""

echo "✅ Step 8: Verify workspaces"
if grep -q '"packages/\*"' package.json; then
  echo "✅ Workspaces updated in package.json"
else
  echo "❌ ERROR: Workspaces not updated"
  exit 1
fi
echo ""

echo "=========================================="
echo "✅ PR #1 VERIFICATION COMPLETE"
echo "=========================================="
echo ""
echo "Summary:"
echo "  ✅ Existing build works"
echo "  ✅ TypeScript compiles"
echo "  ✅ New packages build successfully"
echo "  ✅ No breaking changes to apps/admin"
echo "  ✅ Path aliases configured"
echo "  ✅ Workspaces configured"
echo ""
echo "🚀 Ready to commit PR #1"
