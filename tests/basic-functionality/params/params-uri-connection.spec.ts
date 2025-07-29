import { test, expect } from '@playwright/test';
import { random_string, random_int } from '../../utils/random';
import { addParamRow, getParamsTable, IKeyVal, removeNthParamRow } from '../../utils/params';

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
  const indToRemove = random_int({ max: paramsToAdd })
  await removeNthParamRow(page, { tableBody, index: indToRemove })


  await expect(page.getByTestId('uri-input'))
    .toHaveValue(getFullUri(uri, params.filter((_elem, ind) => ind !== indToRemove)));
});
