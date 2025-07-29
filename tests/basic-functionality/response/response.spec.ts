import { test, expect } from '@playwright/test';
import { random_json, random_string, random_url } from '../utils/random';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('requst result is shown in the response field - json', async ({ page }) => {
  const url: string = random_url({ fragment: false });
  const responseJson = random_json({});

  await page.getByTestId('uri-input').fill(url);
  await page.route(url, async route => {
    await route.fulfill({
      json: responseJson,
    });
  })
  await page.getByTestId('send-request-button').click()

  await expect(page.getByTestId('response-output')).toHaveValue(JSON.stringify(responseJson))
});

test('requst result is shown in the response field - html', async ({ page }) => {
  const url: string = random_url({ fragment: false });
  const responseHTML = `<div>${random_string({})}</div>`;

  await page.getByTestId('uri-input').fill(url);
  await page.route(url, async route => {
    await route.fulfill({
      body: responseHTML,
    });
  })
  await page.getByTestId('send-request-button').click()

  await expect(page.getByTestId('response-output')).toHaveValue(responseHTML)
});
