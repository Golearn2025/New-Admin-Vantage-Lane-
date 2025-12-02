/**
 * Performance Monitoring & Cost Tracking
 * 
 * Monitorizează costurile Supabase și performanța React în timp real
 */

// 🚀 SUPABASE COST MONITORING
interface QueryMetrics {
  endpoint: string;
  duration: number;
  rowCount: number;
  timestamp: number;
  cost: number; // estimated cost in USD
}

class SupabaseCostMonitor {
  private queries: QueryMetrics[] = [];
  private readonly COST_PER_1000_QUERIES = 0.10; // $0.10 per 1000 queries
  
  trackQuery(endpoint: string, duration: number, rowCount: number = 0) {
    const cost = this.COST_PER_1000_QUERIES / 1000; // Cost per single query
    
    const metric: QueryMetrics = {
      endpoint,
      duration,
      rowCount,
      timestamp: Date.now(),
      cost
    };
    
    this.queries.push(metric);
    
    // 🚨 Alert for expensive queries
    if (duration > 200) {
      console.warn(`🐌 Slow Supabase query: ${endpoint} (${duration}ms)`);
    }
    
    if (rowCount > 1000) {
      console.warn(`📊 Large result set: ${endpoint} (${rowCount} rows)`);
    }
    
    // Log navigation-related queries (these are the expensive ones)
    if (endpoint.includes('auth') || endpoint.includes('admin_users')) {
      console.log(`🧭 Navigation query: ${endpoint} (${duration}ms) - Cost: $${cost.toFixed(6)}`);
    }
    
    return cost;
  }
  
  getDailyCostEstimate(): number {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    return this.queries
      .filter(q => q.timestamp > oneDayAgo)
      .reduce((total, q) => total + q.cost, 0);
  }
  
  getMonthlyCostEstimate(): number {
    return this.getDailyCostEstimate() * 30;
  }
  
  getNavigationCost(): number {
    const navigationQueries = this.queries.filter(q => 
      q.endpoint.includes('auth') || 
      q.endpoint.includes('admin_users') ||
      q.endpoint.includes('getSession')
    );
    
    return navigationQueries.reduce((total, q) => total + q.cost, 0);
  }
  
  generateReport(): string {
    const totalQueries = this.queries.length;
    const dailyCost = this.getDailyCostEstimate();
    const monthlyCost = this.getMonthlyCostEstimate();
    const navigationCost = this.getNavigationCost();
    
    return `
🚀 SUPABASE COST REPORT
========================
Total Queries Today: ${totalQueries}
Daily Cost: $${dailyCost.toFixed(4)}
Monthly Estimate: $${monthlyCost.toFixed(2)}
Navigation Cost: $${navigationCost.toFixed(4)} (${((navigationCost/dailyCost)*100).toFixed(1)}% of total)

🎯 OPTIMIZATION TARGETS:
- Reduce navigation queries by 80%
- Implement React Query caching
- Expected savings: $${(navigationCost * 0.8 * 30).toFixed(2)}/month
    `;
  }
}

// 🚀 REACT PERFORMANCE MONITORING
class ReactPerformanceMonitor {
  public renders: Array<{
    component: string;
    duration: number;
    timestamp: number;
  }> = [];
  
  trackRender(componentName: string, duration: number) {
    this.renders.push({
      component: componentName,
      duration,
      timestamp: Date.now()
    });
    
    // Alert for slow renders
    if (duration > 16) { // 60fps = 16ms per frame
      console.warn(`🐌 Slow render: ${componentName} (${duration}ms)`);
    }
  }
  
  trackNavigation(fromPath: string, toPath: string, duration: number) {
    console.log(`🧭 Navigation: ${fromPath} → ${toPath} (${duration}ms)`);
    
    if (duration > 300) {
      console.warn(`🚨 Slow navigation detected: ${duration}ms`);
    }
  }
  
