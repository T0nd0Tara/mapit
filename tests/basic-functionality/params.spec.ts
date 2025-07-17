import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('new row appears on input', async ({ page }) => {
  await page.getByRole('tab', { name: 'Params (0)' }).click();
  const table = page.getByTestId('params-key-value-table').first()
  const tableBody = table.locator('tbody');
  expect(await tableBody.locator('tr').count()).toBe(1)

  await tableBody.locator('tr input').first().fill('a')

  expect(await tableBody.locator('tr').count()).toBe(2)
});
