/**
 * useCounterAnimation Hook (useCountUp)
 * 
 * Animates a number from current to target using requestAnimationFrame
 * 100% reutilizabil, smooth easing, zero transform-uri
 * 
 * Compliant:
 * - <50 lines per function
 * - TypeScript strict
 * - requestAnimationFrame (performant)
 * - Easing support
 * - prefers-reduced-motion support
 */

import { useEffect, useRef, useState } from 'react';

type EasingFunction = 'linear' | 'outCubic' | 'outQuad';

interface UseCounterAnimationOptions {
  /** Animation duration in ms */
  duration?: number;
  /** Easing function */
  easing?: EasingFunction;
  /** Enable animation (false for prefers-reduced-motion) */
  enabled?: boolean;
}

const easingFunctions = {
  linear: (t: number) => t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  outQuad: (t: number) => 1 - Math.pow(1 - t, 2),
};

/**
 * Animate a number from current to target value with easing
 * 
 * @param target - Target value to animate to
 * @param options - Animation options
 * @returns Animated value (rounded)
 * 
 * @example
 * const animated = useCounterAnimation(1234, { duration: 700, easing: 'outCubic' });
 * return <div>{animated}</div>;
 */
export function useCounterAnimation(
  target: number,
  options: UseCounterAnimationOptions = {}
): number {
  const { duration = 700, easing = 'outCubic', enabled = true } = options;
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    // Skip animation if disabled
    if (!enabled) {
      setVal(target);
      return;
    }

    let raf = 0;
    const ease = easingFunctions[easing];

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min(1, (timestamp - startRef.current) / duration);
      const next = fromRef.current + (target - fromRef.current) * ease(progress);
      setVal(next);
      
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    cancelAnimationFrame(raf);
    startRef.current = null;
    fromRef.current = val; // Start from current value for smooth updates
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [target, duration, easing, enabled, val]);

  return Math.round(val);
}
