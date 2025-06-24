export function indexOfOrUndefined(value: string, ...args: Parameters<typeof String.prototype.indexOf>)
  : ReturnType<typeof String.prototype.indexOf> | undefined {
  const result = value.indexOf(...args);
  return result === -1 ? undefined : result;
}
