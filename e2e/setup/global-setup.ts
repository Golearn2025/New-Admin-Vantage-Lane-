import { chromium, type FullConfig } from '@playwright/test';
import { TEST_USERS } from '../fixtures/test-users';

/**
 * Global Setup for Playwright Tests  
 * Pre-authenticates test users to avoid login in every test
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for security tests...');
  
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3001';
  const browser = await chromium.launch();
  
  try {
    // Pre-authenticate admin user
    await authenticateUser(browser, baseURL, TEST_USERS.admin, 'e2e/.auth/admin.json');
    
    // Pre-authenticate operator user  
    await authenticateUser(browser, baseURL, TEST_USERS.operator, 'e2e/.auth/operator.json');
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Authenticate a user and save session storage
 */
async function authenticateUser(
  browser: any,
  baseURL: string,
  user: { email: string; password: string; role: string },
  authFile: string
) {
  console.log(`🔐 Authenticating ${user.role}: ${user.email}`);
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to login with longer timeout
    await page.goto(`${baseURL}/login`, { timeout: 60000 });
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    
    // Fill login form
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    
    // Submit form
    await page.click('button[type="submit"], [data-testid="login-submit"]');
    
    // Wait for successful login (redirect to dashboard)
    await page.waitForURL(/\/(dashboard|operator)/, { timeout: 15000 });
    
    // Verify authentication success
    const isAuthenticated = await page.evaluate(() => {
      // Check for common auth indicators
      return !!document.querySelector('[data-testid="user-menu"], .user-avatar, [data-role]');
    });
    
    if (!isAuthenticated) {
      throw new Error(`Authentication failed for ${user.email}`);
    }
    
    // Save authentication state
    await context.storageState({ path: authFile });
    console.log(`✅ Authenticated ${user.role} successfully`);
    
  } catch (error) {
    console.error(`❌ Failed to authenticate ${user.email}:`, error);
    throw error;
  } finally {
    await context.close();
  }
}

export default globalSetup;
