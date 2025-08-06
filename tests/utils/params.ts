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
  newParam ??= { key: random_string({}), value: random_string({}) };
  const rowCount = await tableBody.locator('tr').count()
  const lastRow = tableBody.locator('tr').nth(rowCount - 1);

  const inputs = lastRow.locator('td > input')
  expect(await inputs.count()).toBe(2);

  await inputs.nth(0).fill(newParam.key);
  await inputs.nth(1).fill(newParam.value);
}
export const removeNthParamRow = async (page: Page, {
  tableBody,
  index,
}: {
  tableBody?: Awaited<ReturnType<typeof getParamsTable>>,
  index?: number
}) => {
  tableBody ??= await getParamsTable(page);
  const rowCount = await tableBody.locator('tr').count()
  expect(rowCount).toBeGreaterThanOrEqual(2)
  index ??= rowCount - 2; // -1 to convert size to last index, another -1 to get the last filled row

  await tableBody.locator('tr').nth(index).locator('td > :first-child').last().click()

  expect(await tableBody.locator('tr').count()).toBe(rowCount - 1)
}

export const getKeyValuesFromTable = async ({
  tableBody,
}: {
  tableBody: Awaited<ReturnType<typeof getParamsTable>>,
}): Promise<IKeyVal[]> => {
  const rows = await tableBody.locator('tr').all()
  const keyValues: Promise<IKeyVal>[] = rows.slice(0, rows.length - 1).map(async (row) => {
    const inputs = await row.locator('td > input').all()
    const [key, value] = await Promise.all([
      inputs[0].inputValue(),
      inputs[1].inputValue(),
    ])
    return {
      key, value
    }
  })

  return await Promise.all(keyValues);
}
