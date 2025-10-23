/**
 * VANTAGE LANE - THEME PRESETS
 * 
 * Multi-theme support: permite schimbarea culorii brandului în tot proiectul
 * doar prin selectarea unui preset diferit.
 * 
 * Toate componentele folosesc var(--theme-primary) și se actualizează automat!
 */

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primaryAlpha10: string;
    primaryAlpha20: string;
    primaryAlpha30: string;
  };
  effects: {
    gradient: string;
    gradientHover: string;
    glow: string;
    glowStrong: string;
    shimmer: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    button: string;
    buttonHover: string;
    focus: string;
  };
  tags: string[];
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  // ============================================
  // 1. VANTAGE GOLD (Primary Brand - #d3aa31)
  // ============================================
  vantageGold: {
    id: 'vantageGold',
    name: 'Vantage Gold',
    description: 'Premium gold theme - Vantage Lane signature color',
    colors: {
      primary: '#d3aa31',
      primaryDark: '#b8922a',
      primaryLight: '#e5c65f',
      primaryAlpha10: 'rgba(211, 170, 49, 0.1)',
      primaryAlpha20: 'rgba(211, 170, 49, 0.2)',
      primaryAlpha30: 'rgba(211, 170, 49, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(135deg, #d3aa31 0%, #e5c65f 100%)',
      gradientHover: 'linear-gradient(135deg, #b8922a 0%, #d3aa31 100%)',
      glow: '0 0 20px rgba(211, 170, 49, 0.4)',
      glowStrong: '0 0 30px rgba(211, 170, 49, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 16px rgba(211, 170, 49, 0.15)',
      cardHover: '0 8px 24px rgba(211, 170, 49, 0.25)',
      button: '0 2px 8px rgba(211, 170, 49, 0.2)',
      buttonHover: '0 4px 12px rgba(211, 170, 49, 0.3)',
      focus: '0 0 0 3px rgba(211, 170, 49, 0.3)',
    },
    tags: ['default', 'gold', 'premium', 'vantage'],
  },

  // ============================================
  // 2. ROYAL PURPLE (Luxury variant)
  // ============================================
  royalPurple: {
    id: 'royalPurple',
    name: 'Royal Purple',
    description: 'Elegant purple theme for luxury feel',
    colors: {
      primary: '#8b5cf6',
      primaryDark: '#7c3aed',
      primaryLight: '#a78bfa',
      primaryAlpha10: 'rgba(139, 92, 246, 0.1)',
      primaryAlpha20: 'rgba(139, 92, 246, 0.2)',
      primaryAlpha30: 'rgba(139, 92, 246, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      gradientHover: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      glow: '0 0 20px rgba(139, 92, 246, 0.4)',
      glowStrong: '0 0 30px rgba(139, 92, 246, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 16px rgba(139, 92, 246, 0.15)',
      cardHover: '0 8px 24px rgba(139, 92, 246, 0.25)',
      button: '0 2px 8px rgba(139, 92, 246, 0.2)',
      buttonHover: '0 4px 12px rgba(139, 92, 246, 0.3)',
      focus: '0 0 0 3px rgba(139, 92, 246, 0.3)',
    },
    tags: ['purple', 'luxury', 'elegant'],
  },

  // ============================================
  // 3. OCEAN BLUE (Corporate/Trust)
  // ============================================
  oceanBlue: {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    description: 'Professional blue for corporate environments',
    colors: {
      primary: '#3b82f6',
      primaryDark: '#2563eb',
      primaryLight: '#60a5fa',
      primaryAlpha10: 'rgba(59, 130, 246, 0.1)',
      primaryAlpha20: 'rgba(59, 130, 246, 0.2)',
      primaryAlpha30: 'rgba(59, 130, 246, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      gradientHover: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      glow: '0 0 20px rgba(59, 130, 246, 0.4)',
      glowStrong: '0 0 30px rgba(59, 130, 246, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 16px rgba(59, 130, 246, 0.15)',
      cardHover: '0 8px 24px rgba(59, 130, 246, 0.25)',
      button: '0 2px 8px rgba(59, 130, 246, 0.2)',
      buttonHover: '0 4px 12px rgba(59, 130, 246, 0.3)',
      focus: '0 0 0 3px rgba(59, 130, 246, 0.3)',
    },
    tags: ['blue', 'corporate', 'professional'],
  },

  // ============================================
  // 4. CRIMSON RED (Bold/Energetic)
  // ============================================
  crimsonRed: {
    id: 'crimsonRed',
    name: 'Crimson Red',
    description: 'Bold red theme for high energy brands',
    colors: {
      primary: '#ef4444',
      primaryDark: '#dc2626',
      primaryLight: '#f87171',
      primaryAlpha10: 'rgba(239, 68, 68, 0.1)',
      primaryAlpha20: 'rgba(239, 68, 68, 0.2)',
      primaryAlpha30: 'rgba(239, 68, 68, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      gradientHover: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      glow: '0 0 20px rgba(239, 68, 68, 0.4)',
      glowStrong: '0 0 30px rgba(239, 68, 68, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(248,113,113,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 16px rgba(239, 68, 68, 0.15)',
      cardHover: '0 8px 24px rgba(239, 68, 68, 0.25)',
      button: '0 2px 8px rgba(239, 68, 68, 0.2)',
      buttonHover: '0 4px 12px rgba(239, 68, 68, 0.3)',
      focus: '0 0 0 3px rgba(239, 68, 68, 0.3)',
    },
    tags: ['red', 'bold', 'energetic'],
  },

  // ============================================
  // 5. EMERALD GREEN (Growth/Success)
  // ============================================
  emeraldGreen: {
    id: 'emeraldGreen',
    name: 'Emerald Green',
    description: 'Fresh green theme symbolizing growth',
    colors: {
      primary: '#10b981',
      primaryDark: '#059669',
      primaryLight: '#34d399',
      primaryAlpha10: 'rgba(16, 185, 129, 0.1)',
      primaryAlpha20: 'rgba(16, 185, 129, 0.2)',
      primaryAlpha30: 'rgba(16, 185, 129, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      gradientHover: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      glow: '0 0 20px rgba(16, 185, 129, 0.4)',
      glowStrong: '0 0 30px rgba(16, 185, 129, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 16px rgba(16, 185, 129, 0.15)',
      cardHover: '0 8px 24px rgba(16, 185, 129, 0.25)',
      button: '0 2px 8px rgba(16, 185, 129, 0.2)',
      buttonHover: '0 4px 12px rgba(16, 185, 129, 0.3)',
      focus: '0 0 0 3px rgba(16, 185, 129, 0.3)',
    },
    tags: ['green', 'growth', 'success'],
  },

  // ============================================
  // 6. SUNSET ORANGE (Warm/Creative)
  // ============================================
  sunsetOrange: {
    id: 'sunsetOrange',
    name: 'Sunset Orange',
    description: 'Warm orange theme for creative brands',
    colors: {
      primary: '#f97316',
      primaryDark: '#ea580c',
      primaryLight: '#fb923c',
      primaryAlpha10: 'rgba(249, 115, 22, 0.1)',
      primaryAlpha20: 'rgba(249, 115, 22, 0.2)',
      primaryAlpha30: 'rgba(249, 115, 22, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      gradientHover: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      glow: '0 0 20px rgba(249, 115, 22, 0.4)',
      glowStrong: '0 0 30px rgba(249, 115, 22, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 16px rgba(249, 115, 22, 0.15)',
      cardHover: '0 8px 24px rgba(249, 115, 22, 0.25)',
      button: '0 2px 8px rgba(249, 115, 22, 0.2)',
      buttonHover: '0 4px 12px rgba(249, 115, 22, 0.3)',
      focus: '0 0 0 3px rgba(249, 115, 22, 0.3)',
    },
    tags: ['orange', 'warm', 'creative'],
  },

  // ============================================
  // 7. NEO GLASS (pentru dashboard special)
  // ============================================
  neoGlass: {
    id: 'neoGlass',
    name: 'Neo Glass',
    description: 'Futuristic purple-pink gradient (pentru NeoGlass Dashboard)',
    colors: {
      primary: '#6B4EFF',
      primaryDark: '#5a3de8',
      primaryLight: '#A58BFF',
      primaryAlpha10: 'rgba(107, 78, 255, 0.1)',
      primaryAlpha20: 'rgba(107, 78, 255, 0.2)',
      primaryAlpha30: 'rgba(107, 78, 255, 0.3)',
    },
    effects: {
      gradient: 'linear-gradient(180deg, #6B4EFF 0%, #A58BFF 100%)',
      gradientHover: 'linear-gradient(180deg, #5a3de8 0%, #6B4EFF 100%)',
      glow: '0 0 20px rgba(107, 78, 255, 0.4)',
      glowStrong: '0 0 30px rgba(107, 78, 255, 0.6)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(165,139,255,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 24px rgba(107, 78, 255, 0.15)',
      cardHover: '0 8px 32px rgba(107, 78, 255, 0.25)',
      button: '0 2px 8px rgba(107, 78, 255, 0.2)',
      buttonHover: '0 4px 12px rgba(107, 78, 255, 0.3)',
      focus: '0 0 0 3px rgba(107, 78, 255, 0.3)',
    },
    tags: ['purple', 'futuristic', 'glassmorphism', 'neoglass'],
  },
};

