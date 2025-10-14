# Code Owners

## Teams și responsabilități

### @core-platform
- **Coordonare generală**: release management, CI/CD
- **Feature flags**: configurare și management
- **Tools**: scripturi de build, development tools
- **Infrastructure**: deployment și monitoring

### @core-frontend  
- **Rute /app**: toate paginile și layout-urile
- **Features**: componente business și flow-uri
- **Shared UI (composed)**: componente compuse
- **Lib utilities**: helper-e și utilități

### @design
- **Design tokens**: culori, spacing, typography
- **Shared UI (core)**: componente atomice
- **A11y guidelines**: accessibility standards
- **UX patterns**: design system consistency

### @core-api
- **API contracts**: definirea și versioning
- **API clients**: implementare și caching
- **RLS testing**: testarea contractelor
- **Performance**: optimizarea query-urilor

### @core-db
- **Schema management**: migrații și indexuri
- **Database optimization**: performance tuning
- **Backup strategies**: disaster recovery

### @security
- **RLS policies**: Row Level Security
- **CSP headers**: Content Security Policy
- **Security policies**: autentificare și autorizare
- **Secret management**: key rotation și storage

### @core-auth
- **Login flow**: autentificare și sesiuni
- **Password management**: reset și policies
- **Multi-factor auth**: 2FA implementation

### @qa
- **Test strategies**: planificare și execuție
- **Audit runs**: verificări periodice de calitate
- **E2E testing**: scenarii de business
- **Performance testing**: load și stress testing

### @tech-writers
- **Documentation**: menținerea și actualizarea
- **ADR management**: Architecture Decision Records
- **Process documentation**: ghiduri și proceduri
- **Audit checklists**: documentația de compliance

## Application User Roles (R0 UPDATE - Removed super_admin)

### admin (Consolidated from super_admin)
- **Access**: Complete access to all resources and configurations
- **Responsibilities**: System administration, user management, global configurations
- **Team mapping**: @core-platform, @security leads
- **Permissions**: Full CRUD on all entities

### operator 
- **Access**: Regional/company scoped operations management
- **Responsibilities**: Daily operations, customer support, driver management
- **Team mapping**: Business operations teams
- **Permissions**: Scoped CRUD on bookings, users within assigned region/company

### auditor
- **Access**: Read-only access to all data for compliance purposes
- **Responsibilities**: Audit trails, compliance reports, financial oversight
- **Team mapping**: @qa, compliance officers
- **Permissions**: Read-only on all resources for audit purposes

### driver & customer
- **Access**: Own data and related operations only
- **Responsibilities**: Personal account management
- **Permissions**: Limited CRUD on own profile and associated data

## Contact și escalare

Pentru întrebări sau conflicte:
1. **Technical**: @core-platform
2. **Design**: @design  
3. **Security**: @security
4. **Process**: @tech-writers
