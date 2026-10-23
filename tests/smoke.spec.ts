import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', name: 'Map (default)' },
  { path: '/#/map', name: 'Map' },
  { path: '/#/ithaca', name: 'Ithaca' },
  { path: '/#/calypso', name: 'Calypso' },
  { path: '/#/log', name: 'Captain\'s Log' },
  { path: '/#/trials', name: 'Three Trials' },
  { path: '/#/deck', name: 'Deck' },
  { path: '/#/recruit', name: 'Recruit' },
  { path: '/#/ports', name: 'Ports' },
  { path: '/#/armada', name: 'Armada' },
  { path: '/#/chapters', name: 'Chapters' },
  { path: '/#/gifts', name: 'Gifts' },
];

test.describe('Work Odyssey - All Routes Smoke Test', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const route of routes) {
    test(`${route.name} - loads without console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Handle intro if present
      await page.goto(route.path);
      
      // Check for and dismiss intro if it appears
      const introButton = page.locator('button:has-text("Set sail")');
      if (await introButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await introButton.click();
        await page.waitForTimeout(1000);
      }

      // Wait for the view to be present
      await expect(page.locator('.view')).toBeVisible({ timeout: 10000 });

      // Verify no console errors
      expect(consoleErrors).toEqual([]);

      // Take a screenshot for visual verification
      await page.screenshot({ path: `test-results/${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`, fullPage: true });
    });
  }

  test('Navigation - rail links work', async ({ page }) => {
    await page.goto('/');
    
    // Dismiss intro if present
    const introButton = page.locator('button:has-text("Set sail")');
    if (await introButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await introButton.click();
      await page.waitForTimeout(1000);
    }

    // Test a few navigation links
    const railLinks = await page.locator('#rail a').all();
    expect(railLinks.length).toBeGreaterThan(0);
    
    // Click the first link and verify navigation
    if (railLinks.length > 0) {
      await railLinks[1].click(); // Skip first (might be current)
      await page.waitForTimeout(500);
      await expect(page.locator('.view')).toBeVisible();
    }
  });

  test('Map interactions - zoom controls', async ({ page }) => {
    await page.goto('/#/map');
    
    // Dismiss intro
    const introButton = page.locator('button:has-text("Set sail")');
    if (await introButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await introButton.click();
      await page.waitForTimeout(1000);
    }

    await expect(page.locator('.map-stage')).toBeVisible();
    
    // Test zoom controls if visible
    const zoomIn = page.locator('.map-ctl button').first();
    if (await zoomIn.isVisible().catch(() => false)) {
      await zoomIn.click();
      await page.waitForTimeout(200);
    }
  });

  test('Responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/ithaca');
    
    // Dismiss intro
    const introButton = page.locator('button:has-text("Set sail")');
    if (await introButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await introButton.click();
      await page.waitForTimeout(1000);
    }

    await expect(page.locator('.view')).toBeVisible();
    await page.screenshot({ path: 'test-results/mobile-ithaca.png', fullPage: true });
  });
});
