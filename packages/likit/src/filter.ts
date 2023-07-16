type KeyType<T extends Array<unknown>> = T extends Array<infer G> ? G : never;
type ExcludeItem<K> = K extends string | number ? K | RegExp | { (_: K): boolean } : K | { (_: K): boolean };
type ToExclude<T extends Array<unknown>> = T extends Array<infer K> ? ExcludeItem<K> : never;
type Predicate = (item: unknown, index?: number,) => unknown;

export function arrayExclude<T extends Array<unknown>, K extends KeyType<T>>(array: T, ...excludes: ToExclude<T>[]): T {
  if (excludes.length === 0) {
    return array;
  }
  const [first, ...rest] = excludes;
  const predicate = (typeof first === "function" ? (...args) => !first(...args) : (item: K) => item !== first) as Predicate;
  return arrayExclude(array.filter(predicate) as T, ...rest);
}
