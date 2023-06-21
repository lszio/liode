import { describe, expect, test, vi as spy } from "vitest"
import { EditType, getEditOperations, withDifferents } from "./likit"

describe("likit", () => {
  test.each([
    ["qwer", "asdf", new Array(4).fill(EditType.REPLACE)],
    ["", "asdf", new Array(4).fill(EditType.INSERT)],
    ["qwer", "", new Array(4).fill(EditType.DELETE)],
    ["qwer", "qwer", new Array(4).fill(EditType.UNCHANGE)]
  ])("getEditOperations: %s => %s", (a, b, ops) => {
    const operations = getEditOperations(a.split(""), b.split(""))
    expect(operations.map(o => o.type)).toEqual(ops)
  })

  test.each([
    ["qwer", "asdf", [0, 0, 0, 4]],
    ["", "asdf", [0, 0, 4, 0]],
    ["qwer", "", [0, 4, 0, 0]],
    ["qwer", "qwer", [4, 0, 0, 0]],

  ])("withDifferents: %s => %s", (a, b, [u, d, i, r]) => {
    const unchange = spy.fn();
    const onreplace = spy.fn();
    const ondelete = spy.fn();
    const oninsert = spy.fn();

    withDifferents(a.split(""), b.split(""), { onreplace, unchange, oninsert, ondelete })

    expect(onreplace).toBeCalledTimes(r)
    expect(oninsert).toBeCalledTimes(i)
    expect(ondelete).toBeCalledTimes(d)
    expect(unchange).toBeCalledTimes(u)
  })
})
