import {
  TYPES,
  configureViewerOptions,
  SGraphView,
  ConsoleLogger,
  LogLevel,
  loadDefaultModules,
  LocalModelSource,
  CircularNode,
  configureModelElement,
  SGraph,
  SEdge,
  selectFeature,
  PolylineEdgeView,
  MouseListener,
  SModelElement,
} from "sprotty";
import { type Action, Point } from "sprotty-protocol";
import { CircleNodeView } from "./views";
import { ContainerModule, inject, injectable, Container } from "inversify";

const NodeCreator = Symbol("NodeCreator");

export default (nodeCreator: (point?: Point) => void) => {
  const circlegraphModule = new ContainerModule(
    (bind, unbind, isBound, rebind) => {
      bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
      rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
      rebind(TYPES.LogLevel).toConstantValue(LogLevel.log);
      bind(NodeCreator).toConstantValue(nodeCreator);
      bind(TYPES.MouseListener).to(DroppableMouseListener);
      const context = { bind, unbind, isBound, rebind };
      configureModelElement(context, "graph", SGraph, SGraphView);
      configureModelElement(
        context,
        "node:circle",
        CircularNode,
        CircleNodeView
      );
      configureModelElement(context, "edge:straight", SEdge, PolylineEdgeView, {
        disable: [selectFeature],
      });
      configureViewerOptions(context, {
        needsClientLayout: false,
      });
    }
  );

  const container = new Container();
  loadDefaultModules(container);
  container.load(circlegraphModule);
  return container;
};

@injectable()
class DroppableMouseListener extends MouseListener {
  @inject(NodeCreator) nodeCreator: (point?: Point) => void;

  override dragOver(
    target: SModelElement,
    event: MouseEvent
  ): (Action | Promise<Action>)[] {
    event.preventDefault();
    return [];
  }

  override drop(
    target: SModelElement,
    event: MouseEvent
  ): (Action | Promise<Action>)[] {
    this.nodeCreator({ x: event.offsetX, y: event.offsetY });
    return [];
  }
}
