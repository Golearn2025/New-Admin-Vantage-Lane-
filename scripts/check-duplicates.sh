#!/bin/bash

###############################################################################
# CODE DUPLICATION CHECK
# 
# Detects copy-pasted code and similar patterns
# Uses pattern matching for JS/TS/TSX files
###############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 CODE DUPLICATION ANALYSIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

mkdir -p reports

# Check for repeated patterns (simple approach)
echo -e "${BLUE}Scanning for duplicated code patterns...${NC}"
echo ""

# Find files with similar function names
DUPLICATE_FUNCS=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -name "*.test.ts" | \
  xargs grep -h "function \|const.*= \|export function" 2>/dev/null | \
  sort | uniq -c | sort -rn | awk '$1 > 1 {count++} END {print count+0}')

if [ "$DUPLICATE_FUNCS" -lt 5 ]; then
  echo -e "${GREEN}✓ Minimal function duplication detected ($DUPLICATE_FUNCS patterns)${NC}"
else
  echo -e "${YELLOW}⚠ Found $DUPLICATE_FUNCS potentially duplicated function patterns${NC}"
  echo ""
  echo "Top duplicated patterns:"
  find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" -not -name "*.test.ts" | \
    xargs grep -h "function \|const.*= " 2>/dev/null | \
    sed 's/{.*//' | sort | uniq -c | sort -rn | head -5
fi

echo ""

# Check for repeated imports (same imports in many files = candidates for consolidation)
echo -e "${BLUE}Checking for repeated import patterns...${NC}"
echo ""

COMMON_IMPORTS=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -name "*.test.ts" | \
  xargs grep "^import" 2>/dev/null | \
  cut -d: -f2- | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')

if [ "$COMMON_IMPORTS" -gt 20 ]; then
  echo -e "${YELLOW}⚠ Some imports used in $COMMON_IMPORTS+ files${NC}"
  echo "  Consider creating shared barrel exports"
  echo ""
  echo "Most common imports:"
  find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" -not -name "*.test.ts" | \
    xargs grep "^import" 2>/dev/null | \
    cut -d: -f2- | sort | uniq -c | sort -rn | head -5
else
  echo -e "${GREEN}✓ Import patterns are well distributed${NC}"
fi

echo ""

# Check for similar JSX structures (repeated UI patterns)
echo -e "${BLUE}Checking for repeated JSX patterns...${NC}"
echo ""

# Count divs with similar className patterns
REPEATED_CLASSES=$(find apps/admin app -name "*.tsx" \
  -not -path "*/node_modules/*" | \
  xargs grep -h "className=" 2>/dev/null | \
  sed 's/.*className="\([^"]*\)".*/\1/' | \
  sort | uniq -c | sort -rn | awk '$1 > 10 {count++} END {print count+0}')

if [ "$REPEATED_CLASSES" -gt 10 ]; then
  echo -e "${YELLOW}⚠ Found $REPEATED_CLASSES className patterns used 10+ times${NC}"
  echo "  Consider extracting to reusable components"
else
  echo -e "${GREEN}✓ Good component reuse (few repeated patterns)${NC}"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📊 DUPLICATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Function patterns:   $DUPLICATE_FUNCS"
echo "  Common imports:      $COMMON_IMPORTS files"
echo "  Repeated classes:    $REPEATED_CLASSES patterns"
echo ""

TOTAL_ISSUES=$((DUPLICATE_FUNCS + REPEATED_CLASSES))

if [ $TOTAL_ISSUES -lt 20 ]; then
  echo -e "${GREEN}✅ LOW DUPLICATION - Good code reuse!${NC}"
  exit 0
elif [ $TOTAL_ISSUES -lt 50 ]; then
  echo -e "${YELLOW}⚠️  MEDIUM DUPLICATION - Consider refactoring${NC}"
  exit 0
else
  echo -e "${RED}❌ HIGH DUPLICATION - Refactoring recommended${NC}"
  exit 1
fi
