type Fn = (..._: any[]) => unknown;

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
 * TODO: Description placeholder
 * @date 9/8/2023 - 2:06:50 PM
 * @author 李书志
 *
 * @export
 * @template F
 * @param {Fn} fn
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

