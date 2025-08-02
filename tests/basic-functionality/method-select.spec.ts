import { test, expect } from '@playwright/test';
import { random_json, random_url } from '../utils/random';
import { HttpMethod } from '../../src/types/http';
import _ from 'lodash';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})
test('method select actually work', async ({ page }) => {
  const method: string = _.sample(Object.keys(HttpMethod))!;
  const url: string = random_url({});
  const responseJson = random_json({});

  await page.getByTestId('method-select').click();
  await page.getByTestId(`method-option-${method.toLowerCase()}`).click();
  await page.getByTestId('uri-input').fill(url);

  await page.route(url, async route => {
    expect(route.request().method().toLowerCase()).toEqual(method.toLowerCase());
    await route.fulfill({
      json: responseJson,
    });
  });

  await page.getByTestId('send-request-button').click()
  await expect(page.getByTestId('response-output')).toHaveValue(JSON.stringify(responseJson));
});
