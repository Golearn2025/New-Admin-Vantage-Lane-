/**
 * Message Form Component
 * Input fields for notification title, message, and link
 * 
 * MODERN & PREMIUM - 100% ui-core + Textarea
 */

'use client';

import { Input, Textarea } from '@vantage-lane/ui-core';
import type { NotificationFormData } from './types';
import styles from './MessageForm.module.css';

interface MessageFormProps {
  data: NotificationFormData;
  onChange: (data: Partial<NotificationFormData>) => void;
}

export function MessageForm({ data, onChange }: MessageFormProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Message</h3>
      
      <div className={styles.field}>
        <label htmlFor="notif-title" className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <Input
          id="notif-title"
          type="text"
          placeholder="Notification title..."
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="notif-message" className={styles.label}>
          Message <span className={styles.required}>*</span>
        </label>
        <Textarea
          id="notif-message"
          placeholder="Notification message..."
          value={data.message}
          onChange={(e) => onChange({ message: e.target.value })}
          rows={5}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="notif-link" className={styles.label}>
          Link (optional)
        </label>
        <Input
          id="notif-link"
          type="text"
          placeholder="/admin/bookings"
          value={data.link}
          onChange={(e) => onChange({ link: e.target.value })}
        />
      </div>
    </div>
  );
}
