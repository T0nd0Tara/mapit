import _ from 'lodash'

export function random_string(length: number = 10) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function random_int({ min, max }: { min?: number, max?: number }) {
  min ??= 0
  min = _.toInteger(min);
  max ??= 10
  max = _.toInteger(max);

  return _.random(min, max, false)
}
