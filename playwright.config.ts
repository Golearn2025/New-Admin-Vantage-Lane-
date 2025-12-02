import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Vantage Lane Admin
 * Security-focused E2E testing
 */
export default defineConfig({
  // Test directory
  testDir: './e2e/tests',
  
  // Fulfillment timeout per test
  timeout: 60_000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 10_000,
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : 2,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'e2e/reports' }],
    ['json', { outputFile: 'e2e/reports/results.json' }],
    ['line']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure  
    screenshot: 'only-on-failure',
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium-security',
      use: { 
        ...devices['Desktop Chrome'],
        // Security-focused settings
        permissions: [],
        locale: 'en-US',
        timezoneId: 'UTC',
      },
      testMatch: '**/security/*.spec.ts',
    },
    
    {
      name: 'firefox-security', 
      use: {
        ...devices['Desktop Firefox'],
        permissions: [],
        locale: 'en-US',
        timezoneId: 'UTC',
      },
      testMatch: '**/security/*.spec.ts',
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  
  // Output directory for test artifacts
  outputDir: 'e2e/artifacts',
  
  // Global test configuration
  globalSetup: './e2e/setup/global-setup.ts',
  globalTeardown: './e2e/setup/global-teardown.ts',
});
