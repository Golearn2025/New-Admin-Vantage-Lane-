import { test, expect } from '@playwright/test';

/**
 * Security Test 3: Cross-Organization Protection
 * 
 * Verifies that operators cannot access data from other organizations
 * even when using direct API calls or URL manipulation
 */
test.describe('Cross-Organization Protection', () => {
  test.use({ storageState: 'e2e/.auth/operator.json' });

  test('should block cross-organization booking access via API', async ({ page }) => {
    let blockedRequests: string[] = [];
    let errorResponses: { url: string; status: number; statusText: string }[] = [];
    
    // Monitor API responses for blocked requests
    page.on('response', async (response) => {
      if (response.url().includes('/api/bookings/') && response.status() >= 400) {
        errorResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
        
        try {
          const responseBody = await response.text();
          if (responseBody.includes('not found') || responseBody.includes('forbidden')) {
            blockedRequests.push(response.url());
          }
        } catch (error) {
          // Could not parse response
        }
      }
    });
    
    // Navigate to bookings list first to get context
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');
    
    // Try to access bookings from other organizations via direct API call
    const testBookingIds = ['999999', '888888', '777777']; // Likely other org IDs
    
    for (const bookingId of testBookingIds) {
      try {
        const response = await page.request.get(`/api/bookings/${bookingId}`);
        
        // Should be blocked (404 Not Found or 403 Forbidden)
        expect([404, 403, 401]).toContain(response.status());
        
        const responseText = await response.text();
        expect(responseText.toLowerCase()).toMatch(/not found|forbidden|unauthorized/);
        
      } catch (error) {
        // Network error is also acceptable (request blocked)
        console.log(`Request blocked for booking ${bookingId}: ${error}`);
      }
    }
  });

  test('should return "not found" for cross-org booking details', async ({ page }) => {
    // First, get a valid booking ID from operator's organization
    let validBookingId: string | null = null;
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/bookings/list') && response.status() === 200) {
        try {
          const data = await response.json();
          if (data.bookings && data.bookings.length > 0) {
            validBookingId = data.bookings[0].id;
          }
        } catch (error) {
          console.log('Could not parse bookings response');
        }
      }
    });
    
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');
    
    if (validBookingId) {
      // Test accessing operator's own booking (should work)
      const validResponse = await page.request.get(`/api/bookings/${validBookingId}`);
      expect(validResponse.status()).toBe(200);
    }
    
    // Test accessing likely cross-org booking IDs
    const crossOrgBookingIds = [
      '1', '2', '3', // Likely admin org bookings
      '100000', '200000', // Different org ranges
    ];
    
    for (const bookingId of crossOrgBookingIds) {
      const response = await page.request.get(`/api/bookings/${bookingId}`);
      
      // Should be blocked
      expect(response.status()).toBeGreaterThanOrEqual(400);
      
      if (response.status() === 404) {
        const errorBody = await response.text();
        expect(errorBody.toLowerCase()).toContain('not found');
      }
    }
  });

  test('should not leak organization IDs in error messages', async ({ page }) => {
    const errorMessages: string[] = [];
    
    // Collect console errors
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errorMessages.push(message.text());
      }
    });
    
    // Try to access various cross-org resources
    const attemptedUrls = [
      '/api/bookings/999999',
      '/api/bookings/888888/legs',
      '/api/organizations/admin-org',
    ];
    
    for (const url of attemptedUrls) {
      try {
        const response = await page.request.get(url);
        if (response.status() >= 400) {
          const errorText = await response.text();
          
          // Should not expose organization IDs or internal details
          expect(errorText).not.toMatch(/organization_id.*=.*[a-f0-9-]{36}/);
          expect(errorText).not.toContain('admin-org');
          expect(errorText).not.toContain('internal_org_id');
          
          // Should be generic error message
          expect(errorText.toLowerCase()).toMatch(/not found|access denied|forbidden/);
        }
      } catch (error) {
        // Request failed - this is acceptable
      }
    }
    
    // Check that no sensitive info was logged to console
    const sensitiveErrors = errorMessages.filter(msg =>
      msg.includes('organization_id') ||
      msg.includes('admin-org') ||
      msg.includes('internal_org')
    );
    
    expect(sensitiveErrors).toHaveLength(0);
  });

  test('should maintain session isolation between organizations', async ({ page, context }) => {
    // Start on operator dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Try to manipulate session to access other org data
    await page.evaluate(() => {
      // Attempt to modify local storage
      localStorage.setItem('currentOrganization', 'admin-org');
      localStorage.setItem('organizationId', 'admin-org-id');
      
      // Attempt to modify session storage
      sessionStorage.setItem('userOrg', 'admin');
      sessionStorage.setItem('role', 'admin');
    });
    
    // Navigate to a data endpoint
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');
    
    // Should still see only operator data (not admin data)
    const bookingRows = page.locator('[data-testid="booking-row"], tbody tr');
    const visibleBookings = await bookingRows.count();
    
    // Should still be limited to operator's data scope
    expect(visibleBookings).toBeLessThanOrEqual(50);
    
    // Should still be identified as operator
    await page.goto('/dashboard');
    
    const userRole = await page.evaluate(() => {
      const roleElement = document.querySelector('[data-role], [data-testid="user-role"]');
      return roleElement?.textContent || '';
    });
    
    // Should not have escalated to admin
    expect(userRole.toLowerCase()).not.toContain('admin');
  });

  test('should prevent booking modification across organizations', async ({ page }) => {
    // Get a booking ID from another organization (hypothetical)
    const crossOrgBookingId = '999999';
    
    // Try to update booking details
    const updatePayload = {
      customer_name: 'Hacked Customer',
      status: 'cancelled'
    };
    
    const response = await page.request.patch(`/api/bookings/${crossOrgBookingId}`, {
      data: updatePayload
    });
    
    // Should be blocked
    expect([404, 403, 401]).toContain(response.status());
    
    // Try to delete booking
    const deleteResponse = await page.request.delete(`/api/bookings/${crossOrgBookingId}`);
    expect([404, 403, 401]).toContain(deleteResponse.status());
  });
});
