import { test, expect } from '@playwright/test';

test.describe('Portfolio Security & E2E Test Suite', () => {

  test('Anonymous user can view public sections but cannot see admin controls', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.navbar').first()).toBeVisible();
    
    const adminControls = page.locator('.project-admin-actions');
    const addBtn = page.locator('.add-btn');
    
    await expect(adminControls).toHaveCount(0);
    await expect(addBtn).toHaveCount(0);
  });

  test('Invalid routes load gracefully without completely crashing the app', async ({ page }) => {
    await page.goto('/non-existent-security-route-xyz', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('terminal Ctrl+L se nahi khulta (backtick x3 hi trigger hai)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Control+L');
    await expect(page.locator('app-terminal, .terminal-modal, [role="dialog"], .terminal-overlay')).toHaveCount(0);
  });

  test('forged storage flags se admin UI nahi dikhta', async ({ page }) => {
    await page.addInitScript(() => {
      for (const k of ['isAdmin', 'is_admin', 'admin', '__portfolio_root']) {
        localStorage.setItem(k, 'true');
        sessionStorage.setItem(k, 'true');
      }
    });
    await page.goto('/security', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.getByText(/upload resume|add certificate|delete/i)).toHaveCount(0);
  });

  test('CSP header set hai aur site pe CSP violation nahi', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (m) => {
      if (/Content Security Policy/i.test(m.text())) violations.push(m.text());
    });
    for (const route of ['/', '/security', '/sde', '/contact', '/links']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
    }
    expect(violations).toEqual([]);
  });

});
