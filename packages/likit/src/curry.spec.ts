import { Curry, curry } from "./curry";
import { describe, expect, test } from "vitest";

describe("curry", () => {
  test("basic", () => {
    const fn = (a: number, b: string, c: boolean, d: symbol) => `${a}.${b}.${c}.${String(d)}`;
    const curriedFn: Curry<typeof fn> = curry(fn) as Curry<typeof fn>;
    const s = Symbol("s");

    const r = "1.2.true.Symbol(s)";
    expect(curriedFn(1, "2", true, s)).toBe(r);

    expect(curriedFn(1)("2")(true)(s)).toBe(r);
    expect(curriedFn(1)("2")(true, s)).toBe(r);
    expect(curriedFn(1)("2", true, s)).toBe(r);

    expect(curriedFn(1, "2")(true, s)).toBe(r);
    expect(curriedFn(1, "2", true)(s)).toBe(r);

    expect(curriedFn(1, "2")(true)(s)).toBe(r);

    expect(curriedFn(1)("2", true)(s)).toBe(r);
  });
});
