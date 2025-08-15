import { test, expect } from '@playwright/test';
import { random_json, random_key_val, random_url } from '../utils/random';
import _ from 'lodash';
import { IKeyVal } from '../utils/params';
import { getHeadersTableBody } from '../utils/get-element';
import { addRow } from '../utils/key-value-table';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('headers actually work', async ({ page }) => {
  const url: string = random_url({});
  const headers = Array.from(Array(5)).map(() => random_key_val({ uppercase: false }))

  const responseJson = random_json({});

  const tableBody = await getHeadersTableBody(page);
  await headers.reduce((prev, keyVal) => prev.then(() => addRow({ tableBody, keyVal })), Promise.resolve())

  await page.getByTestId('uri-input').fill(url);

  await page.route(url, async route => {
    const requestHeaders = await route.request().allHeaders();

    headers.forEach((header: IKeyVal) => expect(requestHeaders[header.key]).toBe(header.value))

    await route.fulfill({
      json: responseJson,
    });
  });

  await page.getByTestId('send-request-button').click()
  await expect(page.getByTestId('response-output')).toHaveValue(JSON.stringify(responseJson));
});
