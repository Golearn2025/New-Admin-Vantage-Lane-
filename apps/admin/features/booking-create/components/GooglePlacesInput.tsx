/**
 * GooglePlacesInput Component
 * Google Places Autocomplete for location input
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './GooglePlacesInput.module.css';

export interface GooglePlacesInputProps {
  value: string;
  onChange: (value: string, placeData?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  label?: string;
  icon?: string;
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
      if (place.formatted_address) {
        onChange(place.formatted_address, place);
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, onChange]);

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
