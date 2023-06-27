import { describe, test, expect } from "vitest";
import { Add, Sub } from "./number";

describe("number", () => {
  test("add", () => {
    const a: Add<126, 621> = 747;
    const b: Add<0, 123> = 123;

    expect(a).toBe(747);
    expect(b).toBe(123);
  });

  test("sub", () => {
    const a: Sub<621, 126> = 495;
    const b: Sub<123, 0> = 123;

    expect(a).toBe(495);
    expect(b).toBe(123);
  });
});
