# PERFORMANCE BASELINE - SUB-SECOND EXPERIENCE

**Date:** 2025-11-26  
**Target:** <1s initial load, <100ms interactions  
**Applies To:** All pages, especially data-heavy admin tables  

## 📊 Data Fetching & Caching

### No Fetch in UI Components
- [ ] **Zero fetch() in .tsx files** (data layer separation)
- [ ] **React Query/SWR** for server state (or custom cache)
- [ ] **Optimistic updates** where appropriate (bookings, status changes)
- [ ] **Background refetch** (stale-while-revalidate pattern)

### Pagination Strategy
- [ ] **Server-side pagination** (no loading 1000+ rows)
- [ ] **Cursor-based pagination** for real-time data (better than offset)
- [ ] **Virtual scrolling** for large lists (>100 items)
- [ ] **Page size limits** enforced (max 100 items per page)

**Performance Testing:**
```bash
# Measure table load time (bookings, users, etc.)
# Network tab: Look for >500ms API calls
# Expected: <200ms for paginated queries

# Test large dataset performance
curl "http://localhost:3000/api/bookings?page=1&limit=50" -w "@curl-format.txt"
```

### Loading States & UX
- [ ] **Skeleton loading** (not just spinners)
- [ ] **Progressive loading** (critical content first)
- [ ] **Loading state consistency** (same pattern across pages)
- [ ] **Error boundaries** (graceful failure handling)

---

## 🚀 Bundle Size & Code Splitting

### Bundle Analysis
- [ ] **Main bundle <500KB** (gzipped)
- [ ] **Page-level code splitting** (lazy loading for routes)
- [ ] **Component-level splitting** for heavy components (charts, editors)
- [ ] **Third-party lib optimization** (tree-shaking, selective imports)

### Dynamic Imports
- [ ] **Heavy components lazy loaded** (React.lazy + Suspense)
- [ ] **Chart libraries on-demand** (Recharts only when needed)
- [ ] **Modal content dynamic** (load dialog content on open)
- [ ] **Admin-only features** separate chunks

**Bundle Commands:**
```bash
# Build and analyze
pnpm build
npx @next/bundle-analyzer

# Expected outputs:
# pages/_app.js: <200KB
# pages/admin/bookings.js: <100KB  
# chunks/charts.js: <150KB (loaded on demand)
```

### Asset Optimization
- [ ] **Images optimized** (Next.js Image component, WebP)
- [ ] **Font loading optimized** (preload, font-display: swap)
- [ ] **CSS minification** (production builds)
- [ ] **Unused CSS removal** (PurgeCSS or similar)

---

## 🔄 React Performance Optimization

### Re-render Prevention
- [ ] **useMemo for expensive calculations** (data transformations)
- [ ] **useCallback for event handlers** (prevent child re-renders)
- [ ] **React.memo for pure components** (props-based memoization)
- [ ] **Stable object references** (no inline object/array creation in JSX)

