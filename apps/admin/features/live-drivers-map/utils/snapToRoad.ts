/**
 * Snap-to-Road utility
 * Projects GPS coordinates onto the nearest road using Mapbox GL's
 * queryRenderedFeatures (client-side, no API calls needed).
 */


interface Point {
  lat: number;
  lng: number;
}

// Mapbox road layer IDs (dark-v11 style)
const ROAD_LAYERS = [
  'road-simple',
  'road-street',
  'road-street-low',
  'road-secondary-tertiary',
  'road-primary',
  'road-motorway-trunk',
  'road-minor',
  'road-minor-low',
  'road-major-link',
  'road-motorway-trunk-case',
  'road-primary-case',
  'road-secondary-tertiary-case',
  'road-street-case',
  'road-minor-case',
  'road-major-link-case',
];

/**
 * Find the nearest point on a line segment to a given point.
 */
function nearestPointOnSegment(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number
): { x: number; y: number; dist: number } {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    // Segment is a point
    const d = Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
    return { x: ax, y: ay, dist: d };
  }

  // Project point onto segment, clamped to [0,1]
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const projX = ax + t * dx;
  const projY = ay + t * dy;
  const dist = Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);

  return { x: projX, y: projY, dist };
}

/**
 * Snap a GPS coordinate to the nearest road visible on the map.
 * Returns the snapped coordinate, or the original if no road is found nearby.
 *
 * @param mapInstance - The Mapbox GL map instance
 * @param point - The GPS coordinate to snap
 * @param searchRadiusPx - Pixel radius to search for roads (default 50px)
 * @param maxDistanceM - Max distance in meters to snap (default 30m)
 */
export function snapToNearestRoad(
  mapInstance: mapboxgl.Map,
  point: Point,
  searchRadiusPx: number = 60,
  maxDistanceM: number = 40
): Point {
  try {
    const screenPoint = mapInstance.project([point.lng, point.lat]);

    // Query road features in a box around the point
    const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
      [screenPoint.x - searchRadiusPx, screenPoint.y - searchRadiusPx],
      [screenPoint.x + searchRadiusPx, screenPoint.y + searchRadiusPx],
    ];

    // Get available layers on the map and filter to road layers
    const availableLayers = mapInstance.getStyle()?.layers?.map(l => l.id) || [];
    const roadLayerIds = ROAD_LAYERS.filter(id => availableLayers.includes(id));

    if (roadLayerIds.length === 0) {
      // Fallback: try any layer with 'road' in the name
      const fallbackLayers = availableLayers.filter(id => id.includes('road'));
      if (fallbackLayers.length === 0) return point;
      roadLayerIds.push(...fallbackLayers);
    }

    const features = mapInstance.queryRenderedFeatures(bbox, {
      layers: roadLayerIds,
    });

    if (!features || features.length === 0) return point;

    // Find the nearest point across all road segments
    let bestDist = Infinity;
    let bestPoint: { x: number; y: number } | null = null;

    for (const feature of features) {
      const geometry = feature.geometry;
      if (!geometry) continue;

      let lineStrings: number[][][] = [];

      if (geometry.type === 'LineString') {
        lineStrings = [(geometry as GeoJSON.LineString).coordinates];
      } else if (geometry.type === 'MultiLineString') {
        lineStrings = (geometry as GeoJSON.MultiLineString).coordinates;
      } else {
        continue;
      }

      for (const coords of lineStrings) {
        for (let i = 0; i < coords.length - 1; i++) {
          const segA = coords[i];
          const segB = coords[i + 1];
          if (!segA || !segB) continue;
          const ax = segA[0] as number;
          const ay = segA[1] as number;
          const bx = segB[0] as number;
          const by = segB[1] as number;

          const nearest = nearestPointOnSegment(
            point.lng, point.lat,
            ax, ay,
            bx, by
          );

          if (nearest.dist < bestDist) {
            bestDist = nearest.dist;
            bestPoint = { x: nearest.x, y: nearest.y };
          }
        }
      }
    }

    if (!bestPoint) return point;

    // Convert distance from degrees to approximate meters (at this latitude)
    const metersPerDegLat = 111320;
    const metersPerDegLng = metersPerDegLat * Math.cos((point.lat * Math.PI) / 180);
    const distMeters = Math.sqrt(
      ((bestPoint.y - point.lat) * metersPerDegLat) ** 2 +
      ((bestPoint.x - point.lng) * metersPerDegLng) ** 2
    );

    // Only snap if within max distance
    if (distMeters > maxDistanceM) return point;

    return { lat: bestPoint.y, lng: bestPoint.x };
  } catch {
    return point;
  }
}
