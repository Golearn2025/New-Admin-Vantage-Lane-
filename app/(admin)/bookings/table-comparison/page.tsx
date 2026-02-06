'use client';

/**
 * Table Comparison Page
 * Compare original BookingsTable vs new TanStack Table
 */

import { useState } from 'react';
import { BookingsTable } from '../../../../apps/admin/features/shared/bookings-table/components/BookingsTable';
import { BookingsTableTanStack } from '../../../../apps/admin/features/shared/bookings-table/components/BookingsTableTanStack';

export default function TableComparisonPage() {
  const [activeTable, setActiveTable] = useState<'original' | 'tanstack'>('tanstack');

  return (
    <div style={{ padding: '24px', maxWidth: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          📊 Table Comparison
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Compare the original BookingsTable with the new TanStack Table implementation
        </p>

        {/* Toggle buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTable('tanstack')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: activeTable === 'tanstack' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              background: activeTable === 'tanstack' ? '#eff6ff' : 'white',
              color: activeTable === 'tanstack' ? '#1e40af' : '#374151',
              fontWeight: activeTable === 'tanstack' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
          >
            🚀 TanStack Table (NEW)
          </button>
          <button
            onClick={() => setActiveTable('original')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: activeTable === 'original' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              background: activeTable === 'original' ? '#eff6ff' : 'white',
              color: activeTable === 'original' ? '#1e40af' : '#374151',
              fontWeight: activeTable === 'original' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
          >
            📋 Original Table
          </button>
        </div>

        {/* Feature comparison */}
        <div
          style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            ✨ TanStack Table Features:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
              <span>Column separators (vertical lines)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
              <span>Smooth column resizing</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
              <span>Better sorting indicators</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
              <span>Premium hover effects</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
              <span>All original data preserved</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
              <span>Better performance</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Active table */}
      {activeTable === 'tanstack' ? (
        <BookingsTableTanStack
          statusFilter={['pending', 'confirmed', 'assigned', 'in_progress']}
          title="Active Bookings (TanStack)"
          description="New premium table with column separators"
          showStatusFilter={true}
        />
      ) : (
        <BookingsTable
          statusFilter={['pending', 'confirmed', 'assigned', 'in_progress']}
          title="Active Bookings (Original)"
          description="Original custom table"
          showStatusFilter={true}
        />
      )}
    </div>
  );
}
