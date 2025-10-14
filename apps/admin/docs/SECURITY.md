# Security Documentation

## Authentication

### JWT Implementation
- **Access tokens**: 15 minute expiry
- **Refresh tokens**: 7 day expiry  
- **Token rotation**: automatic on refresh
- **Storage**: httpOnly cookies (secure, sameSite)

### Session Management
- **Concurrent sessions**: max 3 per user
- **Auto logout**: after 30 min inactivity
- **Force logout**: admin capability
- **Session invalidation**: on password change

## Authorization (RBAC)

### Roles Hierarchy
```
admin > operator > driver > corporate > customer
```

### Permissions Matrix
| Resource | Customer | Driver | Corporate | Operator | Admin |
|----------|----------|--------|-----------|----------|-------|
| Own bookings | R/W | R/W | R/W | R | R/W |
| All bookings | - | - | - | R | R/W |
| User profiles | Own | Own | Team | R | R/W |
| Payments | Own | Own | Team | R | R/W |
| System settings | - | - | - | R | R/W |

## Row Level Security (RLS)

### Implementation
- **All tables** have RLS enabled
- **Policy testing** obligatoriu pentru fiecare endpoint
- **Service role** interzis în frontend
- **anon role** doar pentru public APIs

### Policy Examples
```sql
-- Users pot accesa doar propriile date
CREATE POLICY "users_own_data" ON users
  FOR ALL TO authenticated
  USING (auth.uid() = id);

-- Admins pot accesa toate datele  
CREATE POLICY "admins_all_access" ON users
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

## Data Protection

### Encryption
- **At rest**: database level encryption
- **In transit**: TLS 1.3 obligatoriu
- **Sensitive fields**: additional encryption pentru PII

### Data Masking
- **Phone numbers**: format (***) ***-1234
- **Emails**: format u***@example.com  
- **Credit cards**: show last 4 digits only

## API Security

### Rate Limiting
```typescript
const limits = {
  login: '5 requests/15min',
  general: '1000 requests/hour',
  sensitive: '100 requests/hour'
};
```

### Input Validation
- **Schema validation** pentru toate input-urile
- **SQL injection** prevention prin prepared statements
- **XSS protection** prin sanitization și CSP

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.example.com;
```

## Audit & Monitoring

### Audit Logs
Toate acțiunile sensibile sunt loggate:
- Login/logout attempts
- Permission changes
- Data modifications
- System configuration changes

### Security Monitoring
- **Failed login attempts**: 5+ triggers alert
- **Unusual access patterns**: location/time based
- **Privilege escalation**: automatic detection
- **Data access patterns**: anomaly detection

### RBAC (Role-Based Access Control) - R0 UPDATE

### Roluri finale (după R0 cleanup)

**admin** - Rol complet privilegiat
- Access complet la toate resursele (înlocuiește vechiul super_admin)
- Poate crea/modifica/șterge utilizatori
- Poate vedea toate datele financiare și operaționale
- Poate configura webhooks, integrări și setări de sistem
- Access la audit logs și monitoring complet

**operator** - Gestiune operațională
- Poate gestiona rezervări și șoferi în regiunea/compania sa
- Poate vedea rapoarte operaționale pentru zona sa
- Nu poate accesa date financiare globale
- Nu poate modifica configurări critice de sistem
- Access limitat la propriul operator scope

**driver** - Șofer individual
- Poate vedea și actualiza propriile rezervări
- Poate actualiza statusul rezervărilor active
- Poate vedea propriul istoric de plăți și performance
- Nu poate vedea datele altor șoferi
- Access doar la propriul profil și documente

**customer** - Client final
- Poate crea și gestiona propriile rezervări
- Poate vedea propriul istoric și facturi
- Nu poate vedea datele altor utilizatori
- Access doar la propriul cont și istoricul personal

**auditor** - Rol de audit și compliance
- Access read-only la toate datele pentru audit
- Poate vedea logs și activitatea utilizatorilor
- Nu poate modifica date operaționale
- Access la rapoarte de compliance și financiare pentru audit
- Nu poate efectua acțiuni administrativeables

## Secrets Management

### Environment Variables
```bash
# Never commit these
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
```

### Key Rotation
- **JWT keys**: monthly rotation
- **Database passwords**: quarterly rotation  
- **API keys**: on-demand rotation
- **Certificates**: auto-renewal

## Incident Response

### Security Incident Levels
1. **Low**: Informational, no action needed
2. **Medium**: Monitoring required
3. **High**: Immediate investigation
4. **Critical**: Emergency response, system lockdown

### Response Team
- **Security Lead**: @security
- **DevOps**: @core-platform  
- **Product**: @core-frontend
- **Legal**: external contact
