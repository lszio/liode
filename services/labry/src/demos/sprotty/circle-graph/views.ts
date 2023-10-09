import { injectable } from "inversify";
import { type VNode, h } from "snabbdom";
import { type RenderingContext, SNode, ShapeView } from "sprotty";

@injectable()
export class CircleNodeView extends ShapeView {
  render(node: SNode, context: RenderingContext): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined;
    }
    const radius = this.getRadius(node);
    return h("g", {}, [
      h(
        "cicle",
        {
          attrs: { x: radius, cx: radius, cy: radius },
          class: {
            "sprotty-node": true,
            selected: node.selected,
          },
        },
        []
      ),
      // h(
      //   "text",
      //   {
      //     attrs: { x: radius, y: radius + 7 },
      //     class: { "sprotty-text": true },
      //   },
      //   [node.id.substr(4)]
      // ),
    ]);
  }

  protected getRadius(node: SNode): number {
    const d = Math.min(node.size.width, node.size.height);
    return d > 0 ? d / 2 : 0;
  }
}
