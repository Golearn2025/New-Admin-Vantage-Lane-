import { test, expect } from '@playwright/test';
import { TEST_USERS, ROLE_PERMISSIONS } from '../../fixtures/test-users';

/**
 * Security Test 1: Operator Access Control
 * 
 * Verifies that operators cannot access admin-only routes
 * and are properly redirected to operator dashboard
 */
test.describe('Operator Access Control', () => {
  test.use({ storageState: 'e2e/.auth/operator.json' });

  test('should block operator from accessing business intelligence', async ({ page }) => {
    // Attempt to access admin-only route
    await page.goto('/business-intelligence');
    
    // Should be redirected to operator dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verify it's the operator dashboard (not admin)
    await expect(page.locator('[data-testid="operator-dashboard"], .operator-dashboard')).toBeVisible();
    
    // Should not see admin-specific elements
    await expect(page.locator('[data-testid="admin-sidebar"], .admin-navigation')).not.toBeVisible();
  });

  test('should block operator from accessing users management', async ({ page }) => {
    // Try multiple admin-only user routes
    const adminRoutes = ['/users/all', '/users/admins', '/users/customers'];
    
    for (const route of adminRoutes) {
      await page.goto(route);
      
      // Should be redirected to operator dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      
      // Should see operator content, not admin users table
      await expect(page.locator('[data-testid="users-table"], .admin-users-table')).not.toBeVisible();
    }
  });

  test('should block operator from accessing admin payments', async ({ page }) => {
    await page.goto('/payments');
    
    // Should be redirected to operator dashboard  
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Should not see admin payments table
    await expect(page.locator('[data-testid="payments-table"], .admin-payments')).not.toBeVisible();
  });

  test('should allow operator to access allowed routes', async ({ page }) => {
    const allowedRoutes = ROLE_PERMISSIONS.operator.canAccess;
    
    for (const route of allowedRoutes) {
      await page.goto(route);
      
      // Should not be redirected away
      expect(page.url()).toContain(route);
      
      // Should see appropriate content
      if (route === '/operator/drivers') {
        await expect(page.locator('[data-testid="operator-drivers"], .operator-drivers-list')).toBeVisible();
      }
    }
  });

  test('should verify operator identity in UI', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show operator role indicator
    const roleIndicators = [
      '[data-role="operator"]',
      '[data-testid="user-role"]',
      '.user-role'
    ];
    
    let roleFound = false;
    for (const selector of roleIndicators) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        const text = await element.textContent();
        expect(text?.toLowerCase()).toContain('operator');
        roleFound = true;
        break;
      }
    }
    
    // Alternative: check user menu or profile section  
    if (!roleFound) {
      await expect(page.locator('text="Operator Dashboard", text="DEN CHAUFFEUR"')).toBeVisible();
    }
  });

  test('should not prefetch admin data before redirect', async ({ page }) => {
    // Start monitoring network requests
    const networkRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        networkRequests.push(request.url());
      }
    });
    
    // Navigate to admin route
    await page.goto('/business-intelligence');
    
    // Wait for redirect
    await page.waitForURL(/\/dashboard/);
    
    // Verify no admin-only API calls were made
    const suspiciousRequests = networkRequests.filter(url => 
      url.includes('/api/business-intelligence') ||
      url.includes('/api/users/all') ||
      url.includes('/api/admin/')
    );
    
    expect(suspiciousRequests).toHaveLength(0);
  });
});