/**
 * Helper pentru a obține preset-ul curent
 */
export function getThemePreset(themeId: string): ThemePreset {
  // Check if theme exists in THEME_PRESETS
  if (themeId in THEME_PRESETS) {
    // TypeScript can't narrow the type automatically, so we assert it's defined
    return THEME_PRESETS[themeId as keyof typeof THEME_PRESETS]!;
  }
  
  // Fallback to vantageGold if not found
  console.warn(`Theme "${themeId}" not found, falling back to vantageGold`);
  return THEME_PRESETS.vantageGold!;
}

/**
 * Helper pentru a lista toate theme-urile disponibile
 */
export function getAllThemes(): ThemePreset[] {
  return Object.values(THEME_PRESETS);
}

/**
 * Helper pentru a aplica theme CSS variables
 */
export function applyThemeVariables(theme: ThemePreset) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Colors
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--theme-primary-light', theme.colors.primaryLight);
  root.style.setProperty('--theme-primary-alpha-10', theme.colors.primaryAlpha10);
  root.style.setProperty('--theme-primary-alpha-20', theme.colors.primaryAlpha20);
  root.style.setProperty('--theme-primary-alpha-30', theme.colors.primaryAlpha30);

  // Effects
  root.style.setProperty('--theme-gradient', theme.effects.gradient);
  root.style.setProperty('--theme-gradient-hover', theme.effects.gradientHover);
  root.style.setProperty('--theme-glow', theme.effects.glow);
  root.style.setProperty('--theme-glow-strong', theme.effects.glowStrong);

  // Shadows
  root.style.setProperty('--theme-shadow-card', theme.shadows.card);
  root.style.setProperty('--theme-shadow-card-hover', theme.shadows.cardHover);
  root.style.setProperty('--theme-shadow-button', theme.shadows.button);
  root.style.setProperty('--theme-shadow-button-hover', theme.shadows.buttonHover);
  root.style.setProperty('--theme-shadow-focus', theme.shadows.focus);
}
