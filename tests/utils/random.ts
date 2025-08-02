import _ from 'lodash'

export function random_string({
  length = 10,
  uppercase = true,
  lowercase = true,
  digits = true,
}: {
  length?: number,
  uppercase?: boolean,
  lowercase?: boolean,
  digits?: boolean,
}) {
  let result = '';
  let characters = ''
  if (uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase) characters += 'abcdefghijklmnopqrstuvwxyz'
  if (digits) characters += '0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Produces a random int in the range [min, max]. i.e. inclusive
export function random_int({ min, max }: { min?: number, max?: number }) {
  min ??= 0
  min = _.toInteger(min);
  max ??= 10
  max = _.toInteger(max);

  return _.random(min, max, false)
}

export function random_url({
  path = true,
  param = false,
  fragment = false,
}: {
  path?: boolean,
  param?: boolean,
  fragment?: boolean,
}): string {
  let url = `https://${random_string({ uppercase: false })}.${random_string({ length: 3, uppercase: false })}`;

  if (path) url += `/${random_string({})}`;
  if (param) url += `?${random_string({ length: 3 })}=${random_string({ length: 5 })}`
  if (fragment) url += `#${random_string({})}`

  return url;
}

export function random_json({ depth = 2, fieldsCount = 5 }:
  { depth?: number, fieldsCount?: number }
): object {
  const out: object = {}
  for (let fieldInd = 0; fieldInd < fieldsCount; fieldInd++) {
    out[random_string({})] = depth <= 0 ? random_string({}) : random_json({ depth: depth - 1, fieldsCount })
  }
  return out;
}
