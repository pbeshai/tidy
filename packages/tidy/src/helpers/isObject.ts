/**
 * Returns true if input is an object
 */
export function isObject(obj: any) {
  const type = typeof obj;
  return obj != null && (type === 'object' || type === 'function');
}
