/**
 * THEME SWITCHER - Premium Component
 * 
 * Dropdown pentru schimbarea theme-ului în timp real.
 * Arată preview cu culoarea fiecărui theme.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import styles from './ThemeSwitcher.module.css';

export interface ThemeSwitcherProps {
  /** Position of dropdown */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Show theme name in button */
  showLabel?: boolean;
  /** Compact mode (icon only) */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

export function ThemeSwitcher({
  position = 'bottom-right',
  showLabel = true,
  compact = false,
  className = '',
}: ThemeSwitcherProps) {
  const { currentTheme, setTheme, themeConfig, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.container} ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        className={`${styles.trigger} ${compact ? styles.compact : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        aria-expanded={isOpen}
        type="button"
      >
        {/* Color Preview */}
        <span
          className={styles.colorPreview}
          style={{ background: themeConfig.colors.primary }}
          aria-hidden="true"
        />

        {/* Theme Name */}
        {!compact && showLabel && (
          <span className={styles.themeName}>{themeConfig.name}</span>
        )}

        {/* Chevron Icon */}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`${styles.dropdown} ${styles[position]}`}>
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Choose Theme</span>
          </div>

          <div className={styles.themeList}>
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                className={`${styles.themeOption} ${
                  currentTheme === theme.id ? styles.active : ''
                }`}
                onClick={() => handleThemeChange(theme.id)}
                type="button"
              >
                {/* Color Preview */}
                <div className={styles.themePreview}>
                  <div
                    className={styles.themeColor}
                    style={{ background: theme.effects.gradient }}
                  />
                  <div
                    className={styles.themeGlow}
                    style={{ boxShadow: theme.effects.glow }}
                  />
                </div>

                {/* Theme Info */}
                <div className={styles.themeInfo}>
                  <span className={styles.themeOptionName}>{theme.name}</span>
                  <span className={styles.themeDescription}>
                    {theme.description}
                  </span>
                </div>

                {/* Active Indicator */}
                {currentTheme === theme.id && (
                  <svg
                    className={styles.checkIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7 10L9 12L13 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className={styles.dropdownFooter}>
            <span className={styles.footerText}>
              {availableThemes.length} themes available
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
