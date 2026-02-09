/**
 * Predictive Interpolation Engine
 * Uber/Bolt-style continuous smooth motion with dead reckoning.
 *
 * How it works:
 * 1. When a GPS update arrives, we know the car moved from A → B.
 * 2. We animate smoothly from current rendered position → B over ~1s.
 * 3. After reaching B, we EXTRAPOLATE beyond B in the same direction
 *    at the same speed (dead reckoning) so the car never stops.
 * 4. When the next GPS update C arrives, we smoothly correct toward C.
 *
 * Result: the car appears to move continuously without pauses.
 */

import mapboxgl from 'mapbox-gl';

interface Point {
  lat: number;
  lng: number;
}

interface DriverAnimationState {
  // Current rendered position (what's on screen right now)
  renderPos: Point;
  // The last confirmed GPS position
  targetPos: Point;
  // Previous confirmed GPS position (for calculating velocity)
  prevPos: Point;
  // Velocity in degrees per millisecond
  velocityLat: number;
  velocityLng: number;
  // Current heading in degrees
  heading: number;
  // Timestamp of last GPS update
  lastGpsTime: number;
  // Duration we expect between GPS updates (adaptive)
  expectedInterval: number;
  // Reference to the Mapbox marker
  marker: mapboxgl.Marker;
  // Whether we're in "catch-up" phase (moving toward new target)
  catchingUp: boolean;
  // Progress through catch-up (0 to 1)
  catchUpStart: number;
  catchUpFrom: Point;
}

const states = new Map<string, DriverAnimationState>();
let rafId: number | null = null;
let isRunning = false;
let mapMoving = false;

/**
 * Calculate bearing between two points (degrees, 0 = north, clockwise)
 */
export function calcBearing(a: Point, b: Point): number {
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Linear interpolation
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Smooth step easing (ease-out for catch-up)
 */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * The main animation loop — runs at 60fps via requestAnimationFrame.
 * Moves all driver markers every frame.
 */
function tick() {
  if (!isRunning) return;

  const now = Date.now();

  states.forEach((state, driverId) => {
    const timeSinceGps = now - state.lastGpsTime;

    let newLat: number;
    let newLng: number;

    if (state.catchingUp) {
      // Phase 1: Catch-up — smoothly move from current rendered pos to target
      const catchUpDuration = Math.min(state.expectedInterval * 0.8, 1200);
      const elapsed = now - state.catchUpStart;
      const t = Math.min(elapsed / catchUpDuration, 1);
      const eased = easeOut(t);

      newLat = lerp(state.catchUpFrom.lat, state.targetPos.lat, eased);
      newLng = lerp(state.catchUpFrom.lng, state.targetPos.lng, eased);

      if (t >= 1) {
        // Catch-up complete, switch to extrapolation
        state.catchingUp = false;
      }
    } else {
      // Phase 2: Extrapolation (dead reckoning) — continue past target
      // at the same velocity until next GPS update arrives
      const extraTime = timeSinceGps - state.expectedInterval * 0.8;
      if (extraTime > 0 && (Math.abs(state.velocityLat) > 1e-10 || Math.abs(state.velocityLng) > 1e-10)) {
        // Dampen extrapolation over time (don't overshoot too far)
        const dampen = Math.max(0, 1 - extraTime / 5000);
        newLat = state.targetPos.lat + state.velocityLat * extraTime * dampen;
        newLng = state.targetPos.lng + state.velocityLng * extraTime * dampen;
      } else {
        newLat = state.targetPos.lat;
        newLng = state.targetPos.lng;
      }
    }

    // Only update DOM if position actually changed (avoid unnecessary reflows)
    const moved =
      Math.abs(newLat - state.renderPos.lat) > 1e-7 ||
      Math.abs(newLng - state.renderPos.lng) > 1e-7;

    if (moved && !mapMoving) {
      state.renderPos = { lat: newLat, lng: newLng };
      state.marker.setLngLat([newLng, newLat]);
    }
  });

  rafId = requestAnimationFrame(tick);
}

/**
 * Start the animation engine (call once on mount)
 */
export function startEngine() {
  if (isRunning) return;
  isRunning = true;
  rafId = requestAnimationFrame(tick);
}

/**
 * Stop the animation engine (call on unmount)
 */
export function stopEngine() {
  isRunning = false;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  states.clear();
}

/**
 * Notify engine that map is being dragged (pause marker updates)
 */
export function setMapMoving(moving: boolean) {
  mapMoving = moving;
}

/**
 * Register a new driver marker with the engine
 */
export function registerDriver(
  driverId: string,
  marker: mapboxgl.Marker,
  initialPos: Point
) {
  states.set(driverId, {
    renderPos: { ...initialPos },
    targetPos: { ...initialPos },
    prevPos: { ...initialPos },
    velocityLat: 0,
    velocityLng: 0,
    heading: 0,
    lastGpsTime: Date.now(),
    expectedInterval: 1000,
    marker,
    catchingUp: false,
    catchUpStart: 0,
    catchUpFrom: { ...initialPos },
  });
}

/**
 * Unregister a driver from the engine
 */
export function unregisterDriver(driverId: string) {
  states.delete(driverId);
}

/**
 * Feed a new GPS position for a driver.
 * The engine will smoothly animate toward it and then extrapolate.
 * Returns the new heading (for rotating the car SVG).
 */
export function feedGpsUpdate(
  driverId: string,
  newPos: Point
): number | null {
  const state = states.get(driverId);
  if (!state) return null;

  const now = Date.now();
  const dt = now - state.lastGpsTime;

  // Calculate velocity (degrees per ms)
  if (dt > 0 && dt < 10000) {
    state.velocityLat = (newPos.lat - state.targetPos.lat) / dt;
    state.velocityLng = (newPos.lng - state.targetPos.lng) / dt;
  }

  // Calculate heading
  const dist = Math.abs(newPos.lat - state.targetPos.lat) + Math.abs(newPos.lng - state.targetPos.lng);
  if (dist > 1e-6) {
    state.heading = calcBearing(state.targetPos, newPos);
  }

  // Update adaptive interval
  if (dt > 100 && dt < 10000) {
    state.expectedInterval = state.expectedInterval * 0.7 + dt * 0.3; // Smooth average
  }

  // Start catch-up phase from current rendered position to new target
  state.prevPos = { ...state.targetPos };
  state.targetPos = { ...newPos };
  state.catchingUp = true;
  state.catchUpStart = now;
  state.catchUpFrom = { ...state.renderPos };
  state.lastGpsTime = now;

  return state.heading;
}

/**
 * Get current state for a driver (for debugging)
 */
export function getDriverState(driverId: string) {
  return states.get(driverId);
}

/**
 * Check if a driver is registered
 */
export function isDriverRegistered(driverId: string): boolean {
  return states.has(driverId);
}
