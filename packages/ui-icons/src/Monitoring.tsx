import { BaseIconProps } from './types';

export function Monitoring({ size = 24, className, 'aria-label': ariaLabel }: BaseIconProps) {
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
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
