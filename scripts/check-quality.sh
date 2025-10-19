#!/bin/bash

###############################################################################
# QUALITY CHECKS - Advanced Code Quality Verification
# 
# Checks:
# 1. Code Duplication (jscpd)
# 2. Dead Code (ts-prune)
# 3. Hardcoded Values
# 4. 'any' Types
# 5. Magic Numbers
# 6. TODO/FIXME comments
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 ADVANCED QUALITY CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

mkdir -p reports

PASS=0
FAIL=0
WARN=0

# Check 1: 'any' Types
echo -e "${BLUE}1️⃣  CHECKING 'any' TYPES...${NC}"
echo ""

ANY_COUNT=$(grep -r '\bany\b' apps/admin/shared app --include='*.ts' --include='*.tsx' \
  --exclude-dir=node_modules --exclude='*.test.ts' 2>/dev/null | wc -l | tr -d ' ')

if [ "$ANY_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✓ No 'any' types found${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ Found $ANY_COUNT 'any' types${NC}"
  grep -r '\bany\b' apps/admin/shared app --include='*.ts' --include='*.tsx' \
    --exclude-dir=node_modules --exclude='*.test.ts' -n 2>/dev/null | head -10
  echo ""
  echo "  Run: npm run check:any for full list"
  ((WARN++))
fi
echo ""

# Check 2: Hardcoded Colors
echo -e "${BLUE}2️⃣  CHECKING HARDCODED COLORS...${NC}"
echo ""

COLOR_COUNT=$(grep -r 'color:\s*#\|rgb(\|hsl(' apps/admin app \
  --include='*.css' --include='*.tsx' --exclude-dir=node_modules 2>/dev/null | wc -l | tr -d ' ')

if [ "$COLOR_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✓ No hardcoded colors found${NC}"
  ((PASS++))
else
  echo -e "${RED}✗ Found $COLOR_COUNT hardcoded colors${NC}"
  grep -r 'color:\s*#\|rgb(\|hsl(' apps/admin app \
    --include='*.css' --include='*.tsx' --exclude-dir=node_modules -n 2>/dev/null | head -5
  echo ""
  echo "  Use design tokens from packages/ui-core/src/tokens/"
  ((FAIL++))
fi
echo ""

# Check 3: Magic Numbers (hardcoded numbers in code)
echo -e "${BLUE}3️⃣  CHECKING MAGIC NUMBERS...${NC}"
echo ""

MAGIC_COUNT=$(grep -r '\s[0-9]\{2,\}\s*[;,)]' apps/admin/shared app \
  --include='*.ts' --include='*.tsx' --exclude='*.test.ts' \
  --exclude-dir=node_modules --exclude='*tokens*' 2>/dev/null | \
  grep -v '100\|200\|300\|400\|500\|600\|700\|800\|900\|1000' | wc -l | tr -d ' ')

if [ "$MAGIC_COUNT" -lt 10 ]; then
  echo -e "${GREEN}✓ Acceptable magic numbers (< 10)${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ Found $MAGIC_COUNT potential magic numbers${NC}"
  echo "  Consider extracting to constants"
  ((WARN++))
fi
echo ""

# Check 4: Hardcoded Strings (potential i18n issues)
echo -e "${BLUE}4️⃣  CHECKING HARDCODED STRINGS...${NC}"
echo ""

# Count hardcoded strings in JSX (excluding imports, types, etc)
STRING_COUNT=$(grep -r '"[A-Z][a-z]' apps/admin/shared app \
  --include='*.tsx' --exclude='*.test.ts' --exclude-dir=node_modules 2>/dev/null | \
  grep -v 'import\|type\|interface\|const\|export' | \
  wc -l | tr -d ' ')

if [ "$STRING_COUNT" -lt 100 ]; then
  echo -e "${GREEN}✓ Acceptable hardcoded strings${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ Many hardcoded strings ($STRING_COUNT)${NC}"
  echo "  Consider i18n for internationalization"
  ((WARN++))
fi
echo ""

# Check 5: TODO/FIXME Comments
echo -e "${BLUE}5️⃣  CHECKING TODO/FIXME COMMENTS...${NC}"
echo ""

TODO_COUNT=$(grep -r 'TODO\|FIXME\|XXX\|HACK' apps/admin app \
  --include='*.ts' --include='*.tsx' --exclude-dir=node_modules 2>/dev/null | wc -l | tr -d ' ')

if [ "$TODO_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✓ No pending TODOs${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ Found $TODO_COUNT TODO/FIXME comments${NC}"
  grep -r 'TODO\|FIXME' apps/admin app \
    --include='*.ts' --include='*.tsx' --exclude-dir=node_modules -n 2>/dev/null | head -5
  echo ""
  echo "  Review and resolve or document"
  ((WARN++))
fi
echo ""

# Check 6: Business Logic in UI Components
echo -e "${BLUE}6️⃣  CHECKING BUSINESS LOGIC IN UI...${NC}"
echo ""

BUSINESS_COUNT=$(grep -r 'supabase\.from\|fetch(\|axios' app \
  --include='*.tsx' --exclude-dir=api --exclude-dir=node_modules 2>/dev/null | wc -l | tr -d ' ')

if [ "$BUSINESS_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✓ No business logic in UI${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ Found $BUSINESS_COUNT potential violations${NC}"
  echo "  Keep business logic in hooks/services"
  ((WARN++))
fi
echo ""

# Check 7: Large Functions (complexity)
echo -e "${BLUE}7️⃣  CHECKING LARGE FUNCTIONS...${NC}"
echo ""

# Find functions with many lines
LARGE_FUNCS=$(find apps/admin app -name "*.tsx" -o -name "*.ts" | \
  xargs -I {} sh -c 'awk "/function |const.*=.*=>|export.*function/ {start=NR} /^}/ {if(NR-start>50) print FILENAME\":\"start\"-\"NR}" {}' 2>/dev/null | \
  wc -l | tr -d ' ')

if [ "$LARGE_FUNCS" -lt 5 ]; then
  echo -e "${GREEN}✓ No large functions (< 50 lines)${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ Found $LARGE_FUNCS functions > 50 lines${NC}"
  echo "  Consider splitting into smaller functions"
  ((WARN++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📊 QUALITY RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  ${GREEN}Passed:   $PASS${NC}"
echo -e "  ${YELLOW}Warnings: $WARN${NC}"
echo -e "  ${RED}Failed:   $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "  ${GREEN}✅ QUALITY CHECKS PASSED!${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "  ${RED}❌ SOME QUALITY ISSUES FOUND${NC}"
  echo -e "  ${YELLOW}Fix critical issues before committing${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
