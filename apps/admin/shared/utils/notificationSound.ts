/**
 * Notification Sound Utility - Single Source
 * STEP 2 - REALTIME STANDARDIZATION: Consolidated sound logic
 * 
 * Usage: playBookingNotificationSound() - plays once per booking
 */

import { logger } from '@/lib/utils/logger';

const SOUND_PATH = '/sounds/notification-good-427346.mp3';

/**
 * Play notification sound for new bookings
 * Single source to prevent duplicate audio
 */
export function playBookingNotificationSound(): void {
  try {
    const audio = new Audio(SOUND_PATH);
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Browser blocked autoplay - silent fail
    });
    logger.info('🔊 New booking sound played');
  } catch (err) {
    logger.warn('⚠️ Sound play blocked:', err);
  }
}
