# Architecture Documentation

## Overview

Aplicația Admin folosește **Feature-Sliced Design** cu granițe strict definite între module.

## Structura de foldere

```
/
├── app/                    # Rute și pagini (Next.js App Router)
└── apps/admin/
    ├── entities/          # Entități de business
    ├── features/          # Funcționalități compuse
    ├── shared/            # Resurse partajate
    ├── schema/            # Schema DB (FROZEN)
    ├── security/          # Configurări securitate (FROZEN)
    ├── tools/             # Tooling și scripturi
    ├── tests/             # Suite de teste
    ├── docs/              # Documentație
    └── public/           # Asset-uri statice
```

## Principii arhitecturale

### 1. Dependency Rule

- Straturile inferioare nu cunosc straturile superioare
- `shared` ← `entities` ← `features` ← `app`

### 2. Frozen Boundaries

- Anumite module sunt înghețate pentru stabilitate
- Modificări doar cu proces special de aprobare

### 3. Contract-First API

- Toate API-urile au contracte definite în `shared/api/contracts`
- Validare strictă a request/response

### 4. Component Composition

- UI compus din componente atomice (`shared/ui/core`)
- Componente business în `shared/ui/composed`

## Technology Stack

- **Frontend**: React 18 + Next.js 14
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules + Design Tokens
- **Testing**: Jest + Playwright
- **Linting**: ESLint + Prettier

## Security Architecture (R0 UPDATE - Removed super_admin)

### Authentication & Authorization

- **Authentication**: JWT + refresh tokens
- **Authorization**: RBAC cu 5 roluri finale (admin, operator, driver, customer, auditor)
- **Role consolidation**: super_admin eliminat → admin cu acces complet
- **Data Protection**: RLS policies în Supabase cu role-specific access
- **Audit**: Toate acțiunile loggate cu role tracking

### Final Role Structure

```typescript
type UserRole = 'admin' | 'operator' | 'driver' | 'customer' | 'auditor';

const rolePermissions = {
  admin: {
    scope: 'global',
    access: 'full_crud',
    description: 'Complete system access (consolidated from super_admin)',
  },
  operator: {
    scope: 'regional_company',
    access: 'scoped_crud',
    description: 'Operations management within assigned scope',
  },
  auditor: {
    scope: 'global',
    access: 'read_only',
    description: 'Compliance and audit access to all data',
  },
  driver: {
    scope: 'self',
    access: 'limited_crud',
    description: 'Own profile and assigned bookings',
  },
  customer: {
    scope: 'self',
    access: 'limited_crud',
    description: 'Own profile and bookings',
  },
} as const;
```

## Performance optimizations

### Database

- **Connection pooling**: pentru concurența mare
- **Read replicas**: pentru queries heavy
- **Indexuri selective**: pe filtrele frecvente
- **Query caching**: pentru agregări costisitoare

### Frontend

- **Code splitting**: la nivel de rută
- **Image optimization**: lazy loading + WebP
- **Bundle analysis**: pentru dead code elimination
- **CDN usage**: pentru asset-uri statice

## M0.3 - List Request Flow Architecture

### Request → Cache → Database Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Frontend   │───▶│   API Route  │───▶│ Cache Layer │───▶│  Database    │
│  (filters)  │    │ /api/*/list  │    │   (Redis)   │    │ (PostgreSQL) │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                           │                    │                 │
                           ▼                    ▼                 ▼
                   ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
                   │  Response    │◀───│  Cache Hit  │◀───│ Query Result │
                   │  Transform   │    │   (5min)    │    │  (Indexed)   │
                   └──────────────┘    └─────────────┘    └──────────────┘
```

### Cache Strategy

#### Cache Keys Structure

```typescript
// Pattern: entity:filters:sort:pagination
const cacheKey = `${entity}:${hashFilters}:${sortField}:${sortDir}:${cursor | page}`;

// Examples:
// "bookings:status=pending:created_at:desc:cursor_xyz"
// "users:role=driver&status=active:last_login:desc:page_1"
// "payments:amount_range=1000-5000:created_at:desc:cursor_abc"
```

#### Cache TTL Strategy

- **Hot data** (bookings, tickets): 2 minutes TTL
- **Warm data** (users, documents): 5 minutes TTL
- **Cold data** (payments history): 15 minutes TTL
- **Aggregations** (summaries, counts): 10 minutes TTL

#### Cache Invalidation Patterns

```typescript
// On entity mutation, invalidate related cache keys
const invalidatePatterns = {
  booking_updated: ['bookings:*', 'users:driver:*'], // Driver stats change
  user_status_changed: ['users:*', 'bookings:*'], // Affects filters
  payment_completed: ['payments:*', 'bookings:*'], // Updates booking status
  document_approved: ['documents:*', 'users:*'], // User verification status
  ticket_assigned: ['tickets:*'], // Assignment changes
};
```

### List API Implementation Pattern

```typescript
// Standard list endpoint implementation
export async function handleListRequest<T, F>(
  request: ListRequest<F>,
  entity: string,
  queryBuilder: (filters: F) => Query
): Promise<ListResponse<T>> {
  // 1. Generate cache key
  const cacheKey = generateCacheKey(entity, request);

  // 2. Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { ...JSON.parse(cached), performance: { cache_hit: true } };
  }

  // 3. Build optimized query
  const query = queryBuilder(request.filters)
    .orderBy(request.sort?.field || 'created_at', request.sort?.direction || 'desc')
    .limit(request.page_size || 25);

  // 4. Apply pagination (keyset preferred)
  if (request.cursor) {
    query.where(buildCursorWhere(request.cursor));
  } else if (request.page) {
    query.offset((request.page - 1) * (request.page_size || 25));
  }

  // 5. Execute with performance tracking
  const startTime = performance.now();
  const result = await query.execute();
  const queryDuration = performance.now() - startTime;

  // 6. Transform and paginate
  const response = transformListResponse(result, request, queryDuration);

  // 7. Cache result
  await redis.setex(cacheKey, getTTL(entity), JSON.stringify(response));

  return response;
}
```

### Performance Targets per Endpoint

| Endpoint       | Cache Hit Rate | P95 Query Time | P95 Response Time |
| -------------- | -------------- | -------------- | ----------------- |
| bookings.list  | >80%           | <50ms          | <100ms            |
| users.list     | >75%           | <30ms          | <80ms             |
| documents.list | >70%           | <40ms          | <90ms             |
| tickets.list   | >85%           | <60ms          | <120ms            |
| payments.list  | >70%           | <45ms          | <95ms             |
