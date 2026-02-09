/**
 * Marker Styles — Realistic Top-Down Car SVG v3
 *
 * White/silver sedan with dark-blue glass, red taillights, mirrors,
 * roof highlight, fender lines, headlights, SVG shadow.
 * Status shown via colored indicator dot at bottom of car.
 * viewBox 0 0 100 100 for high detail.
 */

let markerIdCounter = 0;

/**
 * Realistic top-down car SVG inner content (100×100 viewBox)
 * @param color - status color used for the indicator dot
 * @param uid   - unique id prefix for gradient/filter defs
 */
export function getRealisticCarSVG(color: string, uid: string): string {
  return `
    <defs>
      <filter id="sh_${uid}" x="-25%" y="-15%" width="150%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="rgba(0,0,0,0.45)"/>
      </filter>
      <filter id="gw_${uid}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="bd_${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e8e8e8"/>
        <stop offset="50%" stop-color="#f5f5f5"/>
        <stop offset="100%" stop-color="#d4d4d4"/>
      </linearGradient>
      <linearGradient id="gl_${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a3a4a"/>
        <stop offset="100%" stop-color="#2d5a6a"/>
      </linearGradient>
      <linearGradient id="rf_${uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#d0d0d0"/>
        <stop offset="50%" stop-color="#f0f0f0"/>
        <stop offset="100%" stop-color="#d0d0d0"/>
      </linearGradient>
      <linearGradient id="hd_${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.3)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <g filter="url(#sh_${uid})">
      <!-- Body -->
      <path d="M35 18 Q35 10 42 8 L50 5 L58 8 Q65 10 65 18 L67 75 Q67 88 58 90 L50 92 L42 90 Q33 88 33 75 Z" fill="url(#bd_${uid})" stroke="#b0b0b0" stroke-width="0.8"/>
      <!-- Fender lines -->
      <path d="M35 20 Q33 22 33 30 L33 70 Q33 78 35 80" fill="none" stroke="#c8c8c8" stroke-width="0.5"/>
      <path d="M65 20 Q67 22 67 30 L67 70 Q67 78 65 80" fill="none" stroke="#c8c8c8" stroke-width="0.5"/>
      <!-- Hood / bonnet reflection -->
      <path d="M40 8 L50 6 L60 8 L60 12 L40 12 Z" fill="url(#hd_${uid})"/>
      <!-- Windshield — dark blue glass -->
      <path d="M38 20 Q38 16 42 14 L50 12 L58 14 Q62 16 62 20 L62 30 Q62 32 60 32 L40 32 Q38 32 38 30 Z" fill="url(#gl_${uid})" stroke="#8ab4c4" stroke-width="0.6" opacity="0.9"/>
      <!-- Windshield reflection -->
      <path d="M42 16 L46 14.5 L46 28 L42 28 Z" fill="rgba(255,255,255,0.15)"/>
      <!-- Chrome beltline (left) -->
      <path d="M36 30 L36 60" fill="none" stroke="#ccc" stroke-width="0.7"/>
      <!-- Chrome beltline (right) -->
      <path d="M64 30 L64 60" fill="none" stroke="#ccc" stroke-width="0.7"/>
      <!-- Left side windows — dark glass -->
      <path d="M36 31 L38 31 L38 44 L36 44 Z" fill="url(#gl_${uid})" opacity="0.8" stroke="#8ab4c4" stroke-width="0.3"/>
      <path d="M36 46 L38 46 L38 59 L36 59 Z" fill="url(#gl_${uid})" opacity="0.75" stroke="#8ab4c4" stroke-width="0.3"/>
      <!-- Right side windows — dark glass -->
      <path d="M62 31 L64 31 L64 44 L62 44 Z" fill="url(#gl_${uid})" opacity="0.8" stroke="#8ab4c4" stroke-width="0.3"/>
      <path d="M62 46 L64 46 L64 59 L62 59 Z" fill="url(#gl_${uid})" opacity="0.75" stroke="#8ab4c4" stroke-width="0.3"/>
      <!-- A-pillar lines -->
      <line x1="38" y1="31" x2="39" y2="34" stroke="#bbb" stroke-width="0.4"/>
      <line x1="62" y1="31" x2="61" y2="34" stroke="#bbb" stroke-width="0.4"/>
      <!-- C-pillar lines -->
      <line x1="38" y1="59" x2="39" y2="56" stroke="#bbb" stroke-width="0.4"/>
      <line x1="62" y1="59" x2="61" y2="56" stroke="#bbb" stroke-width="0.4"/>
      <!-- Roof -->
      <rect x="39" y="34" width="22" height="22" rx="4" fill="url(#rf_${uid})"/>
      <!-- Roof center highlight -->
      <rect x="46" y="36" width="8" height="18" rx="3" fill="rgba(255,255,255,0.25)"/>
      <!-- Rear window — dark glass -->
      <path d="M39 60 Q39 58 41 58 L59 58 Q61 58 61 60 L61 72 Q61 76 58 78 L50 80 L42 78 Q39 76 39 72 Z" fill="url(#gl_${uid})" stroke="#8ab4c4" stroke-width="0.5" opacity="0.85"/>
      <!-- Side mirrors -->
      <ellipse cx="30" cy="24" rx="3.5" ry="2" fill="#d8d8d8" stroke="#aaa" stroke-width="0.5"/>
      <ellipse cx="70" cy="24" rx="3.5" ry="2" fill="#d8d8d8" stroke="#aaa" stroke-width="0.5"/>
      <!-- Taillights — red -->
      <rect x="35" y="84" width="8" height="3" rx="1.5" fill="#ef4444" opacity="0.9"/>
      <rect x="57" y="84" width="8" height="3" rx="1.5" fill="#ef4444" opacity="0.9"/>
      <!-- Headlights -->
      <rect x="37" y="10" width="6" height="2.5" rx="1" fill="rgba(255,255,255,0.7)"/>
      <rect x="57" y="10" width="6" height="2.5" rx="1" fill="rgba(255,255,255,0.7)"/>
      <!-- Status indicator dot — bigger with glow -->
      <circle cx="50" cy="96" r="6" fill="${color}" opacity="0.85" filter="url(#gw_${uid})"/>
      <circle cx="50" cy="96" r="3.5" fill="white" opacity="0.45"/>
    </g>
  `;
}

