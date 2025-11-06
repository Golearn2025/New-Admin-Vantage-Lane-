#!/usr/bin/env bash
set -euo pipefail

# ========================================
# VANTAGE LANE - VERIFICARE CLEAN
# Rulează în director curat pentru a elimina orice cache/dependențe locale
# ========================================

echo "=========================================="
echo "🧹 CLEAN VERIFICATION"
echo "=========================================="
echo ""

# Confirmă cu user-ul
echo "⚠️  Acest script va șterge:"
echo "   - node_modules/"
echo "   - .next/"
echo "   - dist/"
echo "   - pnpm-lock.yaml"
echo "   - Toate fișierele netracked"
echo ""
read -p "Continui? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Anulat de user"
  exit 1
fi

echo ""
echo "🧹 [1/5] Cleaning git directory..."
git clean -fdx

echo ""
echo "📦 [2/5] Installing dependencies..."
pnpm install

echo ""
echo "🔍 [3/5] Running TypeScript + Lint..."
pnpm check:ts && pnpm lint

echo ""
echo "🏗️  [4/5] Building project..."
pnpm build

echo ""
echo "🧪 [5/5] Running tests..."
pnpm test:run

echo ""
echo "=========================================="
echo "🔍 RUNNING COMPLETE VERIFICATION"
echo "=========================================="
echo ""

bash scripts/verify-complete.sh

echo ""
echo "=========================================="
echo "🎉 CLEAN VERIFICATION COMPLETE!"
echo "=========================================="
echo ""
echo "✅ All checks passed in clean environment"
echo "✅ No hidden dependencies or cache issues"
echo ""
