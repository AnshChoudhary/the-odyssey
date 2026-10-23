import { test } from '@playwright/test';

test.use({
  video: 'on',
  viewport: { width: 1440, height: 900 },
});

test('record demo video', async ({ page }) => {
  // Start
  await page.goto('/');
  
  // Skip tour
  const skipButton = page.getByRole('button', { name: /begin your voyage/i });
  if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.waitForTimeout(2000); // Show the tour briefly
    await skipButton.click();
  }
  
  // Show The Chart
  await page.waitForTimeout(3000);
  
  // Click an island
  const island = page.locator('g.island').first();
  if (await island.isVisible({ timeout: 2000 }).catch(() => false)) {
    await island.click();
    await page.waitForTimeout(2000);
    
    // Close panel
    await page.locator('button:has-text("×")').first().click();
  }
  
  await page.waitForTimeout(1000);
  
  // Navigate to Board the Ship
  await page.getByRole('button', { name: /open navigation/i }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Board the Ship' }).click();
  await page.waitForTimeout(3000);
  
  // Navigate to Captain's Log
  await page.getByRole('button', { name: /open navigation/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: "Captain's Log" }).click();
  await page.waitForTimeout(3000);
  
  // Navigate to Three Trials
  await page.getByRole('button', { name: /open navigation/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Three Trials' }).click();
  await page.waitForTimeout(3000);
  
  // Navigate to Ithaca
  await page.getByRole('button', { name: /open navigation/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Ithaca North Star' }).click();
  await page.waitForTimeout(3000);
  
  // Press Esc to return to chart
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);
});
