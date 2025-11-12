/**
 * Bookings Columns - Helper Functions
 */

import { ArrowRight, Car, RefreshCw, Timer } from 'lucide-react';
import React from 'react';

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export const formatTime = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const getTripIcon = (tripType: string): React.ReactNode => {
  switch (tripType) {
    case 'return':
      return <RefreshCw size={14} strokeWidth={2} />;
    case 'oneway':
      return <ArrowRight size={14} strokeWidth={2} />;
    case 'hourly':
      return <Timer size={14} strokeWidth={2} />;
    case 'fleet':
      return <Car size={14} strokeWidth={2} />;
    default:
      return <ArrowRight size={14} strokeWidth={2} />;
  }
};

export const formatLocation = (address: string): string => {
  // UK Postcode pattern: AA9A 9AA or A9A 9AA or similar
  const postcodeMatch = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/i);

  if (postcodeMatch && postcodeMatch[0]) {
    const postcode = postcodeMatch[0].trim().toUpperCase();
    // Extract city/area (usually first word or words before postcode)
    const beforePostcode = address.split(postcode)[0]?.trim() || '';
    // Get last part before postcode (usually city name)
    const parts = beforePostcode
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);
    const city = parts[parts.length - 1] || parts[0] || 'Unknown';

    return `${postcode} - ${city}`;
  }

  // Fallback: show original address
  return address;
};

export const formatPrice = (pounds: number): string => `£${pounds.toFixed(2)}`;

export const formatServiceName = (code: string): string => {
  const names: Record<string, string> = {
    security_escort: 'Security Escort',
    fresh_flowers: 'Fresh Flowers',
    champagne: 'Champagne',
  };
  return names[code] || code;
};

export const formatVehicleModel = (model: string | null): string => {
  if (!model) return 'Any Vehicle';
  if (model.toLowerCase().includes('selected')) return 'Any Vehicle';
  if (model.toLowerCase().includes('tbd')) return 'Any Vehicle';

  // Format specific models with FULL brand + model name
  const modelMap: Record<string, string> = {
    exec_5_series: 'BMW 5 Series', // Executive
    exec_e_class: 'Mercedes E-Class', // Executive
    lux_s_class: 'Mercedes S-Class', // Luxury
    lux_7_series: 'BMW 7 Series', // Luxury
    suv_range_rover: 'Range Rover', // SUV
    van_v_class: 'Mercedes V-Class', // Van
  };

  return modelMap[model.toLowerCase()] || model;
};
