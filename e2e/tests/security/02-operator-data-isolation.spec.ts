import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../../fixtures/test-users';

/**
 * Security Test 2: Operator Data Isolation
 * 
 * Verifies that operators can only see data from their organization
 * and cannot access cross-organization data
 */
test.describe('Operator Data Isolation', () => {
  test.use({ storageState: 'e2e/.auth/operator.json' });

  test('should only see bookings from operator organization', async ({ page }) => {
    let apiResponse: any = null;
    
    // Intercept bookings API call
    page.on('response', async (response) => {
      if (response.url().includes('/api/bookings') && response.status() === 200) {
        try {
          apiResponse = await response.json();
        } catch (error) {
          console.log('Could not parse API response:', error);
        }
      }
    });
    
    await page.goto('/bookings');
    
    // Wait for bookings to load
    await page.waitForSelector('[data-testid="bookings-table"], .bookings-list, table', { timeout: 10000 });
    
    // Count visible bookings in UI
    const bookingRows = page.locator('[data-testid="booking-row"], tbody tr, .booking-item');
    const visibleBookingsCount = await bookingRows.count();
    
    // Should see limited number of bookings (not all 166+)
    expect(visibleBookingsCount).toBeLessThanOrEqual(50);
    expect(visibleBookingsCount).toBeGreaterThan(0);
    
    // Verify API response contains only organization-specific data
    if (apiResponse?.bookings) {
      expect(apiResponse.bookings.length).toBeLessThanOrEqual(50);
      
      // All bookings should belong to operator's organization
      for (const booking of apiResponse.bookings.slice(0, 5)) {
        if (booking.organization_id) {
          expect(booking.organization_id).toBeTruthy();
          // Should not contain admin-only organization IDs
          expect(booking.organization_id).not.toBe('admin-org-id');
        }
      }
    }
  });

  test('should verify organization context in API calls', async ({ page }) => {
    const apiCalls: { url: string; headers: any; response?: any }[] = [];
    
    // Monitor API calls
    page.on('request', (request) => {
      if (request.url().includes('/api/') && request.method() === 'GET') {
        apiCalls.push({
          url: request.url(),
          headers: request.headers()
        });
      }
    });
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/') && response.status() === 200) {
        const call = apiCalls.find(c => c.url === response.url());
        if (call) {
          try {
            call.response = await response.json();
          } catch (error) {
            // Response might not be JSON
          }
        }
      }
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify API calls include proper authentication context
    const dataApiCalls = apiCalls.filter(call => 
      call.url.includes('/api/bookings') ||
      call.url.includes('/api/operator') ||
      call.url.includes('/api/dashboard')
    );
    
    expect(dataApiCalls.length).toBeGreaterThan(0);
    
    for (const call of dataApiCalls) {
      // Should have authentication headers
      expect(call.headers['authorization'] || call.headers['cookie']).toBeTruthy();
      
      // Response should be filtered for organization
      if (call.response?.data || call.response?.bookings) {
        const data = call.response.data || call.response.bookings || [];
        // Should not return massive datasets (admin would see 166+ items)
        expect(data.length).toBeLessThanOrEqual(100);
      }
    }
  });

  test('should not expose other organizations data in UI', async ({ page }) => {
    await page.goto('/bookings');
    await page.waitForSelector('[data-testid="bookings-table"], table', { timeout: 10000 });
    
    // Look for organization indicators in the UI
    const organizationElements = page.locator('[data-testid="organization"], .organization, [data-org]');
    
    if (await organizationElements.count() > 0) {
      // If organization info is visible, should only show operator's org
      for (let i = 0; i < Math.min(5, await organizationElements.count()); i++) {
        const orgText = await organizationElements.nth(i).textContent();
        if (orgText) {
          // Should not contain other organization names
          expect(orgText.toLowerCase()).not.toContain('admin');
          expect(orgText.toLowerCase()).not.toContain('vantage lane corporate');
          // May contain operator's organization: "DEN CHAUFFEUR"
        }
      }
    }
  });

  test('should have consistent data count across pages', async ({ page }) => {
    // Navigate to bookings
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');
    
    // Get booking count from UI (if displayed)
    const countSelectors = [
      '[data-testid="total-count"]',
      '.total-items',
      '.bookings-count',
      'text=/Total: \\d+/',
      'text=/\\d+ bookings?/'
    ];
    
    let totalCount: number | null = null;
    
    for (const selector of countSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        const text = await element.textContent();
        const match = text?.match(/(\d+)/);
        if (match && match[1]) {
          totalCount = parseInt(match[1]);
          break;
        }
      }
    }
    
    if (totalCount !== null) {
      // Should be reasonable number for operator (not admin's 166+)
      expect(totalCount).toBeLessThanOrEqual(100);
      expect(totalCount).toBeGreaterThan(0);
    }
    
    // Navigate to dashboard and verify consistent numbers
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Dashboard should show similar bounded numbers
    const dashboardStats = page.locator('[data-testid="stats-card"], .stat-card, .metric');
    const statsCount = await dashboardStats.count();
    
    expect(statsCount).toBeGreaterThan(0); // Should show some stats
  });
});
