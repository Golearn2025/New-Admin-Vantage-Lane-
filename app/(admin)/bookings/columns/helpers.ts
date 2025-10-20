/**
 * Bookings Columns - Helper Functions
 */

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

export const getTripIcon = (tripType: string): string => {
  switch (tripType) {
    case 'return':
      return '⟲';
    case 'oneway':
      return '→';
    case 'hourly':
      return '⏱';
    case 'fleet':
      return '🚗';
    default:
      return '→';
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

export const formatPrice = (cents: number): string => `£${(cents / 100).toFixed(2)}`;

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

  // Format specific models: van_v_class → V-Class
  const modelMap: Record<string, string> = {
    van_v_class: 'V-Class',
    suv_range_rover: 'Range Rover',
    exec_5_series: '5 Series',
    lux_s_class: 'S-Class',
  };

  return modelMap[model.toLowerCase()] || model;
};
