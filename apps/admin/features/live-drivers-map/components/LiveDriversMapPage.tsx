/**
 * Live Drivers Map Page — Orchestrator only.
 * All logic lives in hooks, all UI in child components.
 */

'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useRef, useState } from 'react';
import { useDriverMarkerSync } from '../hooks/useDriverMarkerSync';
import { useFilteredDrivers } from '../hooks/useFilteredDrivers';
import { useMapInstance, type MapTheme } from '../hooks/useMapInstance';
import { useRealtimeDrivers } from '../hooks/useRealtimeDrivers';
import { DriversSidebar } from './DriversSidebar';
import { MapHeader } from './MapHeader';

export function LiveDriversMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapStyle, setMapStyle] = useState<MapTheme>('day');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { drivers, loading: driversLoading } = useRealtimeDrivers({
    showOnline: true,
    showBusy: true,
  });

  const { map, isLoaded, markerElementsRef } = useMapInstance(mapContainer, mapStyle, {
    showPointOfInterestLabels: false,
    showTransitLabels: false,
  });

  useDriverMarkerSync(map, isLoaded, drivers, driversLoading, markerElementsRef, setSelectedDriverId);

  const { filteredDrivers, onlineCount, busyCount, totalCount } = useFilteredDrivers(drivers, searchQuery);

  const zoomToDriver = useCallback((driver: any) => {
    if (!map.current || !driver.currentLatitude || !driver.currentLongitude) return;
    map.current.flyTo({
      center: [driver.currentLongitude, driver.currentLatitude],
      zoom: 15,
      duration: 1000,
    });
    setSelectedDriverId(driver.id);
  }, []);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MapHeader
        mapStyle={mapStyle}
        onStyleChange={setMapStyle}
        onlineCount={onlineCount}
        busyCount={busyCount}
        totalCount={totalCount}
        isLoading={driversLoading}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div ref={mapContainer} style={{ flex: 1 }} />
        <DriversSidebar
          drivers={filteredDrivers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDriverId={selectedDriverId}
          onZoomToDriver={zoomToDriver}
        />
      </div>
    </div>
  );
}
