/**
 * Geocoding utilities - OPTIMIZED for cost efficiency
 * Only geocode when necessary, not on every GPS update
 */

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmFudGFnZWxhbmUiLCJhIjoiY21peGw4NTIxMDR5YjNkcXp3eGN0OTc3YyJ9.S1VwkfoU1jU97dOF4Nayjw';

// Cache to avoid repeated geocoding for same location
const geocodeCache = new Map<string, string>();

/**
 * Reverse geocode coordinates to address
 * ONLY call this when necessary (trip start/end, stops, user clicks)
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const address = data.features[0].place_name || '';
      
      // Cache the result
      geocodeCache.set(cacheKey, address);
      
      // Limit cache size to prevent memory issues
      if (geocodeCache.size > 1000) {
        const firstKey = geocodeCache.keys().next().value;
        if (firstKey !== undefined) {
          geocodeCache.delete(firstKey);
        }
      }
      
      return address;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  return null;
}

/**
 * Check if we should geocode based on driver state
 * This prevents unnecessary API calls
 */
export function shouldGeocode(
  currentSpeed: number | null,
  lastGeocodeTime: Date | null,
  currentTime: Date
): boolean {
  // Geocode if driver is stopped (speed = 0 or null)
  if (!currentSpeed || currentSpeed < 1) {
    // But not more than once per minute
    if (lastGeocodeTime) {
      const timeSinceLastGeocode = currentTime.getTime() - lastGeocodeTime.getTime();
      return timeSinceLastGeocode > 60000; // 1 minute
    }
    return true;
  }
  
  // Don't geocode while moving
  return false;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}
