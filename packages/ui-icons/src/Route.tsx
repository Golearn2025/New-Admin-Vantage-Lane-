import { BaseIconProps } from './types';

export function Route({ size = 24, className, 'aria-label': ariaLabel }: BaseIconProps) {
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
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth={1.5} />
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M8.5 8.5l7 7"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
