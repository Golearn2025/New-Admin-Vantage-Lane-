/**
 * Driver Marker Helpers
 * 
 * Utilities for creating and managing Google Maps AdvancedMarkerElement
 * with status-based colors and pulse animations
 */

export type DriverMainStatus = 'ONLINE' | 'BUSY' | 'OFFLINE';
export type DriverSubStatus = 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | null;

export interface DriverStatus {
  main: DriverMainStatus;
  sub: DriverSubStatus;
}

/**
 * Get marker color based on driver status
 */
export function getDriverColor(status: DriverStatus): string {
  // ONLINE (free) - light green
  if (status.main === 'ONLINE') {
    return '#22C55E';
  }
  
  // BUSY - color by substatus
  if (status.main === 'BUSY') {
    switch (status.sub) {
      case 'EN_ROUTE':
        return '#3B82F6'; // blue
      case 'ARRIVED':
        return '#7C3AED'; // violet
      case 'IN_PROGRESS':
        return '#D4AF37'; // gold
      default:
        return '#0066FF'; // blue fallback (assigned but no substatus)
    }
  }
  
  // OFFLINE - gray
  return '#9CA3AF';
}

/**
 * Check if marker should pulse (only when BUSY)
 */
export function isPulsing(status: DriverStatus): boolean {
  return status.main === 'BUSY';
}

/**
 * Build marker HTML element with pin + ring + pulse
 */
export function buildMarkerElement(opts: {
  color: string;
  pulsing: boolean;
  selected?: boolean;
}): HTMLDivElement {
  const root = document.createElement('div');
  root.className = 'driverMarker';
  
  if (opts.selected) {
    root.classList.add('selected');
  }
  
  // Pulse (only when BUSY)
  if (opts.pulsing) {
    const pulse = document.createElement('div');
    pulse.className = 'pulse';
    pulse.style.border = `2px solid ${opts.color}`;
    pulse.style.background = opts.color;
    root.appendChild(pulse);
  }
  
  // Pin body
  const pin = document.createElement('div');
  pin.className = 'pin';
  root.appendChild(pin);
  
  // Status ring
  const ring = document.createElement('div');
  ring.className = 'ring';
  ring.style.borderColor = opts.color;
  root.appendChild(ring);
  
  // Car icon (SVG)
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('class', 'icon');
  icon.innerHTML = `
    <path 
      fill="white" 
      d="M5 11l1-3c.3-1 1.2-2 2.4-2h7.2c1.2 0 2.1 1 2.4 2l1 3v6h-2v-2H7v2H5v-6zm3.1-3c-.3 0-.6.2-.7.5L6.8 10h10.4l-.6-1.5c-.1-.3-.4-.5-.7-.5H8.1zM8 14a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 8 14zm8 0a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 16 14z"
    />
  `;
  root.appendChild(icon);
  
  return root;
}

/**
 * Map driver online_status to DriverStatus format
 */
export function mapDriverStatus(
  onlineStatus: string,
  bookingStatus?: string | null
): DriverStatus {
  // Determine main status
  let main: DriverMainStatus = 'OFFLINE';
  
  if (onlineStatus === 'online' && !bookingStatus) {
    main = 'ONLINE';
  } else if (onlineStatus === 'online' && bookingStatus) {
    main = 'BUSY';
  }
  
  // Determine substatus (only if BUSY)
  let sub: DriverSubStatus = null;
  
  if (main === 'BUSY' && bookingStatus) {
    const normalized = bookingStatus.toUpperCase();
    if (normalized === 'EN_ROUTE' || normalized === 'ENROUTE') {
      sub = 'EN_ROUTE';
    } else if (normalized === 'ARRIVED') {
      sub = 'ARRIVED';
    } else if (normalized === 'IN_PROGRESS' || normalized === 'INPROGRESS') {
      sub = 'IN_PROGRESS';
    }
  }
  
  return { main, sub };
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: DriverStatus): string {
  if (status.main === 'ONLINE') {
    return 'Available';
  }
  
  if (status.main === 'BUSY') {
    switch (status.sub) {
      case 'EN_ROUTE':
        return 'En Route to Pickup';
      case 'ARRIVED':
        return 'Arrived at Pickup';
      case 'IN_PROGRESS':
        return 'Trip in Progress';
      default:
        return 'Busy';
    }
  }
  
  return 'Offline';
}
