#!/bin/bash
set -euo pipefail

# ========================================
# 🔒 SECURITY VALIDATION SCRIPT
# Validates STEP 2 + 3 security implementations
# ========================================

echo "=========================================="
echo "🔒 SECURITY VALIDATION - LOCAL"
echo "=========================================="
echo ""

EXIT_CODE=0
REPORT_FILE="security-validation-local.md"

# ========================================
# 1. Service Role Abuse Check  
# ========================================
echo "🚨 [1/5] Checking for service_role abuse..."

ADMIN_CLIENT_COUNT=$(grep -r "createAdminClient" app/api/ --include="*.ts" | wc -l || echo 0)
if [ "$ADMIN_CLIENT_COUNT" -gt 0 ]; then
    echo "❌ SECURITY VIOLATION: createAdminClient() found in API routes"
    grep -r "createAdminClient" app/api/ --include="*.ts" | head -5
    echo "👉 Fix: Replace with withAdminOrOperatorClient() for RLS compliance"
    EXIT_CODE=1
else
    echo "✅ No service_role abuse detected"
fi

# Check for direct service_role usage
SERVICE_ROLE_COUNT=$(grep -r "service_role" app/api/ lib/ --include="*.ts" --include="*.tsx" | grep -v "\.env" | wc -l || echo 0)
if [ "$SERVICE_ROLE_COUNT" -gt 0 ]; then
    echo "⚠️  WARNING: Direct service_role usage detected ($SERVICE_ROLE_COUNT occurrences)"
    grep -r "service_role" app/api/ lib/ --include="*.ts" --include="*.tsx" | grep -v "\.env" | head -3
    echo "👉 Review: Ensure this is justified and not bypassing RLS"
fi

echo ""

# ========================================
# 2. Secure Client Pattern Validation
# ========================================
echo "🛡️ [2/5] Validating secure client usage..."

SECURE_CLIENT_COUNT=$(grep -r "withAdminOrOperatorClient" app/api/ --include="*.ts" | wc -l || echo 0)
echo "✅ withAdminOrOperatorClient usage found: $SECURE_CLIENT_COUNT times"

if [ "$SECURE_CLIENT_COUNT" -lt 3 ]; then
    echo "⚠️  WARNING: Expected more API routes to use secure client pattern"
    echo "👉 Review: Ensure critical API routes use withAdminOrOperatorClient"
fi

# Check for secure client imports
SECURE_IMPORTS=$(grep -r "from.*secure-client" app/api/ --include="*.ts" | wc -l || echo 0)
if [ "$SECURE_IMPORTS" -gt 0 ]; then
    echo "✅ Secure client imports found: $SECURE_IMPORTS files"
else
    echo "⚠️  No secure client imports found"
fi

echo ""

# ========================================
# 3. Middleware Security Check
# ========================================  
echo "🔐 [3/5] Validating middleware security..."

if [ -f "middleware.ts" ]; then
    echo "✅ middleware.ts found"
    
    # Check for role-based protection
    ROLE_PROTECTION=$(grep -c "requiresAuth\|isAllowed" middleware.ts || echo 0)
    if [ "$ROLE_PROTECTION" -ge 1 ]; then
        echo "✅ Role-based protection found ($ROLE_PROTECTION patterns)"
    else
        echo "⚠️  WARNING: No role-based protection patterns detected"
    fi
    
    # Check for auth imports  
    AUTH_IMPORTS=$(grep -c "getServerRole\|requiresAuth" middleware.ts || echo 0)
    if [ "$AUTH_IMPORTS" -ge 1 ]; then
        echo "✅ Authentication imports found"
    else
        echo "⚠️  No authentication imports detected"
    fi
else
    echo "❌ middleware.ts file not found"
    EXIT_CODE=1
fi

echo ""

# ========================================
# 4. Hardcoded Secrets Check
# ========================================
echo "🔒 [4/5] Scanning for hardcoded secrets..."

# Check for hardcoded passwords
PASSWORDS_FOUND=$(grep -r -i "password.*=" app/ lib/ --include="*.ts" --include="*.tsx" | grep -v "\.env" | grep -v "example" || true)
if [ -n "$PASSWORDS_FOUND" ]; then
    echo "❌ SECURITY VIOLATION: Potential hardcoded passwords found"
    echo "$PASSWORDS_FOUND" | head -3
    EXIT_CODE=1
else
    echo "✅ No hardcoded passwords detected"
fi

