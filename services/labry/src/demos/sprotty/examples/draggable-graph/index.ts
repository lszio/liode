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
  moveFeature,
  overrideViewerOptions,
  configureModelElement,
} from "sprotty";
import { Container, ContainerModule } from "inversify";
import { RectangleNodeView, CircleNodeView } from "../../views";
import {
  dragFeature,
  dropZoneFeature,
  dragDropModule,
} from "../../features/drag-drop";

const simpleGraphModule = new ContainerModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

    configureModelElement(context, "graph", SGraph, SGraphView, {
      enable: [dropZoneFeature],
    });
    configureModelElement(context, "rect", SNode, RectangleNodeView, {
      enable: [dragFeature],
      disable: [moveFeature],
    });
    configureModelElement(context, "circle", SNode, CircleNodeView, {
      enable: [dragFeature],
      disable: [moveFeature],
    });
  }
);

const container = new Container();
loadDefaultModules(container, { exclude: [] });
container.load(simpleGraphModule);
container.load(dragDropModule);

overrideViewerOptions(container, {
  baseDiv: "draggable-graph",
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
