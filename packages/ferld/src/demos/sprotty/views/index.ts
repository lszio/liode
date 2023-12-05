import { type VNode, h } from "snabbdom";
import { type RenderingContext, SNode, ShapeView } from "sprotty";

export class CircleNodeView extends ShapeView {
  render(node: SNode, context: RenderingContext): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined;
    }
    const radius = this.getRadius(node);
    return h("g", {}, [
      h(
        "circle",
        {
          attrs: { r: radius, cx: radius, cy: radius },
          class: {
            "sprotty-node": true,
            selected: node.selected,
          },
        },
        []
      ),
    ]);
  }

  protected getRadius(node: SNode): number {
    const d = Math.min(node.size.width, node.size.height);
    return d > 0 ? d / 2 : 10;
  }
}

export class RectangleNodeView extends ShapeView {
  render(node: SNode, context: RenderingContext): VNode | undefined {
    return h("g", {}, [
      h(
        "rect",
        {
          attrs: {
            x: 0,
            y: 0,
            width: node.size.width,
            height: node.size.height,
          },
          class: {
            "sprotty-node": true,
            selected: node.selected,
          },
        },
        []
      ),
    ]);
  }
}