/**
 * Create realistic car marker element
 */
export function createPremiumCarMarker(
  color: string,
  rotation: number = 0,
  vehicleScale: number = 1,
): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'driver-car-marker';

  const uid = `m${markerIdCounter++}`;
  const baseSize = 48;
  const size = Math.round(baseSize * vehicleScale);

  el.innerHTML = `
    <svg
      width="${size}"
      height="${size}"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style="transform: rotate(${rotation}deg); transform-origin: center center; transition: transform 2s linear; overflow: visible;"
    >
      ${getRealisticCarSVG(color, uid)}
    </svg>
  `;

  el.style.cursor = 'pointer';
  el.style.lineHeight = '0';
  return el;
}

/**
 * Create full driver marker container (name + car + plate)
 */
export function createDriverMarkerContainer(opts: {
  driverName: string;
  color: string;
  rotation: number;
  vehicleScale: number;
  licensePlate?: string;
}): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'driver-marker-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.cursor = 'pointer';

  // Name label
  const nameLabel = document.createElement('div');
  nameLabel.className = 'driver-name';
  nameLabel.textContent = opts.driverName;
  nameLabel.style.fontSize = '11px';
  nameLabel.style.background = 'rgba(0,0,0,0.6)';
  nameLabel.style.color = 'white';
  nameLabel.style.borderRadius = '6px';
  nameLabel.style.padding = '2px 6px';
  nameLabel.style.fontWeight = '600';
  nameLabel.style.whiteSpace = 'nowrap';
  nameLabel.style.marginBottom = '2px';
  nameLabel.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.appendChild(nameLabel);

  // Premium car SVG
  const carEl = createPremiumCarMarker(opts.color, opts.rotation, opts.vehicleScale);
  container.appendChild(carEl);

  // License plate
  if (opts.licensePlate) {
    const plate = document.createElement('div');
    plate.className = 'plate';
    plate.textContent = opts.licensePlate;
    plate.style.fontSize = '10px';
    plate.style.background = 'white';
    plate.style.color = 'black';
    plate.style.borderRadius = '4px';
    plate.style.padding = '1px 4px';
    plate.style.fontWeight = '700';
    plate.style.marginTop = '2px';
    plate.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    container.appendChild(plate);
  }

  return container;
}

/**
 * Update marker status indicator color (the colored dot at bottom)
 */
export function updateMarkerColor(el: HTMLElement, color: string): void {
  const circles = el.querySelectorAll<SVGCircleElement>('circle');
  circles.forEach((c) => {
    const fill = c.getAttribute('fill') || '';
    if (fill !== 'white' && !fill.startsWith('rgba')) {
      c.setAttribute('fill', color);
    }
  });
}

/**
 * Update marker SVG rotation
 */
export function updateMarkerRotation(el: HTMLElement, rotation: number, animate: boolean = true): void {
  const svg = el.querySelector('svg');
  if (svg) {
    if (animate) {
      svg.style.transition = 'transform 2s linear';
    }
    svg.style.transform = `rotate(${rotation}deg)`;
  }
}

/**
 * Update marker SVG scale (vehicle type change)
 */
export function updateMarkerScale(el: HTMLElement, vehicleScale: number): void {
  const svg = el.querySelector('svg');
  if (svg) {
    const baseSize = 48;
    const size = Math.round(baseSize * vehicleScale);
    svg.setAttribute('width', `${size}`);
    svg.setAttribute('height', `${size}`);
  }
}
