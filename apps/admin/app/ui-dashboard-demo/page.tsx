/**
 * UI-Dashboard Demo Page
 * Shows MetricCard (Gradient) + BarBasic
 */

'use client';

import { MetricCard, BarBasic } from '@vantage-lane/ui-dashboard';
import { DASHBOARD_CARDS } from '@admin/shared/config/dashboard.spec';

// Mock data
const mockBarData = [
  { x: '2025-01-10', y: 12345 },
  { x: '2025-01-11', y: 15678 },
  { x: '2025-01-12', y: 13456 },
  { x: '2025-01-13', y: 18234 },
  { x: '2025-01-14', y: 16789 },
  { x: '2025-01-15', y: 19567 },
  { x: '2025-01-16', y: 21234 },
];

export default function UIDashboardDemoPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: '700' }}>
        @vantage-lane/ui-dashboard Demo
      </h1>
      
      {/* MetricCards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        <MetricCard
          spec={DASHBOARD_CARDS[1]!} // GMV Completed
          value={4523150} // £45,231.50 in pence
          delta={12.5}
          variant="gradient"
          gradient="purple"
        />
        
        <MetricCard
          spec={DASHBOARD_CARDS[0]!} // Bookings Completed
          value={1234}
          delta={8.2}
          variant="gradient"
          gradient="pink"
        />
        
        <MetricCard
          spec={DASHBOARD_CARDS[2]!} // Platform Commission
          value={815600} // £8,156.00 in pence
          delta={-2.1}
          variant="gradient"
          gradient="blue"
        />
      </div>
      
      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '24px'
      }}>
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
            Daily Revenue Trend
          </h2>
          <BarBasic
            data={mockBarData}
            unit="GBP_pence"
            height={300}
          />
        </div>
        
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
            Bookings Count
          </h2>
          <BarBasic
            data={mockBarData.map(d => ({ ...d, y: Math.floor(d.y / 100) }))}
            unit="count"
            height={300}
            color="var(--vl-chart-success, #10b981)"
          />
        </div>
      </div>
      
      {/* Loading States */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Loading States
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <MetricCard
            spec={DASHBOARD_CARDS[0]!}
            value={null}
            loading={true}
            variant="gradient"
            gradient="green"
          />
          <BarBasic
            data={[]}
            loading={true}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
