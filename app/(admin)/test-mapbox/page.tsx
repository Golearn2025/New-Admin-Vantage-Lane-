'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

// Set token
mapboxgl.accessToken = 'pk.eyJ1IjoidmFudGFnZWxhbmUiLCJhIjoiY21peGw4NTIxMDR5YjNkcXp3eGN0OTc3YyJ9.S1VwkfoU1jU97dOF4Nayjw';

export default function TestMapboxPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('🚀 TEST: Initializing Mapbox...');
    console.log('🔑 TEST: Token:', mapboxgl.accessToken ? 'SET ✅' : 'MISSING ❌');

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [26.1025, 44.4268],
      zoom: 12,
    });

    map.current.on('load', () => {
      console.log('✅ TEST: Mapbox loaded!');
      setIsLoaded(true);

      // Add test marker
      new mapboxgl.Marker({ color: '#22C55E' })
        .setLngLat([26.1025, 44.4268])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Test Marker</h3>'))
        .addTo(map.current!);
    });

    map.current.on('error', (e) => {
      console.error('❌ TEST: Mapbox error:', e);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: '#1a1a1a', color: 'white' }}>
        <h1>🗺️ Mapbox Test Page</h1>
        <p>Status: {isLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
      </div>
      <div 
        ref={mapContainer} 
        style={{ flex: 1, width: '100%' }}
      />
    </div>
  );
}
