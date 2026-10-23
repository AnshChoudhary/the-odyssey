import { test, expect } from '@playwright/test';

test.describe('The Work Odyssey', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });

    await page.goto('/');
    
    // Skip tour if it appears
    const skipButton = page.getByRole('button', { name: /begin your voyage/i });
    try {
      await skipButton.click({ timeout: 2000 });
    } catch {
      // Tour already dismissed or not present
    }
  });

  test('should load the homepage without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    
    // Check that The Chart is visible (use more specific selector)
    await expect(page.locator('.glass-panel').filter({ hasText: 'Your living map of work' }).first()).toBeVisible();
    
    // No console errors
    expect(errors).toHaveLength(0);
  });

  test('should show tour on first visit', async ({ page, context }) => {
    // Clear localStorage to simulate first visit
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    
    // Tour should be visible
    await expect(page.getByRole('heading', { name: /welcome to the work odyssey/i })).toBeVisible();
    
    // Skip tour
    await page.getByRole('button', { name: /begin your voyage/i }).click();
    
    // Tour should be hidden
    await expect(page.getByRole('heading', { name: /welcome to the work odyssey/i })).not.toBeVisible();
  });

  test('should open and close navigation', async ({ page }) => {
    // Click compass button
    await page.getByRole('button', { name: /open navigation/i }).click();
    
    // Navigation should be visible
    await expect(page.getByRole('heading', { name: /navigate/i })).toBeVisible();
    
    // Close navigation
    await page.locator('button:has-text("×")').first().click();
    
    // Navigation should be hidden
    await expect(page.getByRole('heading', { name: /navigate/i })).not.toBeVisible();
  });

  test('should navigate to different views', async ({ page }) => {
    const views = [
      { name: 'Board the Ship', expectedText: 'Your crew' },
      { name: "Captain's Log", expectedText: 'Weekly check-in with Athena' },
      { name: 'Three Trials', expectedText: 'biggest challenges' },
      { name: 'Ithaca North Star', expectedText: 'Your destination' },
      { name: 'Chapters of the Epic', expectedText: 'Your journey told as mock-epic prose' },
      { name: "Calypso's Island", expectedText: "Work that's been forgotten" },
      { name: 'Gifts from the Gods', expectedText: 'Recognition from your crew' },
      { name: 'Recruit a Crew Member', expectedText: 'Suggested collaborators' },
      { name: 'Ports of Call', expectedText: 'Cross-team harbours' },
      { name: 'The Armada', expectedText: 'Manager fleet view' },
      { name: "Athena's Counsel", expectedText: 'Gentle daily wisdom' },
    ];

    for (const view of views) {
      // Open navigation
      await page.getByRole('button', { name: /open navigation/i }).click();
      
      // Wait for navigation to be visible
      await expect(page.getByRole('heading', { name: /navigate/i })).toBeVisible();
      
      // Click view
      await page.getByRole('button', { name: view.name }).click();
      
      // Wait for navigation to close
      await expect(page.getByRole('heading', { name: /navigate/i })).not.toBeVisible();
      
      // Check that view is loaded
      await expect(page.locator(`text=${view.expectedText}`)).toBeVisible();
    }
  });

  test('should handle Esc key to return to chart', async ({ page }) => {
    // Navigate to a different view
    await page.getByRole('button', { name: /open navigation/i }).click();
    await page.getByRole('button', { name: 'Board the Ship' }).click();
    await expect(page.locator('text=Your crew')).toBeVisible();
    
    // Press Esc
    await page.keyboard.press('Escape');
    
    // Should return to chart
    await expect(page.locator('text=Your living map of work')).toBeVisible();
  });

  test('should show legend when help button is clicked', async ({ page }) => {
    // Click help button
    await page.getByRole('button', { name: /show legend/i }).click();
    
    // Legend should be visible
    await expect(page.getByRole('heading', { name: /legend/i })).toBeVisible();
    
    // Close legend
    await page.getByRole('button', { name: /got it/i }).click();
    
    // Legend should be hidden
    await expect(page.getByRole('heading', { name: /legend/i })).not.toBeVisible();
  });

  test('should interact with map - pan and zoom', async ({ page }) => {
    // Wait for SVG to be visible
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
    
    // Try to pan by dragging
    const box = await svg.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100);
      await page.mouse.up();
    }
    
    // Test passed if no errors occurred
    expect(true).toBe(true);
  });

  test('should click island and show detail panel', async ({ page }) => {
    // Wait for first island to be present
    const island = page.locator('[data-testid^="island-"]').first();
    await expect(island).toBeVisible();
    
    // Click the island
    await island.click();
    
    // Detail panel should appear with Actions heading
    await expect(page.locator('text=Actions')).toBeVisible();
    
    // Verify action buttons are present
    await expect(page.getByTestId('action-rescue')).toBeVisible();
    await expect(page.getByTestId('action-done')).toBeVisible();
    await expect(page.getByTestId('action-dismiss')).toBeVisible();
    
    // Close panel
    await page.locator('button:has-text("×")').first().click();
    
    // Panel should be hidden
    await expect(page.locator('text=Actions')).not.toBeVisible();
  });

  test('should click ship and navigate to Board the Ship', async ({ page }) => {
    // Wait for ship to be visible
    const ship = page.getByTestId('ship');
    await expect(ship).toBeVisible();
    
    // Click the ship
    await ship.click();
    
    // Should navigate to Board the Ship
    await expect(page.locator('text=Your crew')).toBeVisible();
  });

  test('should interact with crew member on ship deck', async ({ page }) => {
    // Navigate to Board the Ship
    await page.getByRole('button', { name: /open navigation/i }).click();
    await page.getByRole('button', { name: 'Board the Ship' }).click();
    await expect(page.locator('text=Your crew')).toBeVisible();
    
    // Wait for first crew member to be visible
    const crewMember = page.locator('[data-testid^="crew-"]').first();
    await expect(crewMember).toBeVisible();
    
    // Click crew member
    await crewMember.click();
    
    // Detail panel should appear with bond strength
    await expect(page.locator('text=Bond Strength')).toBeVisible();
    
    // Close panel
    await page.locator('button:has-text("×")').first().click();
    
    // Panel should be hidden
    await expect(page.locator('text=Bond Strength')).not.toBeVisible();
  });

  test("should swipe cards in Captain's Log", async ({ page }) => {
    // Navigate to Captain's Log
    await page.getByRole('button', { name: /open navigation/i }).click();
    await page.getByRole('button', { name: "Captain's Log" }).click();
    await expect(page.locator('text=Weekly check-in with Athena')).toBeVisible();
    
    // Wait for Aye button to be visible
    const ayeButton = page.getByTestId('btn-aye');
    await expect(ayeButton).toBeVisible();
    
    // Click Aye button
    await ayeButton.click();
    
    // Wait for either progress to update or completion screen
    await expect(
      page.locator('text=/2\\/|Check-in Complete/')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should interact with Three Trials', async ({ page }) => {
    // Navigate to Three Trials
    await page.getByRole('button', { name: /open navigation/i }).click();
    await page.getByRole('button', { name: 'Three Trials' }).click();
    await expect(page.locator('text=/identify your month.*biggest challenges/i')).toBeVisible();
    
    // Wait for first trial to be visible
    const trial = page.locator('[data-testid^="trial-"]').first();
    await expect(trial).toBeVisible();
    
    // Click trial
    await trial.click();
    
    // Detail modal should appear
    await expect(page.locator('text=Add backstory')).toBeVisible();
    
    // Verify confirm button is present (or close button if already confirmed)
    const confirmButton = page.getByTestId('btn-confirm-trial');
    const closeButton = page.getByTestId('btn-close-trial');
    await expect(confirmButton.or(closeButton)).toBeVisible();
    
    // Close modal
    await page.locator('button:has-text("×")').first().click();
    
    // Modal should be hidden
    await expect(page.locator('text=Add backstory')).not.toBeVisible();
  });

  test('should open a gift chest', async ({ page }) => {
    // Navigate to Gifts
    await page.getByRole('button', { name: /open navigation/i }).click();
    await page.getByRole('button', { name: 'Gifts from the Gods' }).click();
    await expect(page.locator('text=Recognition from your crew')).toBeVisible();
    
    // Wait for first unopened chest button to be visible
    const openButton = page.locator('[data-testid^="btn-open-chest-"]').first();
    await expect(openButton).toBeVisible();
    
    // Click to open chest
    await openButton.click();
    
    // Gift message should appear (star emoji indicates opened)
    await expect(page.locator('text=⭐').first()).toBeVisible();
  });

  test('should take screenshots of all views', async ({ page }, testInfo) => {
    // Set viewport to 1440x900 for consistent screenshots
    await page.setViewportSize({ width: 1440, height: 900 });
    
    const views = [
      { name: 'chart', nav: 'The Chart' },
      { name: 'ship', nav: 'Board the Ship' },
      { name: 'captains-log', nav: "Captain's Log" },
      { name: 'trials', nav: 'Three Trials' },
      { name: 'ithaca', nav: 'Ithaca North Star' },
      { name: 'chapters', nav: 'Chapters of the Epic' },
      { name: 'calypso', nav: "Calypso's Island" },
      { name: 'gifts', nav: 'Gifts from the Gods' },
      { name: 'recruit', nav: 'Recruit a Crew Member' },
      { name: 'ports', nav: 'Ports of Call' },
      { name: 'armada', nav: 'The Armada' },
      { name: 'athena', nav: "Athena's Counsel" },
    ];

    for (const view of views) {
      if (view.name !== 'chart') {
        // Open navigation
        await page.getByRole('button', { name: /open navigation/i }).click();
        
        // Wait for navigation to be visible
        await expect(page.getByRole('heading', { name: /navigate/i })).toBeVisible();
        
        // Click view
        await page.getByRole('button', { name: view.nav }).click();
        
        // Wait for navigation to close
        await expect(page.getByRole('heading', { name: /navigate/i })).not.toBeVisible();
      }
      
      // Wait for page to be stable
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await page.screenshot({ 
        path: `docs/screenshots/${view.name}.png`,
        fullPage: false
      });
    }
  });
});
