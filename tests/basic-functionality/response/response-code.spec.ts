import { test, expect } from '@playwright/test';
import { random_int, random_url } from '../../utils/random';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('response status code is shown', async ({ page }) => {
  const url: string = random_url({ fragment: false });
  const status = random_int({ min: 100, max: 599 })

  await page.getByTestId('uri-input').fill(url);
  await page.route(url, async route => {
    await route.fulfill({
      json: {},
      status
    });
  })
  await page.getByTestId('send-request-button').click()

  await expect(page.getByTestId('response-status-code')).toContainText(status.toString())
});
