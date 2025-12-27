/**
 * Smooth Marker Animation - Standard GPS Tracking Approach
 * Used by Uber, Bolt, Google Maps for smooth vehicle movement
 */

interface Position {
  lat: number;
  lng: number;
}

interface AnimationState {
  startPos: Position;
  endPos: Position;
  startTime: number;
  duration: number;
  animationFrame: number | null;
  onUpdate: (pos: Position, heading: number) => void;
  onComplete: (() => void) | undefined;
}

const activeAnimations = new Map<string, AnimationState>();

/**
 * Calculate bearing (heading) between two points
 */
function calculateBearing(start: Position, end: Position): number {
  const startLat = start.lat * Math.PI / 180;
  const startLng = start.lng * Math.PI / 180;
  const endLat = end.lat * Math.PI / 180;
  const endLng = end.lng * Math.PI / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  return bearing;
}

/**
 * Easing function for smooth acceleration/deceleration
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Animate marker smoothly between two positions
 * This is the STANDARD approach used by all GPS tracking apps
 * 
 * @param markerId Unique identifier for this marker
 * @param startPos Starting position
 * @param endPos Ending position
 * @param durationMs Animation duration (typically 5000ms = time between GPS updates)
 * @param onUpdate Callback for each frame with new position and heading
 * @param onComplete Callback when animation completes
 */
export function animateMarkerSmooth(
  markerId: string,
  startPos: Position,
  endPos: Position,
  durationMs: number,
  onUpdate: (pos: Position, heading: number) => void,
  onComplete?: () => void
): void {
  // Cancel any existing animation for this marker
  cancelMarkerAnimation(markerId);

  const startTime = Date.now();
  const heading = calculateBearing(startPos, endPos);

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    // Apply easing for smooth movement
    const eased = easeInOutCubic(progress);

    // Interpolate position
    const currentPos = {
      lat: startPos.lat + (endPos.lat - startPos.lat) * eased,
      lng: startPos.lng + (endPos.lng - startPos.lng) * eased
    };

    onUpdate(currentPos, heading);

    if (progress < 1) {
      const state = activeAnimations.get(markerId);
      if (state) {
        state.animationFrame = requestAnimationFrame(animate);
      }
    } else {
      activeAnimations.delete(markerId);
      onComplete?.();
    }
  };

  // Store animation state
  activeAnimations.set(markerId, {
    startPos,
    endPos,
    startTime,
    duration: durationMs,
    animationFrame: null,
    onUpdate,
    onComplete
  });

  // Start animation
  const state = activeAnimations.get(markerId)!;
  state.animationFrame = requestAnimationFrame(animate);
}

/**
 * Cancel animation for a specific marker
 */
export function cancelMarkerAnimation(markerId: string): void {
  const state = activeAnimations.get(markerId);
  if (state && state.animationFrame !== null) {
    cancelAnimationFrame(state.animationFrame);
    activeAnimations.delete(markerId);
  }
}

/**
 * Cancel all active animations
 */
export function cancelAllAnimations(): void {
  activeAnimations.forEach((state, markerId) => {
    if (state.animationFrame !== null) {
      cancelAnimationFrame(state.animationFrame);
    }
  });
  activeAnimations.clear();
}

/**
 * Check if marker is currently animating
 */
export function isMarkerAnimating(markerId: string): boolean {
  return activeAnimations.has(markerId);
}
