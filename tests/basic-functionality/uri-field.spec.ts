import { test, expect } from '@playwright/test';
import { random_json, random_string, random_url } from '../utils/random';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})
test('allow to insert invalid uri', async ({ page }) => {
  const invalid_uri = `${random_string({})}://??${random_string({})}??????==#=##dsafasdf###`
  await page.getByTestId('uri-input').pressSequentially(invalid_uri, { delay: 100 })
  await expect(page.getByTestId('uri-input')).toHaveValue(invalid_uri)
});

test('enter in uri sends it', async ({ page }) => {
  const url: string = random_url({});
  const responseJson = random_json({});

  await page.route(url, async route => {
    await route.fulfill({
      json: responseJson,
    });
  })

  await page.getByTestId('uri-input').click()
  await page.keyboard.type(url);

  await page.keyboard.press('Enter');


  await expect(page.getByTestId('response-output')).toHaveValue(JSON.stringify(responseJson))
});