  generateReport(): string {
    const slowRenders = this.renders.filter(r => r.duration > 16);
    const avgRenderTime = this.renders.reduce((sum, r) => sum + r.duration, 0) / this.renders.length;
    
    return `
⚡ REACT PERFORMANCE REPORT  
===========================
Total Renders: ${this.renders.length}
Average Render Time: ${avgRenderTime.toFixed(2)}ms
Slow Renders (>16ms): ${slowRenders.length}
Worst Render: ${Math.max(...this.renders.map(r => r.duration))}ms
    `;
  }
}

// 🚀 RENDER.COM PREPARATION MONITOR
class RenderComMonitor {
  public memoryUsage: number[] = [];
  
  trackMemoryUsage() {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      this.memoryUsage.push(usedMB);
      
      console.log(`💾 Memory usage: ${usedMB}MB`);
      
      if (usedMB > 100) {
        console.warn(`🚨 High memory usage: ${usedMB}MB (target: <50MB)`);
      }
    }
  }
  
  getBundleSize(): Promise<number> {
    // Estimate based on loaded scripts
    return new Promise((resolve) => {
      const scripts = Array.from(document.scripts);
      let totalSize = 0;
      
      scripts.forEach(script => {
        if (script.src && script.src.includes('/_next/')) {
          // Rough estimate - in production would use actual bundle stats
          totalSize += 50; // KB per script (rough estimate)
        }
      });
      
      resolve(totalSize);
    });
  }
  
  async generateReport(): Promise<string> {
    const avgMemory = this.memoryUsage.reduce((sum, m) => sum + m, 0) / this.memoryUsage.length;
    const bundleSize = await this.getBundleSize();
    
    return `
🚀 RENDER.COM READINESS REPORT
==============================
Average Memory: ${avgMemory.toFixed(1)}MB (target: <50MB)
Bundle Size Estimate: ${bundleSize}KB (target: <1MB)
Cold Start Ready: ${avgMemory < 50 ? '✅' : '❌'}
Memory Efficient: ${Math.max(...this.memoryUsage) < 75 ? '✅' : '❌'}
    `;
  }
}

// 🚀 GLOBAL PERFORMANCE MANAGER
class PerformanceManager {
  public supabase = new SupabaseCostMonitor();
  public react = new ReactPerformanceMonitor();
  public render = new RenderComMonitor();
  
  startMonitoring() {
    console.log('🚀 Performance monitoring started');
    
    // Track memory usage every 30 seconds
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.render.trackMemoryUsage();
      }, 30000);
    }
  }
  
  async generateFullReport(): Promise<string> {
    const supabaseReport = this.supabase.generateReport();
    const reactReport = this.react.generateReport();
    const renderReport = await this.render.generateReport();
    
    return `
${supabaseReport}

${reactReport}

${renderReport}

🎯 SUMMARY & ACTIONS:
====================
1. 🚨 Navigation optimization needed: Save ~$${(this.supabase.getNavigationCost() * 0.8 * 30).toFixed(2)}/month
2. 💾 Memory optimization: ${this.render.memoryUsage.length > 0 && Math.max(...this.render.memoryUsage) > 50 ? 'NEEDED' : 'GOOD'}
3. ⚡ Render performance: ${this.react.renders.filter(r => r.duration > 16).length > 0 ? 'NEEDS WORK' : 'GOOD'}
    `;
  }
}

// 🚀 SINGLETON INSTANCE
export const performanceManager = new PerformanceManager();

// 🚀 DEVELOPMENT HELPER FUNCTIONS
export function startPerformanceMonitoring() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    performanceManager.startMonitoring();
    
    // Add global helper functions
    (window as any).perf = {
      report: () => performanceManager.generateFullReport().then(console.log),
      supabase: performanceManager.supabase,
      react: performanceManager.react,
      render: performanceManager.render,
    };
    
    console.log('🚀 Performance monitoring active. Use window.perf.report() for full report.');
  }
}

// 🚀 HOOK WRAPPERS FOR EASY INTEGRATION
export function withPerformanceTracking<T>(
  hookName: string, 
  hookFn: () => T
): T {
  const start = performance.now();
  const result = hookFn();
  const duration = performance.now() - start;
  
  performanceManager.react.trackRender(hookName, duration);
  
  return result;
}
