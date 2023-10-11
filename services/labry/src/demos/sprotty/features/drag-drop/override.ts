import {
  type MouseEventKind,
  MouseTool,
  SModelRoot,
  ScrollMouseListener,
  SModelElement,
} from "sprotty";
import { type Action, isAction } from "sprotty-protocol";

export class MouseToolWithExternalDrag extends MouseTool {
  protected handleEvent(
    methodName: MouseEventKind,
    model: SModelRoot,
    event: MouseEvent
  ): void {
    this.focusOnMouseEvent(methodName, model);
    const element = this.getTargetElement(model, event);
    if (!element) return;
    const actions = this.mouseListeners
      .map((listener) => listener[methodName](element, event as WheelEvent))
      .reduce((a, b) => a.concat(b));
    if (actions.length > 0) {
      // event.preventDefault();
      event.stopPropagation();
      // throw new Error("dsaasdg");
      for (const actionOrPromise of actions) {
        if (isAction(actionOrPromise)) {
          this.actionDispatcher.dispatch(actionOrPromise);
        } else {
          actionOrPromise.then((action: Action) => {
            this.actionDispatcher.dispatch(action);
          });
        }
      }
    }
  }
}

/**
 * TODO: Description placeholder
 * @date 9/26/2023 - 2:10:14 PM
 * @author 李书志
 *
 * @export
 * @class LadderDiagramScrollMouseListener
 * @typedef {LadderDiagramScrollMouseListener}
 * @extends {ScrollMouseListener}
 */
export class CustomScrollMouseListener extends ScrollMouseListener {
  /**
   * TODO: Description placeholder
   * @date 9/26/2023 - 2:10:16 PM
   * @author 李书志
   *
   * @public
   * @param {SModelElement} target
   * @param {MouseEvent} event
   * @returns {(Action | Promise<Action>)[]}
   */
  public mouseDown(
    target: SModelElement,
    event: MouseEvent
  ): (Action | Promise<Action>)[] {
    return [];
  }
}
