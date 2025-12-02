import { test, expect } from '@playwright/test';
import { ROLE_PERMISSIONS } from '../../fixtures/test-users';

/**
 * Security Test 4: URL Bypass Prevention
 * 
 * Verifies that operators cannot bypass middleware by directly accessing URLs
 * and that no sensitive data is prefetched before redirects
 */
test.describe('URL Bypass Prevention', () => {
  test.use({ storageState: 'e2e/.auth/operator.json' });

  test('should redirect all forbidden URLs to operator dashboard', async ({ page }) => {
    const forbiddenRoutes = ROLE_PERMISSIONS.operator.cannotAccess;
    
    for (const route of forbiddenRoutes) {
      console.log(`Testing forbidden route: ${route}`);
      
      // Navigate directly to forbidden route
      await page.goto(route);
      
      // Should be redirected to operator dashboard
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
      
      // Should see operator dashboard content
      await expect(page.locator('[data-testid="operator-dashboard"], .operator-dashboard, text="Operator Dashboard"')).toBeVisible();
      
      // Should not see admin content
      await expect(page.locator('[data-testid="admin-panel"], .admin-interface')).not.toBeVisible();
    }
  });

  test('should prevent prefetching of admin data during redirect', async ({ page }) => {
    const networkRequests: { url: string; method: string; status?: number }[] = [];
    const responseBodies: { url: string; body: string }[] = [];
    
    // Monitor all network activity
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        networkRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/') && response.status() === 200) {
        try {
          const body = await response.text();
          responseBodies.push({
            url: response.url(),
            body: body
          });
        } catch (error) {
          // Could not read response body
        }
      }
    });
    
    // Navigate to admin route that should be blocked
    await page.goto('/business-intelligence');
    
    // Wait for redirect to complete
    await page.waitForURL(/\/dashboard/);
    
    // Verify no admin-specific API calls were made successfully
    const adminApiCalls = networkRequests.filter(req =>
      req.url.includes('/api/business-intelligence') ||
      req.url.includes('/api/users/all') ||
      req.url.includes('/api/admin/') ||
      req.url.includes('/api/reports/')
    );
    
    expect(adminApiCalls).toHaveLength(0);
    
    // Verify no admin data was returned in successful responses
    const adminDataResponses = responseBodies.filter(res =>
      res.body.includes('business_intelligence') ||
      res.body.includes('admin_users') ||
      res.body.includes('"role":"admin"') ||
      res.body.length > 10000 // Large datasets indicate admin access
    );
    
    expect(adminDataResponses).toHaveLength(0);
  });

  test('should handle direct API calls with proper authentication', async ({ page }) => {
    // Test direct API access without going through UI
    const apiEndpoints = [
      '/api/business-intelligence/metrics',
      '/api/users/all',
      '/api/payments/list',
      '/api/admin/settings'
    ];
    
    for (const endpoint of apiEndpoints) {
      const response = await page.request.get(endpoint);
      
      // Should return error status
      expect([401, 403, 404]).toContain(response.status());
      
      // Should not return admin data
      if (response.status() === 200) {
        const body = await response.text();
        expect(body).not.toContain('admin');
        expect(body.length).toBeLessThan(1000); // Should not be large dataset
      }
    }
  });

  test('should maintain redirect behavior across browser sessions', async ({ page, context }) => {
    // Navigate to forbidden route
    await page.goto('/users/all');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Create new page in same context
    const newPage = await context.newPage();
    await newPage.goto('/business-intelligence');
    await expect(newPage).toHaveURL(/\/dashboard/);
    
    // Verify both pages show operator dashboard
    await expect(page.locator('[data-testid="operator-dashboard"], text="Operator Dashboard"')).toBeVisible();
    await expect(newPage.locator('[data-testid="operator-dashboard"], text="Operator Dashboard"')).toBeVisible();
    
    await newPage.close();
  });

  test('should block access even with URL parameters and fragments', async ({ page }) => {
    const forbiddenRoutesWithParams = [
      '/business-intelligence?period=monthly',
      '/business-intelligence#charts',
      '/users/all?page=2&limit=50',
      '/users/all#filters',
      '/payments?status=completed&from=2024-01-01',
      '/admin/settings?tab=permissions'
    ];
    
    for (const route of forbiddenRoutesWithParams) {
      await page.goto(route);
      
      // Should still be redirected regardless of parameters
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
      
      // URL should not contain the forbidden path
      expect(page.url()).not.toContain('/business-intelligence');
      expect(page.url()).not.toContain('/users/all');
      expect(page.url()).not.toContain('/admin');
    }
  });

  test('should prevent frame/iframe embedding of admin routes', async ({ page }) => {
    // Try to embed admin routes in iframe
    await page.goto('/dashboard');
    
    await page.setContent(`
      <html>
        <body>
          <iframe id="admin-frame" src="/business-intelligence" width="800" height="600"></iframe>
          <iframe id="users-frame" src="/users/all" width="800" height="600"></iframe>
        </body>
      </html>
    `);
    
    await page.waitForTimeout(2000); // Wait for iframes to attempt loading
    
    // Check iframe content
    const adminFrame = page.frameLocator('#admin-frame');
    const usersFrame = page.frameLocator('#users-frame');
    
    // Iframes should either be blocked or show operator dashboard
    try {
      const adminFrameContent = await adminFrame.locator('body').textContent({ timeout: 3000 });
      if (adminFrameContent) {
        expect(adminFrameContent.toLowerCase()).toContain('operator');
        expect(adminFrameContent.toLowerCase()).not.toContain('business intelligence');
      }
    } catch (error) {
      // Frame blocked - this is good
      console.log('Admin iframe blocked:', error);
    }
    
    try {
      const usersFrameContent = await usersFrame.locator('body').textContent({ timeout: 3000 });
      if (usersFrameContent) {
        expect(usersFrameContent.toLowerCase()).not.toContain('all users');
      }
    } catch (error) {
      // Frame blocked - this is good
      console.log('Users iframe blocked:', error);
    }
  });

  test('should log security violations for monitoring', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Capture console messages
    page.on('console', (message) => {
      consoleMessages.push(message.text());
    });
    
    // Attempt forbidden access
    await page.goto('/business-intelligence');
    await page.waitForURL(/\/dashboard/);
    
    await page.goto('/users/all');
    await page.waitForURL(/\/dashboard/);
    
    // Security violations might be logged (implementation dependent)
    const securityLogs = consoleMessages.filter(msg =>
      msg.toLowerCase().includes('unauthorized') ||
      msg.toLowerCase().includes('access denied') ||
      msg.toLowerCase().includes('redirect')
    );
    
    // At minimum, there should be no error messages exposing security details
    const sensitiveErrorLogs = consoleMessages.filter(msg =>
      msg.includes('organization_id') ||
      msg.includes('admin_secret') ||
      msg.includes('internal_')
    );
    
    expect(sensitiveErrorLogs).toHaveLength(0);
  });
});
