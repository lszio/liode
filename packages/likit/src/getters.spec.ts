import { describe, expect, test, vi as spy } from "vitest"
import { EditType, getEditOperations, withDifferents } from "./likit"
import { getBy, parseGetter } from "./getters"

const object = {
  o: { o: { n: 1 } },
  l: [{ o: { b: true } }, { s: 's' }],
  s: "s",
  b: false,
}

describe("getters", () => {
  test.each([
    ["s", ["s"]],
    ["b", ["b"]],
    ["o.o.n", ["o", "o", "n"]],
    ["l[0].o.b", ["l", 0, "o", "b"]],
    ["l(s@s)", ["l", "s"]]
  ])("parseGetter %s toBe %s", (s, gs) => {
    expect(parseGetter(s).map(i => i["key"] || i["slot"] || i["index"])).toEqual(gs)
  })

  test.each([
    ["s", "s"],
    ["b", false],
    ["o.o.n", 1],
    ["l[0]", { o: { b: true } }],
    ["l[0].o.b", true],
    ["l(s@s).s", "s"]
  ])("getBy(%s) toBe %s", (s, v) => {
    expect(getBy(object, ...parseGetter(s))).toEqual(v)
  })
})
