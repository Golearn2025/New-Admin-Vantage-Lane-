#!/bin/bash

###############################################################################
# PERFORMANCE & REUSABILITY ANALYSIS
# 
# Checks:
# 1. Bundle size analysis
# 2. Component reusability
# 3. Import efficiency
# 4. Performance anti-patterns
###############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⚡ PERFORMANCE & REUSABILITY ANALYSIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

mkdir -p reports

# Check 1: Large files (potential performance issue)
echo -e "${BLUE}1️⃣  Checking file sizes...${NC}"
echo ""

LARGE_FILES=$(find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" | \
  xargs wc -l 2>/dev/null | \
  awk '$1 > 300 {print $1 " lines: " $2}' | wc -l | tr -d ' ')

if [ "$LARGE_FILES" -eq 0 ]; then
  echo -e "${GREEN}✓ All files under 300 lines${NC}"
elif [ "$LARGE_FILES" -lt 5 ]; then
  echo -e "${YELLOW}⚠ $LARGE_FILES files over 300 lines${NC}"
  find apps/admin app -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" | \
    xargs wc -l 2>/dev/null | \
    awk '$1 > 300 {print "  " $1 " lines: " $2}' | head -3
  echo "  Consider splitting large files"
else
  echo -e "${RED}✗ $LARGE_FILES files over 300 lines${NC}"
  echo "  Large files impact build performance"
fi

echo ""

# Check 2: Component reusability
echo -e "${BLUE}2️⃣  Analyzing component reusability...${NC}"
echo ""

# Count components in ui-core (reusable)
REUSABLE_COMPONENTS=$(find packages/ui-core/src -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')

# Count components in apps (specific)
APP_COMPONENTS=$(find apps/admin -name "*.tsx" -not -path "*/node_modules/*" 2>/dev/null | wc -l | tr -d ' ')

if [ "$REUSABLE_COMPONENTS" -gt 0 ]; then
  REUSABILITY_RATIO=$((REUSABLE_COMPONENTS * 100 / (REUSABLE_COMPONENTS + APP_COMPONENTS)))
  echo "  Reusable components: $REUSABLE_COMPONENTS"
  echo "  App-specific components: $APP_COMPONENTS"
  echo "  Reusability ratio: ${REUSABILITY_RATIO}%"
  echo ""
  
  if [ "$REUSABILITY_RATIO" -gt 30 ]; then
    echo -e "${GREEN}✓ Excellent reusability (${REUSABILITY_RATIO}%)${NC}"
  elif [ "$REUSABILITY_RATIO" -gt 20 ]; then
    echo -e "${YELLOW}⚠ Good reusability (${REUSABILITY_RATIO}%)${NC}"
  else
    echo -e "${YELLOW}⚠ Consider extracting more reusable components${NC}"
  fi
else
  echo -e "${YELLOW}⚠ No reusable components directory found${NC}"
fi

echo ""

# Check 3: Import efficiency
echo -e "${BLUE}3️⃣  Checking import patterns...${NC}"
echo ""

# Count barrel imports (good)
BARREL_IMPORTS=$(find apps/admin app -type f -name "*.tsx" -o -name "*.ts" | \
  xargs grep -h "from '@" 2>/dev/null | wc -l | tr -d ' ')

# Count relative imports (less ideal)
RELATIVE_IMPORTS=$(find apps/admin app -type f -name "*.tsx" -o -name "*.ts" | \
  xargs grep -h "from '\\.\\." 2>/dev/null | wc -l | tr -d ' ')

if [ "$BARREL_IMPORTS" -gt "$RELATIVE_IMPORTS" ]; then
  echo -e "${GREEN}✓ Good use of barrel imports${NC}"
  echo "  Barrel imports: $BARREL_IMPORTS"
  echo "  Relative imports: $RELATIVE_IMPORTS"
else
  echo -e "${YELLOW}⚠ Many relative imports detected${NC}"
  echo "  Barrel imports: $BARREL_IMPORTS"
  echo "  Relative imports: $RELATIVE_IMPORTS"
  echo "  Consider using path aliases"
fi

echo ""

# Check 4: Performance anti-patterns
echo -e "${BLUE}4️⃣  Checking for performance anti-patterns...${NC}"
echo ""

# Check for inline functions in JSX (re-renders)
INLINE_FUNCTIONS=$(find apps/admin app -name "*.tsx" -not -path "*/node_modules/*" | \
  xargs grep -E "onClick=\{.*=>|onChange=\{.*=>" 2>/dev/null | wc -l | tr -d ' ')

if [ "$INLINE_FUNCTIONS" -lt 50 ]; then
  echo -e "${GREEN}✓ Minimal inline functions ($INLINE_FUNCTIONS)${NC}"
elif [ "$INLINE_FUNCTIONS" -lt 100 ]; then
  echo -e "${YELLOW}⚠ Some inline functions ($INLINE_FUNCTIONS)${NC}"
  echo "  Consider useCallback for optimization"
else
  echo -e "${RED}⚠ Many inline functions ($INLINE_FUNCTIONS)${NC}"
  echo "  May cause unnecessary re-renders"
fi

echo ""

# Check for large useEffect dependencies
echo -e "${BLUE}5️⃣  Checking React patterns...${NC}"
echo ""

COMPLEX_EFFECTS=$(find apps/admin app -name "*.tsx" -not -path "*/node_modules/*" | \
  xargs grep -A 1 "useEffect" 2>/dev/null | \
  grep "\[.*,.*,.*,.*\]" | wc -l | tr -d ' ')

if [ "$COMPLEX_EFFECTS" -lt 5 ]; then
  echo -e "${GREEN}✓ Simple useEffect dependencies${NC}"
else
  echo -e "${YELLOW}⚠ Found $COMPLEX_EFFECTS useEffect with many dependencies${NC}"
  echo "  Consider splitting into smaller effects"
fi

echo ""

# Check 6: Design tokens usage
echo -e "${BLUE}6️⃣  Checking design tokens usage...${NC}"
echo ""

# Count CSS modules using tokens
CSS_WITH_TOKENS=$(find apps/admin packages -name "*.module.css" \
  -not -path "*/node_modules/*" | \
  xargs grep -l "var(--" 2>/dev/null | wc -l | tr -d ' ')

TOTAL_CSS=$(find apps/admin packages -name "*.module.css" \
  -not -path "*/node_modules/*" 2>/dev/null | wc -l | tr -d ' ')

if [ "$TOTAL_CSS" -gt 0 ]; then
  TOKEN_USAGE=$((CSS_WITH_TOKENS * 100 / TOTAL_CSS))
  echo "  CSS files using tokens: $CSS_WITH_TOKENS/$TOTAL_CSS (${TOKEN_USAGE}%)"
  
  if [ "$TOKEN_USAGE" -gt 80 ]; then
    echo -e "${GREEN}✓ Excellent design token usage (${TOKEN_USAGE}%)${NC}"
  elif [ "$TOKEN_USAGE" -gt 50 ]; then
    echo -e "${YELLOW}⚠ Good token usage (${TOKEN_USAGE}%)${NC}"
  else
    echo -e "${RED}✗ Low token usage (${TOKEN_USAGE}%)${NC}"
    echo "  Use design tokens from packages/ui-core/src/tokens/"
  fi
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📊 PERFORMANCE SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Large files (>300 lines): $LARGE_FILES"
echo "  Inline functions:         $INLINE_FUNCTIONS"
echo "  Complex useEffects:       $COMPLEX_EFFECTS"
if [ "$TOTAL_CSS" -gt 0 ]; then
  echo "  Token usage:              ${TOKEN_USAGE}%"
fi
if [ "$REUSABLE_COMPONENTS" -gt 0 ]; then
  echo "  Reusability ratio:        ${REUSABILITY_RATIO}%"
fi
echo ""

TOTAL_ISSUES=$((LARGE_FILES))

if [ $TOTAL_ISSUES -lt 3 ]; then
  echo -e "${GREEN}✅ EXCELLENT PERFORMANCE & REUSABILITY!${NC}"
  exit 0
elif [ $TOTAL_ISSUES -lt 10 ]; then
  echo -e "${YELLOW}⚠️  GOOD - Minor optimizations possible${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  CONSIDER OPTIMIZATION${NC}"
  exit 0
fi
