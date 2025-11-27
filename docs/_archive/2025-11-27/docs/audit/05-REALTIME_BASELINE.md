# REALTIME BASELINE - LEAK-FREE SUBSCRIPTIONS

**Date:** 2025-11-26  
**Scope:** Supabase subscriptions, WebSocket connections, event handling  
**Risk:** Memory leaks, performance degradation, connection exhaustion  

## 🔄 Subscription Lifecycle Management

### Single Subscription Rule
- [ ] **One subscription per channel** (no duplicate subscriptions)
- [ ] **Connection reuse** (shared WebSocket across components)
- [ ] **Subscription registry** (track active subscriptions)
- [ ] **Automatic deduplication** (prevent same subscription twice)

### Proper Cleanup Pattern
- [ ] **useEffect return function** (cleanup on unmount)
- [ ] **Subscription removal** (supabase.removeSubscription)
- [ ] **Event listener cleanup** (removeEventListener)
- [ ] **Timer cancellation** (clearInterval, clearTimeout)

**Good Subscription Pattern:**
```typescript
// Good: Proper subscription with cleanup
useEffect(() => {
  const subscription = supabase
    .channel('bookings-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bookings',
    }, handleBookingChange)
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []); // Empty deps - subscribe once
```

---

## 🚫 Infinite Loop Prevention

### useEffect Dependency Discipline
- [ ] **Stable dependencies** (no objects/arrays created in render)
- [ ] **useCallback for functions** (prevent effect re-execution)
- [ ] **useMemo for computed values** (stable object references)
- [ ] **Dependency array discipline** (all used variables included)

### State Update Patterns
- [ ] **No state updates that trigger same effect** (circular dependencies)
- [ ] **Functional state updates** (prev => newValue) when needed
- [ ] **Effect guards** (early return conditions)
- [ ] **Debouncing for user inputs** (prevent API spam)

**Anti-Pattern Examples:**
```typescript
// BAD: Circular dependency
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then(setData); // Updates data
}, [data]); // Depends on data - INFINITE LOOP!

// GOOD: Stable dependency
const [data, setData] = useState([]);
const [trigger, setTrigger] = useState(0);

useEffect(() => {
  fetchData().then(setData);
}, [trigger]); // Only updates when trigger changes
```

---

## 🔌 WebSocket Connection Management

### Connection Lifecycle
- [ ] **Single WebSocket connection** per user session
- [ ] **Connection state tracking** (connecting, connected, disconnected)
- [ ] **Automatic reconnection** (on network interruption)
- [ ] **Graceful degradation** (works offline/without realtime)

