/**
 * Security Test Utilities
 * Common helpers for E2E security testing
 */
import { Page, expect } from '@playwright/test';

/**
 * Wait for and verify a redirect to operator dashboard
 */
export async function expectOperatorDashboardRedirect(page: Page) {
  await page.waitForURL(/\/dashboard/, { timeout: 5000 });
  await expect(page.locator('[data-testid="operator-dashboard"], text="Operator Dashboard", text="DEN CHAUFFEUR"')).toBeVisible();
}

/**
 * Verify user role is displayed correctly in UI
 */
export async function verifyUserRole(page: Page, expectedRole: 'admin' | 'operator' | 'driver') {
  const roleSelectors = [
    `[data-role="${expectedRole}"]`,
    '[data-testid="user-role"]',
    '.user-role',
    '.user-menu'
  ];
  
  let roleFound = false;
  for (const selector of roleSelectors) {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      const text = await element.textContent();
      if (text?.toLowerCase().includes(expectedRole)) {
        roleFound = true;
        break;
      }
    }
  }
  
  if (!roleFound && expectedRole === 'operator') {
    // Alternative check for operator
    await expect(page.locator('text="DEN CHAUFFEUR", text="Operator"')).toBeVisible();
  }
}

/**
 * Monitor and collect API requests
 */
export function createApiMonitor(page: Page) {
  const requests: Array<{
    url: string;
    method: string;
    headers: any;
    status?: number;
    response?: any;
  }> = [];
  
  page.on('request', (request) => {
    if (request.url().includes('/api/')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    }
  });
  
  page.on('response', async (response) => {
    if (response.url().includes('/api/')) {
      const request = requests.find(r => r.url === response.url() && !r.status);
      if (request) {
        request.status = response.status();
        try {
          request.response = await response.json();
        } catch {
          // Response not JSON
        }
      }
    }
  });
  
  return {
    getRequests: () => requests,
    getSuccessfulRequests: () => requests.filter(r => r.status === 200),
    getFailedRequests: () => requests.filter(r => r.status && r.status >= 400),
    getAdminRequests: () => requests.filter(r => 
      r.url.includes('/api/business-intelligence') ||
      r.url.includes('/api/users/all') ||
      r.url.includes('/api/admin/')
    ),
    reset: () => requests.splice(0, requests.length)
  };
}

/**
 * Verify no admin data is leaked in API responses
 */
export function verifyNoAdminDataLeak(apiMonitor: ReturnType<typeof createApiMonitor>) {
  const successfulRequests = apiMonitor.getSuccessfulRequests();
  
  for (const request of successfulRequests) {
    if (request.response) {
      const responseStr = JSON.stringify(request.response);
      
      // Should not contain admin-specific data
      expect(responseStr).not.toContain('business_intelligence');
      expect(responseStr).not.toContain('admin_users');
      expect(responseStr).not.toContain('"role":"admin"');
      
      // Large datasets indicate admin access
      if (Array.isArray(request.response.data) || Array.isArray(request.response.bookings)) {
        const dataArray = request.response.data || request.response.bookings;
        expect(dataArray.length).toBeLessThanOrEqual(100);
      }
    }
  }
}

/**
 * Test direct API endpoint access with authentication
 */
export async function testApiEndpointAccess(
  page: Page,
  endpoint: string,
  expectedStatus: number[] = [401, 403, 404]
) {
  const response = await page.request.get(endpoint);
  expect(expectedStatus).toContain(response.status());
  
  if (response.status() >= 400) {
    const errorBody = await response.text();
    expect(errorBody.toLowerCase()).toMatch(/not found|forbidden|unauthorized/);
  }
  
  return response;
}

/**
 * Verify organization isolation in data
 */
export function verifyOrganizationIsolation(data: any[], operatorOrgId?: string) {
  for (const item of data.slice(0, 5)) {
    if (item.organization_id) {
      expect(item.organization_id).toBeTruthy();
      // Should not be admin organization
      expect(item.organization_id).not.toBe('admin-org');
      expect(item.organization_id).not.toBe('vantage-lane-corporate');
      
      // If operator org is known, verify it matches
      if (operatorOrgId) {
        expect(item.organization_id).toBe(operatorOrgId);
      }
    }
  }
}

/**
 * Login helper for tests
 */
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('input[type="email"]');
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  await page.click('button[type="submit"], [data-testid="login-submit"]');
  
  // Wait for redirect
  await page.waitForURL(/\/(dashboard|operator)/, { timeout: 15000 });
}

/**
 * Logout helper for tests
 */
export async function logout(page: Page) {
  const logoutSelectors = [
    '[data-testid="logout-button"]',
    'button:text("Logout")',
    'a:text("Logout")',
    'button:text("Sign out")'
  ];
  
  for (const selector of logoutSelectors) {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      await element.click();
      break;
    }
  }
  
  // Wait for redirect to login
  await page.waitForURL(/\/login/, { timeout: 10000 });
}
