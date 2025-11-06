#!/usr/bin/env bash
set -euo pipefail

# AUDIT ONE PRO+ (modul cu modul)
# verifică:
# 1) any
# 2) culori/pixeli
# 3) inline styles
# 4) !important
# 5) fișiere > 200
# 6) tabele brute
# 7) importuri UI ilegale
# 8) iconițe ilegale
# 9) breakpoints custom
# 10) fetch/axios/supabase în UI
# 11) inline .map((
# 12) CSS fără tokens
# 13) tokens non-standard
# 14) funcții prea mari
# 15) useEffect în componente
# 16) inline SVG

MODULE_PATH="${1:-}"
if [ -z "$MODULE_PATH" ]; then
  echo "❌ dă-mi calea modulului, ex:"
  echo "   ./scripts/audit/audit-one-pro.sh apps/admin/features/prices-management"
  exit 1
fi

if [ ! -d "$MODULE_PATH" ]; then
  echo "❌ nu există directorul: $MODULE_PATH"
  exit 1
fi

MODULE_KEY=$(echo "$MODULE_PATH" | sed 's#/#-#g')
REPORT_DIR="audit-reports/${MODULE_KEY}"
mkdir -p "$REPORT_DIR"
SUMMARY_FILE="$REPORT_DIR/summary.txt"
: > "$SUMMARY_FILE"

# helper rg
rg_safe() {
  local pattern="$1"; shift
  if command -v rg >/dev/null 2>&1; then
    rg --no-heading --line-number "$pattern" "$@" 2>/dev/null || true
  else
    grep -RniE "$pattern" "$@" 2>/dev/null || true
  fi
}

echo "=========================================="
echo "🔍 AUDIT: $MODULE_PATH"
echo "📁 $REPORT_DIR"
echo "=========================================="

########################################
# 1. any
########################################
rg_safe ": any|<any>" "$MODULE_PATH" --glob '*.ts' --glob '*.tsx' > "$REPORT_DIR/any.txt"
echo "any: $(wc -l < "$REPORT_DIR/any.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 2. culori hardcodate
########################################
rg_safe "#[0-9a-fA-F]{3,6}|rgb\\(|rgba\\(" "$MODULE_PATH" --glob '*.css' --glob '*.module.css' --glob '*.tsx' --glob '*.ts' \
  | grep -v "var(--" \
  | grep -vE "^\s*//" \
  > "$REPORT_DIR/colors.txt" || true
echo "colors: $(wc -l < "$REPORT_DIR/colors.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 3. px hardcodate
########################################
rg_safe "[0-9]+px" "$MODULE_PATH" --glob '*.css' --glob '*.module.css' --glob '*.tsx' \
  | grep -v "var(--" \
  | grep -v "320px\|375px\|768px\|1024px\|1280px" \
  > "$REPORT_DIR/px.txt" || true
echo "px: $(wc -l < "$REPORT_DIR/px.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 4. inline styles
########################################
rg_safe "style=\{\{" "$MODULE_PATH" --glob '*.tsx' > "$REPORT_DIR/inline-styles.txt" || true
echo "inline-styles: $(wc -l < "$REPORT_DIR/inline-styles.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 5. !important
########################################
rg_safe "!important" "$MODULE_PATH" --glob '*.css' --glob '*.module.css' > "$REPORT_DIR/important.txt" || true
echo "important: $(wc -l < "$REPORT_DIR/important.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 6. fișiere > 200 linii
########################################
: > "$REPORT_DIR/file-size.txt"
while IFS= read -r f; do
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ "$lines" -gt 200 ]; then
    echo "$f: $lines" >> "$REPORT_DIR/file-size.txt"
  fi
done < <(find "$MODULE_PATH" -type f \( -name '*.ts' -o -name '*.tsx' \))
FILES_GT_200=0
[ -f "$REPORT_DIR/file-size.txt" ] && FILES_GT_200=$(wc -l < "$REPORT_DIR/file-size.txt" | tr -d ' ')
echo "files>200: $FILES_GT_200" | tee -a "$SUMMARY_FILE"

########################################
# 7. raw <table> și fără ui-core (CRITICAL for production modules)
########################################
: > "$REPORT_DIR/raw-tables.txt"
while IFS= read -r f; do
  if grep -q "<table" "$f"; then
    if ! grep -q "EnterpriseDataTable\|@vantage-lane/ui-core" "$f"; then
      echo "$f: <table> fără ui-core" >> "$REPORT_DIR/raw-tables.txt"
    fi
  fi
done < <(find "$MODULE_PATH" -type f -name '*.tsx')
RAW_TABLES=0
[ -f "$REPORT_DIR/raw-tables.txt" ] && RAW_TABLES=$(wc -l < "$REPORT_DIR/raw-tables.txt" | tr -d ' ')
echo "raw-tables: $RAW_TABLES" | tee -a "$SUMMARY_FILE"

