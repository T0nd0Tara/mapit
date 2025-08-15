import { Page, Locator } from '@playwright/test';

export const getParamsTable = async (page: Page): Promise<Locator> => {
  await page.getByRole('tab', { name: /Params/ }).click();
  return page.getByTestId('params-key-value-table').first().locator('tbody');
}

export const getHeadersTableBody = async (page: Page): Promise<Locator> => {
  await page.getByRole('tab', { name: /Headers/ }).click();
  return page.getByTestId('headers-key-value-table').first().locator('tbody');
}

