import "reflect-metadata";
import {
  TYPES,
  loadDefaultModules,
  LocalModelSource,
  LogLevel,
  SGraph,
  SNode,
  SGraphView,
  ConsoleLogger,
  configureModelElement,
  overrideViewerOptions,
} from "sprotty";
import { Container, ContainerModule } from "inversify";
import { RectangleNodeView, CircleNodeView } from "../../views";

const simpleGraphModule = new ContainerModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

    configureModelElement(context, "graph", SGraph, SGraphView);
    configureModelElement(context, "rect", SNode, RectangleNodeView, {});
    configureModelElement(context, "circle", SNode, CircleNodeView, {});
  }
);

const container = new Container();
loadDefaultModules(container, { exclude: [] });
container.load(simpleGraphModule);

overrideViewerOptions(container, {
  baseDiv: "simple-graph",
});

const graph = {
  id: "graph",
  type: "graph",
  children: [
    {
      id: "1",
      type: "rect",
      position: {
        x: 50,
        y: 0,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
    {
      id: "2",
      type: "circle",
      position: {
        x: 50,
        y: 100,
      },
      size: {
        width: 50,
        height: 50,
      },
    },
  ],
};

const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

modelSource.setModel(graph);
