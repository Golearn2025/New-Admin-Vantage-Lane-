/**
 * Live Drivers Map Page - Mapbox Implementation
 * Real-time map view with Mapbox GL
 */

'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { useRealtimeDrivers } from '../hooks/useRealtimeDrivers';
import { getVehicleScale } from '../mapbox/config/markerConfig';
import { createDriverMarkerContainer, updateMarkerColor, updateMarkerRotation } from '../mapbox/markers/markerStyles';
import { getDriverColor, mapDriverStatus } from '../utils/markerHelpers';
import {
    feedGpsUpdate, isDriverRegistered,
    registerDriver,
    setMapMoving,
    startEngine, stopEngine,
    unregisterDriver,
} from '../utils/predictiveAnimation';
import { snapToNearestRoad } from '../utils/snapToRoad';

// Set Mapbox token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export function LiveDriversMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const markerElements = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastStatuses = useRef<Map<string, string>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hasInitializedBounds = useRef(false);

  // Get real driver data from Supabase
  const { drivers, loading: driversLoading } = useRealtimeDrivers({
    showOnline: true,
    showBusy: true,
  });


  // Filter and sort drivers
  const filteredDrivers = drivers
    .filter(driver => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
      const vehicle = (driver as any).vehicles?.[0];
      const licensePlate = vehicle?.license_plate?.toLowerCase() || '';
      return fullName.includes(query) || licensePlate.includes(query);
    })
    .sort((a, b) => {
      // Sort busy drivers first
      const aIsBusy = a.onlineStatus !== 'online';
      const bIsBusy = b.onlineStatus !== 'online';
      if (aIsBusy && !bIsBusy) return -1;
      if (!aIsBusy && bIsBusy) return 1;
      return 0;
    });

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('🚀 Initializing Mapbox...');

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [26.1025, 44.4268],
      zoom: 12,
    });

    // Notify animation engine when map is being dragged
    map.current.on('movestart', () => setMapMoving(true));
    map.current.on('moveend', () => setMapMoving(false));

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      console.log('✅ Mapbox loaded!');
      setIsLoaded(true);
    });

    // Start predictive animation engine
    startEngine();

    return () => {
      stopEngine();
      if (map.current) map.current.remove();
    };
  }, []);

  // Update driver markers with smooth animation
  useEffect(() => {
    if (!map.current || !isLoaded || driversLoading) return;


    // Process each driver
    drivers.forEach((driver) => {
      if (!driver.currentLatitude || !driver.currentLongitude) return;

      const rawPos = { lat: driver.currentLatitude, lng: driver.currentLongitude };
      // Snap to nearest road (Uber/Bolt style)
      const currentPos = snapToNearestRoad(map.current!, rawPos);

      // If driver is already registered in animation engine, feed new GPS
      if (isDriverRegistered(driver.id)) {
        const heading = feedGpsUpdate(driver.id, currentPos);

        // Rotate car SVG toward new heading
        if (heading !== null) {
          const el = markerElements.current.get(driver.id);
          if (el) updateMarkerRotation(el, heading, true);
        }

        // Update color if status changed
        const prevStatus = lastStatuses.current.get(driver.id);
        if (prevStatus !== driver.onlineStatus) {
          const driverStatus = mapDriverStatus(driver.onlineStatus, (driver as any).bookingStatus);
          const newColor = getDriverColor(driverStatus);
          const el = markerElements.current.get(driver.id);
          if (el) updateMarkerColor(el, newColor);
          lastStatuses.current.set(driver.id, driver.onlineStatus);
        }

        return; // Engine handles position updates via rAF
      }

      // If marker exists but not in engine (shouldn't happen), skip
      if (markers.current.has(driver.id)) {
        return;
      }

      // Create new marker for first time
      const driverStatus = mapDriverStatus(driver.onlineStatus, (driver as any).bookingStatus);
      const color = getDriverColor(driverStatus);

      // Get vehicle info for scale + plate
      const vehicles = (driver as any).vehicles || [];
      const vehicle = vehicles.find((v: any) => v?.license_plate) || vehicles[0];
      const vehicleScale = getVehicleScale(vehicle?.category);

      // Premium marker container (name + SVG + plate)
      const container = createDriverMarkerContainer({
        driverName: `${driver.firstName} ${driver.lastName}`,
        color,
        rotation: 0,
        vehicleScale,
        licensePlate: vehicle?.license_plate,
      });

      // Enhanced popup with more details (NO ADDRESS - just coordinates)
      const vehicleInfo = vehicle ? `${vehicle.make || 'N/A'} ${vehicle.model || ''} ${vehicle.year || ''}` : 'N/A';
      const popupHTML = `
        <div style="padding: 16px; min-width: 280px; font-family: system-ui;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 16px;">
              ${driver.firstName} ${driver.lastName}
            </div>
          </div>
          <div style="color: ${color}; font-weight: 600; margin-bottom: 12px; font-size: 14px;">
            ● ${driver.onlineStatus.toUpperCase()}
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">📍 COORDINATES</div>
            <div style="font-size: 13px; color: #374151; font-weight: 500; font-family: monospace;">
              ${driver.currentLatitude?.toFixed(6)}, ${driver.currentLongitude?.toFixed(6)}
            </div>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">🚗 VEHICLE</div>
            <div style="font-size: 13px; color: #374151; font-weight: 500;">
              ${vehicleInfo}
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              ${vehicle?.license_plate || 'N/A'} • ${vehicle?.color || 'N/A'} • ${vehicle?.category?.toUpperCase() || 'N/A'}
            </div>
          </div>
          ${(driver as any).phone ? `
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
            <a href="tel:${(driver as any).phone}" style="display: inline-block; background: #22C55E; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
              📞 Call Driver
            </a>
          </div>
          ` : ''}
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: container, anchor: 'center' })
        .setLngLat([currentPos.lng, currentPos.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25, maxWidth: '320px' }).setHTML(popupHTML))
        .addTo(map.current!);

      // Click handler for marker selection
      container.addEventListener('click', () => {
        setSelectedDriverId(driver.id);
      });

      // Store marker and container, register with animation engine
      markers.current.set(driver.id, marker);
      markerElements.current.set(driver.id, container);
      lastStatuses.current.set(driver.id, driver.onlineStatus);
      registerDriver(driver.id, marker, currentPos);
    });

    // Remove markers for drivers no longer in list
    const driverIds = new Set(drivers.map(d => d.id));
    markers.current.forEach((marker, id) => {
      if (!driverIds.has(id)) {
        marker.remove();
        markers.current.delete(id);
        markerElements.current.delete(id);
        lastStatuses.current.delete(id);
        unregisterDriver(id);
      }
    });

    // Auto-fit bounds DOAR prima dată când apar șoferi
    if (drivers.length > 0 && !hasInitializedBounds.current && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      drivers.forEach((driver) => {
        if (driver.currentLatitude && driver.currentLongitude) {
          bounds.extend([driver.currentLongitude, driver.currentLatitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      hasInitializedBounds.current = true;
    }
  }, [isLoaded, drivers, driversLoading]);

  const onlineCount = drivers.filter(d => d.onlineStatus === 'online').length;
  const busyCount = drivers.filter(d => d.onlineStatus !== 'online' && d.onlineStatus !== 'offline').length;

  // Zoom to driver on map
  const zoomToDriver = (driver: any) => {
    if (!map.current || !driver.currentLatitude || !driver.currentLongitude) return;
    map.current.flyTo({
      center: [driver.currentLongitude, driver.currentLatitude],
      zoom: 15,
      duration: 1000
    });
    setSelectedDriverId(driver.id);
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header with stats */}
      <div style={{ 
        padding: '20px', 
        background: '#1a1a1a', 
        color: 'white',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexShrink: 0
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', whiteSpace: 'nowrap' }}>🗺️ Live Drivers Map</h1>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '12px 24px', 
            background: '#22C55E', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '16px',
            whiteSpace: 'nowrap'
          }}>
            🟢 Online: {onlineCount}
          </div>
          <div style={{ 
            padding: '12px 24px', 
            background: '#FCD34D', 
            color: '#000',
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '16px',
            whiteSpace: 'nowrap'
          }}>
            🟡 Busy: {busyCount}
          </div>
          <div style={{ 
            padding: '12px 24px', 
            background: '#3b82f6', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '16px',
            whiteSpace: 'nowrap'
          }}>
            📍 Total: {drivers.length}
          </div>
          {driversLoading && (
            <div style={{ 
              padding: '12px 24px', 
              background: '#8b5cf6', 
              borderRadius: '8px', 
              fontSize: '15px',
              whiteSpace: 'nowrap'
            }}>
              ⏳ Loading...
            </div>
          )}
        </div>
      </div>

      {/* Main content area with map and sidebar */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Mapbox Map */}
        <div ref={mapContainer} style={{ flex: 1 }} />

        {/* Sidebar with driver list */}
        <div style={{
          width: '350px',
          background: '#1a1a1a',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #333',
          overflow: 'hidden'
        }}>
          {/* Search box */}
          <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
            <input
              type="text"
              placeholder="🔍 Search driver or license plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Driver count */}
          <div style={{
            padding: '12px 16px',
            background: '#252525',
            borderBottom: '1px solid #333',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            📋 DRIVERS ({filteredDrivers.length})
            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#888' }}>
              🟡 Busy: {filteredDrivers.filter(d => d.onlineStatus !== 'online').length} • 
              🟢 Online: {filteredDrivers.filter(d => d.onlineStatus === 'online').length}
            </span>
          </div>

          {/* Driver list */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filteredDrivers.map((driver) => {
              const vehicles = (driver as any).vehicles || [];
              const vehicle = vehicles.find((v: any) => v?.license_plate) || vehicles[0];
              const isBusy = driver.onlineStatus !== 'online';
              const isSelected = driver.id === selectedDriverId;

              return (
                <div
                  key={driver.id}
                  onClick={() => zoomToDriver(driver)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    background: isSelected ? '#2a4a2a' : 'transparent',
                    transition: 'background 0.2s',
                    borderLeft: isSelected ? '3px solid #22C55E' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#252525';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {isBusy ? '🟡' : '🟢'} {driver.firstName} {driver.lastName}
                    </div>
                    {isBusy && (
                      <span style={{
                        background: '#FCD34D',
                        color: '#000',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        JOB
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                    📍 {(driver as any).address || `${driver.currentLatitude?.toFixed(4)}, ${driver.currentLongitude?.toFixed(4)}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    🚗 {vehicle?.license_plate || 'N/A'} • {vehicle?.make || 'No vehicle'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomToDriver(driver);
                    }}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: '#22C55E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    📍 Zoom to Driver
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
