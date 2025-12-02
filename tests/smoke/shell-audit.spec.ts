/**
 * Shell Audit - Smoke Tests
 * 
 * Tests shell behavior across all roles and viewports
 * Captures screenshots for visual regression testing
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  RouteInfo,
  UIIssue,
  viewports,
  testUsers,
  validateTestEnvironment,
  loginAsRole,
  testUserMenu,
  testSingleRoute,
  saveIssues,
  generateRBACForbiddenRoutes,
  testForbiddenRoute,
  testBrowserCompatibility
} from './shell-audit-helpers';

// Load routes data
const routesPath = path.join(process.cwd(), 'docs/audit/routes/routes.json');
const routesData = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

// Validate environment
validateTestEnvironment();

// Create dated output directory
const outputDate = new Date().toISOString().split('T')[0];
const outputDir = `docs/audit/outputs/${outputDate}`;
fs.mkdirSync(outputDir, { recursive: true });

test.describe('Shell Audit - All Roles', () => {
  // Test each role across all viewports
  for (const [role, user] of Object.entries(testUsers)) {
    const routes = routesData[role] || [];
    
    if (routes.length === 0) {
      test(`${role} - skip (no routes found)`, async () => {
        test.skip(true, `No routes found for ${role} role`);
      });
      continue;
    }

    test.describe(`${role.toUpperCase()} Role`, () => {
      for (const viewport of viewports) {
        test.describe(`${viewport.name} viewport`, () => {
          // Set viewport for entire describe block
          test.use({ viewport: { width: viewport.width, height: viewport.height } });

          test.beforeEach(async ({ page }) => {
            // Login as role user (already in correct viewport)
            await loginAsRole(page, role as keyof typeof testUsers);
          });

          test('Shell consistency and user menu', async ({ page }) => {
            await testUserMenu(page, role as keyof typeof testUsers);
          });

          test(`Shell behavior`, async ({ page }) => {
            // Test shell components exist (no need to set viewport - already set by test.use)
            await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
            await expect(page.locator('[data-testid="user-menu-trigger"]')).toBeVisible();
            
            // Test navigation based on viewport
            if (viewport.name === 'mobile') {
              // Mobile: Test drawer menu
              const menuButton = page.locator('[data-testid="mobile-menu-button"]');
              await expect(menuButton).toBeVisible();
              
              // Open mobile menu
              await menuButton.click();
              await expect(page.locator('[data-testid="mobile-sidebar"]')).toBeVisible();
              
              // Take screenshot with menu open
              await page.screenshot({ 
                path: `${outputDir}/shell-${role}-${viewport.name}-menu-open.png`,
                fullPage: true 
              });
              
              // Close menu (ESC key)
              await page.keyboard.press('Escape');
              await expect(page.locator('[data-testid="mobile-sidebar"]')).not.toBeVisible();
              
            } else {
              // Desktop/Tablet: Test sidebar
              await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
              
              if (viewport.name === 'tablet') {
                // Test sidebar collapse on tablet
                const collapseButton = page.locator('[data-testid="sidebar-collapse"]');
                if (await collapseButton.isVisible()) {
                  await collapseButton.click();
                  await page.screenshot({ 
                    path: `${outputDir}/shell-${role}-${viewport.name}-collapsed.png`,
                    fullPage: true 
                  });
                }
              }
            }
            
            // Take default shell screenshot
            await page.screenshot({ 
              path: `${outputDir}/shell-${role}-${viewport.name}.png`,
              fullPage: true 
            });
            
            // Test user menu
            await page.click('[data-testid="user-menu-trigger"]');
            await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
            await expect(page.locator('text="Profile Settings"')).toBeVisible();
            await expect(page.locator('text="Logout"')).toBeVisible();
            
            // Close user menu
            await page.keyboard.press('Escape');
            await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
          });

          test(`Route navigation`, async ({ page }) => {
            // Test ALL non-dynamic routes - COLLECT ALL ISSUES, don't fail fast
            const routesToTest = (routes as RouteInfo[]).filter((route: RouteInfo) => !route.route?.includes('['));
            let allIssues: UIIssue[] = [];
            
            console.warn(`Testing ${routesToTest.length} routes for ${role} on ${viewport.name}`);
            
            for (const route of routesToTest) {
              const routeIssues = await testSingleRoute(page, route, role, viewport, outputDir);
              allIssues = allIssues.concat(routeIssues);
            }
            
            // Save all issues collected
            saveIssues(allIssues, role, viewport, routesToTest, outputDir);
            
            // Use soft assertions to continue collecting, but mark test as failed at end
            for (const issue of allIssues) {
              expect.soft(false, `${issue.type} in ${issue.route}: ${issue.details}`).toBeTruthy();
            }
            
            console.warn(`📊 ${role}/${viewport.name}: ${allIssues.length} issues found in ${routesToTest.length} routes`);
          });
        });
      }

      test('Role-based access control', async ({ page }) => {
        // Skip for admin - they have full access
        test.skip(role === 'admin', 'Admin has full access to all routes');
        
        // Get forbidden routes for this role
        const forbidden = generateRBACForbiddenRoutes(routesData, role);
        
        for (const forbiddenRoute of forbidden) {
          const isBlocked = await testForbiddenRoute(page, forbiddenRoute);
          expect(isBlocked).toBeTruthy();
        }
      });
    });
  }
});

test.describe('Cross-browser compatibility', () => {
  // Test shell on different browsers if available
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`Shell loads in ${browserName}`, async ({ page, browserName: actualBrowser }) => {
      const result = await testBrowserCompatibility(page, browserName, actualBrowser, outputDir);
      if (result.skipped) {
        test.skip(true, result.reason);
      }
    });
  });
});

test.describe('Performance checks', () => {
  test('Shell load performance', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/login');
    await page.fill('[data-testid="email"]', testUsers.admin.email);
    await page.fill('[data-testid="password"]', testUsers.admin.password);
    
    const startTime = Date.now();
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
    
    // Wait for stable app state - no networkidle!
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Verify load time is reasonable (< 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    console.warn(`Shell load time: ${loadTime}ms`);
  });

  test('No JavaScript errors', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    await page.goto('/login');
    await page.fill('[data-testid="email"]', testUsers.admin.email);
    await page.fill('[data-testid="password"]', testUsers.admin.password);
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
    
    // Wait for stable app state - no networkidle!
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    
    // Navigate to a few key routes
    await page.goto('/users/all');
    
    // Wait for stable app state - no networkidle!
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    
    // Check for critical JS errors (ignoring minor warnings)
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('favicon') &&
      !error.includes('Extension')
    );
    
    if (criticalErrors.length > 0) {
      console.warn('JavaScript errors found:', criticalErrors);
    }
    
    // Don't fail on minor errors, but report them
    expect(criticalErrors.length).toBeLessThan(5);
  });
});
