import { expect, Page, Locator } from '@playwright/test';
import { random_key_val } from './random';
import { addRow, removeNthRow } from './key-value-table';

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
  newParam ??= random_key_val({});
  await addRow({ tableBody, keyVal: newParam });
}

export const removeNthParamRow = async (page: Page, {
  tableBody,
  index,
}: {
  tableBody?: Awaited<ReturnType<typeof getParamsTable>>,
  index?: number
}) => {
  tableBody ??= await getParamsTable(page);
  await removeNthRow({ tableBody, index })
}

