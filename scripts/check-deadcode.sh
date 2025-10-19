#!/bin/bash

###############################################################################
# DEAD CODE DETECTION
# 
# Finds unused exports, functions, and components
# Helps identify code that can be safely removed
###############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 DEAD CODE DETECTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

mkdir -p reports

DEAD_CODE_COUNT=0

# Check 1: Unused exports
echo -e "${BLUE}1️⃣  Checking for unused exports...${NC}"
echo ""

# Find all exports
EXPORTS=$(find apps/admin/shared -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -name "*.test.ts" -not -name "index.ts" | \
  xargs grep -h "^export " 2>/dev/null | \
  sed 's/export \(const\|function\|class\|interface\|type\) //' | \
  sed 's/ .*//' | sed 's/{.*//' | sort -u)

UNUSED_EXPORTS=0
for export in $EXPORTS; do
  # Check if exported name is used anywhere else
  USAGE_COUNT=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" | \
    xargs grep -l "\b$export\b" 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$USAGE_COUNT" -eq 1 ]; then
    ((UNUSED_EXPORTS++))
  fi
done

if [ "$UNUSED_EXPORTS" -eq 0 ]; then
  echo -e "${GREEN}✓ No obviously unused exports${NC}"
else
  echo -e "${YELLOW}⚠ Found ~$UNUSED_EXPORTS potentially unused exports${NC}"
  echo "  Review and remove if truly unused"
  ((DEAD_CODE_COUNT+=$UNUSED_EXPORTS))
fi

echo ""

# Check 2: Unused imports
echo -e "${BLUE}2️⃣  Checking for unused imports...${NC}"
echo ""

UNUSED_IMPORTS=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -name "*.test.ts" | \
  xargs grep "import.*from" 2>/dev/null | \
  grep -c "// @ts-ignore\|// eslint-disable" 2>/dev/null || echo "0")

if [ "$UNUSED_IMPORTS" -lt 5 ]; then
  echo -e "${GREEN}✓ Minimal suppressed import warnings${NC}"
else
  echo -e "${YELLOW}⚠ Found $UNUSED_IMPORTS suppressed import warnings${NC}"
  echo "  Check if these imports are actually needed"
fi

echo ""

# Check 3: Empty files
echo -e "${BLUE}3️⃣  Checking for empty/skeleton files...${NC}"
echo ""

EMPTY_FILES=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -name "*.test.ts" | \
  xargs wc -l 2>/dev/null | \
  awk '$1 < 5 && $2 !~ /index\.ts/ {print $2}' | wc -l | tr -d ' ')

if [ "$EMPTY_FILES" -eq 0 ]; then
  echo -e "${GREEN}✓ No empty files found${NC}"
else
  echo -e "${YELLOW}⚠ Found $EMPTY_FILES nearly empty files${NC}"
  find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" -not -name "*.test.ts" | \
    xargs wc -l 2>/dev/null | \
    awk '$1 < 5 && $2 !~ /index\.ts/ {print "  " $2}' | head -5
  echo "  Consider removing or completing them"
  ((DEAD_CODE_COUNT+=$EMPTY_FILES))
fi

echo ""

# Check 4: Commented out code
echo -e "${BLUE}4️⃣  Checking for commented out code...${NC}"
echo ""

COMMENTED_CODE=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" | \
  xargs grep -E "^\s*//\s*(const|function|export|import|if|for|while)" 2>/dev/null | \
  wc -l | tr -d ' ')

if [ "$COMMENTED_CODE" -lt 10 ]; then
  echo -e "${GREEN}✓ Minimal commented code ($COMMENTED_CODE lines)${NC}"
else
  echo -e "${YELLOW}⚠ Found $COMMENTED_CODE lines of commented code${NC}"
  echo "  Remove dead code or use version control"
fi

echo ""

# Check 5: Unused CSS classes
echo -e "${BLUE}5️⃣  Checking for potentially unused CSS classes...${NC}"
echo ""

# Find CSS classes defined but potentially not used
CSS_CLASSES=$(find apps/admin packages -name "*.module.css" \
  -not -path "*/node_modules/*" | \
  xargs grep -h "^\." 2>/dev/null | \
  sed 's/\.//g' | sed 's/ .*//' | sed 's/{.*//' | sort -u)

UNUSED_CSS=0
for class in $CSS_CLASSES; do
  USAGE=$(find apps/admin app -type f -name "*.tsx" | \
    xargs grep -l "styles\.$class\|className.*$class" 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$USAGE" -eq 0 ]; then
    ((UNUSED_CSS++))
  fi
done

if [ "$UNUSED_CSS" -lt 10 ]; then
  echo -e "${GREEN}✓ Most CSS classes are used ($UNUSED_CSS unused)${NC}"
else
  echo -e "${YELLOW}⚠ Found $UNUSED_CSS potentially unused CSS classes${NC}"
  echo "  Review CSS modules for cleanup"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📊 DEAD CODE SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Unused exports:      $UNUSED_EXPORTS"
echo "  Empty files:         $EMPTY_FILES"
echo "  Commented code:      $COMMENTED_CODE lines"
echo "  Unused CSS classes:  $UNUSED_CSS"
echo "  Total issues:        $DEAD_CODE_COUNT"
echo ""

if [ $DEAD_CODE_COUNT -lt 10 ]; then
  echo -e "${GREEN}✅ MINIMAL DEAD CODE - Excellent!${NC}"
  exit 0
elif [ $DEAD_CODE_COUNT -lt 30 ]; then
  echo -e "${YELLOW}⚠️  SOME DEAD CODE - Consider cleanup${NC}"
  exit 0
else
  echo -e "${RED}⚠️  SIGNIFICANT DEAD CODE - Cleanup recommended${NC}"
  exit 0
fi
