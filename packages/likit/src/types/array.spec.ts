import { describe, test, expect } from "vitest";
import { Join } from "./array";

describe("array", () => {
  test("join", () => {
    type List = ["q", "w", "e", "r"]
    const list: List = ["q", "w", "e", "r"];
    const a: Join<List> = "qwer";
    const b: Join<List, ":"> = "q:w:e:r";

    expect(list).toEqual(["q", "w", "e", "r"]);
    expect(a).toBe("qwer");
    expect(b).toBe("q:w:e:r");
  });
});
