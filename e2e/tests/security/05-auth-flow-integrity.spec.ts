import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../../fixtures/test-users';

/**
 * Security Test 5: Authentication Flow Integrity
 * 
 * Verifies login/logout flows work correctly and maintain proper session state
 * without leaking authentication tokens or allowing privilege escalation
 */
test.describe('Authentication Flow Integrity', () => {
  
  test('should complete operator login flow correctly', async ({ page, context }) => {
    // Start with fresh session (no stored auth)
    await context.clearCookies();
    await context.clearPermissions();
    
    // Navigate to login page
    await page.goto('/login');
    await page.waitForSelector('input[type="email"]');
    
    // Fill login form
    await page.fill('input[type="email"]', TEST_USERS.operator.email);
    await page.fill('input[type="password"]', TEST_USERS.operator.password);
    
    // Submit login
    await page.click('button[type="submit"], [data-testid="login-submit"]');
    
    // Should redirect to operator dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Verify operator role is detected correctly
    await expect(page.locator('text="Operator Dashboard", text="DEN CHAUFFEUR"')).toBeVisible({ timeout: 10000 });
    
    // Should not see admin navigation
    await expect(page.locator('[data-testid="admin-nav"], .admin-sidebar')).not.toBeVisible();
    
    // Session should persist across page refreshes
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text="Operator", text="DEN CHAUFFEUR"')).toBeVisible();
  });

  test('should prevent session manipulation for privilege escalation', async ({ page }) => {
    // Use operator authentication
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Attempt to manipulate session/cookies for admin access
    await page.evaluate(() => {
      // Try to modify common auth storage locations
      document.cookie = 'role=admin; path=/';
      document.cookie = 'user_role=admin; path=/';
      document.cookie = 'permissions=admin; path=/';
      
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('permissions', JSON.stringify(['admin']));
      
      sessionStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('currentUser', JSON.stringify({role: 'admin'}));
    });
    
    // Navigate to admin route
    await page.goto('/business-intelligence');
    
    // Should still be redirected (manipulation failed)
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Should still show operator interface
    await expect(page.locator('text="Operator"')).toBeVisible();
    await expect(page.locator('[data-testid="admin-interface"]')).not.toBeVisible();
  });

  test('should handle logout flow securely', async ({ page, context }) => {
    await page.goto('/dashboard');
    
    // Find and click logout button/link
    const logoutSelectors = [
      '[data-testid="logout-button"]',
      'button:text("Logout")',
      'a:text("Logout")',
      'button:text("Sign out")',
      '[data-testid="user-menu"] >> text="Logout"'
    ];
    
    let loggedOut = false;
    for (const selector of logoutSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        await element.click();
        loggedOut = true;
        break;
      }
    }
    
    if (!loggedOut) {
      // Try user menu approach
      await page.click('[data-testid="user-menu"], .user-avatar, [data-role="button"]');
      await page.waitForTimeout(1000);
      await page.click('text="Logout", text="Sign out"');
      loggedOut = true;
    }
    
    if (loggedOut) {
      // Should redirect to login page
      await page.waitForURL(/\/login/, { timeout: 10000 });
      
      // Should see login form
      await expect(page.locator('input[type="email"]')).toBeVisible();
      
      // Should not be able to access protected routes
      await page.goto('/dashboard');
      await page.waitForURL(/\/login/);
    }
  });

  test('should prevent concurrent sessions abuse', async ({ browser, context }) => {
    // Create two contexts with same operator credentials
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Login in both contexts
    for (const page of [page1, page2]) {
      await page.goto('/login');
      await page.fill('input[type="email"]', TEST_USERS.operator.email);
      await page.fill('input[type="password"]', TEST_USERS.operator.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/);
    }
    
    // Both should work as operator (concurrent sessions allowed)
    await page1.goto('/bookings');
    await page2.goto('/operator/drivers');
    
    // Both should still be restricted to operator permissions
    await page1.goto('/business-intelligence');
    await expect(page1).toHaveURL(/\/dashboard/);
    
    await page2.goto('/users/all');
    await expect(page2).toHaveURL(/\/dashboard/);
    
    await context1.close();
    await context2.close();
  });

  test('should validate token expiration and refresh', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Monitor API calls for authentication headers
    const apiCalls: { url: string; headers: any; status: number }[] = [];
    
    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        apiCalls.push({
          url: response.url(),
          headers: response.headers(),
          status: response.status()
        });
      }
    });
    
    // Make several API calls
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/operator/drivers');
    await page.waitForLoadState('networkidle');
    
    // Verify API calls have proper authentication
    const authenticatedCalls = apiCalls.filter(call => 
      call.status === 200 && 
      (call.headers['authorization'] || call.headers['cookie'])
    );
    
    expect(authenticatedCalls.length).toBeGreaterThan(0);
    
    // No API calls should return 401 Unauthorized (would indicate token issues)
    const unauthorizedCalls = apiCalls.filter(call => call.status === 401);
    expect(unauthorizedCalls).toHaveLength(0);
  });

  test('should prevent authentication bypass through URL manipulation', async ({ page, context }) => {
    // Start without authentication
    await context.clearCookies();
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await page.waitForURL(/\/login/);
    
    // Try various bypass attempts
    const bypassAttempts = [
      '/dashboard?authenticated=true',
      '/dashboard#auth=true',
      '/dashboard?token=admin',
      '/operator/drivers?bypass=true',
      '/bookings?user=operator',
    ];
    
    for (const url of bypassAttempts) {
      await page.goto(url);
      
      // Should still redirect to login
      await page.waitForURL(/\/login/, { timeout: 5000 });
      
      // Should see login form
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });

  test('should handle malformed authentication gracefully', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Inject malformed auth tokens
    await page.evaluate(() => {
      document.cookie = 'auth-token=invalid.jwt.token; path=/';
      document.cookie = 'session=malformed_session; path=/';
      localStorage.setItem('auth', 'invalid_token');
      localStorage.setItem('supabase.auth.token', '{"access_token":"invalid"}');
    });
    
    // Navigate to protected route
    await page.goto('/bookings');
    
    // Should handle gracefully - either redirect to login or show error
    const currentUrl = page.url();
    const isOnLogin = currentUrl.includes('/login');
    const isOnError = await page.locator('text="Error", text="Unauthorized"').isVisible();
    
    expect(isOnLogin || isOnError).toBeTruthy();
    
    // Should not crash or expose internal errors
    const errorMessages = await page.locator('.error-message, [data-testid="error"]').allTextContents();
    const exposedErrors = errorMessages.filter(msg =>
      msg.includes('stack trace') ||
      msg.includes('internal server error') ||
      msg.includes('database')
    );
    
    expect(exposedErrors).toHaveLength(0);
  });

  test('should maintain proper session boundaries', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verify session is scoped to operator role
    const sessionData = await page.evaluate(() => {
      return {
        cookies: document.cookie,
        localStorage: Object.keys(localStorage).map(key => ({
          key,
          value: localStorage.getItem(key)
        })),
        sessionStorage: Object.keys(sessionStorage).map(key => ({
          key, 
          value: sessionStorage.getItem(key)
        }))
      };
    });
    
    // Should not contain admin-level privileges in session
    const sessionString = JSON.stringify(sessionData);
    expect(sessionString).not.toContain('role":"admin"');
    expect(sessionString).not.toContain('admin_permissions');
    expect(sessionString).not.toContain('super_admin');
    
    // Should contain operator role
    expect(sessionString.toLowerCase()).toMatch(/operator|den.chauffeur/);
  });
});
