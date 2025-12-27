'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

/**
 * MapboxTest Component
 * 
 * Test component pentru a verifica integrarea Mapbox
 * Features testate:
 * - Încărcare hartă cu dark theme
 * - Controale de navigare
 * - Marker custom cu culoare
 * - Popup cu informații
 */
export function MapboxTest() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verifică dacă token-ul există
    if (!mapboxgl.accessToken) {
      setError('❌ Mapbox token lipsește! Verifică .env.local');
      return;
    }

    // Previne inițializarea multiplă
    if (!mapContainer.current || map.current) return;

    try {
      // Inițializează harta Mapbox
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark theme pentru admin
        center: [26.1025, 44.4268], // București (lng, lat - ATENȚIE: ordinea inversă față de Google!)
        zoom: 12,
        pitch: 0, // Unghi de înclinare (0 = 2D, 60 = 3D)
        bearing: 0 // Rotație hartă
      });

      // Event: hartă încărcată
      map.current.on('load', () => {
        console.log('✅ Mapbox map loaded successfully!');
        setMapLoaded(true);
      });

      // Event: eroare
      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
        setError(`Mapbox error: ${e.error?.message || 'Unknown error'}`);
      });

      // Adaugă controale de navigare (zoom +/-, compass)
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }), 
        'top-right'
      );

      // Adaugă control de scale
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: 'metric'
        }),
        'bottom-left'
      );

      // Adaugă marker de test (HQ Vantage Lane)
      const marker = new mapboxgl.Marker({ 
        color: '#22C55E', // Verde (ONLINE)
        scale: 1.2
      })
        .setLngLat([26.1025, 44.4268])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; color: #22C55E; font-size: 14px; font-weight: 600;">
                  🚗 Vantage Lane HQ
                </h3>
                <p style="margin: 0; font-size: 12px; color: #64748B;">
                  București, România
                </p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #94A3B8;">
                  Status: <span style="color: #22C55E;">ONLINE</span>
                </p>
              </div>
            `)
        )
        .addTo(map.current);

      // Adaugă markeri suplimentari pentru demo (șoferi fictivi)
      const demoDrivers = [
        { lng: 26.0950, lat: 44.4350, name: 'Driver 1', status: 'EN_ROUTE', color: '#047857' },
        { lng: 26.1100, lat: 44.4200, name: 'Driver 2', status: 'ARRIVED', color: '#B621FE' },
        { lng: 26.1200, lat: 44.4300, name: 'Driver 3', status: 'IN_PROGRESS', color: '#FFD700' },
        { lng: 26.0900, lat: 44.4250, name: 'Driver 4', status: 'ONLINE', color: '#22C55E' },
      ];

      demoDrivers.forEach((driver) => {
        new mapboxgl.Marker({ 
          color: driver.color,
          scale: 1.0
        })
          .setLngLat([driver.lng, driver.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 4px 0; color: ${driver.color}; font-size: 13px; font-weight: 600;">
                    🚗 ${driver.name}
                  </h3>
                  <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                    Status: <span style="color: ${driver.color};">${driver.status}</span>
                  </p>
                </div>
              `)
          )
          .addTo(map.current!);
      });

    } catch (err) {
      console.error('❌ Failed to initialize Mapbox:', err);
      setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Cleanup la unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Container hartă */}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />

      {/* Status indicator */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1
        }}
      >
        {error ? (
          <>
            <span style={{ color: '#EF4444' }}>❌</span>
            <span style={{ color: '#EF4444' }}>{error}</span>
          </>
        ) : mapLoaded ? (
          <>
            <span style={{ color: '#22C55E' }}>✅</span>
            <span>Mapbox Loaded</span>
          </>
        ) : (
          <>
            <span style={{ color: '#FFD700' }}>⏳</span>
            <span>Loading Mapbox...</span>
          </>
        )}
      </div>

      {/* Info panel */}
      {mapLoaded && !error && (
        <div 
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '11px',
            maxWidth: '250px',
            zIndex: 1
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#22C55E' }}>
            🎉 Mapbox Integration Success!
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}>
            <li>✅ Dark theme active</li>
            <li>✅ Navigation controls</li>
            <li>✅ Custom markers (5 total)</li>
            <li>✅ Popups with driver info</li>
            <li>✅ Ready for migration!</li>
          </ul>
          <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: '#94A3B8' }}>
            Click pe markeri pentru detalii
          </p>
        </div>
      )}
    </div>
  );
}
