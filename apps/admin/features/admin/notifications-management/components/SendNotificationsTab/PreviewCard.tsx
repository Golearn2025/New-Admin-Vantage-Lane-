/**
 * Preview Card Component
 * Preview of how the notification will appear
 * 
 * MODERN & PREMIUM - 100% lucide-react icons
 */

'use client';

import { Link as LinkIcon } from 'lucide-react';
import type { NotificationFormData } from './types';
import styles from './PreviewCard.module.css';

interface PreviewCardProps {
  data: NotificationFormData;
}

export function PreviewCard({ data }: PreviewCardProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Preview</h3>
      <div className={styles.card}>
        <div className={styles.notifTitle}>
          {data.title || 'Notification Title'}
        </div>
        <div className={styles.notifMessage}>
          {data.message || 'Notification message will appear here...'}
        </div>
        {data.link && (
          <div className={styles.notifLink}>
            <LinkIcon size={14} strokeWidth={2} />
            <span>{data.link}</span>
          </div>
        )}
      </div>
    </div>
  );
}
