/**
 * Accuracy Circle Feature
 * 
 * Afișează cerc de acuratețe când marker-ul este selectat
 * Conform RULES.md: Feature separate, <100 linii
 */

import { type LngLatLike, type Map as MapboxMap } from 'mapbox-gl';
import { ACCURACY_CIRCLE } from '../config/markerConfig';

/**
 * AccuracyCircle Class
 * 
 * Manages accuracy circle display on map
 */
export class AccuracyCircle {
  private map: MapboxMap | null = null;
  private circleLayerId = 'accuracy-circle';
  private circleSourceId = 'accuracy-circle-source';

  /**
   * Set map instance
   */
  setMap(map: MapboxMap | null): void {
    this.map = map;
  }

  /**
   * Show accuracy circle at position
   */
  show(center: LngLatLike, color: string): void {
    if (!this.map) return;

    this.hide(); // Remove existing circle

    // Add source
    this.map.addSource(this.circleSourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: Array.isArray(center) 
            ? center 
            : 'lng' in center 
              ? [center.lng, center.lat]
              : [center.lon, center.lat],
        },
        properties: {},
      },
    });

    // Add circle layer
    this.map.addLayer({
      id: this.circleLayerId,
      type: 'circle',
      source: this.circleSourceId,
      paint: {
        'circle-radius': {
          stops: [
            [0, 0],
            [20, this.metersToPixelsAtMaxZoom(ACCURACY_CIRCLE.radius, center)],
          ],
          base: 2,
        },
        'circle-color': color,
        'circle-opacity': ACCURACY_CIRCLE.fillOpacity,
        'circle-stroke-width': ACCURACY_CIRCLE.strokeWeight,
        'circle-stroke-color': color,
        'circle-stroke-opacity': ACCURACY_CIRCLE.strokeOpacity,
      },
    });
  }

  /**
   * Hide accuracy circle
   */
  hide(): void {
    if (!this.map) return;

    if (this.map.getLayer(this.circleLayerId)) {
      this.map.removeLayer(this.circleLayerId);
    }

    if (this.map.getSource(this.circleSourceId)) {
      this.map.removeSource(this.circleSourceId);
    }
  }

  /**
   * Convert meters to pixels at max zoom
   * Helper for circle radius calculation
   */
  private metersToPixelsAtMaxZoom(meters: number, center: LngLatLike): number {
    const lat = Array.isArray(center) 
      ? center[1] 
      : 'lat' in center 
        ? center.lat 
        : 0;
    return meters / 0.075 / Math.cos((lat * Math.PI) / 180);
  }
}
