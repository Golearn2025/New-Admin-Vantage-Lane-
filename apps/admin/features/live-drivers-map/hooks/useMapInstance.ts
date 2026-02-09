/**
 * useMapInstance — Initializes and manages the Mapbox map lifecycle.
 * Handles style switching, controls, label toggle on zoom, and cleanup.
 */

'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { setMapMoving, startEngine, stopEngine } from '../utils/predictiveAnimation';

export type MapTheme = 'day' | 'night' | 'dusk' | 'dawn' | 'satellite';

interface MapConfig {
  showPointOfInterestLabels?: boolean;
  showPlaceLabels?: boolean;
  showRoadLabels?: boolean;
  showTransitLabels?: boolean;
  show3dObjects?: boolean;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  theme: MapTheme,
  config: MapConfig = {},
) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markerElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!containerRef.current || map.current) return;

    const isSatellite = theme === 'satellite';
    const styleUrl = isSatellite
      ? 'mapbox://styles/mapbox/standard-satellite'
      : 'mapbox://styles/mapbox/standard';
    const lightPreset = isSatellite ? 'day' : theme;

    map.current = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [-0.4543, 51.4700],
      zoom: 12,
      config: {
        basemap: {
          lightPreset,
          show3dObjects: config.show3dObjects ?? true,
          showPointOfInterestLabels: config.showPointOfInterestLabels ?? false,
          showPlaceLabels: config.showPlaceLabels ?? true,
          showRoadLabels: config.showRoadLabels ?? true,
          showTransitLabels: config.showTransitLabels ?? false,
        },
      },
    } as any);

    map.current.on('movestart', () => setMapMoving(true));
    map.current.on('moveend', () => setMapMoving(false));

    const toggleLabels = () => {
      if (!map.current) return;
      const show = map.current.getZoom() >= 12;
      markerElementsRef.current.forEach((el) => {
        const nameEl = el.querySelector('.driver-name') as HTMLElement;
        if (nameEl) nameEl.style.display = show ? 'block' : 'none';
        const plateEl = el.querySelector('.plate') as HTMLElement;
        if (plateEl) plateEl.style.display = show ? 'block' : 'none';
      });
    };
    map.current.on('zoom', toggleLabels);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => setIsLoaded(true));

    startEngine();

    return () => {
      stopEngine();
      if (map.current) map.current.remove();
      map.current = null;
      setIsLoaded(false);
    };
  }, [theme]);

  return { map, isLoaded, markerElementsRef };
}
