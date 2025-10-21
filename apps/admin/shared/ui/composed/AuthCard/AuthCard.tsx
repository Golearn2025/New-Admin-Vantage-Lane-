/**
 * AuthCard Component - Reusable Authentication Wrapper
 *
 * Card wrapper cu logo header și form layout pentru authentication flows.
 * Folosește DOAR design tokens și core components.
 */

import { ReactNode } from 'react';
import Image from 'next/image';
import { BrandName } from '@admin-shared/ui/composed/BrandName';
import styles from './AuthCard.module.css';

export interface AuthCardProps {
  children: ReactNode;
  title?: string;
}

export function AuthCard({ children, title }: AuthCardProps) {
  return (
    <div className={styles['container']}>
      <div className={styles['card']}>
        <div className={styles['header']}>
          {/* Logo from /public/brand/logo.png */}
          <Image
            src="/brand/logo.png"
            alt="Vantage Lane"
            width={180}
            height={40}
            className={styles['logo']}
            priority
          />

          <BrandName size="xl" />

          <p className={styles['brandSubtitle']}>Admin Access</p>

          {title && <h2 className={styles['title']}>{title}</h2>}
        </div>

        <div className={styles['content']}>{children}</div>
      </div>
    </div>
  );
}
