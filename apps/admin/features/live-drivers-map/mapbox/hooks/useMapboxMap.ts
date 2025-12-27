/**
 * useMapboxMap Hook
 * 
 * React hook pentru Mapbox map initialization și lifecycle
 * Conform RULES.md: React hooks pentru UI integration, <100 linii
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { MapboxManager, type MapboxManagerOptions } from '../core/MapboxManager';

interface UseMapboxMapReturn {
  mapManager: MapboxManager;
  isLoaded: boolean;
  error: string | null;
}

/**
 * Hook pentru Mapbox map management
 * 
 * @param containerRef - Ref la container element
 * @param options - Map options (theme, center, zoom)
 * @returns Map manager, loading state, error
 */
export function useMapboxMap(
  containerRef: RefObject<HTMLDivElement>,
  options: MapboxManagerOptions = {}
): UseMapboxMapReturn {
  const [mapManager] = useState(() => new MapboxManager());
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) {
      console.log('⏭️ Already initialized');
      return;
    }

    if (!containerRef.current) {
      console.log('⏭️ Container not ready on first render');
      return;
    }

    console.log('🚀 Starting Mapbox initialization...');

    try {
      // Initialize map
      mapManager.initialize(containerRef.current, options);
      isInitialized.current = true;

      // Wait for map to load
      const map = mapManager.getMap();
      console.log('📍 Map instance:', map ? 'EXISTS ✅' : 'NULL ❌');
      
      if (map) {
        map.on('load', () => {
          console.log('✅ Mapbox map loaded successfully!');
          setIsLoaded(true);
          setError(null);
        });

        map.on('error', (e) => {
          console.error('❌ Mapbox error:', e);
          setError(e.error?.message || 'Map error occurred');
        });
      } else {
        console.error('❌ Map instance is null after initialization');
        setError('Failed to create map instance');
      }
    } catch (err) {
      console.error('❌ Failed to initialize Mapbox:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized.current) {
        console.log('🧹 Cleaning up Mapbox map');
        mapManager.destroy();
        isInitialized.current = false;
      }
    };
  });

  return {
    mapManager,
    isLoaded,
    error,
  };
}
