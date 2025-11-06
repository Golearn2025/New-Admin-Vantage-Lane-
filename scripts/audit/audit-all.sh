#!/usr/bin/env bash
set -euo pipefail

# ================================
# VANTAGE LANE - AUDIT ALL
# Orchestrator pentru toate modulele
# ================================

# Culori pentru output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Lista modulelor din apps/admin/features
MODULES=(
  "apps/admin/features/admins-table"
  "apps/admin/features/auth-forgot-password"
  "apps/admin/features/auth-login"
  "apps/admin/features/booking-create"
  "apps/admin/features/bookings-table"
  "apps/admin/features/customers-table"
  "apps/admin/features/dashboard"
  "apps/admin/features/dashboard-metrics"
  "apps/admin/features/disputes-table"
  "apps/admin/features/document-viewer"
  "apps/admin/features/documents-approval"
  "apps/admin/features/driver-verification"
  "apps/admin/features/drivers-pending"
  "apps/admin/features/drivers-table"
  "apps/admin/features/invoices-table"
  "apps/admin/features/notification-center"
  "apps/admin/features/notifications-management"
  "apps/admin/features/operator-dashboard"
  "apps/admin/features/operator-drivers-list"
  "apps/admin/features/operators-table"
  "apps/admin/features/payments-overview"
  "apps/admin/features/payments-table"
  "apps/admin/features/payouts-table"
  "apps/admin/features/prices-management"
  "apps/admin/features/refunds-table"
  "apps/admin/features/settings-commissions"
  "apps/admin/features/settings-permissions"
  "apps/admin/features/settings-profile"
  "apps/admin/features/settings-vehicle-categories"
  "apps/admin/features/user-create-modal"
  "apps/admin/features/user-edit-modal"
  "apps/admin/features/user-profile"
  "apps/admin/features/user-view-modal"
  "apps/admin/features/users-table"
  "apps/admin/features/users-table-base"
)

# Opțiuni
RUN_QUALITY=true
RUN_PERFORMANCE=true

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --quality-only)
      RUN_QUALITY=true
      RUN_PERFORMANCE=false
      shift
      ;;
    --performance-only)
      RUN_QUALITY=false
      RUN_PERFORMANCE=true
      shift
      ;;
    --full)
      RUN_QUALITY=true
      RUN_PERFORMANCE=true
      shift
      ;;
    --help)
      echo "Usage: ./scripts/audit/audit-all.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  (default)           Rulează doar quality check pe toate modulele"
      echo "  --quality-only      Rulează doar quality check (default)"
      echo "  --performance-only  Rulează doar performance check"
      echo "  --full              Rulează ambele: quality + performance"
      echo "  --help              Arată acest mesaj"
      exit 0
      ;;
    *)
      echo "Opțiune necunoscută: $1"
      echo "Folosește --help pentru ajutor"
      exit 1
      ;;
  esac
done

