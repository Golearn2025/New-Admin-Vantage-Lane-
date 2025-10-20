import { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  children: ReactNode;
  className?: string;
}

export function Card({
  padding = 'md',
  shadow = 'sm',
  border = true,
  children,
  className = '',
}: CardProps) {
  const cardClasses = [
    styles.card,
    styles[`padding-${padding}`],
    styles[`shadow-${shadow}`],
    border && styles.border,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cardClasses}>{children}</div>;
}
