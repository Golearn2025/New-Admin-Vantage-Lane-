/**
 * DriversSidebar — Search box + scrollable driver list with zoom-to-driver.
 */

'use client';

interface Driver {
  id: string;
  firstName: string | null;
  lastName: string | null;
  onlineStatus: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  [key: string]: any;
}

interface DriversSidebarProps {
  drivers: Driver[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDriverId: string | null;
  onZoomToDriver: (driver: Driver) => void;
}

export function DriversSidebar({
  drivers,
  searchQuery,
  onSearchChange,
  selectedDriverId,
  onZoomToDriver,
}: DriversSidebarProps) {
  const busyCount = drivers.filter((d) => d.onlineStatus !== 'online').length;
  const onlineCount = drivers.filter((d) => d.onlineStatus === 'online').length;

  return (
    <div style={{
      width: '350px',
      background: '#1a1a1a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #333',
      overflow: 'hidden',
    }}>
      {/* Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
        <input
          type="text"
          placeholder="🔍 Search driver or license plate..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {/* Count */}
      <div style={{
        padding: '12px 16px',
        background: '#252525',
        borderBottom: '1px solid #333',
        fontSize: '13px',
        fontWeight: '600',
      }}>
        📋 DRIVERS ({drivers.length})
        <span style={{ marginLeft: '12px', fontSize: '12px', color: '#888' }}>
          🟡 Busy: {busyCount} • 🟢 Online: {onlineCount}
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {drivers.map((driver) => (
          <DriverListItem
            key={driver.id}
            driver={driver}
            isSelected={driver.id === selectedDriverId}
            onZoom={() => onZoomToDriver(driver)}
          />
        ))}
      </div>
    </div>
  );
}

function DriverListItem({
  driver,
  isSelected,
  onZoom,
}: {
  driver: Driver;
  isSelected: boolean;
  onZoom: () => void;
}) {
  const vehicles = driver.vehicles || [];
  const vehicle = vehicles.find((v: any) => v?.license_plate) || vehicles[0];
  const isBusy = driver.onlineStatus !== 'online';

  return (
    <div
      onClick={onZoom}
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #333',
        cursor: 'pointer',
        background: isSelected ? '#2a4a2a' : 'transparent',
        transition: 'background 0.2s',
        borderLeft: isSelected ? '3px solid #22C55E' : '3px solid transparent',
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#252525'; }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>
          {isBusy ? '🟡' : '🟢'} {driver.firstName || ''} {driver.lastName || ''}
        </div>
        {isBusy && (
          <span style={{
            background: '#FCD34D',
            color: '#000',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
          }}>
            JOB
          </span>
        )}
      </div>
      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
        📍 {driver.address || `${driver.currentLatitude?.toFixed(4)}, ${driver.currentLongitude?.toFixed(4)}`}
      </div>
      <div style={{ fontSize: '12px', color: '#999' }}>
        🚗 {vehicle?.license_plate || 'N/A'} • {vehicle?.make || 'No vehicle'}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onZoom(); }}
        style={{
          marginTop: '8px',
          padding: '6px 12px',
          background: '#22C55E',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        📍 Zoom to Driver
      </button>
    </div>
  );
}
