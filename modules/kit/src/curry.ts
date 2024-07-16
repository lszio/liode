// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Fn = (...args: any[]) => unknown;

/**
 * Curry Type
 * Type: (a, b, c) => d TO
 * Type: (a) => (b) => (c) => d
 * Type: (a, b) => (c) => d
 * Type: (a) => (b, c) => d
 * ...
 *
 * @export
 * @typedef {Curry}
 * @template F
 */
export type Curry<F extends Fn> = F extends (...args: infer AS) => infer R
  ? AS extends []
    ? F
    : AS extends [infer _, ...infer B]
      ? B extends []
        ? F
        : CurryHelper<AS, R>
      : never
  : never;

type CurryHelper<AS extends unknown[], R> = CurryToRight<AS, R> &
  CurryToLeft<AS, R> &
  ((..._: AS) => R);

type CurryToRight<RS, R> = RS extends []
  ? R
  : RS extends [infer F, ...infer AS]
    ? AS extends []
      ? R
      : (_: F) => CurryHelper<AS, R>
    : never;

type CurryToLeft<LS, R, RS extends unknown[] = []> = LS extends []
  ? R
  : LS extends [...infer AS, infer L]
    ? ((..._: AS) => CurryHelper<[L, ...RS], R>) &
        CurryToLeft<AS, R, [L, ...RS]>
    : never;

/**
 * curry (a, b, c) => d TO
 * (a) => (b) => (c) => d
 * (a, b) => (c) => d
 * (a) => (b, c) => d
 * ...
 *
 * @export
 * @template F
 * @param {F} fn
 * @returns {Curry<F>}
 */

export function curry<F extends Fn>(fn: F): Curry<F> {
  if (fn.length === 0) return fn as Curry<F>;

  return function curried(...args: Parameters<F>): Curry<F> | ReturnType<F> {
    if (args.length >= fn.length) {
      return fn(...args) as ReturnType<F>;
    }

    return curry(fn.bind(null, ...args));
  } as Curry<F>;
}
