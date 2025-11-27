# SECURITY BASELINE - ZERO TRUST ARCHITECTURE

**Date:** 2025-11-26  
**Risk Level:** CRITICAL  
**Applies To:** All routes, APIs, database access  

## 🔐 Authentication & Session Management

### Server-Side Route Protection
- [ ] **Middleware.ts validates ALL protected routes** 
- [ ] **No client-side only auth checks** (easily bypassed)
- [ ] **Session tokens httpOnly** (no localStorage auth tokens)
- [ ] **CSRF protection enabled** (Next.js built-in or custom)
- [ ] **Secure cookie settings** (secure, sameSite, proper expiry)

### Role-Based Access Control (RBAC)
- [ ] **Admin role verification** server-side (middleware + API)
- [ ] **Operator role isolation** (can't see other operators' data)  
- [ ] **Driver role limitations** (profile + documents only)
- [ ] **Role inheritance forbidden** (no privilege escalation paths)

**Testing Commands:**
```bash
# Test auth bypass attempts
curl -X GET http://localhost:3000/admin/users
# Expected: 401/403 (not 200)

# Test role isolation  
curl -H "Authorization: Bearer <operator_token>" \
     http://localhost:3000/api/admin/users
# Expected: 403 Forbidden
```

---

## 🗄️ Database Security (Row Level Security)

### RLS Policy Coverage
- [ ] **bookings table** - operators see only their organization's bookings
- [ ] **drivers table** - operators see only their assigned drivers
- [ ] **customers table** - proper privacy isolation
- [ ] **admin_users table** - admin-only access  
- [ ] **organizations table** - operators see only their own org
- [ ] **notifications table** - role-based visibility

### Service Role Usage (MINIMIZE)
- [ ] **Authentication operations only** (user creation, role assignment)
- [ ] **No business queries use service_role** (use RLS instead)
- [ ] **Audit service_role usage** (grep for SUPABASE_SERVICE_ROLE_KEY)
- [ ] **Document exceptions** (why service_role needed)

**Testing Queries:**
```sql
-- Test operator isolation (should return empty for wrong org)  
SELECT * FROM bookings WHERE organization_id != '<current_user_org>';

-- Test RLS enforcement (should fail with RLS error)
SET ROLE anon;
SELECT * FROM admin_users;
```

---

## 🔒 Input Validation & Sanitization

### Schema Validation
- [ ] **Zod schemas for all API endpoints** (no raw req.body usage)
- [ ] **File upload validation** (type, size, content scanning)
- [ ] **URL parameter validation** (no direct database queries from params)
- [ ] **Search query sanitization** (prevent SQL injection attempts)

### XSS Prevention  
- [ ] **No dangerouslySetInnerHTML** (or properly sanitized)
- [ ] **Content Security Policy** headers set
- [ ] **User-generated content escaped** (reviews, comments, etc.)
- [ ] **Image upload restrictions** (no executable file types)

**Validation Examples:**
```typescript
// Good: Zod validation
const BookingSchema = z.object({
  pickup_location: z.string().min(1).max(200),
  organization_id: z.string().uuid()
});

// Bad: Direct usage
const { pickup_location } = req.body; // NO VALIDATION!
```

---

## 🔍 Secrets & Environment Management

### Secret Scanning
- [ ] **No API keys in code** (gitleaks scan clean)
- [ ] **No database passwords hardcoded** 
- [ ] **No JWT secrets in repository**
- [ ] **Third-party tokens in .env only**

### Environment Variable Security
- [ ] **.env in .gitignore** (never committed)
- [ ] **.env.example complete** (all required vars documented)
- [ ] **Production env vars different** (not copied from development)
- [ ] **Sensitive vars marked** (comments indicate which are secrets)

**Scanning Commands:**
```bash
# Check for leaked secrets
npx gitleaks detect --source . --verbose

# Find potential hardcoded credentials  
grep -ri "password\|secret\|key" --include="*.ts" --include="*.tsx" src/
```

---

## 📊 Logging & Monitoring Security

### PII Protection
- [ ] **No emails in logs** (mask: u***@domain.com)
- [ ] **No phone numbers logged** (mask: +44****)
- [ ] **No payment info** (never log card details)
- [ ] **IP addresses hashed** (for privacy compliance)

