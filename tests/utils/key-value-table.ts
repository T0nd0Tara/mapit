import { expect, Locator } from "@playwright/test";
import { random_key_val } from "./random";
import { IKeyVal } from "./params";

export const addRow = async ({ tableBody, keyVal = random_key_val({}) }:
  { tableBody: Locator, keyVal?: IKeyVal }) => {

  const rowCount = await tableBody.locator('tr').count()
  const lastRow = tableBody.locator('tr').nth(rowCount - 1);

  const inputs = lastRow.locator('td > input')
  expect(await inputs.count()).toBe(2);

  await inputs.nth(0).fill(keyVal.key);
  await inputs.nth(1).fill(keyVal.value);
}

export const removeNthRow = async ({ tableBody, index }:
  { tableBody: Locator, index?: number }) => {
  const rowCount = await tableBody.locator('tr').count()
  expect(rowCount).toBeGreaterThanOrEqual(2)
  index ??= rowCount - 2; // -1 to convert size to last index, another -1 to get the last filled row

  await tableBody.locator('tr').nth(index).locator('td > :first-child').last().click()

  expect(await tableBody.locator('tr').count()).toBe(rowCount - 1)
}

export const getKeyValuesFromTable = async ({
  tableBody,
}: {
  tableBody: Locator,
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
