import { test, expect } from '@playwright/test';
import { random_url } from '../../utils/random';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('response timing is shown', async ({ page }) => {
  const url: string = random_url({ fragment: false });

  await page.getByTestId('uri-input').fill(url);
  await page.route(url, async route => {
    await route.fulfill({
      json: {}
    });
  })
  await page.getByTestId('send-request-button').click()

  await expect(page.getByTestId('response-timing')).toHaveText(/^(\d+\.)?\d+ ms$/)
});