### Security Event Logging
- [ ] **Failed login attempts tracked** (auth.audit_log_entries)
- [ ] **Admin actions logged** (user creation, role changes)
- [ ] **Suspicious activity detection** (multiple failed logins, etc.)
- [ ] **Log retention policy** (GDPR compliance)

**Log Example (Good):**
```typescript
logger.info("User login attempt", {
  user_id: user.id,
  email_hash: hashEmail(user.email), // NOT plain email
  ip_hash: hashIP(request.ip),       // NOT plain IP
  success: false,
  timestamp: new Date().toISOString()
});
```

---

## 🚨 Rate Limiting & DDoS Protection

### Critical Endpoint Protection
- [ ] **Login endpoint rate limited** (5 attempts per 15 min per IP)
- [ ] **Password reset rate limited** (3 requests per hour per email)
- [ ] **File upload rate limited** (10MB per minute per user)
- [ ] **API endpoints throttled** (prevent data scraping)

### Implementation Check
- [ ] **Rate limiting middleware** (express-rate-limit or custom)
- [ ] **Redis/memory store** for rate limit counters
- [ ] **Proper error messages** (don't reveal limit details)
- [ ] **Bypass for admins** (if needed, document exception)

---

## 🔐 API Security Headers

### Security Headers Checklist
- [ ] **X-Content-Type-Options: nosniff**
- [ ] **X-Frame-Options: DENY** (prevent clickjacking)
- [ ] **X-XSS-Protection: 1; mode=block**  
- [ ] **Referrer-Policy: strict-origin-when-cross-origin**
- [ ] **Content-Security-Policy** (prevent XSS)

### CORS Configuration
- [ ] **Specific origins only** (not wildcard * in production)
- [ ] **Credentials handling secure** (proper CORS + cookies)
- [ ] **Preflight requests handled** (OPTIONS method support)

**Header Verification:**
```bash
# Check security headers
curl -I http://localhost:3000/
curl -I http://localhost:3000/api/health

# Expected: All security headers present
```

---

## 🎯 Security Testing Checklist

### Authentication Testing
- [ ] **Route protection bypassed?** (direct URL access)
- [ ] **Token manipulation works?** (JWT payload modification)
- [ ] **Session fixation possible?** (session hijacking)
- [ ] **Logout invalidates session?** (no zombie sessions)

### Authorization Testing  
- [ ] **Horizontal privilege escalation** (operator A sees operator B data)
- [ ] **Vertical privilege escalation** (operator gets admin access)
- [ ] **Direct object references** (access resources by ID guessing)

### Data Security Testing
- [ ] **SQL injection attempts** (in search, filters, etc.)
- [ ] **Cross-org data leakage** (RLS policy bypass attempts)
- [ ] **File upload attacks** (executable files, path traversal)
- [ ] **XSS payload injection** (in user inputs)

---

## 📋 Security Evidence Template

For each security test:

### Test Results
```bash
# Authentication bypass test
evidence/security/
  auth-bypass-test-results.txt
  middleware-protection-screenshots.png
```

### RLS Testing
```sql
-- Evidence queries (save results)
evidence/security/
  rls-test-queries.sql
  rls-test-results.json
  cross-org-isolation-proof.txt
```

### Vulnerability Scanning
```bash
# Security scan outputs
evidence/security/
  gitleaks-scan-clean.txt
  security-headers-check.txt
  rate-limit-test-results.txt
```

---

## 🚨 CRITICAL SECURITY RISKS

**HIGH PRIORITY** (fix immediately):
1. **No authentication** on admin routes
2. **Service_role used** for business queries  
3. **Cross-org data visible** (RLS bypass)
4. **Secrets in code** (API keys, passwords)
5. **No input validation** (SQL injection risk)

**MEDIUM PRIORITY** (fix in current sprint):
1. **Missing security headers**
2. **No rate limiting** on auth endpoints
3. **PII in logs** (privacy violation)
4. **Weak session management**

**Status:** All items unchecked = AUDIT REQUIRED  
**Next Action:** Start with HIGH PRIORITY risks first
