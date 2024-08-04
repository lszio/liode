import { describe, test, expect } from "bun:test"
import { shape } from "./gua";

describe("GUA", () => {
    test.each([[
        [0, ""],
        [1, "-"]
    ]] as [number string][])("trigram: shape of %d = %s", ([t, s]) => {
        expect(shape(t)).toBe(s);
    })
})