import { type Curry, curry } from "./curry";
import { describe, expect, test } from "bun:test";

describe("curry", () => {
  test("empty", () => {
    function empty() {
      return "EMPTY";
    }

    const curried = curry(empty);
    expect(curried).toBe(empty);
    expect(curried()).toBe(empty());
  });

  test("basic", () => {
    const fn = (a: number, b: string, c: boolean, d: symbol) =>
      `${a}.${b}.${c}.${String(d)}`;
    const curriedFn: Curry<typeof fn> = curry(fn);
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

  test("method", () => {
    class Test {
      n = 0;
      add(a: number, b: number): number {
        return this.n + a + b;
      }
    }

    const t = new Test();
    const add = curry(t.add);

    expect(() => add(1, 2)).toThrow();

    const boundedAdd = curry(t.add.bind(t));
    const boundedAdd10 = boundedAdd(10);
    expect(boundedAdd(1, 2)).toBe(3);
    expect(boundedAdd10(2)).toBe(12);

    t.n = 100;

    expect(boundedAdd(1, 2)).toBe(103);
    expect(boundedAdd10(2)).toBe(112);
  });
});
