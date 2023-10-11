import { inject, injectable } from "inversify";
import { h, type VNode } from "snabbdom";
// import { Action, Point } from "sprotty-protocol";
import {
  type IVNodePostprocessor,
  SModelElement,
  TYPES,
  type ILogger,
} from "sprotty";
import { isDraggable } from "./model";

@injectable()
export class DragDropVNodePostprocessor implements IVNodePostprocessor {
  @inject(TYPES.ILogger)
  protected readonly logger: ILogger;

  public decorate(vnode: VNode, element: SModelElement): VNode {
    if (isDraggable(element)) {
      this.logger.log(this, "test");
      console.log(vnode)
      const firstGIndex = vnode.chidlren?.findIndex((n: VNode) => n.sel === "g") || vnode.children.length
      vnode.children?.splice(firstGIndex, 0,
        h(
          "foreignObject",
          {
            attrs: {
              x: 0,
              y: 0,
              width: 50,
              height: 50,
            },
          },
          [
            h(
              "div",
              {
                style: {
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#2222",
                },
                attrs: { draggable: "true" },
                on: {
                  dragstart: (e: DragEvent) => {
                    console.log("dragstart");
                    e.dataTransfer?.setDragImage(vnode.elm, 10, 10)
                  },
                },
              },
              []
            ),
          ]
        )
      );
    }

    return vnode;
  }

  public postUpdate() {
    //
  }
}
