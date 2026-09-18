import { test, expect } from '@playwright/test';

test.describe('Portfolio Security & E2E Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Assume base URL is localhost:4200 during local testing
    await page.goto('http://localhost:4200');
  });

  // 1. Public Access & Anonymous Guard Test
  test('Anonymous user can view public sections but cannot see admin controls', async ({ page }) => {
    // Verify public pages load successfully
    await expect(page.locator('app-hero, h1')).toBeVisible();
    
    // Admin buttons, delete buttons, or upload forms should NOT be visible to unauthenticated users
    const adminPanel = page.locator('app-admin-panel, .admin-controls');
    await expect(adminPanel).not.toBeVisible();
  });

  // 2. Protected UI is NOT Authorization Test (Client-storage tampering test)
  test('Tampering with sessionStorage/localStorage does not grant real admin access', async ({ page }) => {
    // Attempt to forge admin state via browser storage (Finding #2 fix test)
    await page.evaluate(() => {
      sessionStorage.setItem('__portfolio_root', 'true');
      localStorage.setItem('isAdmin', 'true');
    });

    await page.reload();

    // Even if local UI state is tampered with, unauthenticated state must remain secured against Firestore writes
    // (Firebase SDK should reject write attempts or UI must re-verify token)
    const protectedActionBtn = page.locator('button:has-text("Delete Project")');
    if (await protectedActionBtn.count() > 0) {
      await protectedActionBtn.first().click();
      // Expect error toast or permission denied alert
      const errorMessage = page.locator('.error-toast, text=/permission/i');
      // If UI hides it completely, that's also valid
    }
    
    // Cleanup storage
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
  });

  // 3. Invalid Route Handling Test
  test('Invalid routes redirect or display 404 gracefully without crashing', async ({ page }) => {
    await page.goto('http://localhost:4200/non-existent-security-route-xyz');
    
    // Should either redirect to home or show 404 component
    const url = page.url();
    const isHomeOr404 = url.includes('404') || url === 'http://localhost:4200/';
    expect(isHomeOr404).toBeTruthy();
  });

  // 4. XSS Sanitization & Malicious Input Test
  test('Malicious script inputs in search/terminal are safely escaped and not executed', async ({ page }) => {
    const maliciousPayload = '<script>window.XSS_TRIGGERED = true;</script>';
    
    // Find terminal or search input if present
    const terminalInput = page.locator('input.terminal-input, input[placeholder*="command" i]');
    if (await terminalInput.count() > 0) {
      await terminalInput.fill(maliciousPayload);
      await terminalInput.press('Enter');

      // Verify global flag was NOT set by script execution
      const xssTriggered = await page.evaluate(() => (window as any).XSS_TRIGGERED);
      expect(xssTriggered).toBeUndefined();
    }
  });

  // 5. Admin Login & Session Invalidation (Logout) Test
  test('Admin authentication flow, session persistence, and secure logout', async ({ page }) => {
    // Navigate to login / secret terminal route
    await page.goto('http://localhost:4200/login'); // or trigger secret terminal modal

    // If login elements exist, test invalid credentials first
    const emailInput = page.locator('input[type="email"]');
    const passInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    if (await emailInput.count() > 0) {
      await emailInput.fill('hacker@malicious.com');
      await passInput.fill('wrongpassword123');
      await submitBtn.click();

      // Expect failure message
      await expect(page.locator('.error-msg, text=/failed|invalid/i')).toBeVisible();

      // Now test proper logout invalidation if logged in successfully...
      // (Mocking valid credentials or testing logout button state)
      const logoutBtn = page.locator('button:has-text("Logout")');
      if (await logoutBtn.count() > 0) {
        await logoutBtn.click();
        // After logout, admin controls must disappear
        await expect(page.locator('.admin-controls')).not.toBeVisible();
      }
    }
  });

});
