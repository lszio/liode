type Fn = (..._: any[]) => unknown;

/**
 * Curry Type 
 * Type: (a, b, c) => d TO
 * Type: (a) => (b) => (c) => d
 * Type: (a, b) => (c) => d
 * Type: (a) => (b, c) => d
 * ...
 * @date 9/9/2023 - 10:14:23 AM
 * @author Li Shuzhi
 *
 * @export
 * @typedef {Curry}
 * @template F
 */
export type Curry<F extends Fn> = CurryHelper<
  Parameters<F>,
  ReturnType<F>
>;

type CurryHelper<AS extends unknown[], R> = CurryToRight<AS, R> &
  CurryToLeft<AS, R> & { (..._: AS): R };

type CurryToRight<RS, R> = RS extends []
  ? R
  : RS extends [infer F, ...infer AS]
  ? {
    (_: F): CurryHelper<AS, R>;
  }
  : never;

type CurryToLeft<LS, R, RS extends unknown[] = []> = LS extends []
  ? R
  : LS extends [...infer AS, infer L]
  ? {
    (..._: AS): CurryHelper<[L, ...RS], R>;
  } & CurryToLeft<AS, R, [L, ...RS]>
  : never;

/**
 * curry (a, b, c) => d TO
 * (a) => (b) => (c) => d 
 * (a, b) => (c) => d
 * (a) => (b, c) => d
 * ...
 * @date 9/9/2023 - 10:14:30 AM
 * @author Li Shuzhi
 *
 * @export
 * @template F
 * @param {F} fn
 * @returns {Curry<F>}
 */
export function curry<F extends Fn>(fn: F): Curry<F> {
  return function curried(...args: any): any {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function (..._: any): any {
        return curried(...args, ..._);
      };
    }
  } as Curry<F>;
}

