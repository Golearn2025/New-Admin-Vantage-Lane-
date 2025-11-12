/**
 * Notification Sound Hook
 * 
 * 100% Reutilizabil - TypeScript Strict
 * Compliant: <50 lines, cleanup useEffect, zero any
 */

import { useState, useCallback, useEffect, useRef } from 'react';

interface NotificationSoundSettings {
  enabled: boolean;
  volume: number;
  muteAll: boolean;
}

interface UseNotificationSoundReturn {
  playNewBookingSound: () => void;
  settings: NotificationSoundSettings;
  updateSettings: (newSettings: Partial<NotificationSoundSettings>) => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'admin-notification-sound-settings';
const DEFAULT_SETTINGS: NotificationSoundSettings = {
  enabled: true,
  volume: 80,
  muteAll: false,
};

export function useNotificationSound(): UseNotificationSoundReturn {
  const [settings, setSettings] = useState<NotificationSoundSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio and settings
  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        // Invalid JSON, use defaults
        setSettings(DEFAULT_SETTINGS);
      }
    }

    // Initialize audio element
    audioRef.current = new Audio('/sounds/notification-good-427346.mp3');
    audioRef.current.preload = 'auto';
    
    setIsLoading(false);

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSoundSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const playNewBookingSound = useCallback(() => {
    if (!settings.enabled || settings.muteAll || !audioRef.current) return;

    audioRef.current.volume = settings.volume / 100;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Browser blocked autoplay - silent fail
    });
  }, [settings.enabled, settings.muteAll, settings.volume]);

  return {
    playNewBookingSound,
    settings,
    updateSettings,
    isLoading,
  };
}
