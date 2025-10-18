/**
 * VANTAGE LANE - THEME PROVIDER
 * 
 * React Context pentru gestionarea theme-ului global.
 * Permite schimbarea culorii brandului în timp real.
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_PRESETS, type ThemePreset, applyThemeVariables, getThemePreset } from './theme-presets';

type ThemeKey = keyof typeof THEME_PRESETS;

interface ThemeContextType {
  currentTheme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  themeConfig: ThemePreset;
  availableThemes: ThemePreset[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeKey;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'vantageGold',
  storageKey = 'vantage-lane-theme',
}: ThemeProviderProps) {
  // Initialize theme from localStorage sau default
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && stored in THEME_PRESETS) {
        return stored as ThemeKey;
      }
    }
    return defaultTheme;
  });

  const themeConfig = getThemePreset(currentTheme);
  const availableThemes = Object.values(THEME_PRESETS);

  // Apply theme CSS variables când se schimbă
  useEffect(() => {
    applyThemeVariables(themeConfig);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, currentTheme);
    }

    // Optional: dispatch custom event pentru alte componente
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('theme-changed', {
          detail: { theme: currentTheme, config: themeConfig },
        })
      );
    }
  }, [currentTheme, themeConfig, storageKey]);

  const handleSetTheme = (theme: ThemeKey) => {
    if (theme in THEME_PRESETS) {
      setCurrentTheme(theme);
    } else {
      console.warn(`Theme "${theme}" not found. Available themes:`, Object.keys(THEME_PRESETS));
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        themeConfig,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook pentru a accesa theme-ul curent
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentTheme, setTheme, themeConfig } = useTheme();
 *   
 *   return (
 *     <button onClick={() => setTheme('royalPurple')}>
 *       Switch to {themeConfig.name}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Hook pentru a obține direct culorile theme-ului
 * Util când ai nevoie rapid de culori în JS
 * 
 * @example
 * ```tsx
 * function Chart() {
 *   const colors = useThemeColors();
 *   
 *   return <BarChart color={colors.primary} />;
 * }
 * ```
 */
export function useThemeColors() {
  const { themeConfig } = useTheme();
  return themeConfig.colors;
}

/**
 * Hook pentru a obține direct efectele theme-ului
 * 
 * @example
 * ```tsx
 * function Card() {
 *   const effects = useThemeEffects();
 *   
 *   return (
 *     <div style={{ 
 *       background: effects.gradient,
 *       boxShadow: effects.glow 
 *     }}>
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */
export function useThemeEffects() {
  const { themeConfig } = useTheme();
  return themeConfig.effects;
}
