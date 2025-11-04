/**
 * WhatsAppShare Component
 * 
 * Generates WhatsApp messages for booking sharing:
 * - Basic: Only postcodes (for initial broadcast)
 * - Full: Complete details (after driver accepts)
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import React, { useState } from 'react';
import { Smartphone, CheckCircle, Clipboard } from 'lucide-react';
import type { BookingListItem } from '@vantage-lane/contracts';
import styles from './WhatsAppShare.module.css';

interface WhatsAppShareProps {
  booking: BookingListItem;
  level: 'basic' | 'full';
}

export function WhatsAppShare({ booking, level }: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false);

  const extractPostcode = (address: string): string => {
    const match = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/i);
    return match ? match[0] : address.split(',').pop()?.trim() || address;
  };

  const extractArea = (address: string): string => {
    const parts = address.split(',');
    return parts.length > 1 ? (parts[parts.length - 2]?.trim() || '') : '';
  };

  const generateBasicMessage = (): string => {
    const pickupPostcode = extractPostcode(booking.pickup_location);
    const pickupArea = extractArea(booking.pickup_location);
    const dropoffPostcode = extractPostcode(booking.destination);
    const dropoffArea = extractArea(booking.destination);
    const surge = booking.platform_commission_pct && booking.platform_commission_pct > 10 
      ? ` ⚡${(booking.platform_commission_pct / 10).toFixed(1)}x` 
      : '';
    
    const scheduledDate = booking.scheduled_at 
      ? new Date(booking.scheduled_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      : 'TBD';

    return `🚗 *Vantage Lane Job Alert*
━━━━━━━━━━━━━━━━━━━━━━

📋 *${booking.reference}* • 💰 *£${booking.fare_amount.toFixed(0)}*${surge}

📍 *PICKUP*
${pickupPostcode}${pickupArea ? ` (${pickupArea})` : ''}
🕐 ${scheduledDate}${booking.flight_number ? ` • ✈️ ${booking.flight_number}` : ''}

📍 *DROP-OFF*
${dropoffPostcode}${dropoffArea ? ` (${dropoffArea})` : ''}

🚗 ${booking.category} • ${booking.distance_miles?.toFixed(0) || '?'} mi • ${booking.duration_min || '?'} min
💵 Driver gets: £${booking.driver_payout.toFixed(0)}

━━━━━━━━━━━━━━━━━━━━━━
✅ Reply "YES" to accept this job`;
  };

  const generateFullMessage = (): string => {
    const services = [...(booking.free_services || []), ...(booking.paid_services || [])];
    const servicesText = services.length > 0 
      ? `\n✨ *SERVICES*\n${services.map(s => 'service_code' in s ? s.service_code : s).join(', ')}\n` 
      : '';
    
    const scheduledDate = booking.scheduled_at 
      ? new Date(booking.scheduled_at).toLocaleString('en-GB')
      : 'TBD';

    return `✅ *Job Accepted - Full Details*
━━━━━━━━━━━━━━━━━━━━━━

📋 *${booking.reference}*

👤 *CUSTOMER*
${booking.customer_name}${booking.customer_loyalty_tier ? ` (⭐ ${booking.customer_loyalty_tier.toUpperCase()})` : ''}
📞 ${booking.customer_phone}

📍 *PICKUP*
${booking.pickup_location}
🕐 ${scheduledDate}${booking.flight_number ? ` • ✈️ ${booking.flight_number}` : ''}
🗺️ https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.pickup_location)}

📍 *DROP-OFF*
${booking.destination}
🗺️ https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.destination)}
${servicesText}${booking.notes ? `\n📝 *NOTES*\n${booking.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━
Driver: ${booking.driver_name || 'TBD'}
Vehicle: ${booking.vehicle_make || ''} ${booking.vehicle_model_name || ''} ${booking.vehicle_plate ? `(${booking.vehicle_plate})` : ''}`.trim();
  };

  const message = level === 'basic' ? generateBasicMessage() : generateFullMessage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <span className={styles.previewTitle}>
            {level === 'basic' ? (<><Smartphone size={14} /> Job Alert Preview</>) : (<><CheckCircle size={14} /> Full Details Preview</>)}
          </span>
        </div>
        <pre className={styles.previewContent}>{message}</pre>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          type="button"
        >
          {copied ? (<><CheckCircle size={14} /> Copied!</>) : (<><Clipboard size={14} /> Copy Message</>)}
        </button>
        <button
          className={styles.whatsappButton}
          onClick={handleWhatsApp}
          type="button"
        >
          <Smartphone size={14} /> Share to WhatsApp
        </button>
      </div>
    </div>
  );
}
