/**
 * TABS COMPONENT - PREMIUM
 * 
 * Full-featured tabs with:
 * - Horizontal & Vertical layouts
 * - Icons & Badges
 * - Keyboard navigation
 * - Responsive design
 * - Theme integration
 */

'use client';

import React, { useState } from 'react';
import { Icon, type IconName } from '../Icon';
import { Badge } from '../Badge';
import styles from './Tabs.module.css';

export interface Tab {
  id: string;
  label: string;
  icon?: IconName;
  badge?: number | string;
  badgeColor?: 'theme' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabsProps {
  /** Tabs array */
  tabs: Tab[];
  /** Default active tab id */
  defaultActiveTab?: string;
  /** Controlled active tab id */
  activeTab?: string;
  /** On tab change callback */
  onChange?: (tabId: string) => void;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Tab variant */
  variant?: 'default' | 'pills' | 'underline';
  /** Full width tabs */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
}

export function Tabs({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onChange,
  orientation = 'horizontal',
  variant = 'default',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultActiveTab || tabs[0]?.id || ''
  );

  // Use controlled or internal state
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  // Handle tab click
  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }

    onChange?.(tabId);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, tabId: string, index: number) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentIndex = enabledTabs.findIndex(t => t.id === tabId);

    let nextIndex = currentIndex;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
      } else if (e.key === 'ArrowRight') {
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
      }
    } else {
      if (e.key === 'ArrowUp') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
      } else if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
      }
    }

    if (nextIndex !== currentIndex) {
      const nextTab = enabledTabs[nextIndex];
      if (nextTab) {
        handleTabClick(nextTab.id, false);
        
        // Focus the next tab
        const nextTabElement = document.querySelector(
          `[data-tab-id="${nextTab.id}"]`
        ) as HTMLButtonElement;
        nextTabElement?.focus();
      }
    }
  };

  // Get active tab content
  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div 
      className={`${styles.container} ${styles[`orientation-${orientation}`]} ${className}`}
      role="tablist"
      aria-orientation={orientation}
    >
      {/* Tab List */}
      <div 
        className={`${styles.tabList} ${styles[`variant-${variant}`]} ${
          fullWidth ? styles.fullWidth : ''
        }`}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''} ${
                isDisabled ? styles.tabDisabled : ''
              }`}
              onClick={() => handleTabClick(tab.id, isDisabled)}
              onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
              type="button"
            >
              {/* Icon */}
              {tab.icon && (
                <Icon 
                  name={tab.icon} 
                  size="sm" 
                  {...(isActive && { color: 'theme' as const })}
                />
              )}

              {/* Label */}
              <span className={styles.tabLabel}>{tab.label}</span>

              {/* Badge */}
              {tab.badge !== undefined && (
                <Badge 
                  color={tab.badgeColor || 'theme'} 
                  size="sm"
                  variant="soft"
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}

        {/* Active indicator (for underline variant) */}
        {variant === 'underline' && (
          <div 
            className={styles.activeIndicator}
            style={{
              [orientation === 'horizontal' ? 'left' : 'top']: 
                `calc(${tabs.findIndex(t => t.id === activeTab)} * ${
                  fullWidth ? `${100 / tabs.length}%` : 'auto'
                })`,
            }}
          />
        )}
      </div>

      {/* Tab Panels */}
      <div className={styles.tabPanels}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            className={styles.tabPanel}
          >
            {tab.id === activeTab && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
