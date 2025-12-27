import { MapboxTest } from '../../../apps/admin/features/live-drivers-map/components/MapboxTest';

/**
 * Mapbox Test Page
 * 
 * Pagină de test pentru verificarea integrării Mapbox
 * Accesează: http://localhost:3000/mapbox-test
 */
export default function MapboxTestPage() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      background: '#0F172A'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#1E293B',
        borderBottom: '1px solid #334155',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
          🗺️ Mapbox Integration Test
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
          Testing Mapbox GL JS with dark theme and custom markers
        </p>
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, padding: '16px' }}>
        <MapboxTest />
      </div>
    </div>
  );
}
