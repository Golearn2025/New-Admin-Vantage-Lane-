/**
 * DEMO PAGE - Theme System & Premium Components
 * 
 * Temporary page to showcase the new theme system and premium components
 */

'use client';

import { ThemeProvider, ThemeSwitcher } from '@vantage-lane/ui-core';
import { Button } from '@vantage-lane/ui-core';
import { Input } from '@vantage-lane/ui-core';
import { Card } from '@vantage-lane/ui-core';
import styles from './demo.module.css';

export default function DemoPage() {
  return (
    <ThemeProvider defaultTheme="vantageGold">
      <div className={styles.demoPage}>
        {/* Header */}
        <header className={styles.demoHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>🎨 Vantage Lane Premium</h1>
              <p className={styles.subtitle}>Theme System Demo - Switch themes to see magic! ✨</p>
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.demoContent}>
          {/* Section 1: Buttons */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🔘 Premium Buttons</h2>
            <p className={styles.sectionDesc}>
              Gradient backgrounds, glow effects, and smooth transitions
            </p>
            <div className={styles.grid}>
              <div className={styles.showcase}>
                <label>Primary (Gradient + Glow)</label>
                <Button variant="primary" size="md">
                  Book Now
                </Button>
              </div>
              <div className={styles.showcase}>
                <label>Outline (Theme Border)</label>
                <Button variant="outline" size="md">
                  Learn More
                </Button>
              </div>
              <div className={styles.showcase}>
                <label>Secondary</label>
                <Button variant="secondary" size="md">
                  Cancel
                </Button>
              </div>
              <div className={styles.showcase}>
                <label>Ghost</label>
                <Button variant="ghost" size="md">
                  Skip
                </Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className={styles.showcase}>
              <label>Sizes</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
          </section>

          {/* Section 2: Inputs */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📝 Premium Inputs</h2>
            <p className={styles.sectionDesc}>
              Gold focus rings, animated labels, and icon color changes
            </p>
            <div className={styles.grid}>
              <div className={styles.showcase}>
                <Input
                  label="Email Address"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
              <div className={styles.showcase}>
                <Input
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                />
              </div>
              <div className={styles.showcase}>
                <Input
                  label="Search"
                  placeholder="Search..."
                  type="search"
                />
              </div>
              <div className={styles.showcase}>
                <Input
                  label="Disabled"
                  placeholder="Cannot edit"
                  disabled
                />
              </div>
            </div>

            <div className={styles.showcase}>
              <Input
                label="With Helper Text"
                placeholder="Enter your name"
                hint="This will be displayed publicly"
              />
            </div>

            <div className={styles.showcase}>
              <Input
                label="With Error"
                placeholder="Enter valid email"
                error="Please enter a valid email address"
              />
            </div>
          </section>

          {/* Section 3: Cards */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🃏 Premium Cards</h2>
            <p className={styles.sectionDesc}>
              Theme-colored accents and hover shadows
            </p>
            <div className={styles.cardsGrid}>
              <Card variant="default">
                <h3 style={{ margin: '0 0 0.5rem' }}>Default Card</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                  Simple card with theme accents on hover
                </p>
              </Card>
              <Card variant="elevated">
                <h3 style={{ margin: '0 0 0.5rem' }}>Elevated Card</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                  Enhanced shadow and depth
                </p>
              </Card>
              <Card variant="outlined">
                <h3 style={{ margin: '0 0 0.5rem' }}>Outlined Card</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                  Subtle border with glass background
                </p>
              </Card>
            </div>
          </section>

          {/* Section 4: Theme Colors Preview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🎨 CSS Variables (Dynamic)</h2>
            <p className={styles.sectionDesc}>
              These update automatically when you change theme!
            </p>
            <div className={styles.variablesGrid}>
              <div className={styles.colorSwatch} style={{ background: 'var(--theme-primary)' }}>
                <span>--theme-primary</span>
              </div>
              <div className={styles.colorSwatch} style={{ background: 'var(--theme-primary-dark)' }}>
                <span>--theme-primary-dark</span>
              </div>
              <div className={styles.colorSwatch} style={{ background: 'var(--theme-primary-light)' }}>
                <span>--theme-primary-light</span>
              </div>
              <div className={styles.colorSwatch} style={{ background: 'var(--theme-gradient)' }}>
                <span>--theme-gradient</span>
              </div>
            </div>

            <div className={styles.effectsDemo}>
              <div className={styles.glowBox} style={{ boxShadow: 'var(--theme-glow)' }}>
                --theme-glow
              </div>
              <div className={styles.glowBox} style={{ boxShadow: 'var(--theme-glow-strong)' }}>
                --theme-glow-strong
              </div>
              <div className={styles.glowBox} style={{ boxShadow: 'var(--theme-shadow-card)' }}>
                --theme-shadow-card
              </div>
            </div>
          </section>

          {/* Section 5: Instructions */}
          <section className={styles.section}>
            <div className={styles.instructions}>
              <h3>🎯 How to Use</h3>
              <ol>
                <li>Click the <strong>Theme Switcher</strong> in the top right</li>
                <li>Select any of the <strong>7 available themes</strong></li>
                <li>Watch <strong>ALL components update instantly</strong> 🎉</li>
                <li>Try clicking on inputs to see the <strong>gold focus rings</strong></li>
                <li>Hover over buttons to see <strong>gradient overlays and glow effects</strong></li>
              </ol>
              
              <h3>🚀 What's Next</h3>
              <ul>
                <li>✅ Phase 1: Theme System (DONE)</li>
                <li>✅ Phase 2: Button + Input Premium (DONE)</li>
                <li>✅ Phase 3: Layout Premium (DONE)</li>
                <li>🔄 Phase 4: Authentication Premium (IN PROGRESS)</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Built with ❤️ by Vantage Lane Engineering</p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Progress: 30% Complete | 3/10 Phases Done
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