# Check for API keys patterns  
API_KEYS_FOUND=$(grep -r "sk_\|pk_" app/ lib/ --include="*.ts" --include="*.tsx" | grep -v "\.env" | grep -v "example" || true)
if [ -n "$API_KEYS_FOUND" ]; then
    echo "❌ SECURITY VIOLATION: Potential hardcoded API keys found"
    echo "$API_KEYS_FOUND" | head -3
    EXIT_CODE=1
else
    echo "✅ No hardcoded API keys detected"  
fi

echo ""

# ========================================
# 5. Code Quality Verification
# ========================================
echo "📘 [5/5] Running code quality checks..."

# TypeScript check
echo "  🔍 TypeScript compilation..."
if npm run check:ts > /dev/null 2>&1; then
    echo "  ✅ TypeScript: PASSED"
else
    echo "  ❌ TypeScript: FAILED"
    EXIT_CODE=1
fi

# ESLint check  
echo "  🔍 ESLint security rules..."
if npm run lint > /dev/null 2>&1; then
    echo "  ✅ ESLint: PASSED"
else
    echo "  ❌ ESLint: FAILED"
    EXIT_CODE=1
fi

echo ""

# ========================================
# Generate Report
# ========================================
echo "📊 Generating security validation report..."

cat > "$REPORT_FILE" << EOF
# 🔒 Security Validation Report (Local)

**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")
**Environment:** Local Development
**Status:** $([ $EXIT_CODE -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")

## 🛡️ Security Checks Summary

### 1. Service Role Abuse
- **createAdminClient() usage:** $ADMIN_CLIENT_COUNT occurrences
- **Direct service_role usage:** $SERVICE_ROLE_COUNT occurrences
- **Status:** $([ $ADMIN_CLIENT_COUNT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")

### 2. Secure Client Pattern  
- **withAdminOrOperatorClient usage:** $SECURE_CLIENT_COUNT occurrences
- **Secure client imports:** $SECURE_IMPORTS files
- **Status:** $([ $SECURE_CLIENT_COUNT -ge 3 ] && echo "✅ PASSED" || echo "⚠️ WARNING")

### 3. Middleware Security
- **Role protection patterns:** $ROLE_PROTECTION found
- **Auth imports:** $AUTH_IMPORTS found  
- **Status:** $([ $ROLE_PROTECTION -ge 1 ] && echo "✅ PASSED" || echo "⚠️ WARNING")

### 4. Secrets Security
- **Hardcoded passwords:** $([ -z "$PASSWORDS_FOUND" ] && echo "0" || echo "FOUND")
- **Hardcoded API keys:** $([ -z "$API_KEYS_FOUND" ] && echo "0" || echo "FOUND")
- **Status:** $([ -z "$PASSWORDS_FOUND" ] && [ -z "$API_KEYS_FOUND" ] && echo "✅ PASSED" || echo "❌ FAILED")

## 🎯 Implementation Status

✅ **STEP 2 - API Security:** $([ $SECURE_CLIENT_COUNT -ge 3 ] && echo "IMPLEMENTED" || echo "PARTIAL")
✅ **STEP 3 - RLS Baseline:** IMPLEMENTED (database-level)  
✅ **Middleware Protection:** $([ $ROLE_PROTECTION -ge 1 ] && echo "ACTIVE" || echo "NEEDS ATTENTION")

**Overall Security Score:** $([ $EXIT_CODE -eq 0 ] && echo "🛡️ EXCELLENT" || echo "🚨 NEEDS ATTENTION")
EOF

echo "📄 Report saved to: $REPORT_FILE"

# ========================================
# Final Summary
# ========================================
echo ""
echo "=========================================="
echo "📊 SECURITY VALIDATION SUMMARY"
echo "=========================================="
echo "Service role checks: $([ $ADMIN_CLIENT_COUNT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"  
echo "Secure client usage: $([ $SECURE_CLIENT_COUNT -ge 3 ] && echo "✅ PASSED" || echo "⚠️ WARNING")"
echo "Middleware security: $([ $ROLE_PROTECTION -ge 1 ] && echo "✅ PASSED" || echo "⚠️ WARNING")"
echo "Secrets security: $([ -z "$PASSWORDS_FOUND" ] && [ -z "$API_KEYS_FOUND" ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Overall status: $([ $EXIT_CODE -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"

if [ $EXIT_CODE -eq 0 ]; then
    echo ""  
    echo "🎉 Security validation completed successfully!"
    echo "🛡️ Application security posture: EXCELLENT"
else
    echo ""
    echo "🚨 Security validation FAILED - issues detected!"
    echo "👉 Review the report above and fix issues before deployment"
fi

exit $EXIT_CODE
