import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { if (!localStorage.getItem('elseplane:preferences')) localStorage.setItem('elseplane:preferences', JSON.stringify({ introductionComplete: true, discoveries: [] })); });
});

test('travels through W and reveals an empty slice', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'First Crossing' })).toBeVisible();
  await page.getByLabel('Move through W').fill('3');
  await expect(page.getByText('W 3.00')).toBeVisible();
  await page.getByLabel('Move through W').fill('0');
  await expect(page.getByText('W 0.00')).toBeVisible();
});

test('offers every agreed Gallery scene', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Gallery' }).click();
  const scenes = ['Paper Window', 'First Crossing', 'Tilted Space', 'Beyond the Ramp', 'The Smaller Opening', 'Unlinked', 'Weightless Garden', 'The Workbench'];
  for (const name of scenes) await expect(page.getByRole('button', { name: new RegExp(name) })).toBeVisible();
  await page.getByRole('button', { name: /The Workbench/ }).click();
  await expect(page.getByRole('heading', { name: 'The Workbench' })).toBeVisible();
  await page.getByRole('button', { name: 'Duocylinder' }).click();
});

test('persists settings, discoveries, and an explicit experiment', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByLabel('High contrast').check();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByLabel('Move through W').fill('1');
  await expect(page.getByRole('button', { name: /Journal 1/ })).toBeVisible();
  await page.getByRole('button', { name: 'Save experiment' }).click();
  await expect(page.getByRole('status')).toContainText('saved');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/high-contrast/);
  await expect(page.getByRole('button', { name: /Journal 1/ })).toBeVisible();
  await page.getByRole('button', { name: 'Open saved' }).click();
  await expect(page.getByText('W 1.00')).toBeVisible();
});
