#!/bin/bash

# ===============================
# STRUCTURE + REUSABILITY AUDIT
# ===============================
# Output: full-audit.md
# Usage: bash audit-structure.sh

AUDIT_FILE="full-audit.md"
echo "# 📁 Vantage Lane — Project Structure Audit" > "$AUDIT_FILE"
echo "_Generated on $(date)_" >> "$AUDIT_FILE"

# 1. ROOT STRUCTURE
echo -e "\n## 1. 📂 Root Folders" >> "$AUDIT_FILE"
echo '```txt' >> "$AUDIT_FILE"
find . -maxdepth 1 -type d | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 2. FULL FILE TREE
echo -e "\n## 2. 🌳 Full File Tree (src only)" >> "$AUDIT_FILE"
echo '```txt' >> "$AUDIT_FILE"
tree -a -I "node_modules|.git|dist|build|.next|storybook-static|.turbo|.vscode|public" -L 6 >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 3. PAGES + ROUTES
echo -e "\n## 3. 🧭 App Router Structure (/app/*)" >> "$AUDIT_FILE"
echo '```ts' >> "$AUDIT_FILE"
find ./apps -type f \( -name "page.tsx" -o -name "layout.tsx" \) | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 4. FEATURES STRUCTURE
echo -e "\n## 4. 🧩 Feature Folders (apps/*/features/*)" >> "$AUDIT_FILE"
echo '```txt' >> "$AUDIT_FILE"
find ./apps -type d -path "*/features/*" -maxdepth 3 | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 5. COMPONENTS STRUCTURE
echo -e "\n## 5. 🧱 UI Components (apps/*/components/* + packages/ui-core/*)" >> "$AUDIT_FILE"
echo '```ts' >> "$AUDIT_FILE"
find ./apps -type d -path "*/components/*" -o -path "./packages/ui-core/src/*" | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 6. HOOKS STRUCTURE
echo -e "\n## 6. 🪝 Custom Hooks (apps/*/hooks/*)" >> "$AUDIT_FILE"
echo '```ts' >> "$AUDIT_FILE"
find ./apps -type d -path "*/hooks/*" | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 7. SHARED LIBS / UTILS
echo -e "\n## 7. 🧠 Shared Logic (lib / utils / shared)" >> "$AUDIT_FILE"
echo '```ts' >> "$AUDIT_FILE"
find . -type d -regex ".*\/(lib|utils|shared).*" | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 8. TOKENS / DESIGN SYSTEM
echo -e "\n## 8. 🎨 Design Tokens (packages/ui-core/src/tokens)" >> "$AUDIT_FILE"
echo '```css' >> "$AUDIT_FILE"
find ./packages/ui-core/src/tokens -name "*.css" | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# 9. REUSABLE vs NON-REUSABLE HEURISTICS
echo -e "\n## 9. 🧩 Reusability Audit" >> "$AUDIT_FILE"
echo '```ts' >> "$AUDIT_FILE"
echo "🔁 Reusable (hooks, components, shared, ui-core, lib, utils):" >> "$AUDIT_FILE"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  | grep -E '/(hooks|components|shared|ui-core|ui|lib|utils)/' \
  | grep -vE 'node_modules|.next|.git|dist|build|public|storybook-static' \
  | sort >> "$AUDIT_FILE"
echo -e "\n⛔️ Potential NON-reusable (page-bound logic/UI):" >> "$AUDIT_FILE"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  | grep -E '/(pages|features)/' \
  | grep -vE '/(hooks|components|shared|ui-core|ui|lib|utils)/' \
  | grep -vE 'node_modules|.next|.git|dist|build|public|storybook-static' \
  | sort >> "$AUDIT_FILE"
echo '```' >> "$AUDIT_FILE"

# DONE
echo -e "\n✅ Audit complet. Vezi: $AUDIT_FILE"