### Error Handling & Reconnection
- [ ] **Exponential backoff** (prevent rapid reconnection attempts)
- [ ] **Connection timeout handling** (don't wait forever)
- [ ] **Error state UI** (show connection status to user)
- [ ] **Manual reconnect option** (user can retry)

**Connection Manager Pattern:**
```typescript
// Good: Connection manager with reconnection
class RealtimeManager {
  private connection: RealtimeChannel | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.connection?.state === 'joined') return;
    
    this.connection = supabase.channel('app-channel');
    
    this.connection.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        this.handleReconnect();
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  disconnect() {
    this.connection?.unsubscribe();
    this.connection = null;
    this.reconnectAttempts = 0;
  }
}
```

---

## 📊 Event Throttling & Debouncing

### Input Event Management
- [ ] **Search input debounced** (300ms delay before API call)
- [ ] **Scroll events throttled** (max 60fps for performance)
- [ ] **Resize events throttled** (prevent layout thrashing)
- [ ] **Real-time updates batched** (group multiple changes)

### Rate Limiting Patterns
- [ ] **User action rate limiting** (prevent spam clicks)
- [ ] **API call deduplication** (cancel previous requests)
- [ ] **Event queue management** (process events in order)
- [ ] **Priority event handling** (critical events processed first)

**Debouncing Example:**
```typescript
// Good: Debounced search with cleanup
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);

  return () => clearTimeout(timer); // Cleanup timer
}, [searchTerm]);

useEffect(() => {
  if (debouncedSearch) {
    searchAPI(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## 🧠 Memory Leak Detection & Prevention

### Common Leak Sources
- [ ] **Unclosed subscriptions** (Supabase channels not removed)
- [ ] **Event listeners** (not removed on component unmount)
- [ ] **Timers** (setInterval, setTimeout not cleared)
- [ ] **Object URLs** (not revoked after file upload)

### Memory Monitoring
- [ ] **Chrome DevTools Memory tab** (heap snapshots before/after)
- [ ] **Component unmount verification** (memory returns to baseline)
- [ ] **Long-running session testing** (no steady memory growth)
- [ ] **Subscription count tracking** (monitor active connections)

**Memory Leak Testing Checklist:**
```bash
# Manual testing procedure:
1. Take baseline heap snapshot
2. Navigate to page with realtime features
3. Interact with realtime components (tables, notifications, etc.)
4. Navigate away from page (component unmount)
5. Force garbage collection (DevTools)
6. Take second heap snapshot
7. Compare memory usage

# Expected: Memory returns to ~baseline level
# Red flag: Continuous memory growth
```

### WeakMap/WeakSet Usage
- [ ] **Weak references** for caches (automatic cleanup)
- [ ] **Component-scoped data** (cleaned when component unmounts)
- [ ] **Event handler references** (don't prevent garbage collection)

---

## 🎯 Realtime Feature Patterns

### Live Data Updates
- [ ] **Optimistic updates** (immediate UI feedback)
- [ ] **Conflict resolution** (handle concurrent edits)
- [ ] **Update batching** (group related changes)
- [ ] **Fallback polling** (if realtime fails)

### Notification System
- [ ] **Connection-based delivery** (only to connected users)
- [ ] **Notification deduplication** (no duplicate alerts)
- [ ] **Permission-based filtering** (role-appropriate notifications)
- [ ] **Offline queue** (deliver when reconnected)

### Live Status Indicators
- [ ] **Connection status visible** (online/offline indicator)
- [ ] **Last update timestamp** (show data freshness)
- [ ] **Sync status feedback** (saving, saved, error states)
- [ ] **Conflict indicators** (when data conflicts occur)

---

## 🔧 Supabase-Specific Best Practices

### Channel Management
- [ ] **Descriptive channel names** (e.g., `bookings-org-${orgId}`)
- [ ] **Role-based channels** (admin-only, operator-specific)
- [ ] **Channel cleanup** (remove when no longer needed)
- [ ] **Channel reuse** (same channel for related data)

### Postgres Changes Subscription
- [ ] **Specific table targeting** (not wildcard subscriptions)
- [ ] **Row-level filtering** (organization_id, user_id filters)
- [ ] **Event type filtering** (INSERT, UPDATE, DELETE specific)
- [ ] **Column filtering** (only watch relevant columns)

**Optimized Subscription:**
```typescript
// Good: Specific, filtered subscription
const subscription = supabase
  .channel(`bookings-org-${organizationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookings',
    filter: `organization_id=eq.${organizationId}` // Row-level filter
  }, handleNewBooking)
  .subscribe();
```

---

## 🧪 Realtime Testing Checklist

### Subscription Testing
- [ ] **Multiple tab testing** (same user, multiple browser tabs)
- [ ] **Cross-user testing** (admin sees operator actions)
- [ ] **Network interruption** (disconnect/reconnect scenarios)
- [ ] **Long-running sessions** (hours of continuous use)

### Performance Testing
- [ ] **High-frequency updates** (stress test with many changes)
- [ ] **Large payload handling** (big data updates)
- [ ] **Concurrent user simulation** (multiple users, same data)
- [ ] **Memory usage over time** (leak detection)

### Error Scenario Testing
- [ ] **Server restart** (graceful reconnection)
- [ ] **Database unavailable** (fallback behavior)
- [ ] **Permission changes** (user loses access mid-session)
- [ ] **Invalid data** (malformed real-time messages)

---

## 📊 Realtime Evidence Collection

### Connection Monitoring
```bash
evidence/realtime/
  connection-testing/
    websocket-lifecycle.log
    reconnection-attempts.log
    multi-tab-behavior.txt
```

### Memory Analysis
```bash
evidence/realtime/
  memory-testing/
    heap-snapshot-before.png
    heap-snapshot-after.png
    memory-growth-graph.png
    subscription-count-log.txt
```

### Performance Metrics
```bash
evidence/realtime/
  performance/
    event-handling-times.log
    debounce-effectiveness.txt
    throttling-results.log
```

---

## 🚨 REALTIME RED FLAGS

**CRITICAL** (immediate fix required):
1. **Memory leaks detected** (steady memory growth)
2. **Subscription not cleaned** (connections persist after unmount)
3. **Infinite loops** (useEffect triggering itself)
4. **No reconnection logic** (permanent disconnection on network issues)
5. **Duplicate subscriptions** (multiple channels for same data)

**HIGH PRIORITY** (fix this sprint):
1. **No debouncing on inputs** (API spam)
2. **No error handling** (crashes on connection loss)
3. **No connection status** (users don't know if live data is working)
4. **No event throttling** (performance issues on high-frequency updates)

**MEDIUM PRIORITY** (next sprint):
1. **Suboptimal subscription filters** (too broad, inefficient)
2. **No offline fallback** (app breaks without connection)
3. **No update batching** (many small updates instead of grouped)

**Status:** All items unchecked = REALTIME AUDIT REQUIRED  
**Next Action:** Start with memory leak detection (most critical)
