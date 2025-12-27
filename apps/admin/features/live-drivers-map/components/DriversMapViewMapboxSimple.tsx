/**
 * Drivers Map View - Mapbox Simple Implementation
 * Direct initialization without complex hooks
 */

'use client';

import type { DriverLocationData } from '@entities/driver-location';
import { ErrorBanner, LoadingState } from '@vantage-lane/ui-core';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

// Set Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface DriversMapViewMapboxSimpleProps {
  drivers: DriverLocationData[];
  loading: boolean;
  error: string | null;
  onDriverClick: (driver: DriverLocationData) => void;
  darkMode?: boolean;
}

export function DriversMapViewMapboxSimple({
  drivers,
  loading,
  error,
  onDriverClick,
  darkMode = true,
}: DriversMapViewMapboxSimpleProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('🚀 Initializing Mapbox map...');
    console.log('🔑 Token:', mapboxgl.accessToken ? 'SET ✅' : 'MISSING ❌');

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
        center: [26.1025, 44.4268], // Bucharest
        zoom: 12,
      });

      // Add controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        console.log('✅ Mapbox loaded!');
        setIsLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
        setMapError(e.error?.message || 'Map error');
      });
    } catch (err) {
      console.error('❌ Failed to create map:', err);
      setMapError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [darkMode]);

  // Update markers when drivers change
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    console.log('🔄 Updating markers for', drivers.length, 'drivers');

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    // Add new markers
    drivers.forEach((driver) => {
      if (!driver.currentLatitude || !driver.currentLongitude) return;

      // Marker color based on status
      const color = driver.onlineStatus === 'online' ? '#22C55E' : '#FCD34D';

      // Create marker
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([driver.currentLongitude, driver.currentLatitude])
        .addTo(map.current!);

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <strong>${driver.firstName} ${driver.lastName}</strong><br/>
          <span style="color: ${color};">● ${driver.onlineStatus}</span>
        </div>
      `);
      marker.setPopup(popup);

      // Click handler
      el.addEventListener('click', () => {
        onDriverClick(driver);
      });

      markers.current.set(driver.id, marker);
    });

    // Fit bounds to show all drivers
    if (drivers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      drivers.forEach((driver) => {
        if (driver.currentLatitude && driver.currentLongitude) {
          bounds.extend([driver.currentLongitude, driver.currentLatitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [drivers, isLoaded, onDriverClick]);

  // Handle errors
  if (error || mapError) {
    return (
      <div style={{ padding: '20px' }}>
        <ErrorBanner message={`Map Error: ${error || mapError}`} />
      </div>
    );
  }

  // Show loading
  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        background: darkMode ? '#0F172A' : '#F8FAFC'
      }}>
        <LoadingState message="Loading Mapbox..." />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Driver count */}
      {drivers.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            zIndex: 1000,
          }}
        >
          🚗 {drivers.length} driver{drivers.length !== 1 ? 's' : ''} online
        </div>
      )}
    </div>
  );
}
