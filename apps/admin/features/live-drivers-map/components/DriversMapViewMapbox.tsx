/**
 * Drivers Map View - Mapbox Implementation
 * 
 * Clean UI component - doar prezentare, logica în hooks și managers
 * Conform RULES.md: UI fără logică, <100 linii
 */

'use client';

import type { DriverLocationData } from '@entities/driver-location';
import { ErrorBanner, LoadingState } from '@vantage-lane/ui-core';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef } from 'react';
import { useDriverMarkers } from '../mapbox/hooks/useDriverMarkers';
import { useMapboxMap } from '../mapbox/hooks/useMapboxMap';

interface DriversMapViewMapboxProps {
  drivers: DriverLocationData[];
  loading: boolean;
  error: string | null;
  onDriverClick: (driver: DriverLocationData) => void;
  darkMode?: boolean;
}

/**
 * DriversMapViewMapbox Component
 * 
 * Mapbox-based map view for live driver tracking
 */
export function DriversMapViewMapbox({
  drivers,
  loading,
  error,
  onDriverClick,
  darkMode = true,
}: DriversMapViewMapboxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  // Initialize Mapbox map
  const { mapManager, isLoaded, error: mapError } = useMapboxMap(
    mapContainer,
    {
      theme: darkMode ? 'dark' : 'light',
    }
  );

  // Manage driver markers
  const { selectedDriverId } = useDriverMarkers({
    mapManager,
    drivers,
    onDriverClick,
    autoFitBounds: true,
  });

  // Handle errors
  if (error || mapError) {
    return (
      <div className="map-error-container" style={{ padding: '20px' }}>
        <ErrorBanner message={`Map Error: ${error || mapError}`} />
      </div>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="map-loading-container" style={{ 
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
    <div className="drivers-map-view" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Map container */}
      <div
        ref={mapContainer}
        className="mapbox-container"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Loading overlay */}
      {loading && (
        <div
          className="map-overlay-loading"
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          <LoadingState message="Updating driver locations..." size="small" />
        </div>
      )}

      {/* Driver count indicator */}
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
          {selectedDriverId && ' • 1 selected'}
        </div>
      )}
    </div>
  );
}
