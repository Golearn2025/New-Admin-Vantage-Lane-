# FREEZE-LIST

Aceste căi sunt **înghețate** și nu se pot modifica fără excepție și proces special de aprobare.

## Căi înghețate (nu se modifică fără excepție):

- `/apps/admin/schema/**` - Schema de bază de date
- `/apps/admin/security/**` - Configurări de securitate

## UI Core Components (FROZEN)

Modificări doar cu freeze-exception + ADR

### Componente atomice

- `/apps/admin/shared/ui/core/Button/` - @design @core-frontend
- `/apps/admin/shared/ui/core/Input/` - @design @core-frontend
- `/apps/admin/shared/ui/core/Card/` - @design @core-frontend
- `/apps/admin/shared/ui/core/Checkbox/` - @design @core-frontend

### Componente compuse

- `/apps/admin/shared/ui/composed/AuthCard/` - @design @core-frontend
- `/apps/admin/shared/ui/composed/FormRow/` - @design @core-frontend
- `/apps/admin/shared/ui/composed/ErrorBanner/` - @design @core-frontend

### Authentication Pages

- `/app/login/` - @design @core-frontend @core-auth

- `/apps/admin/shared/config/design-tokens/**` - Token-uri de design
- `/apps/admin/shared/config/feature-flags/**` - Feature flags
- `/apps/admin/app/login/**` - Fluxul de autentificare

## Proces de modificare

Pentru orice modificare în aceste căi:

1. **Freeze Exception Request** - cerere motivată cu ADR
2. **Security Review** - verificare obligatorie de securitate
3. **Architecture Review** - validare arhitecturală
4. **Multi-approver** - aprobare de la toți ownerii zonei

## Impact

Modificările în zonele înghețate pot afecta:

- Securitatea sistemului
- Compatibilitatea API
- Stabilitatea componentelor de bază
- Performanța generală

## Contact

Pentru întrebări: @core-platform @security
