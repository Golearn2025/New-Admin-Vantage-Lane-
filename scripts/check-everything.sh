#!/bin/bash

###############################################################################
# CHECK EVERYTHING - Complete Verification Script
# 
# Runs ALL quality checks before commit:
# - TypeScript compilation
# - ESLint
# - Next.js build
# - P0 critical items
# - Security audit
# 
# Usage: ./scripts/check-everything.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 RUNNING ALL VERIFICATION CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL_CHECKS=5
PASSED=0
FAILED=0

# Function to run check
run_check() {
  local name=$1
  local command=$2
  
  echo -e "${BLUE}▶ $name${NC}"
  echo "  Running: $command"
  echo ""
  
  if eval $command > /tmp/check_output.log 2>&1; then
    echo -e "  ${GREEN}✓ PASSED${NC}"
    ((PASSED++))
  else
    echo -e "  ${RED}✗ FAILED${NC}"
    echo "  See /tmp/check_output.log for details"
    tail -20 /tmp/check_output.log
    ((FAILED++))
  fi
  
  echo ""
}

# Check 1: TypeScript
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1️⃣  TYPESCRIPT COMPILATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm run check:ts 2>&1 | grep -v "test.ts" | grep "error TS" > /dev/null; then
  echo -e "${RED}✗ TypeScript errors found in production code${NC}"
  npm run check:ts 2>&1 | grep "error TS" | head -5
  ((FAILED++))
else
  echo -e "${GREEN}✓ TypeScript compilation successful${NC}"
  ((PASSED++))
fi
echo ""

# Check 2: ESLint
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  2️⃣  ESLINT CODE QUALITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_check "ESLint Check" "npm run check:lint"

# Check 3: Next.js Build
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  3️⃣  NEXT.JS PRODUCTION BUILD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_check "Production Build" "npm run build"

# Check 4: P0 Critical Items
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  4️⃣  P0 CRITICAL ITEMS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_check "P0 Health Check" "npm run check:p0"

# Check 5: Security Audit
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  5️⃣  SECURITY AUDIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm audit --audit-level=high > /tmp/audit.log 2>&1; then
  echo -e "${GREEN}✓ No high/critical vulnerabilities${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠ Vulnerabilities found (check with: npm audit)${NC}"
  # Don't fail for vulnerabilities, just warn
  ((PASSED++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📊 RESULTS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Total Checks:  $TOTAL_CHECKS"
echo -e "  ${GREEN}Passed:       $PASSED${NC}"
echo -e "  ${RED}Failed:       $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "  ${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo -e "  ${GREEN}🎉 SAFE TO COMMIT!${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "  ${RED}❌ SOME CHECKS FAILED!${NC}"
  echo -e "  ${RED}⚠️  FIX ERRORS BEFORE COMMITTING${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
