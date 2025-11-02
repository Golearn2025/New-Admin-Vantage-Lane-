/**
 * BookingExpandedRow Component - Tabbed Interface
 * 
 * Displays booking details in organized tabs:
 * - Assignment (default): Driver/Vehicle assignment + WhatsApp share
 * - Overview: Pickup/Dropoff, Customer, Services, Notes
 * - Pricing: Calculation, Surge, Commission splits
 * - Timeline: Audit log with status changes
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import React, { useState } from 'react';
import { UserCheck, ClipboardList, DollarSign, Calendar } from 'lucide-react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { 
  TabPanel,
  AssignmentTab,
  OverviewTab,
  PricingTab,
  TimelineTab,
  WhatsAppShare,
  type Tab,
} from './expanded';
import styles from './BookingExpandedRow.module.css';

interface BookingExpandedRowProps {
  booking: BookingListItem;
}

export function BookingExpandedRow({ booking }: BookingExpandedRowProps) {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsAppLevel, setWhatsAppLevel] = useState<'basic' | 'full'>('basic');

  const handleShareWhatsApp = (level: 'basic' | 'full') => {
    setWhatsAppLevel(level);
    setShowWhatsApp(true);
  };

  const tabs: Tab[] = [
    {
      id: 'assignment',
      label: 'Assignment',
      icon: <UserCheck size={18} strokeWidth={2} />,
      content: (
        <AssignmentTab
          booking={booking}
          onShareWhatsApp={() => handleShareWhatsApp(booking.driver_id ? 'full' : 'basic')}
        />
      ),
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: <ClipboardList size={18} strokeWidth={2} />,
      content: <OverviewTab booking={booking} />,
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: <DollarSign size={18} strokeWidth={2} />,
      content: <PricingTab booking={booking} />,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <Calendar size={18} strokeWidth={2} />,
      content: <TimelineTab booking={booking} />,
    },
  ];

  return (
    <div className={styles.expandedContainer}>
      {showWhatsApp && (
        <div className={styles.whatsappModal}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Share to WhatsApp</h3>
            <button 
              className={styles.modalClose}
              onClick={() => setShowWhatsApp(false)}
              type="button"
            >
              ✕
            </button>
          </div>
          <WhatsAppShare booking={booking} level={whatsAppLevel} />
        </div>
      )}

      <TabPanel tabs={tabs} defaultTab="assignment" variant="underline" />
    </div>
  );
}
