import { test, expect, Page, Locator } from '@playwright/test';
import { random_string } from '../../utils/random';
import { addParamRow, getParamsTable, IKeyVal } from '../../utils/params';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
});

test("adding param in table adds it to uri", async ({ page }) => {
  let uri = `http://${random_string()}/${random_string()}`
  const [_, tableBody] = await Promise.all([
    page.getByTestId('uri-input').fill(uri).then(() =>
      expect(page.getByTestId('uri-input')).toHaveValue(uri)
    ),
    getParamsTable(page),
  ]);

  for (let i = 0; i < 5; i++) {
    const newParam: IKeyVal = { key: random_string(), value: random_string() };
    await addParamRow(page, { tableBody, newParam });
    const concatChar = i === 0 ? '?' : '&';
    uri += `${concatChar}${newParam.key}=${newParam.value}`
    await expect(page.getByTestId('uri-input')).toHaveValue(uri)
  }
});
