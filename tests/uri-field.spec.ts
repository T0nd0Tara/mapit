import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Uri Field', () => {
  test('add uri', async ({ page }) => {
    const uri = "http://www.google.com";
    const uriInput = page.getByTestId('uri-input');
    await uriInput.fill(uri);
    await expect(uriInput).toHaveValue(uri);
  })
});
