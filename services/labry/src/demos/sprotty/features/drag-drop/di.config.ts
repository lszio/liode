import { ContainerModule } from "inversify";
import { MouseTool, ScrollMouseListener, TYPES } from "sprotty";
import { DragDropVNodePostprocessor } from "./vnode-postprocessor";
import {
  CustomScrollMouseListener,
  MouseToolWithExternalDrag,
} from "./override";

export const dragDropModule = new ContainerModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(MouseToolWithExternalDrag).toSelf().inSingletonScope();
    rebind(MouseTool).to(MouseToolWithExternalDrag);

    bind(CustomScrollMouseListener).toSelf().inSingletonScope();
    rebind(ScrollMouseListener).to(CustomScrollMouseListener);

    bind(DragDropVNodePostprocessor).toSelf().inSingletonScope();
    bind(TYPES.IVNodePostprocessor).toService(DragDropVNodePostprocessor);
  }
);
