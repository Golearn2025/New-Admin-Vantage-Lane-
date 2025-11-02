import * as React from 'react';
import type { LucideProps } from 'lucide-react';

export type IconProps = LucideProps & {
  'aria-label'?: string;
};

export function makeLucide(
  L: React.ComponentType<any>,
  defaults: { size?: number | string; strokeWidth?: number | string } = {}
) {
  return function Icon(props: IconProps) {
    const { size, strokeWidth, className, ...rest } = props;
    return (
      <L
        className={className}
        size={size ?? defaults.size ?? 24}
        strokeWidth={strokeWidth ?? defaults.strokeWidth ?? 2}
        {...rest}
      />
    );
  };
}
