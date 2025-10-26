import React from 'react';
import { BaseIconProps } from './types';

export function UserPlus({ size = 24, className, 'aria-label': ariaLabel }: BaseIconProps) {
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
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path d="M19 8v6M16 11h6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
