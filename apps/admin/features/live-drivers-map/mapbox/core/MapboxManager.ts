/**
 * Mapbox Manager - Core Map Logic
 * 
 * Wrapper peste mapboxgl.Map cu lifecycle management
 * Conform RULES.md: Business logic separate de UI, <150 linii
 */

import mapboxgl, { type LngLatLike, type MapboxOptions } from 'mapbox-gl';
import { BOUNDS_PADDING, DEFAULT_CENTER, DEFAULT_ZOOM } from '../config/mapDefaults';
import { getMapStyle, type MapTheme } from '../config/mapStyles';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export interface MapboxManagerOptions {
  theme?: MapTheme;
  center?: LngLatLike;
  zoom?: number;
}

/**
 * MapboxManager Class
 * 
 * Manages Mapbox map instance lifecycle
 */
export class MapboxManager {
  private map: mapboxgl.Map | null = null;
  private isInitialized = false;

  /**
   * Initialize map
   */
  initialize(container: HTMLElement, options: MapboxManagerOptions = {}): void {
    if (this.isInitialized || this.map) {
      console.warn('Map already initialized');
      return;
    }

    // Debug: Check token
    console.log('🔑 Mapbox token:', mapboxgl.accessToken ? 'SET ✅' : 'MISSING ❌');
    
    const { theme = 'dark', center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM.initial } = options;

    console.log('🗺️ Initializing Mapbox with:', { theme, center, zoom });

    const mapOptions: MapboxOptions = {
      container,
      style: getMapStyle(theme),
      center,
      zoom,
      minZoom: DEFAULT_ZOOM.min,
      maxZoom: DEFAULT_ZOOM.max,
      attributionControl: false, // Custom attribution if needed
    };

    try {
      this.map = new mapboxgl.Map(mapOptions);
      this.isInitialized = true;
      console.log('✅ Mapbox map instance created');
    } catch (err) {
      console.error('❌ Failed to create Mapbox map:', err);
      throw err;
    }

    // Add navigation controls
    this.map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add scale control
    this.map.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left'
    );
  }

  /**
   * Get map instance
   */
  getMap(): mapboxgl.Map | null {
    return this.map;
  }

  /**
   * Check if map is loaded
   */
  isLoaded(): boolean {
    return this.map?.loaded() ?? false;
  }

  /**
   * Set map center
   */
  setCenter(center: LngLatLike, zoom?: number): void {
    if (!this.map) return;
    
    this.map.flyTo({
      center,
      zoom: zoom ?? this.map.getZoom(),
      essential: true,
    });
  }

  /**
   * Fit bounds to show all markers
   */
  fitBounds(coordinates: LngLatLike[]): void {
    if (!this.map || coordinates.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((coord) => bounds.extend(coord));

    this.map.fitBounds(bounds, {
      padding: BOUNDS_PADDING,
      maxZoom: DEFAULT_ZOOM.street,
    });
  }

  /**
   * Destroy map instance
   */
  destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.isInitialized = false;
    }
  }
}
