#!/usr/bin/env bash
set -euo pipefail

# ================================
# VANTAGE LANE - AUDIT PERFORMANCE
# Performance & Optimization Checks
# ================================

MODULE_PATH="${1:-}"
if [ -z "$MODULE_PATH" ]; then
  echo "❌ Dă-mi modulul!"
  echo ""
  echo "Exemple:"
  echo "  ./scripts/audit/audit-performance.sh apps/admin/features/auth-login"
  echo "  ./scripts/audit/audit-performance.sh apps/admin/features/prices-management"
  exit 1
fi

if [ ! -d "$MODULE_PATH" ]; then
  echo "❌ Modulul nu există: $MODULE_PATH"
  exit 1
fi

MODULE_NAME=$(echo "$MODULE_PATH" | sed 's#/#-#g')
REPORT_DIR="audit-reports/${MODULE_NAME}/performance"
mkdir -p "$REPORT_DIR"
SUMMARY_FILE="$REPORT_DIR/summary.txt"
: > "$SUMMARY_FILE"

# Helper: ripgrep cu fallback la grep
rg_safe() {
  local pattern="$1"; shift
  if command -v rg >/dev/null 2>&1; then
    rg --no-heading --line-number "$pattern" "$@" 2>/dev/null || true
  else
    grep -RniE "$pattern" "$@" 2>/dev/null || true
  fi
}

echo "=========================================="
echo "⚡ PERFORMANCE AUDIT: $MODULE_PATH"
echo "📁 Output: $REPORT_DIR"
echo "=========================================="
echo ""

# 1. MISSING useCallback (functions passed as props)
echo "[1/8] Checking useCallback usage..."
: > "$REPORT_DIR/missing-useCallback.txt"
# Find functions passed as props without useCallback
rg_safe "const\s+\w+\s*=\s*\([^)]*\)\s*=>" "$MODULE_PATH" --glob '*.tsx' --glob '*.ts' \
  | grep -v "useCallback" \
  | grep -v "// perf:" \
  > "$REPORT_DIR/missing-useCallback.txt" || true
CALLBACK_COUNT=$(wc -l < "$REPORT_DIR/missing-useCallback.txt" | tr -d ' ')
echo "missing-useCallback: $CALLBACK_COUNT" | tee -a "$SUMMARY_FILE"

# 2. MISSING useMemo (expensive calculations)
echo "[2/8] Checking useMemo usage..."
: > "$REPORT_DIR/missing-useMemo.txt"
# Find array/object computations without useMemo
rg_safe "const\s+\w+\s*=\s*(\[|\{|\.filter\(|\.map\(|\.reduce\()" "$MODULE_PATH" --glob '*.tsx' --glob '*.ts' \
  | grep -v "useMemo" \
  | grep -v "useState" \
  | grep -v "// perf:" \
  > "$REPORT_DIR/missing-useMemo.txt" || true
MEMO_COUNT=$(wc -l < "$REPORT_DIR/missing-useMemo.txt" | tr -d ' ')
echo "missing-useMemo: $MEMO_COUNT" | tee -a "$SUMMARY_FILE"

# 3. MISSING React.memo (component optimization)
echo "[3/8] Checking React.memo usage..."
: > "$REPORT_DIR/missing-react-memo.txt"
# Find exported components without React.memo
rg_safe "^export (const|function)\s+\w+" "$MODULE_PATH" --glob '*.tsx' \
  | grep -v "React.memo" \
  | grep -v "export default" \
  | grep -v "export type" \
  | grep -v "export interface" \
  > "$REPORT_DIR/missing-react-memo.txt" || true
REACT_MEMO_COUNT=$(wc -l < "$REPORT_DIR/missing-react-memo.txt" | tr -d ' ')
echo "missing-react-memo: $REACT_MEMO_COUNT" | tee -a "$SUMMARY_FILE"

# 4. HEAVY IMPORTS (lodash, moment full)
echo "[4/8] Checking heavy imports..."
: > "$REPORT_DIR/heavy-imports.txt"
# Detect full lodash/moment imports
rg_safe "import .* from ['\"]lodash['\"]|import .* from ['\"]moment['\"]" "$MODULE_PATH" --glob '*.ts*' \
  > "$REPORT_DIR/heavy-imports.txt" || true
HEAVY_COUNT=$(wc -l < "$REPORT_DIR/heavy-imports.txt" | tr -d ' ')
echo "heavy-imports: $HEAVY_COUNT" | tee -a "$SUMMARY_FILE"

