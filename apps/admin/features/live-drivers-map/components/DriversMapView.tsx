/**
 * Drivers Map View - Google Maps Integration
 * 
 * Displays online drivers on Google Maps with real-time markers
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LoadingState, ErrorBanner } from '@vantage-lane/ui-core';
import type { DriverLocationData } from '@entities/driver-location';

interface DriversMapViewProps {
  drivers: DriverLocationData[];
  loading: boolean;
  error: string | null;
  onDriverClick: (driver: DriverLocationData) => void;
  darkMode?: boolean;
}

// Default map center (Bucharest, Romania)
const DEFAULT_CENTER = { lat: 44.4268, lng: 26.1025 };
const DEFAULT_ZOOM = 12;

export function DriversMapView({ drivers, loading, error, onDriverClick, darkMode = false }: DriversMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    // Dark theme styles for Google Maps
    const darkMapStyles = [
      { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#8c8c8c" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }]
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }]
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }]
      }
    ];

    // Light theme styles
    const lightMapStyles = [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ];

    const mapOptions: google.maps.MapOptions = {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      mapTypeId: 'roadmap',
      disableDefaultUI: false,
      gestureHandling: 'cooperative',
      maxZoom: 18,
      minZoom: 8,
      styles: darkMode ? darkMapStyles : lightMapStyles
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
  }, [isGoogleMapsLoaded]);

  // Create marker for driver
  const createDriverMarker = useCallback((driver: DriverLocationData) => {
    if (!mapInstanceRef.current || !driver.currentLatitude || !driver.currentLongitude) {
      return null;
    }

    const position = {
      lat: driver.currentLatitude,
      lng: driver.currentLongitude
    };

    // Color-coded marker based on status
    const getMarkerColor = (status: string) => {
      switch (status) {
        case 'online': return '#22c55e'; // Green
        case 'busy': return '#3b82f6';   // Blue  
        case 'break': return '#f59e0b';  // Yellow
        default: return '#6b7280';       // Gray
      }
    };

    const marker = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: `${driver.firstName || ''} ${driver.lastName || ''} (${driver.onlineStatus})`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: getMarkerColor(driver.onlineStatus),
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      animation: google.maps.Animation.DROP,
    });

    // Add click handler
    marker.addListener('click', () => {
      onDriverClick(driver);
    });

    return marker;
  }, [onDriverClick]);

  // Update markers when drivers change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const currentMarkers = markersRef.current;
    const newMarkers = new Map<string, google.maps.Marker>();

    // Remove markers for drivers that are no longer online
    for (const [driverId, marker] of Array.from(currentMarkers.entries())) {
      const driver = drivers.find(d => d.id === driverId);
      if (!driver || !driver.currentLatitude || !driver.currentLongitude) {
        marker.setMap(null);
      } else {
        newMarkers.set(driverId, marker);
      }
    }

    // Add or update markers for current drivers
    drivers.forEach(driver => {
      if (!driver.currentLatitude || !driver.currentLongitude) return;

      let marker = newMarkers.get(driver.id);
      
      if (!marker) {
        // Create new marker
        const newMarker = createDriverMarker(driver);
        if (newMarker) {
          newMarkers.set(driver.id, newMarker);
        }
      } else {
        // Update existing marker position
        const newPosition = {
          lat: driver.currentLatitude,
          lng: driver.currentLongitude
        };
        marker.setPosition(newPosition);
      }
    });

    markersRef.current = newMarkers;

    // Auto-fit bounds if we have drivers
    if (drivers.length > 0 && drivers.some(d => d.currentLatitude && d.currentLongitude)) {
      const bounds = new google.maps.LatLngBounds();
      drivers.forEach(driver => {
        if (driver.currentLatitude && driver.currentLongitude) {
          bounds.extend({
            lat: driver.currentLatitude,
            lng: driver.currentLongitude
          });
        }
      });
      mapInstanceRef.current.fitBounds(bounds, 50);
    }
  }, [drivers, createDriverMarker]);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current.clear();
    };
  }, []);

  if (error) {
    return (
      <div className="map-error-container">
        <ErrorBanner 
          message={`Map Error: ${error}`}
        />
      </div>
    );
  }

  if (!isGoogleMapsLoaded) {
    return (
      <div className="map-loading-container">
        <LoadingState message="Loading Google Maps..." />
      </div>
    );
  }

  return (
    <div className="drivers-map-view">
      <div
        ref={mapRef}
        className="google-map"
        style={{ width: '100%', height: '500px' }}
      />
      
      {loading && (
        <div className="map-overlay-loading">
          <LoadingState message="Updating driver locations..." size="small" />
        </div>
      )}
    </div>
  );
}