### Component Architecture
- [ ] **State colocation** (state close to where it's used)
- [ ] **Component splitting** (separate stateful from pure components)
- [ ] **Context optimization** (multiple contexts vs single large context)
- [ ] **Effect dependency discipline** (minimal deps, stable refs)

**React DevTools Profiling:**
```bash
# Manual testing steps:
1. Open React DevTools Profiler
2. Start recording
3. Perform action (table sort, filter, etc.)
4. Stop recording
5. Analyze flame graph

# Expected:
# - Render time <50ms for interactions
# - Minimal unnecessary re-renders
# - No "cascade" re-renders (parent → children chain reactions)
```

### List & Table Performance  
- [ ] **Virtualized lists** for >100 items (react-window, @tanstack/react-virtual)
- [ ] **Table row memoization** (prevent re-render on scroll)
- [ ] **Pagination over infinite scroll** (memory management)
- [ ] **Search debouncing** (300ms delay, prevent API spam)

---

## 💾 Memory Management & Leaks

### useEffect Cleanup
- [ ] **Event listener removal** (addEventListener → removeEventListener)
- [ ] **Timer cleanup** (clearInterval, clearTimeout)
- [ ] **Subscription cleanup** (Supabase subscriptions unsubscribed)
- [ ] **AbortController usage** (cancel in-flight requests on unmount)

### Memory Leak Detection
- [ ] **Component unmount cleanup** (all side effects cleaned)
- [ ] **Global state cleanup** (remove unused data)  
- [ ] **File upload cleanup** (revoke object URLs)
- [ ] **Worker termination** (if using Web Workers)

**Memory Testing:**
```bash
# Chrome DevTools Memory tab:
1. Take heap snapshot (baseline)
2. Navigate to page with heavy components  
3. Interact with features (tables, modals, etc.)
4. Navigate away from page
5. Take heap snapshot (after)
6. Compare memory usage

# Expected: Memory returns to ~baseline after navigation
# Red flag: Steady memory growth (indicates leaks)
```

### WeakMap/WeakSet Usage
- [ ] **Cache cleanup** (no memory accumulation in caches)
- [ ] **Reference cleanup** (avoid circular references)
- [ ] **Observer cleanup** (IntersectionObserver, ResizeObserver)

---

## 🌐 Network Optimization

### API Efficiency  
- [ ] **Request batching** (multiple operations in single call)
- [ ] **Response compression** (gzip enabled)
- [ ] **GraphQL-style queries** (select only needed fields)
- [ ] **Conditional requests** (ETags, Last-Modified headers)

### Caching Strategy
- [ ] **HTTP caching headers** (Cache-Control, Expires)
- [ ] **Service Worker caching** (offline-first for static assets)
- [ ] **Browser caching** (localStorage/sessionStorage for appropriate data)
- [ ] **CDN usage** (static assets served from CDN)

**Network Testing:**
```bash
# Check response sizes and times
curl -H "Accept-Encoding: gzip" \  
     -w "@curl-format.txt" \
     "http://localhost:3000/api/bookings"

# Expected:
# - Response time: <200ms
# - Response size: <50KB for paginated data
# - Compression: ~70% reduction for JSON
```

### Real-time Optimization
- [ ] **WebSocket connection reuse** (single connection per user)
- [ ] **Event batching** (group related updates)
- [ ] **Throttling/debouncing** (prevent event spam)
- [ ] **Reconnection logic** (handle network interruptions)

---

## 📱 Mobile Performance

### Touch & Interaction
- [ ] **Touch target size** (minimum 44px)
- [ ] **Tap delay elimination** (touch-action: manipulation)
- [ ] **Smooth scrolling** (will-change, transform3d for animations)
- [ ] **Gesture handling** (prevent zoom on inputs)

### Mobile-Specific Optimizations
- [ ] **Reduced animations** on low-power devices
- [ ] **Image lazy loading** (below fold content)
- [ ] **Progressive enhancement** (core functionality works without JS)
- [ ] **Battery usage** (minimize background processing)

---

## 🎯 Performance Monitoring

### Core Web Vitals
- [ ] **Largest Contentful Paint (LCP)** <2.5s
- [ ] **First Input Delay (FID)** <100ms  
- [ ] **Cumulative Layout Shift (CLS)** <0.1
- [ ] **Time to First Byte (TTFB)** <600ms

### Custom Performance Metrics
- [ ] **Table load time** <500ms (for paginated data)
- [ ] **Search response time** <300ms
- [ ] **Modal open time** <100ms
- [ ] **Navigation time** <200ms (between pages)

**Monitoring Tools:**
```bash
# Lighthouse audit
npx lighthouse http://localhost:3000/admin/bookings --output=json

# Expected scores:
# Performance: >90
# Accessibility: >95
# Best Practices: >90
# SEO: >90 (if applicable)
```

### Performance Budget
- [ ] **JavaScript budget** <500KB total
- [ ] **CSS budget** <100KB total
- [ ] **Image budget** <1MB per page
- [ ] **Font budget** <100KB total

---

## 📊 Performance Evidence Collection

### Automated Testing
```bash
# Performance test suite
evidence/performance/
  lighthouse-reports/
    admin-dashboard-2025-11-26.json
    bookings-table-2025-11-26.json
  
  bundle-analysis/
    bundle-size-report.txt
    code-splitting-analysis.png
```

### Manual Testing Results
```bash
evidence/performance/  
  react-profiler/
    table-sort-interaction.json
    modal-open-profiling.json
    
  memory-testing/
    heap-snapshots-before-after.png
    memory-usage-graph.png
```

### Network Performance
```bash
evidence/performance/
  network-analysis/
    api-response-times.txt
    compression-ratios.txt
    cache-hit-rates.log
```

---

## 🚨 PERFORMANCE RED FLAGS

**CRITICAL** (fix immediately):
1. **>2s initial page load** (bundle too large)
2. **>500ms table interactions** (no virtualization)  
3. **Memory leaks detected** (steady growth in DevTools)
4. **No pagination** (loading 1000+ rows)
5. **Fetch in render** (causing render loops)

**HIGH PRIORITY** (fix this sprint):
1. **>100ms interaction delays** (needs optimization)
2. **No loading states** (poor UX)
3. **Large bundle chunks** (needs code splitting)
4. **No caching strategy** (repeated API calls)

**MEDIUM PRIORITY** (next sprint):
1. **Missing memoization** (unnecessary re-renders)
2. **Non-optimized images** (should use Next.js Image)
3. **No error boundaries** (whole page crashes)

**Status:** All items unchecked = PERFORMANCE AUDIT REQUIRED  
**Next Action:** Start with CRITICAL issues, measure before/after improvements
