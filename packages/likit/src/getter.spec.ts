import { describe, expect, test } from "vitest"
import { slice, getBy, parseGetter, withLimit } from "./getter"

const object = {
  o: { o: { n: 1 } },
  l: [{ o: { b: true } }, { s: 's' }],
  s: "s",
  b: false,
  ll: [1, 2, 3, 4, 5]
}

describe("getters", () => {
  test.each([
    ["s", ["s"]],
    ["b", ["b"]],
    ["o.o.n", ["o", "o", "n"]],
    ["l[0].o.b", ["l", 0, "o", "b"]],
    ["l(s@s).s", ["l", "s", "s"]],
    ["ll[::-1]", ["ll", "::-1"]]
  ])("parseGetter %s toBe %s", (s, gs) => {
    const key = (i: any) => {
      if (i.key) return i.key
      else if (i.slot) return i.slot
      else if (i.start || i.end || i.step) return `${i["start"] || ''}:${i["end"] || ''}:${i["step"] || ''}`
      else if (i.index !== undefined) return i.index
      return undefined
    }
    expect(parseGetter(s).map(key)).toEqual(gs)
  })

  test.each([
    ["s", "s"],
    ["b", false],
    ["o.o.n", 1],
    ["l[0]", { o: { b: true } }],
    ["l[0].o.b", true],
    ["l(s@s).s", "s"],
    ["ll[::-1]", [5, 4, 3, 2, 1]],
    ["ll[0:-1]", [1, 2, 3, 4]],
    ["ll[:-1]", [1, 2, 3, 4]],
    ["ll[2:4]", [3, 4]],
    ["ll[4:2:-1]", [5, 4]]
  ])("getBy(%s) toBe %s", (s, v) => {
    expect(getBy(object, ...parseGetter(s))).toEqual(v)
  })

  test.each([
    [[1, 2, 3, 4, 5], undefined, undefined, undefined, [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], 0, undefined, undefined, [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], undefined, 5, undefined, [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], undefined, undefined, 1, [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], 2, undefined, undefined, [3, 4, 5]],
    [[1, 2, 3, 4, 5], -3, undefined, undefined, [3, 4, 5]],
    [[1, 2, 3, 4, 5], -33, undefined, undefined, [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], undefined, 2, undefined, [1, 2]],
    [[1, 2, 3, 4, 5], undefined, 2, undefined, [1, 2]],
    [[1, 2, 3, 4, 5], -4, -2, undefined, [2, 3]],
    [[1, 2, 3, 4, 5], undefined, undefined, 2, [1, 3, 5]],
    [[1, 2, 3, 4, 5], undefined, undefined, -1, [5, 4, 3, 2, 1]],
    [[1, 2, 3, 4, 5], undefined, undefined, -1, [5, 4, 3, 2, 1]],
    [[1, 2, 3, 4, 5], -1, undefined, -1, [5, 4, 3, 2, 1]],
    [[1, 2, 3, 4, 5], undefined, 0, -1, [5, 4, 3, 2]],
    [[1, 2, 3, 4, 5], undefined, undefined, 2, [1, 3, 5]],
    [[1, 2, 3, 4, 5], undefined, undefined, -2, [5, 3, 1]],
  ])("slice %s[%s:%s:%s] => %s", (array, start, end, step, sliced) => {
    expect(slice(array, start, end, step)).toEqual(sliced)
  })

  test.each([
    [11, 0, 100, 11],
    [-11, 0, 100, 0],
    [111, 0, 100, 100],
  ])("withLimit %d, [%d, %d] => %d", (n, l, u, t) => {
    expect(withLimit(n, l, u)).toBe(t)
  })
})
