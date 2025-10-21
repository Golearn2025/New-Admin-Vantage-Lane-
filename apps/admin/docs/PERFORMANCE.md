# Performance Guidelines

## Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: <2.0s
- **CLS (Cumulative Layout Shift)**: <0.1
- **TBT (Total Blocking Time)**: <200ms
- **FCP (First Contentful Paint)**: <1.5s

## Frontend Performance

### Code Splitting

```typescript
// Route-based splitting
const Dashboard = lazy(() => import('./Dashboard'));
const Bookings = lazy(() => import('./Bookings'));

// Feature-based splitting
const BookingsTable = lazy(() => import('@admin/features/bookings-table'));
```

### Bundle Optimization

- **Tree shaking**: eliminate unused code
- **Bundle analysis**: weekly reports pe bundle size
- **Threshold**: max +20KB gzipped per PR
- **Dynamic imports**: pentru heavy dependencies

### Caching Strategy

```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

## Database Performance

### Query Guidelines

- **Response time**: <200ms pentru p95
- **N+1 prevention**: use joins sau batch loading
- **Query analysis**: EXPLAIN ANALYZE pentru slow queries
- **Connection pooling**: max 20 connections

### Indexing Strategy

```sql
-- Standard pentru paginare
CREATE INDEX idx_table_created_at_id ON table (created_at DESC, id DESC);

-- Pentru filtering
CREATE INDEX idx_table_status_created_at ON table (status, created_at DESC);

-- Partial pentru common filters
CREATE INDEX idx_active_bookings ON bookings (created_at DESC)
WHERE status IN ('pending', 'accepted');
```

### Pagination Performance

```typescript
// Keyset pagination implementation
const getBookings = async (cursor?: string, limit = 20) => {
  const query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (cursor) {
    const [timestamp, id] = decodeCursor(cursor);
    query.lt('created_at', timestamp).neq('id', id);
  }

  return query;
};
```

## Monitoring & Alerts

### Performance Monitoring

- **Real User Monitoring**: Core Web Vitals tracking
- **Synthetic monitoring**: automated performance tests
- **Database monitoring**: query performance și connection pool
- **Bundle monitoring**: size tracking și alerts

### Alert Thresholds

```yaml
performance_alerts:
  lcp_p95: 2.5s # 25% above target
  cls_p95: 0.15 # 50% above target
  query_p95: 300ms # 50% above target
  bundle_size: +25KB # 25% above threshold
```

## Optimization Techniques

### Frontend

- **Image optimization**: next/image cu lazy loading
- **Font optimization**: preload critical fonts
- **Critical CSS**: inline pentru above-the-fold
- **Service Worker**: pentru offline capability

### Backend

- **Response caching**: Redis pentru frequent queries
- **Database connection pooling**: pgBouncer
- **CDN**: pentru static assets
- **Compression**: gzip/brotli pentru responses
