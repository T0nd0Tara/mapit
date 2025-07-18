import { expect, Page, Locator } from '@playwright/test';
import { random_string } from './random';

export interface IKeyVal {
  key: string,
  value: string,
}

export const getParamsTable = async (page: Page): Promise<Locator> => {
  await page.getByRole('tab', { name: /Params/ }).click();
  return page.getByTestId('params-key-value-table').first().locator('tbody');
}

export const addParamRow = async (page: Page, {
  tableBody,
  newParam,
}: {
  tableBody?: Awaited<ReturnType<typeof getParamsTable>>,
  newParam?: IKeyVal
}) => {
  tableBody ??= await getParamsTable(page);
  newParam ??= { key: random_string(), value: random_string() };
  const rowCount = await tableBody.locator('tr').count()
  const lastRow = tableBody.locator('tr').nth(rowCount - 1);

  const inputs = lastRow.locator('td > input')
  expect(await inputs.count()).toBe(2);

  await inputs.nth(0).fill(newParam.key);
  await inputs.nth(1).fill(newParam.value);
}
