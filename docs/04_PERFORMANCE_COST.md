# ⚡ PERFORMANCE OPTIMIZATION

**Owner:** Engineering Team  
**Scope:** Performance requirements  
**Last Updated:** 2025-11-27  
**Status:** ACTIVE

## 🎯 PERFORMANCE TARGETS

| Metric | Target | Critical |
|--------|--------|----------|
| **Page Load Time** | <3s | <5s |
| **Bundle Size** | <1MB per route | <2MB |
| **Lighthouse Score** | >90 | >80 |
| **Database Query Time** | <100ms | <500ms |
| **API Response Time** | <200ms | <1s |
| **Memory Usage** | <50MB | <100MB |

## 🏗️ ARCHITECTURE PATTERNS

### Client-Side Caching
```typescript
// ✅ React Query for API caching
const { data, isLoading } = useQuery({
  queryKey: ['users', { page, filters }],
  queryFn: () => fetchUsers(page, filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Component Optimization
```typescript
// ✅ React.memo for expensive components
export const ExpensiveTable = React.memo(({ data, columns }) => {
  // Expensive rendering logic
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});

// ✅ useMemo for expensive calculations
const sortedData = useMemo(() => {
  return data.sort(sortFunction);
}, [data, sortBy, sortDirection]);

// ✅ useCallback for event handlers  
const handleClick = useCallback((id: string) => {
  onRowClick(id);
}, [onRowClick]);
```

## 📊 DATABASE OPTIMIZATION

### Pagination (Server-Side)
```sql
-- ✅ Efficient pagination with LIMIT/OFFSET
SELECT * FROM bookings 
WHERE organization_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- ✅ Count total for pagination info
SELECT COUNT(*) FROM bookings 
WHERE organization_id = $1;
```

### Query Optimization
```sql
-- ✅ Use indexes for frequent filters
CREATE INDEX idx_bookings_org_created ON bookings(organization_id, created_at);
CREATE INDEX idx_drivers_org_status ON drivers(organization_id, status);

-- ✅ Avoid N+1 queries with joins
SELECT b.*, d.name as driver_name, c.name as customer_name
FROM bookings b
LEFT JOIN drivers d ON b.driver_id = d.id  
LEFT JOIN customers c ON b.customer_id = c.id
WHERE b.organization_id = $1;
```

## 🚀 BUNDLE OPTIMIZATION

### Code Splitting
```typescript
// ✅ Route-based code splitting
const UsersPage = lazy(() => import('./pages/UsersPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));

// ✅ Component-based code splitting  
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

### Import Optimization
```typescript
// ✅ Tree-shaking friendly imports
import { Button } from '@vantage-lane/ui-core/Button';
import { formatDate } from '@formatters/date';

// ❌ Avoid barrel imports for large libraries
import * as _ from 'lodash'; // Bad
import { debounce } from 'lodash'; // Good
```

## 🔄 REAL-TIME OPTIMIZATION

### Supabase Realtime
```typescript
// ✅ Selective subscription
const subscription = supabase
  .channel('bookings')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'bookings',
    filter: `organization_id=eq.${orgId}` // Only org data
  }, handleRealtimeUpdate)
  .subscribe();

// ✅ Cleanup subscriptions
useEffect(() => {
  return () => subscription.unsubscribe();
}, []);
```

### Debounced Updates
```typescript
// ✅ Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    setSearchQuery(query);
  }, 300),
  []
);
```

## 🖼️ ASSET OPTIMIZATION

### Image Optimization
```typescript
// ✅ Next.js Image component
import Image from 'next/image';

<Image
  src="/driver-photo.jpg"
  alt="Driver photo"
  width={150}
  height={150}
  loading="lazy"
  placeholder="blur"
/>
```

### Static Assets
```typescript
// ✅ Optimize static imports
const largeData = lazy(() => import('./data/large-dataset.json'));

// ✅ Use CDN for static assets
const AVATAR_BASE_URL = 'https://cdn.vantage-lane.com/avatars/';
```

## 📈 MONITORING & METRICS

### Performance Monitoring
```typescript
// ✅ Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log); 
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Database Query Monitoring
```sql
-- ✅ Monitor slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements 
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC;
```

## 🚨 PERFORMANCE ALERTS

### Bundle Size Budgets
```json
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 1000000, // 1MB
    maxEntrypointSize: 1000000, // 1MB
    hints: 'error'
  }
};
```

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    configPath: '.lighthouserc.json'
    budgetPath: '.lighthouseBudgets.json'
```

## ⚡ QUICK WINS CHECKLIST

- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Optimize database indexes
- [ ] Implement client-side caching
- [ ] Use React.memo for expensive components
- [ ] Lazy load heavy components
- [ ] Debounce user inputs
- [ ] Optimize images (WebP, lazy loading)
- [ ] Remove unused dependencies
- [ ] Enable tree-shaking

---

**Performance is a feature. Monitor regularly and optimize proactively.**
