import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

test('opens the repository index directly without module CORS failures', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(pathToFileURL(resolve('index.html')).href);
  await expect(page.getByRole('heading', { name: 'Elseplane' })).toBeVisible();
  await expect(page.locator('.game-shell')).toHaveCSS('display', 'grid');
  expect(errors.filter((message) => /CORS|ERR_FAILED|not allowed to load local resource/i.test(message))).toEqual([]);
});
