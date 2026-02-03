/**
 * Live Drivers Map Page - Mapbox Implementation
 * Real-time map view with Mapbox GL
 */

'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { useRealtimeDrivers } from '../hooks/useRealtimeDrivers';
import { calculateBearing } from '../utils/smoothMarkerAnimation';

// Set Mapbox token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export function LiveDriversMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const markerElements = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastPositions = useRef<Map<string, { lat: number; lng: number }>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hasInitializedBounds = useRef(false);
  const isMapMoving = useRef(false);

  // Get real driver data from Supabase
  const { drivers, loading: driversLoading } = useRealtimeDrivers({
    showOnline: true,
    showBusy: true,
  });

  // Debug: Check what data we have
  useEffect(() => {
    if (drivers.length > 0) {
      console.log('🔍 First driver data:', drivers[0]);
      console.log('🔍 Address field:', (drivers[0] as any).address);
      console.log('🔍 Vehicles field:', (drivers[0] as any).vehicles);
    }
  }, [drivers]);

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

    // Disable transitions când user mută harta (previne marker "floating")
    map.current.on('movestart', () => {
      isMapMoving.current = true;
      console.log('🗺️ Map movestart - disabling transitions for', markers.current.size, 'markers');
      markers.current.forEach((marker) => {
        const element = marker.getElement();
        element.style.transition = 'none';
      });
    });

    // Re-enable transitions când user termină de mutat harta
    map.current.on('moveend', () => {
      isMapMoving.current = false;
      console.log('🗺️ Map moveend - re-enabling transitions for', markers.current.size, 'markers');
      markers.current.forEach((marker) => {
        const element = marker.getElement();
        element.style.transition = 'transform 2s linear';
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      console.log('✅ Mapbox loaded!');
      setIsLoaded(true);
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // Update driver markers with smooth animation
  useEffect(() => {
    if (!map.current || !isLoaded || driversLoading) return;

    console.log('🔄 Updating', drivers.length, 'driver markers');

    // Process each driver
    drivers.forEach((driver) => {
      if (!driver.currentLatitude || !driver.currentLongitude) return;

      const currentPos = { lat: driver.currentLatitude, lng: driver.currentLongitude };
      const existingMarker = markers.current.get(driver.id);
      const lastPos = lastPositions.current.get(driver.id);

      // If marker exists and position changed, animate it smoothly
      if (existingMarker && lastPos && 
          (Math.abs(lastPos.lat - currentPos.lat) > 0.00001 || 
           Math.abs(lastPos.lng - currentPos.lng) > 0.00001)) {
        
        console.log(`🚗 Animating ${driver.firstName} from`, lastPos, 'to', currentPos);

        // Calculate heading for rotation
        const heading = calculateBearing(lastPos, currentPos);
        
        // Apply CSS transitions for ultra-smooth movement (Uber/Bolt standard)
        const markerElement = existingMarker.getElement();
        
        // Aplică transition DOAR dacă harta NU se mișcă (previne suprascrierea)
        if (!isMapMoving.current) {
          markerElement.style.transition = 'transform 2s linear';
        }
        
        // Update position (CSS animates automatically - GPU accelerated)
        existingMarker.setLngLat([currentPos.lng, currentPos.lat]);
        
        // Smooth rotation
        const carIcon = markerElement.querySelector('svg');
        if (carIcon && !isMapMoving.current) {
          carIcon.style.transition = 'transform 2s linear';
          carIcon.style.transform = `rotate(${heading}deg)`;
        } else if (carIcon) {
          carIcon.style.transform = `rotate(${heading}deg)`;
        }
        
        // Update last position
        lastPositions.current.set(driver.id, currentPos);
        console.log(`✅ Position updated for ${driver.firstName} with CSS transition`);

        return; // Skip recreating marker
      }

      // If marker exists but position hasn't changed, skip
      if (existingMarker) {
        return;
      }

      // Create new marker for first time
      const color = driver.onlineStatus === 'online' ? '#22C55E' : '#FCD34D';
      const heading = 0;

      // Create container for marker + labels
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.cursor = 'pointer';

      // Name label
      const nameLabel = document.createElement('div');
      nameLabel.textContent = `${driver.firstName} ${driver.lastName}`;
      nameLabel.style.background = 'rgba(0, 0, 0, 0.8)';
      nameLabel.style.color = 'white';
      nameLabel.style.padding = '2px 6px';
      nameLabel.style.borderRadius = '4px';
      nameLabel.style.fontSize = '11px';
      nameLabel.style.fontWeight = '600';
      nameLabel.style.whiteSpace = 'nowrap';
      nameLabel.style.marginBottom = '2px';
      container.appendChild(nameLabel);

      // Realistic car icon (top-down view like Uber/Bolt)
      const carIcon = document.createElement('div');
      carIcon.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" style="transform: rotate(${heading}deg);">
          <!-- Car body -->
          <rect x="12" y="8" width="16" height="24" rx="3" fill="${color}" stroke="white" stroke-width="2"/>
          
          <!-- Windshield (front) -->
          <rect x="14" y="10" width="12" height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          
          <!-- Rear window -->
          <rect x="14" y="26" width="12" height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          
          <!-- Side mirrors -->
          <circle cx="10" cy="16" r="2" fill="${color}" stroke="white" stroke-width="1"/>
          <circle cx="30" cy="16" r="2" fill="${color}" stroke="white" stroke-width="1"/>
          
          <!-- Direction indicator (arrow at front) -->
          <path d="M 20 4 L 24 8 L 16 8 Z" fill="white" stroke="white" stroke-width="1"/>
          
          <!-- Wheels -->
          <rect x="10" y="12" width="3" height="6" rx="1" fill="#333"/>
          <rect x="27" y="12" width="3" height="6" rx="1" fill="#333"/>
          <rect x="10" y="22" width="3" height="6" rx="1" fill="#333"/>
          <rect x="27" y="22" width="3" height="6" rx="1" fill="#333"/>
        </svg>
      `;
      carIcon.style.filter = 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))';
      container.appendChild(carIcon);

      // Vehicle label (license plate) - Find first vehicle with license plate
      const vehicles = (driver as any).vehicles || [];
      const vehicle = vehicles.find((v: any) => v?.license_plate) || vehicles[0];
      if (vehicle?.license_plate) {
        const plateLabel = document.createElement('div');
        plateLabel.textContent = vehicle.license_plate;
        plateLabel.style.background = 'white';
        plateLabel.style.color = '#1F2937';
        plateLabel.style.padding = '2px 6px';
        plateLabel.style.borderRadius = '4px';
        plateLabel.style.fontSize = '10px';
        plateLabel.style.fontWeight = '700';
        plateLabel.style.border = '1px solid #E5E7EB';
        plateLabel.style.marginTop = '2px';
        container.appendChild(plateLabel);
      }

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

      const marker = new mapboxgl.Marker(container)
        .setLngLat([driver.currentLongitude, driver.currentLatitude])
        .setPopup(new mapboxgl.Popup({ offset: 25, maxWidth: '320px' }).setHTML(popupHTML))
        .addTo(map.current!);

      // Click handler for marker selection
      container.addEventListener('click', () => {
        setSelectedDriverId(driver.id);
      });

      // Store marker and container for animation
      markers.current.set(driver.id, marker);
      markerElements.current.set(driver.id, container);
      lastPositions.current.set(driver.id, currentPos);
    });

    // Remove markers for drivers no longer in list
    const driverIds = new Set(drivers.map(d => d.id));
    markers.current.forEach((marker, id) => {
      if (!driverIds.has(id)) {
        marker.remove();
        markers.current.delete(id);
        markerElements.current.delete(id);
        lastPositions.current.delete(id);
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
