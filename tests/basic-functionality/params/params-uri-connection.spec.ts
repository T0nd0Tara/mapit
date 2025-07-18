import { test, expect, Page, Locator } from '@playwright/test';
import { random_string } from '../../utils/random';
import { addParamRow, getParamsTable, IKeyVal } from '../../utils/params';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
});

test("adding param in table adds it to uri", async ({ page }) => {
  const uri = `http://${random_string()}/${random_string()}`
  const [_, tableBody] = await Promise.all([
    page.getByTestId('uri-input').fill(uri).then(() =>
      expect(page.getByTestId('uri-input')).toHaveValue(uri)
    ),
    getParamsTable(page),
  ]);

  const newParam: IKeyVal = { key: random_string(), value: random_string() };
  await addParamRow(page, { tableBody, newParam });
  await expect(page.getByTestId('uri-input')).toHaveValue(`${uri}?${newParam.key}=${newParam.value}`)
});
