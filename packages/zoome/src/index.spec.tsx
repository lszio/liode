import { describe, expect, test, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
// import { SimpleDemo } from "./demo"
import Zoome, { ZoomeMode } from "./index"
import "@testing-library/jest-dom"

declare module 'vitest' {
  export interface TestContext {
    zoome: Zoome;
  }
}

describe("zoome", () => {
  beforeEach((ctx) => {
    render(
      <div id="container" data-testid="container">
        <div id="source">
          <p id="content">Zoome Test</p>
          <span id="count">0</span>
        </div>
      </div>
    )

    const container = document.querySelector("#container") as HTMLElement;
    const source = document.querySelector("#source") as HTMLElement;
    const zoome = new Zoome({ name: "zoome-vitest", source, container })
    ctx.zoome = zoome
  })

  test("basic", async (ctx) => {
    expect(ctx.zoome.name).toBe("zoome-vitest")
    expect(ctx.zoome.source).toBeInTheDocument()
    expect(ctx.zoome.cloned!.id).toBe("zoome-vitest-zoome-cloned")
    expect(ctx.zoome.zoominp).toBe(true)
    expect(document.querySelector("#zoome-vitest-zoome-cloned")).toBeInTheDocument();
  })

  test("update matrix", async (ctx) => {
    ctx.zoome.matrix = { scaleX: 2, scaleY: 2, translateX: 0, translateY: 0 }
    expect(ctx.zoome.cloned?.style.transform).toBe("translate(0px, 0px) scale(2, 2)")

    ctx.zoome.matrix = { scaleX: 3, scaleY: 3, translateX: 0, translateY: 0 }
    expect(ctx.zoome.cloned?.style.transform).toBe("translate(0px, 0px) scale(3, 3)")
  })

  test("update source", async (ctx) => {
    ctx.zoome.source!.firstElementChild!.innerHTML = "Zoome Vitest Updated"
    ctx.zoome.handleSourceMutated([]);
    const cloned = ctx.zoome.cloned

    expect(cloned?.firstElementChild?.innerHTML).toBe("Zoome Vitest Updated");
  })

  test("source transform", async (ctx) => {
    expect(ctx.zoome.getSourceTransform()).toEqual({ scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 })
    // ctx.zoome.source!.style.transform = "translate(0px, 0px) scale(2, 2)"
    // expect(ctx.zoome.getSourceTransform()).toEqual({ scaleX: 2, scaleY: 2, translateX: 0, translateY: 0 })
  })

  test("trigger mousemove", async (ctx) => {
    ctx.zoome.matrix = { scaleX: 3, scaleY: 3, translateX: 0, translateY: 0 }
    fireEvent.mouseMove(ctx.zoome.source!, { clientX: 200, clientY: 100 })

    expect(ctx.zoome.cloned?.style.transform).toBe("translate(-600px, -300px) scale(3, 3)")
  })

  test("zoomout", async (ctx) => {
    ctx.zoome.mode = ZoomeMode.ZOOMOUT;
    ctx.zoome.handleSourceMutated();

    expect(ctx.zoome.zoominp).toBe(false)
    expect(ctx.zoome.zoomoutp).toBe(true)
  })

  test("destory", async (ctx) => {
    ctx.zoome.destory()
    expect(document.querySelector("#source-zoome-cloned")).not.toBeInTheDocument();
  })
})
