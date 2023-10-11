import { SModelElement } from "sprotty";

export const dragFeature = Symbol("dragFeature");
export const dropFeature = Symbol("dropFeature");
export const dropZoneFeature = Symbol("dropZoneFeature");

export interface Draggable {
  dragging?: boolean;
}

export function isDraggable<T extends SModelElement>(
  object: T
): object is T & Draggable {
  return object.hasFeature(dragFeature);
}

export interface Droppable {
  dropping?: boolean;
  dropAllowed?: boolean;
}

export function isDroppable<T extends SModelElement>(
  object: T
): object is T & Droppable {
  return object.hasFeature(dropFeature);
}

export function isDropZone<T extends SModelElement>(object: T): object is T {
  return object.hasFeature(dropZoneFeature);
}
