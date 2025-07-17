import { test, expect, Page, Locator } from '@playwright/test';
import { random_string } from '../utils/random';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

interface IKeyVal {
  key: string,
  value: string,
}

const getParamsTable = async (page: Page): Promise<Locator> => {
  await page.getByRole('tab', { name: /Params/ }).click();
  return page.getByTestId('params-key-value-table').first().locator('tbody');
}

const addParamRow = async (page: Page, {
  tableBody,
  newParam,
}: {
  tableBody?: Awaited<ReturnType<typeof getParamsTable>>,
  newParam?: IKeyVal
}) => {
  tableBody ??= await getParamsTable(page);
  newParam ??= { key: random_string(), value: random_string() };
  const lastRow = tableBody.locator('tr').last();

  const inputs = lastRow.locator('input')
  expect(await inputs.count()).toBe(2);

  await Promise.all([
    inputs.first().fill(newParam.key),
    inputs.last().fill(newParam.value),
  ]);
}
test('cant remove only row', async ({ page }) => {
  const tableBody = await getParamsTable(page);
  const rows = tableBody.locator('tr');
  expect(await rows.count()).toBe(1)

  const trash = rows.first().locator('td').last()
  expect(await trash.locator('*').count()).toBe(0)
});
test('cant remove last row', async ({ page }) => {
  const tableBody = await getParamsTable(page);

  for (let i = 0; i < 5; i++) {
    await addParamRow(page, { tableBody });
  }

  const trash = tableBody.locator('tr').last().locator('td').last()
  expect(await trash.locator('*').count()).toBe(0)
});

test('can delete row', async ({ page }) => {
  const tableBody = await getParamsTable(page);
  await addParamRow(page, { tableBody });
  const numOfRows = await tableBody.locator('tr').count();
  await tableBody.locator('tr').first().locator('td > :first-child').last().click()
  expect(await tableBody.locator('tr').count()).toBe(numOfRows - 1)
});
test('new row appears on input', async ({ page }) => {
  const tableBody = await getParamsTable(page);
  expect(await tableBody.locator('tr').count()).toBe(1)

  await addParamRow(page, { tableBody });

  expect(await tableBody.locator('tr').count()).toBe(2)
});

