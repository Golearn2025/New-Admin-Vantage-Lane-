/**
 * Marker Styles
 * 
 * SVG și HTML styles pentru driver markers
 * Conform RULES.md: Styling separate de logică
 */

/**
 * Create custom marker element (HTML/CSS)
 */
export function createMarkerElement(color: string, scale: number = 1.0): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'driver-marker';
  
  // Inline styles (sau folosește CSS class)
  el.style.width = `${30 * scale}px`;
  el.style.height = `${30 * scale}px`;
  el.style.backgroundColor = color;
  el.style.border = '3px solid white';
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
  el.style.cursor = 'pointer';
  el.style.transition = 'all 0.3s ease';
  
  return el;
}

/**
 * Create SVG car icon marker
 */
export function createCarMarkerElement(color: string, scale: number = 1.0, rotation: number = 0): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'driver-car-marker';
  
  const size = 40 * scale;
  
  el.innerHTML = `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      style="transform: rotate(${rotation}deg); transition: transform 0.3s ease;"
    >
      <!-- Car icon path -->
      <path 
        d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" 
        fill="${color}"
        stroke="white"
        stroke-width="1"
      />
    </svg>
  `;
  
  el.style.cursor = 'pointer';
  el.style.transition = 'all 0.3s ease';
  
  return el;
}

/**
 * Update marker element color
 */
export function updateMarkerColor(el: HTMLElement, color: string): void {
  if (el.classList.contains('driver-marker')) {
    el.style.backgroundColor = color;
  } else if (el.classList.contains('driver-car-marker')) {
    const path = el.querySelector('path');
    if (path) {
      path.setAttribute('fill', color);
    }
  }
}

/**
 * Update marker element scale
 */
export function updateMarkerScale(el: HTMLElement, scale: number): void {
  if (el.classList.contains('driver-marker')) {
    const baseSize = 30;
    el.style.width = `${baseSize * scale}px`;
    el.style.height = `${baseSize * scale}px`;
  } else if (el.classList.contains('driver-car-marker')) {
    const svg = el.querySelector('svg');
    if (svg) {
      const baseSize = 40;
      svg.setAttribute('width', `${baseSize * scale}`);
      svg.setAttribute('height', `${baseSize * scale}`);
    }
  }
}