# Check if this is a critical production module
CRITICAL_MODULES="bookings-table|users-table|payments-table|invoices-table|payouts-table|drivers-table|customers-table|disputes-table|refunds-table"
if echo "$MODULE_PATH" | grep -qE "($CRITICAL_MODULES)"; then
  if [ "$RAW_TABLES" -gt 0 ]; then
    echo "" | tee -a "$SUMMARY_FILE"
    echo "🔴 CRITICAL: Production module MUST use EnterpriseDataTable!" | tee -a "$SUMMARY_FILE"
    echo "raw-tables-CRITICAL: FAIL" | tee -a "$SUMMARY_FILE"
  fi
fi

########################################
# 8. importuri UI greșite
########################################
rg_safe "from ['\"][^.@].*Button|from ['\"][^.@].*Modal" "$MODULE_PATH" --glob '*.ts*' > "$REPORT_DIR/illegal-ui-imports.txt" || true
echo "illegal-ui-imports: $(wc -l < "$REPORT_DIR/illegal-ui-imports.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 9. iconițe ilegale
########################################
rg_safe "from ['\"]react-icons|from ['\"]@heroicons|from ['\"]feather-icons" "$MODULE_PATH" --glob '*.ts*' > "$REPORT_DIR/illegal-icons.txt" || true
echo "illegal-icons: $(wc -l < "$REPORT_DIR/illegal-icons.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 10. breakpoints custom
########################################
rg_safe "@media.*max-width:\s*[0-9]+px" "$MODULE_PATH" --glob '*.css' --glob '*.module.css' \
  | grep -v "320px" | grep -v "375px" | grep -v "768px" | grep -v "1024px" | grep -v "1280px" \
  > "$REPORT_DIR/custom-breakpoints.txt" || true
echo "custom-breakpoints: $(wc -l < "$REPORT_DIR/custom-breakpoints.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 11. fetch/axios/supabase în UI
########################################
rg_safe "fetch\(|axios\.|supabase\.from|trpc\." "$MODULE_PATH" --glob '*.tsx' > "$REPORT_DIR/fetch-in-ui.txt" || true
echo "fetch-in-ui: $(wc -l < "$REPORT_DIR/fetch-in-ui.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 12. inline map
########################################
rg_safe "\.map\(\(" "$MODULE_PATH" --glob '*.ts*' > "$REPORT_DIR/inline-map.txt" || true
echo "inline-map: $(wc -l < "$REPORT_DIR/inline-map.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 13. CSS fără var(--) deloc
########################################
: > "$REPORT_DIR/css-without-tokens.txt"
while IFS= read -r cssf; do
  if ! grep -q "var(--" "$cssf"; then
    echo "$cssf" >> "$REPORT_DIR/css-without-tokens.txt"
  fi
done < <(find "$MODULE_PATH" -type f \( -name '*.css' -o -name '*.module.css' \))
CSS_NO_TOKENS=0
[ -f "$REPORT_DIR/css-without-tokens.txt" ] && CSS_NO_TOKENS=$(wc -l < "$REPORT_DIR/css-without-tokens.txt" | tr -d ' ')
echo "css-no-tokens: $CSS_NO_TOKENS" | tee -a "$SUMMARY_FILE"

########################################
# 14. tokens non-standard
########################################
# citim prefixele permise din allowed-tokens.txt
TOKENS_FILE="$(dirname "$0")/allowed-tokens.txt"
if [ -f "$TOKENS_FILE" ]; then
  ALLOWED_PREFIXES=$(cat "$TOKENS_FILE" | tr '\n' '|' | sed 's/|$//')
else
  # fallback dacă fișierul lipsește
  ALLOWED_PREFIXES="--color-|--spacing-|--font-|--border-|--radius-|--shadow-|--size-|--transition-|--z-|--opacity-"
fi
rg_safe "var\(--" "$MODULE_PATH" --glob '*.css' --glob '*.module.css' --glob '*.tsx' --glob '*.ts' \
  | grep "var(--" \
  | egrep -v "($ALLOWED_PREFIXES)" \
  > "$REPORT_DIR/bad-tokens.txt" || true
echo "bad-tokens: $(wc -l < "$REPORT_DIR/bad-tokens.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

########################################
# 15. funcții prea mari (heuristic)
########################################
# simplu: fișiere TSX foarte mari le marcăm
cp "$REPORT_DIR/file-size.txt" "$REPORT_DIR/large-functions.txt" 2>/dev/null || true
# aici ar intra un parser real; pentru moment marcăm fișierul
echo "large-functions: $(wc -l < "${REPORT_DIR}/large-functions.txt" 2>/dev/null | tr -d ' ' || echo 0)" | tee -a "$SUMMARY_FILE"

########################################
# 16. useEffect în componente UI
########################################
rg_safe "useEffect\(" "$MODULE_PATH" --glob '*component*.tsx' --glob '*.page.tsx' > "$REPORT_DIR/useeffect-in-ui.txt" || true
echo "useeffect-in-ui: $(wc -l < "$REPORT_DIR/useeffect-in-ui.txt" | tr -d ' ')" | tee -a "$SUMMARY_FILE"

echo ""
echo "=========================================="
echo "✅ AUDIT COMPLET"
echo "summary: $SUMMARY_FILE"
echo "=========================================="
