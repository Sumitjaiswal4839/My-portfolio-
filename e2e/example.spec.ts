import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server (Playwright handles this if baseURL is set in playwright.config.ts)
    // Using explicit localhost just in case baseURL isn't configured yet.
    await page.goto('http://localhost:4200/');
  });

  test('should load the homepage and display correct title and logo', async ({ page }) => {
    // Verify the page title (update string if your actual title is different)
    await expect(page).toHaveTitle(/Sumit Jaiswal/i);
    
    // Check if the navbar logo renders correctly
    const logoName = page.locator('.logo-name').first();
    await expect(logoName).toHaveText('Sumit Jaiswal');
  });

  test('should switch between Security and Engineering modes', async ({ page }) => {
    // Click the Security mode button
    const securityBtn = page.locator('.mode-pill-btn', { hasText: 'Security' });
    await securityBtn.click();
    // Expect URL to redirect to /security
    await expect(page).toHaveURL(/.*\/security/);

    // Click the Engineering mode button
    const engineeringBtn = page.locator('.mode-pill-btn', { hasText: 'Engineering' });
    await engineeringBtn.click();
    // Expect URL to redirect to /sde
    await expect(page).toHaveURL(/.*\/sde/);
  });

  test('should navigate to About page from navbar', async ({ page }) => {
    // Find the About link in the desktop navbar and click it
    const aboutLink = page.locator('.nav-links a', { hasText: 'About' }).first();
    await aboutLink.click();
    
    // Expect URL to change to /about
    await expect(page).toHaveURL(/.*\/about/);
  });

  test('should be able to toggle the theme', async ({ page }) => {
    const themeBtn = page.locator('.theme-toggle').first();
    
    // Verify button exists and click it
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    
    // You can also assert if 'data-theme' attribute changed on HTML tag if applicable
    // const htmlTag = page.locator('html');
    // await expect(htmlTag).toHaveAttribute('data-theme', 'light');
  });
});
