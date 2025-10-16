import { BaseIconProps } from './types';

export function Menu({ size = 24, className, 'aria-label': ariaLabel }: BaseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
