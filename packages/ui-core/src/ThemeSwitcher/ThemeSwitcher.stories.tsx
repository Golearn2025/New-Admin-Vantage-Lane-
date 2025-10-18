/**
 * THEME SWITCHER STORIES
 * 
 * Demonstrates theme switching functionality with all 7 available themes
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { FC } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeProvider } from '../theme/ThemeProvider';

const meta = {
  title: 'Core/ThemeSwitcher',
  component: ThemeSwitcher,
  decorators: [
    (Story: FC) => (
      <ThemeProvider defaultTheme="vantageGold">
        <div style={{ padding: '2rem', minHeight: '400px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Theme Switcher

Premium dropdown component for switching between 7 available themes.

## Features

- 🎨 **7 Themes**: Vantage Gold, Royal Purple, Ocean Blue, Crimson Red, Emerald Green, Sunset Orange, Neo Glass
- 🔄 **Live Preview**: See gradient and glow effects before selecting
- 💾 **Persistent**: Theme saved to localStorage
- ✨ **Smooth Animations**: Glass effect with elegant transitions
- ⌨️ **Keyboard Friendly**: Escape to close, Tab navigation
- 📱 **Responsive**: Works on all screen sizes

## Themes Available

1. **Vantage Gold** (#d3aa31) - Default brand theme
2. **Royal Purple** (#8b5cf6) - Luxury feel
3. **Ocean Blue** (#3b82f6) - Professional
4. **Crimson Red** (#ef4444) - Bold and energetic
5. **Emerald Green** (#10b981) - Growth and success
6. **Sunset Orange** (#f97316) - Warm and creative
7. **Neo Glass** (#6B4EFF) - Futuristic glassmorphism

## How It Works

All components using \`var(--theme-primary)\` will automatically update when theme changes!

\`\`\`tsx
import { ThemeSwitcher, ThemeProvider } from '@vantage-lane/ui-core';

function App() {
  return (
    <ThemeProvider defaultTheme="vantageGold">
      <ThemeSwitcher />
      {/* Your app components */}
    </ThemeProvider>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
      description: 'Dropdown position relative to trigger button',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show current theme name in button',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode (icon only, no label)',
    },
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default theme switcher with all options visible
 */
export const Default: Story = {
  args: {
    position: 'bottom-right',
    showLabel: true,
    compact: false,
  },
};

/**
 * Compact mode - only shows color preview, no label
 * Perfect for tight spaces like mobile headers
 */
export const Compact: Story = {
  args: {
    position: 'bottom-right',
    showLabel: false,
    compact: true,
  },
};

/**
 * No label - shows only color preview but keeps regular size
 */
export const NoLabel: Story = {
  args: {
    position: 'bottom-right',
    showLabel: false,
    compact: false,
  },
};

/**
 * Different dropdown positions
 */
export const BottomLeft: Story = {
  args: {
    position: 'bottom-left',
    showLabel: true,
  },
};

export const TopRight: Story = {
  args: {
    position: 'top-right',
    showLabel: true,
  },
  decorators: [
    (Story: FC) => (
      <ThemeProvider defaultTheme="vantageGold">
        <div style={{ padding: '2rem', minHeight: '500px', display: 'flex', alignItems: 'flex-end' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

/**
 * Multiple switchers in a toolbar
 */
export const InToolbar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: 'var(--color-surface-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-default)',
      }}
    >
      <div style={{ flex: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}>
        Vantage Lane Admin
      </div>
      <button
        style={{
          padding: '0.5rem 1rem',
          background: 'var(--theme-gradient)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Dashboard
      </button>
      <ThemeSwitcher compact />
    </div>
  ),
};

/**
 * With custom styling
 */
export const CustomStyle: Story = {
  args: {
    position: 'bottom-right',
    showLabel: true,
    className: 'custom-theme-switcher',
  },
  decorators: [
    (Story: FC) => (
      <ThemeProvider defaultTheme="royalPurple">
        <div style={{ padding: '2rem' }}>
          <Story />
          <style>{`
            .custom-theme-switcher button {
              border: 2px solid var(--theme-primary);
              box-shadow: var(--theme-glow);
            }
          `}</style>
        </div>
      </ThemeProvider>
    ),
  ],
};

/**
 * Demonstration: All themes preview
 * Click each theme to see the entire UI update!
 */
export const AllThemesDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '600px' }}>
      {/* Header with theme switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: 'var(--color-surface-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
          Theme Demo
        </h3>
        <ThemeSwitcher />
      </div>

      {/* Demo Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Card 1 */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--color-surface-elevated)',
            border: '2px solid var(--theme-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--theme-shadow-card)',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: 'var(--theme-primary)' }}>
            Primary Card
          </h4>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            This card uses theme primary color for border and heading
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--theme-gradient)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--theme-glow)',
            color: 'white',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem' }}>Gradient Card</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
            This card uses theme gradient background
          </p>
        </div>
      </div>

      {/* Demo Button */}
      <button
        style={{
          padding: '0.75rem 2rem',
          background: 'var(--theme-gradient)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'var(--theme-shadow-button)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--theme-shadow-button-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--theme-shadow-button)';
        }}
      >
        Primary Action
      </button>

      {/* Info */}
      <div
        style={{
          padding: '1rem',
          background: 'var(--theme-primary-alpha-10)',
          border: '1px solid var(--theme-primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        💡 <strong>Try switching themes!</strong> All elements update automatically because they use
        CSS variables like <code>var(--theme-primary)</code>
      </div>
    </div>
  ),
};
