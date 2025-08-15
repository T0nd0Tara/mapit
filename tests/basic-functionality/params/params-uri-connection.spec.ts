import { test, expect } from '@playwright/test';
import { random_string, random_int, random_url } from '../../utils/random';
import { addParamRow, IKeyVal, removeNthParamRow } from '../../utils/params';
import { getParamsTable } from '../../utils/get-element'
import { getKeyValuesFromTable } from '../../utils/key-value-table'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
});

test("adding param in table adds it to uri", async ({ page }) => {
  let uri = `http://${random_string({})}/${random_string({})}`
  const [_, tableBody] = await Promise.all([
    page.getByTestId('uri-input').fill(uri).then(() =>
      expect(page.getByTestId('uri-input')).toHaveValue(uri)
    ),
    getParamsTable(page),
  ]);

  for (let i = 0; i < 5; i++) {
    const newParam: IKeyVal = { key: random_string({}), value: random_string({}) };
    await addParamRow(page, { tableBody, newParam });
    const concatChar = i === 0 ? '?' : '&';
    uri += `${concatChar}${newParam.key}=${newParam.value}`
    await expect(page.getByTestId('uri-input')).toHaveValue(uri)
  }
});

test("removing param from table removes it in the uri", async ({ page }) => {
  const getFullUri = (uri: string, params: IKeyVal[]) =>
    `${uri}?${params.map(param => `${param.key}=${param.value}`).join('&')}`;

  const uri = `http://${random_string({})}/${random_string({})}`
  const [_, tableBody] = await Promise.all([
    page.getByTestId('uri-input').fill(uri).then(() =>
      expect(page.getByTestId('uri-input')).toHaveValue(uri)
    ),
    getParamsTable(page),
  ]);

  const params: IKeyVal[] = []

  const paramsToAdd: number = 5;
  for (let i = 0; i < paramsToAdd; i++) {
    const newParam: IKeyVal = { key: random_string({}), value: random_string({}) };
    params.push(newParam)
    await addParamRow(page, { tableBody, newParam });
  }

  await expect(page.getByTestId('uri-input')).toHaveValue(getFullUri(uri, params))
  const indToRemove = random_int({ max: paramsToAdd - 1 })
  await removeNthParamRow(page, { tableBody, index: indToRemove })


  await expect(page.getByTestId('uri-input'))
    .toHaveValue(getFullUri(uri, params.filter((_elem, ind) => ind !== indToRemove)));
});

test("adding param in uri field adds it to table", async ({ page }) => {
  const url = random_url({});
  const param: IKeyVal = {
    key: random_string({}),
    value: random_string({}),
  }

  const uri = `${url}?${param.key}=${param.value}`
  await page.getByTestId('uri-input').pressSequentially(uri);
  const [_, tableBody] = await Promise.all([
    expect(page.getByTestId('uri-input')).toHaveValue(uri),
    getParamsTable(page),
  ]);

  const actualKeyValues: IKeyVal[] = await getKeyValuesFromTable({ tableBody });

  expect(actualKeyValues).toHaveLength(1);
  expect(actualKeyValues[0].key).toBe(param.key);
  expect(actualKeyValues[0].value).toBe(param.value);

});
