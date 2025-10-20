import { BaseIconProps } from './types';

export function CreditCard({ size = 24, className, 'aria-label': ariaLabel }: BaseIconProps) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth={1.5} />
      <path d="M2 10h20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
