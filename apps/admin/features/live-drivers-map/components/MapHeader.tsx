/**
 * MapHeader — Stats bar with theme switcher and driver counts.
 */

'use client';

import type { MapTheme } from '../hooks/useMapInstance';

interface MapHeaderProps {
  mapStyle: MapTheme;
  onStyleChange: (style: MapTheme) => void;
  onlineCount: number;
  busyCount: number;
  totalCount: number;
  isLoading: boolean;
}

const THEME_LABELS: Record<MapTheme, string> = {
  day: '☀️ Day',
  dusk: '🌅 Dusk',
  night: '🌙 Night',
  dawn: '🌄 Dawn',
  satellite: '🛰️ Satellite',
};

const THEMES: MapTheme[] = ['day', 'dusk', 'night', 'dawn', 'satellite'];

export function MapHeader({ mapStyle, onStyleChange, onlineCount, busyCount, totalCount, isLoading }: MapHeaderProps) {
  return (
    <div style={{
      padding: '20px',
      background: '#1a1a1a',
      color: 'white',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      flexWrap: 'wrap',
      flexShrink: 0,
    }}>
      <h1 style={{ margin: 0, fontSize: '24px', whiteSpace: 'nowrap' }}>🗺️ Live Drivers Map</h1>

      <div style={{ display: 'flex', gap: '4px', background: '#333', borderRadius: '8px', padding: '3px' }}>
        {THEMES.map((t) => (
          <button
            key={t}
            onClick={() => onStyleChange(t)}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: mapStyle === t ? '#4f46e5' : 'transparent',
              color: mapStyle === t ? 'white' : '#999',
              transition: 'all 0.2s',
            }}
          >
            {THEME_LABELS[t]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <StatBadge color="#22C55E" label={`🟢 Online: ${onlineCount}`} />
        <StatBadge color="#FCD34D" textColor="#000" label={`🟡 Busy: ${busyCount}`} />
        <StatBadge color="#3b82f6" label={`📍 Total: ${totalCount}`} />
        {isLoading && <StatBadge color="#8b5cf6" label="⏳ Loading..." />}
      </div>
    </div>
  );
}

function StatBadge({ color, label, textColor = 'white' }: { color: string; label: string; textColor?: string }) {
  return (
    <div style={{
      padding: '12px 24px',
      background: color,
      color: textColor,
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  );
}
