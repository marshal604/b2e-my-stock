export function transformCommaStringToNumber(str: string): number {
  const value = str.split(',').join('');
  return Number(value);
}