# 5. CONSOLE.LOG in production
echo "[5/8] Checking console.log..."
: > "$REPORT_DIR/console-log.txt"
rg_safe "console\.(log|warn|error|debug|info)" "$MODULE_PATH" --glob '*.ts*' \
  | grep -v "// debug" \
  | grep -v "// TODO" \
  > "$REPORT_DIR/console-log.txt" || true
CONSOLE_COUNT=$(wc -l < "$REPORT_DIR/console-log.txt" | tr -d ' ')
echo "console-log: $CONSOLE_COUNT" | tee -a "$SUMMARY_FILE"

# 6. IMG TAG instead of Next Image
echo "[6/8] Checking <img> usage..."
: > "$REPORT_DIR/img-tag.txt"
rg_safe "<img\s" "$MODULE_PATH" --glob '*.tsx' \
  > "$REPORT_DIR/img-tag.txt" || true
IMG_COUNT=$(wc -l < "$REPORT_DIR/img-tag.txt" | tr -d ' ')
echo "img-tag: $IMG_COUNT" | tee -a "$SUMMARY_FILE"

# 7. MISSING KEY in .map()
echo "[7/8] Checking missing keys in .map()..."
: > "$REPORT_DIR/missing-keys.txt"
# Find .map() without key prop (heuristic)
rg_safe "\.map\(\(" "$MODULE_PATH" --glob '*.tsx' -A 3 \
  | grep -v "key=" \
  | grep "\.map" \
  > "$REPORT_DIR/missing-keys.txt" || true
KEY_COUNT=$(wc -l < "$REPORT_DIR/missing-keys.txt" | tr -d ' ')
echo "missing-keys: $KEY_COUNT" | tee -a "$SUMMARY_FILE"

# 8. UNUSED IMPORTS (improved detection)
echo "[8/8] Checking unused imports..."
: > "$REPORT_DIR/unused-imports.txt"
# Find imports that might be unused (heuristic)
while IFS= read -r file; do
  if [ -f "$file" ]; then
    # Extract all imports
    imports=$(grep -E "^import.*from" "$file" 2>/dev/null || true)
    if [ -n "$imports" ]; then
      while IFS= read -r import_line; do
        # Skip type-only imports (import { type Foo })
        if echo "$import_line" | grep -q "import[[:space:]]*{[[:space:]]*type[[:space:]]"; then
          continue
        fi
        
        # Extract imported name (simple heuristic)
        imported=$(echo "$import_line" | sed -n "s/.*import[[:space:]]*{\([^}]*\)}.*/\1/p" | tr ',' '\n' | xargs)
        if [ -n "$imported" ]; then
          for item in $imported; do
            # Skip TypeScript 'type' keyword
            if [ "$item" = "type" ]; then
              continue
            fi
            
            # Check if item is used in file (excluding import line)
            usage=$(grep -c "\b$item\b" "$file" 2>/dev/null || echo "0")
            if [ "$usage" -le 1 ]; then
              echo "$file: potentially unused import '$item'" >> "$REPORT_DIR/unused-imports.txt"
            fi
          done
        fi
      done <<< "$imports"
    fi
  fi
done < <(find "$MODULE_PATH" -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | head -20)
UNUSED_COUNT=0
[ -f "$REPORT_DIR/unused-imports.txt" ] && UNUSED_COUNT=$(wc -l < "$REPORT_DIR/unused-imports.txt" | tr -d ' ')
echo "unused-imports: $UNUSED_COUNT" | tee -a "$SUMMARY_FILE"

echo ""
echo "=========================================="
echo "✅ PERFORMANCE AUDIT COMPLET!"
echo "=========================================="
echo ""
cat "$SUMMARY_FILE"
echo ""

# Performance score calculation
TOTAL_ISSUES=$((CALLBACK_COUNT + MEMO_COUNT + REACT_MEMO_COUNT + HEAVY_COUNT + CONSOLE_COUNT + IMG_COUNT + KEY_COUNT + UNUSED_COUNT))

echo "📊 PERFORMANCE SCORE:"
if [ "$TOTAL_ISSUES" -eq 0 ]; then
  echo "   🎉 EXCELLENT! (0 issues)"
elif [ "$TOTAL_ISSUES" -le 10 ]; then
  echo "   ✅ GOOD ($TOTAL_ISSUES issues)"
elif [ "$TOTAL_ISSUES" -le 30 ]; then
  echo "   ⚠️  NEEDS OPTIMIZATION ($TOTAL_ISSUES issues)"
else
  echo "   🔴 CRITICAL ($TOTAL_ISSUES issues)"
fi
echo ""

echo "📁 Rapoarte detaliate: $REPORT_DIR"
echo "📄 Summary: $REPORT_DIR/summary.txt"
echo ""
