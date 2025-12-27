/**
 * Marker Manager - Marker Lifecycle Management
 * 
 * CRUD operations pentru driver markers
 * Conform RULES.md: Business logic separate de UI, <150 linii
 */

import type { DriverLocationData } from '@entities/driver-location';
import { type LngLatLike, type Marker } from 'mapbox-gl';
import { createDriverMarker } from './createDriverMarker';

/**
 * MarkerManager Class
 * 
 * Manages driver markers on Mapbox map
 */
export class MarkerManager {
  private markers: Map<string, Marker> = new Map();
  private map: mapboxgl.Map | null = null;
  private selectedDriverId: string | null = null;
  private onMarkerClick?: (driver: DriverLocationData) => void;

  /**
   * Set map instance
   */
  setMap(map: mapboxgl.Map | null): void {
    this.map = map;
  }

  /**
   * Set marker click handler
   */
  setOnMarkerClick(handler: (driver: DriverLocationData) => void): void {
    this.onMarkerClick = handler;
  }

  /**
   * Set selected driver ID
   */
  setSelectedDriverId(driverId: string | null): void {
    this.selectedDriverId = driverId;
  }

  /**
   * Get selected driver ID
   */
  getSelectedDriverId(): string | null {
    return this.selectedDriverId;
  }

  /**
   * Create marker for driver
   */
  createMarker(driver: DriverLocationData): Marker | null {
    if (!this.map || !driver.currentLatitude || !driver.currentLongitude) {
      return null;
    }

    const position: LngLatLike = [driver.currentLongitude, driver.currentLatitude];
    const isSelected = this.selectedDriverId === driver.id;

    const marker = createDriverMarker(driver, isSelected, (clickedDriver: DriverLocationData) => {
      this.selectedDriverId = clickedDriver.id;
      this.onMarkerClick?.(clickedDriver);
      
      // Update all markers to reflect selection state
      this.updateAllMarkers();
    });

    if (marker) {
      marker.setLngLat(position).addTo(this.map);
      this.markers.set(driver.id, marker);
    }

    return marker;
  }

  /**
   * Update marker position
   */
  updateMarkerPosition(driverId: string, lng: number, lat: number): void {
    const marker = this.markers.get(driverId);
    if (marker) {
      marker.setLngLat([lng, lat]);
    }
  }

  /**
   * Remove marker
   */
  removeMarker(driverId: string): void {
    const marker = this.markers.get(driverId);
    if (marker) {
      marker.remove();
      this.markers.delete(driverId);
    }
  }

  /**
   * Get marker by driver ID
   */
  getMarker(driverId: string): Marker | undefined {
    return this.markers.get(driverId);
  }

  /**
   * Get all markers
   */
  getAllMarkers(): Map<string, Marker> {
    return this.markers;
  }

  /**
   * Update all markers (useful for selection state changes)
   */
  private updateAllMarkers(): void {
    // This will be handled by re-creating markers in the hook
    // when selectedDriverId changes
  }

  /**
   * Clear all markers
   */
  clearAll(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers.clear();
  }

  /**
   * Get marker count
   */
  getCount(): number {
    return this.markers.size;
  }
}
