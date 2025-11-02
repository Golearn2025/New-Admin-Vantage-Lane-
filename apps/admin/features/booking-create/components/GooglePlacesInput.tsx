/**
 * GooglePlacesInput Component
 * Google Places Autocomplete for location input
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './GooglePlacesInput.module.css';

export interface GooglePlacesInputProps {
  value: string;
  onChange: (value: string, placeData?: { lat: number; lng: number; formattedAddress: string }) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
}

export function GooglePlacesInput({
  value,
  onChange,
  placeholder = 'Enter location',
  label,
  icon,
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'uk' }, // UK only
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('🗺️ GooglePlacesInput - place selected:', place);
      
      if (place.formatted_address && place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        console.log('✅ GooglePlacesInput - sending placeData:', { lat, lng, formattedAddress: place.formatted_address });
        onChange(place.formatted_address, {
          lat,
          lng,
          formattedAddress: place.formatted_address,
        });
      } else {
        console.warn('⚠️ GooglePlacesInput - No geometry data in place:', place);
        onChange(place.name || place.formatted_address || '');
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