TOTAL_MODULES=${#MODULES[@]}
CURRENT=0

echo "=========================================="
echo "🔍 AUDIT ALL - VANTAGE LANE"
echo "=========================================="
echo "📦 Module: $TOTAL_MODULES"
echo "🎯 Quality: $RUN_QUALITY"
echo "⚡ Performance: $RUN_PERFORMANCE"
echo "=========================================="
echo ""

# Summary results
QUALITY_RESULTS_DIR="audit-reports/all-modules-quality"
PERFORMANCE_RESULTS_DIR="audit-reports/all-modules-performance"
mkdir -p "$QUALITY_RESULTS_DIR"
mkdir -p "$PERFORMANCE_RESULTS_DIR"

QUALITY_SUMMARY="$QUALITY_RESULTS_DIR/summary.txt"
PERFORMANCE_SUMMARY="$PERFORMANCE_RESULTS_DIR/summary.txt"
: > "$QUALITY_SUMMARY"
: > "$PERFORMANCE_SUMMARY"

# Loop prin toate modulele
for MODULE in "${MODULES[@]}"; do
  CURRENT=$((CURRENT + 1))
  MODULE_NAME=$(basename "$MODULE")
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE}[$CURRENT/$TOTAL_MODULES]${NC} 📦 $MODULE_NAME"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # QUALITY CHECK
  if [ "$RUN_QUALITY" = true ]; then
    echo -e "${YELLOW}🎯 Quality check...${NC}"
    ./scripts/audit/audit-one-pro.sh "$MODULE" > /dev/null 2>&1 || true
    
    # Read results
    REPORT_DIR="audit-reports/$(echo "$MODULE" | sed 's#/#-#g')"
    if [ -f "$REPORT_DIR/summary.txt" ]; then
      TOTAL_ISSUES=$(awk '{sum+=$2} END {print sum}' "$REPORT_DIR/summary.txt" 2>/dev/null || echo "0")
      
      if [ "$TOTAL_ISSUES" -eq 0 ]; then
        echo -e "   ${GREEN}✅ CLEAN (0 issues)${NC}"
        echo "$MODULE_NAME: 0 issues ✅" >> "$QUALITY_SUMMARY"
      elif [ "$TOTAL_ISSUES" -le 10 ]; then
        echo -e "   ${YELLOW}⚠️  MINOR ($TOTAL_ISSUES issues)${NC}"
        echo "$MODULE_NAME: $TOTAL_ISSUES issues ⚠️" >> "$QUALITY_SUMMARY"
      elif [ "$TOTAL_ISSUES" -le 30 ]; then
        echo -e "   ${RED}🔴 NEEDS FIX ($TOTAL_ISSUES issues)${NC}"
        echo "$MODULE_NAME: $TOTAL_ISSUES issues 🔴" >> "$QUALITY_SUMMARY"
      else
        echo -e "   ${RED}💀 CRITICAL ($TOTAL_ISSUES issues)${NC}"
        echo "$MODULE_NAME: $TOTAL_ISSUES issues 💀" >> "$QUALITY_SUMMARY"
      fi
    fi
  fi
  
  # PERFORMANCE CHECK
  if [ "$RUN_PERFORMANCE" = true ]; then
    echo -e "${YELLOW}⚡ Performance check...${NC}"
    ./scripts/audit/audit-performance.sh "$MODULE" > /dev/null 2>&1 || true
    
    # Read results
    PERF_REPORT_DIR="audit-reports/$(echo "$MODULE" | sed 's#/#-#g')/performance"
    if [ -f "$PERF_REPORT_DIR/summary.txt" ]; then
      PERF_TOTAL=$(awk '{sum+=$2} END {print sum}' "$PERF_REPORT_DIR/summary.txt" 2>/dev/null || echo "0")
      
      if [ "$PERF_TOTAL" -eq 0 ]; then
        echo -e "   ${GREEN}🎉 EXCELLENT (0 issues)${NC}"
        echo "$MODULE_NAME: 0 issues 🎉" >> "$PERFORMANCE_SUMMARY"
      elif [ "$PERF_TOTAL" -le 10 ]; then
        echo -e "   ${GREEN}✅ GOOD ($PERF_TOTAL issues)${NC}"
        echo "$MODULE_NAME: $PERF_TOTAL issues ✅" >> "$PERFORMANCE_SUMMARY"
      elif [ "$PERF_TOTAL" -le 30 ]; then
        echo -e "   ${YELLOW}⚠️  NEEDS OPTIMIZATION ($PERF_TOTAL issues)${NC}"
        echo "$MODULE_NAME: $PERF_TOTAL issues ⚠️" >> "$PERFORMANCE_SUMMARY"
      else
        echo -e "   ${RED}🔴 CRITICAL ($PERF_TOTAL issues)${NC}"
        echo "$MODULE_NAME: $PERF_TOTAL issues 🔴" >> "$PERFORMANCE_SUMMARY"
      fi
    fi
  fi
done

echo ""
echo ""
echo "=========================================="
echo "✅ AUDIT COMPLET - TOATE MODULELE"
echo "=========================================="
echo ""

# QUALITY SUMMARY
if [ "$RUN_QUALITY" = true ]; then
  echo "📊 QUALITY SUMMARY:"
  echo ""
  
  CLEAN_COUNT=$(grep -c "✅" "$QUALITY_SUMMARY" 2>/dev/null || echo "0")
  MINOR_COUNT=$(grep -c "⚠️" "$QUALITY_SUMMARY" 2>/dev/null || echo "0")
  NEEDS_FIX_COUNT=$(grep -c "🔴" "$QUALITY_SUMMARY" 2>/dev/null || echo "0")
  CRITICAL_COUNT=$(grep -c "💀" "$QUALITY_SUMMARY" 2>/dev/null || echo "0")
  
  echo -e "   ${GREEN}✅ CLEAN: $CLEAN_COUNT modules${NC}"
  echo -e "   ${YELLOW}⚠️  MINOR: $MINOR_COUNT modules${NC}"
  echo -e "   ${RED}🔴 NEEDS FIX: $NEEDS_FIX_COUNT modules${NC}"
  echo -e "   ${RED}💀 CRITICAL: $CRITICAL_COUNT modules${NC}"
  echo ""
  echo "📄 Raport complet: $QUALITY_SUMMARY"
  echo ""
fi

# PERFORMANCE SUMMARY
if [ "$RUN_PERFORMANCE" = true ]; then
  echo "⚡ PERFORMANCE SUMMARY:"
  echo ""
  
  EXCELLENT_COUNT=$(grep -c "🎉" "$PERFORMANCE_SUMMARY" 2>/dev/null || echo "0")
  GOOD_COUNT=$(grep -c "✅" "$PERFORMANCE_SUMMARY" 2>/dev/null || echo "0")
  NEEDS_OPT_COUNT=$(grep -c "⚠️" "$PERFORMANCE_SUMMARY" 2>/dev/null || echo "0")
  PERF_CRITICAL_COUNT=$(grep -c "🔴" "$PERFORMANCE_SUMMARY" 2>/dev/null || echo "0")
  
  echo -e "   ${GREEN}🎉 EXCELLENT: $EXCELLENT_COUNT modules${NC}"
  echo -e "   ${GREEN}✅ GOOD: $GOOD_COUNT modules${NC}"
  echo -e "   ${YELLOW}⚠️  NEEDS OPT: $NEEDS_OPT_COUNT modules${NC}"
  echo -e "   ${RED}🔴 CRITICAL: $PERF_CRITICAL_COUNT modules${NC}"
  echo ""
  echo "📄 Raport complet: $PERFORMANCE_SUMMARY"
  echo ""
fi

echo "=========================================="
echo "🎉 GATA!"
echo "=========================================="
echo ""
