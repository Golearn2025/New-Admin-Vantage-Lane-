#!/bin/bash
set -e

# Guard script: Prevent logic in app/ routing folder
# All business logic must live in apps/admin/features/**

echo "🛡️  Checking for logic folders in apps/admin/app/..."

if find app -type d \( -name components -o -name hooks -o -name utils -o -name columns -o -name lib -o -name helpers.ts \) 2>/dev/null | grep -q .; then
  echo "❌ ERROR: Logic found in app/**"
  echo "❌ Business logic must be in apps/admin/features/**"
  echo ""
  echo "Found violations:"
  find app -type d \( -name components -o -name hooks -o -name utils -o -name columns \) 2>/dev/null
  echo ""
  echo "Please move logic to apps/admin/features/** and import via @features/*"
  exit 1
fi

echo "✅ No logic folders found in app/ - PASS"
exit 0
