import { BaseIconProps } from './types';

export function Luggage({ size = 24, className, 'aria-label': ariaLabel }: BaseIconProps) {
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
      <rect x="6" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 14h12M9 20v1M15 20v1"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
