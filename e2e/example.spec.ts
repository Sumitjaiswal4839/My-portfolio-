import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('should load the homepage and display correct title and logo', async ({ page }) => {
    await expect(page).toHaveTitle(/Sumit Jaiswal/i);
    const logoName = page.locator('.logo-name').first();
    await expect(logoName).toHaveText('Sumit Jaiswal');
  });

  test('should switch between Security and Engineering modes', async ({ page }) => {
    // Click Cybersecurity/Security button on landing page
    const securityBtn = page.locator('.btn-cyber').first();
    await securityBtn.click();
    await expect(page).toHaveURL(/\/security/);

    // Switch to Engineering (SDE) mode using the navbar pill
    const engineeringPill = page.locator('.mode-pill-btn', { hasText: 'Engineering' }).first();
    await engineeringPill.click();
    await expect(page).toHaveURL(/\/sde/);
  });

  test('should navigate to About page from navbar', async ({ page }) => {
    const aboutLink = page.locator('.nav-links a', { hasText: 'About' }).first();
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should toggle theme and update data-theme attribute', async ({ page }) => {
    const themeBtn = page.locator('.theme-toggle').first();
    await expect(themeBtn).toBeVisible();

    const getTheme = () =>
      page.evaluate(() => document.documentElement.getAttribute('data-theme') || document.body.getAttribute('data-theme'));

    const initialTheme = await getTheme();
    await themeBtn.click();
    const toggledTheme = await getTheme();

    expect(toggledTheme).not.toBe(initialTheme);
  });

});
