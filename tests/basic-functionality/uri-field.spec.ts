import { test, expect } from '@playwright/test';
import { random_string } from '../utils/random';

test.describe('uri-field', () => {
  test('allow to insert invalid uri', async ({ page }) => {
    const invalid_uri = `${random_string()}://??${random_string()}??????==#=##dsafasdf###`
    await page.getByTestId('uri-input').fill(invalid_uri)
    await expect(page.getByTestId('uri-input')).toHaveText(invalid_uri)
  });
})
