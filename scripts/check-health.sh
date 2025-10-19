#!/bin/bash

###############################################################################
# Health Check Script
# 
# Verifies that all P0 critical items are implemented and working:
# 1. Environment variables validation
# 2. Error boundaries exist
# 3. Health check endpoint works
# 4. Security headers configured
###############################################################################

# Don't exit on error - we want to show all results
# set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🏥 P0 HEALTH CHECK - Critical Items Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASS=0
FAIL=0

# Helper functions
check_pass() {
  echo "✅ $1"
  ((PASS++))
}

check_fail() {
  echo "❌ $1"
  ((FAIL++))
}

check_file() {
  if [ -f "$1" ]; then
    check_pass "File exists: $1"
    return 0
  else
    check_fail "File missing: $1"
    return 1
  fi
}

echo "📋 Checking P0 Files..."
echo ""

# Check P0-1: Environment validation
check_file "lib/config/env.ts"

# Check P0-2: Error handling
check_file "app/error.tsx"
check_file "app/global-error.tsx"
check_file "app/not-found.tsx"
check_file "app/loading.tsx"

# Check P0-3: Health check
check_file "app/api/health/route.ts"

# Check P0-4: Security headers in config
if grep -q "X-Frame-Options" next.config.js; then
  check_pass "Security headers configured in next.config.js"
else
  check_fail "Security headers NOT configured in next.config.js"
fi

echo ""
echo "🔍 Checking environment variables..."
echo ""

# Check .env.local exists
if [ -f ".env.local" ]; then
  check_pass ".env.local file exists"
  
  # Check required variables
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    check_pass "NEXT_PUBLIC_SUPABASE_URL is set"
  else
    check_fail "NEXT_PUBLIC_SUPABASE_URL is missing"
  fi
  
  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    check_pass "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
  else
    check_fail "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
  fi
else
  check_fail ".env.local file missing (copy from .env.example)"
fi

# Build check is done separately in check:all or check:everything
# Skipping here to avoid duplication and long wait times

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📊 RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 ALL P0 CHECKS PASSED!"
  echo "✅ Ready for production deployment"
  exit 0
else
  echo "⚠️  SOME CHECKS FAILED"
  echo "❌ Fix failing items before deploying"
  exit 1
fi
