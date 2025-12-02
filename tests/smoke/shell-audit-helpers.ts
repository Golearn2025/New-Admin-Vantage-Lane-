/**
 * SHELL AUDIT HELPERS - Reusable functions for UI testing
 */

import { Page, expect } from '@playwright/test';
import * as fs from 'fs';

// Route interface
export interface RouteInfo {
  route: string;
  file: string;
  isDynamic?: boolean;
  isNested?: boolean;
  hasAuth?: boolean;
}

// Issue interface
export interface UIIssue {
  role: string;
  viewport: string;
  route: string;
  type: 'ERROR_PAGE' | 'MISSING_SHELL' | 'NAV_FAIL' | 'SCREENSHOT_FAIL';
  details: string;
  timestamp: string;
}

// Test viewport configuration
export const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

// Test users for each role - FAIL FAST if env missing
export const testUsers = {
  admin: {
    email: 'catalin@vantage-lane.com',
    password: process.env.ADMIN_TEST_PASSWORD!,
    expectedName: 'Catalin'
  },
  operator: {
    email: 'den@vantage-lane.com',
    password: process.env.OPERATOR_TEST_PASSWORD!,
    expectedName: 'Den'
  },
  driver: {
    email: 'driver@test.com',
    password: process.env.DRIVER_TEST_PASSWORD!,
    expectedName: 'Driver'
  }
};

// Validate required environment variables
export function validateTestEnvironment() {
  for (const [role, user] of Object.entries(testUsers)) {
    if (!user.password) {
      throw new Error(`Missing required environment variable: ${role.toUpperCase()}_TEST_PASSWORD`);
    }
  }
}

export async function loginAsRole(page: Page, role: keyof typeof testUsers) {
  const user = testUsers[role];
  
  await page.goto('/login');
  await page.fill('[data-testid="email"]', user.email);
  await page.fill('[data-testid="password"]', user.password);
  await page.click('[data-testid="login-button"]');
  
  // Wait for redirect after login
  await page.waitForURL('**/dashboard');
  
  // Wait for stable app state - no networkidle!
  await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
}

export async function testUserMenu(page: Page, role: keyof typeof testUsers) {
  const user = testUsers[role];
  
  // User profile and menu tests
  await expect(page.locator('[data-testid="user-menu-trigger"]')).toBeVisible();
  
  // Check if user name is displayed
  const userNameElement = page.locator(`text="${user.expectedName}"`);
  await expect(userNameElement).toBeVisible();
  
  // Test user menu dropdown
  await page.click('[data-testid="user-menu-trigger"]');
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  await expect(page.locator('text="Profile Settings"')).toBeVisible();
  await expect(page.locator('text="Logout"')).toBeVisible();
  
  // Close user menu
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
}

export async function testSingleRoute(
  page: Page, 
  route: RouteInfo, 
  role: string, 
  viewport: { name: string; width: number; height: number },
  outputDir: string
): Promise<UIIssue[]> {
  const issues: UIIssue[] = [];
  console.warn(`🔍 Testing route: ${route.route} (${viewport.name})`);
  
  try {
    // Navigate to route
    await page.goto(route.route);
    
    // Wait for stable app state - no networkidle!
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible({ timeout: 5000 });
    
    // Check for error states
    const pageContent = await page.textContent('body');
    const errorIndicators = ['404', '500', 'not found', 'internal server error'];
    const hasError = errorIndicators.some(indicator => 
      pageContent?.toLowerCase().includes(indicator)
    );
    
    if (hasError) {
      issues.push({
        role,
        viewport: viewport.name,
        route: route.route,
        type: 'ERROR_PAGE',
        details: `Error page detected: ${pageContent?.slice(0, 200)}`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Take screenshot for this route
    try {
      await page.screenshot({ 
        path: `${outputDir}/route-${role}-${viewport.name}-${route.route.replace(/\//g, '_')}.png`,
        fullPage: true 
      });
    } catch (screenshotError: unknown) {
      const errorMessage = screenshotError instanceof Error 
        ? screenshotError.message 
        : String(screenshotError);
      issues.push({
        role,
        viewport: viewport.name,
        route: route.route,
        type: 'SCREENSHOT_FAIL',
        details: `Screenshot failed: ${errorMessage}`,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (navError: unknown) {
    const errorMessage = navError instanceof Error 
      ? navError.message 
      : String(navError);
    
    if (errorMessage.includes('app-header')) {
      issues.push({
        role,
        viewport: viewport.name,
        route: route.route,
        type: 'MISSING_SHELL',
        details: `App header not found: ${errorMessage}`,
        timestamp: new Date().toISOString()
      });
    } else {
      issues.push({
        role,
        viewport: viewport.name,
        route: route.route,
        type: 'NAV_FAIL',
        details: `Navigation failed: ${errorMessage}`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return issues;
}

export function saveIssues(
  issues: UIIssue[], 
  role: string, 
  viewport: { name: string }, 
  routesToTest: RouteInfo[],
  outputDir: string
) {
  const issuesPath = `${outputDir}/ui-issues-${role}-${viewport.name}.json`;
  fs.writeFileSync(issuesPath, JSON.stringify({
    role,
    viewport: viewport.name,
    totalRoutes: routesToTest.length,
    issuesFound: issues.length,
    issues
  }, null, 2));
}

export function generateRBACForbiddenRoutes(
  routesData: Record<string, RouteInfo[]>, 
  role: string
): string[] {
  const adminRoutes = (routesData.admin as RouteInfo[])?.map((route: RouteInfo) => route.route).filter(Boolean) || [];
  const allowedRoutes = {
    operator: ['/dashboard', '/drivers', '/bookings', '/notifications', '/profile'],
    driver: ['/dashboard', '/earnings', '/documents', '/notifications', '/profile']
  };
  
  return adminRoutes.filter((route) => 
    !allowedRoutes[role as keyof typeof allowedRoutes]?.some((allowed) => 
      route.startsWith(allowed)
    )
  ).slice(0, 5); // Test first 5 forbidden routes
}

export async function testForbiddenRoute(
  page: Page, 
  forbiddenRoute: string
): Promise<boolean> {
  await page.goto(forbiddenRoute);
  
  // Should redirect to allowed page or show access denied
  const url = page.url();
  const content = await page.textContent('body');
  
  // Either redirected away from forbidden route OR shows access denied
  const isBlocked = !url.includes(forbiddenRoute) || 
                   (content?.toLowerCase().includes('access denied') ?? false) ||
                   (content?.toLowerCase().includes('unauthorized') ?? false);
                   
  return isBlocked;
}

export async function testBrowserCompatibility(
  page: Page,
  browserName: string,
  actualBrowser: string,
  outputDir: string
) {
  if (actualBrowser !== browserName) {
    return { skipped: true, reason: `Testing only ${browserName}` };
  }
  
  await page.goto('/login');
  await page.fill('[data-testid="email"]', testUsers.admin.email);
  await page.fill('[data-testid="password"]', testUsers.admin.password);
  await page.click('[data-testid="login-button"]');
  
  await page.waitForURL('**/dashboard');
  
  // Wait for stable app state - no networkidle!
  await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
  await expect(page.locator('[data-testid="user-menu-trigger"]')).toBeVisible();
  
  // Take browser-specific screenshot
  await page.screenshot({ 
    path: `${outputDir}/shell-admin-${browserName}.png`,
    fullPage: true 
  });
  
  return { skipped: false };
}
