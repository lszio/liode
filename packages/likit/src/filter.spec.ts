import { arrayExclude } from "./filter";
import { describe, expect, test } from "vitest";

describe("filter", () => {
  test.each([
    [[], [], []],
    [[1, 2, 3], [1], [2, 3]],
    [[1, 2, 3], [1, 3], [2]],
    [[1, 2, 3], [(n: number) => n < 2], [2, 3]],
    [["1", "2", "3"], ["1"], ["2", "3"]],
    [["1", "2", "3"], ["1", "2"], ["3"]],
    [["1", "2", "3"], [(s: string) => s.match(/(1|3)/)], ["2"]]
  ])("arrayExclude(%j, ...%j) => %j", (array, excludes: any, result) => {
    expect(arrayExclude(array, ...excludes)).toEqual(result);
  });
});
