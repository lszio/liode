export interface ZoomeConfig<T> {
  name?: string;
  mode?: ZoomeMode;
  source: T | null;
  viewer?: HTMLElement | null;
  matrix?: Matrix;
  container?: HTMLElement | null;
}

export type ZoomeMode = "zoomin" | "zoomout" | "fixed"

export interface Matrix {
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
}

interface TransformValue {
  scaleX: number;
  scaleY: number;
  skewX?: number;
  skewY?: number;
  translateX: number;
  translateY: number;
}

export default class Zoome<T extends Element> {
  protected _source: T | null = null;
  protected _cloned: T | null = null;
  protected _mode: ZoomeMode = "zoomin";
  protected _matrix: Matrix = { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
  name: string;
  viewer: HTMLElement;
  viewBlock: HTMLElement | null = null;
  container: HTMLElement;
  observer: MutationObserver;
  cache: Record<string, any> = {};

  constructor({ name, source, viewer, container, matrix, mode = "zoomin" }: ZoomeConfig<T>) {
    this.name = name || "zoome";
    this.viewer = viewer || this.createViewerElement();
    this.viewBlock = this.createViewBlock();
    this.mode = mode || "zoomin";

    this.cache.handleMouseMoveInSource = (e: MouseEvent) => this.handleMouseMoveInSource(e);
    this.cache.handleSourceMutated = (_ms: MutationRecord[]) => this.handleSourceMutated(_ms);

    this.container = container || document.body;
    this.container.appendChild(this.viewer);
    this.observer = new MutationObserver(this.cache.handleSourceMutated);
    this.matrix = { ...this._matrix, ...matrix };
    this.source = source;
  }

  handleChangeTransform(transform: TransformValue, target: T | null) {
    if (target) {
      const { scaleX, scaleY, translateX, translateY } = transform;
      const transformString = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      (target as any).style.transform = transformString;
    }
  }

  handleMouseMoveInSource(event: MouseEvent) {
    const { clientX: mX, clientY: mY } = event;
    const { offsetWidth: vX, offsetHeight: vY } = this.viewer;
    // const { offsetWidth: sX, offsetHeight: sY } = this.source as HTMLElement
    const { scaleX: ssX = 1, scaleY: ssY = 1, translateX: stX, translateY: stY } = this.getSourceTransform();
    const { x, y } = this.source?.getBoundingClientRect() || { x: 0, y: 0 };
    const [dX, dY] = [mX - x + stX, mY - y + stY];
    if (this.cloned) {
      const { scaleX = 1, scaleY = 1 } = this._matrix;
      const translateX = vX / 2 - dX / ssX * scaleX;
      const translateY = vY / 2 - dY / ssY * scaleY;
      this.matrix = { ...this._matrix, translateX, translateY };
    }
  }

  handleSourceMutated(_mutations?: MutationRecord[]) {
    this._source && (this.cloned = this._source.cloneNode(true) as T);
    this.doUpdateViewerOrViewerBlock();
  }

  doUpdateViewerOrViewerBlock() {
    if (this.zoomoutp && this.viewBlock) {
      const parentRect = this._source?.parentElement ? this._source.parentElement.getBoundingClientRect() : new DOMRect();
      const sourceRect = this.getSourceRect();
      const viewerRect = this.viewer.getBoundingClientRect();
      const sourceMatrix = this.getSourceTransform();
      const scaleX = viewerRect.width / sourceRect.width * sourceMatrix.scaleX;
      const scaleY = viewerRect.height / sourceRect.height * sourceMatrix.scaleY;
      const scale = Math.min(scaleX, scaleY);

      const svScaleX = scale / sourceMatrix.scaleX;
      const svScaleY = scale / sourceMatrix.scaleY;

      this.matrix = { ...this.matrix, scaleX: scale, scaleY: scale };
      this.viewBlock.style.width = parentRect.width * svScaleX + "px";
      this.viewBlock.style.height = parentRect.height * svScaleY + "px";

      this.viewBlock.style.top = - sourceMatrix.translateY * svScaleX + "px";
      this.viewBlock.style.left = - sourceMatrix.translateX * svScaleY + "px";
    } else if (this.zoominp) {
      this.matrix = this._matrix;
    }
  }

  getSourceRect(): DOMRect {
    if (this._source) {
      return this._source.getBoundingClientRect();
    } else {
      return new DOMRect()
    }
  }

  getSourceTransform(): TransformValue {
    if (this._source) {
      const style = window.getComputedStyle(this._source);
      const matrix = style.transform;
      if (matrix === "none") {
        return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
      }
      const parsed = matrix.split(/matrix\(|,|\)/).filter(x => !!x);
      if (parsed.length === 6) {
        const [scaleX, skewX, skewY, scaleY, translateX, translateY] = parsed.map(x => parseFloat(x));
        return { scaleX, scaleY, translateX, translateY, skewX, skewY };
      } else if (parsed.length === 9) {
        console.warn("3d transform not supported");
      }
    }
    return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
  }

  get zoominp() { return this.mode === "zoomin"; }
  get zoomoutp() { return this.mode === "zoomout"; }

  get mode() { return this._mode; }
  set mode(mode: ZoomeMode) {
    this._mode = mode;
    if (this.zoominp && this.viewBlock) {
      this.viewBlock.style.display = "none";
    } else if (this.zoomoutp && this.viewBlock) {
      this.viewBlock.style.display = "block";
    }
  }

  get matrix() { return this._matrix; }
  set matrix(matrix: Matrix) {
    this._matrix = { ...this._matrix, ...matrix };
    // console.info(`zoome: ${this.name}: update matrix`)
    if (this.cloned) {
      this.handleChangeTransform(this._matrix as TransformValue, this._cloned);
    }
  }

  get source() { return this._source; }
  set source(source: T | null) {
    if (this._source === source) {
      console.warn("same source, skip...");
      return;
    }
    this._source && this.zoominp && this._source.removeEventListener("mousemove", this.cache.handleMouseMoveInSource);
    this._source = source;
    this.observer.disconnect();
    this._source && this.observer.observe(this._source, { attributes: true, subtree: true, characterData: true });
    this._source && this.zoominp && this._source.addEventListener("mousemove", this.cache.handleMouseMoveInSource);
    this.handleSourceMutated([]);
  }

  get cloned() { return this._cloned; }
  set cloned(cloned: T | null) {
    this._cloned && this.viewer.removeChild(this._cloned);
    this._cloned = this.source?.cloneNode(true) as T || null;
    if (cloned) {
      const id = cloned.id;
      cloned.id = (this.name || id) + "-zoome-cloned";
      this.viewer.appendChild(cloned);
      // console.info(`zoome: ${this.name}: cloned updated`)
    }
    this._cloned = cloned;
  }

  protected createViewBlock() {
    const viewBlock = document.createElement("div");
    viewBlock.classList.add("zoome-view-block");
    viewBlock.id = this.name + "-zoome-view-block";
    viewBlock.style.border = "1px solid black";
    viewBlock.style.position = "absolute";
    viewBlock.style.boxSizing = "border-box";
    viewBlock.style.zIndex = "100";
    viewBlock.style.backgroundColor = "rgba(0,0,0,0.1)";

    viewBlock.addEventListener("mouseover", () => {
      viewBlock.style.backgroundColor = "rgba(0,0,0,0.2)";
    });

    viewBlock.addEventListener("mouseout", () => {
      viewBlock.style.backgroundColor = "rgba(0,0,0,0.1)";
      this.cache.dragging = false;
      viewBlock.classList.remove("zoome-view-block-moving");
    });

    this.viewer.appendChild(viewBlock);
    return viewBlock;
  }

  protected createViewerElement(): HTMLElement {
    const viewer = document.createElement("div");
    viewer.classList.add("zoome-viewer");
    viewer.id = "zoome-viewer-" + this.name;
    viewer.style.overflow = "hidden";

    viewer.addEventListener("mousedown", e => {
      if (this.zoomoutp) {
        const sT = this.getSourceTransform();
        const vT = this.matrix;
        const vR = this.viewer.getBoundingClientRect();
        const { width, height } = this.viewBlock ? this.viewBlock.getBoundingClientRect() : { width: 100, height: 100 };

        const translateX = (vR.left - e.clientX + width / 2) * sT.scaleX / (vT.scaleX || 1);
        const translateY = (vR.top - e.clientY + height / 2) * sT.scaleY / (vT.scaleY || 1);
        this.handleChangeTransform({
          ...sT,
          translateX,
          translateY
        }, this._source);

        this.cache.dragging = true;
        this.cache.translateX = translateX;
        this.cache.translateY = translateY;
        this.cache.mouseX = e.clientX;
        this.cache.mouseY = e.clientY;
      }
    });

    viewer.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.cache.dragging) {
        const dx = e.clientX - this.cache.mouseX;
        const dy = e.clientY - this.cache.mouseY;

        this.cache.mouseX = e.clientX;
        this.cache.mouseY = e.clientY;

        const { scaleX: sX, scaleY: sY, translateX, translateY } = this.getSourceTransform();
        const { scaleX: vX = 1, scaleY: vY = 1 } = this.matrix;

        this.handleChangeTransform({
          scaleX: sX, scaleY: sY,
          translateX: translateX - dx * sX / vX, translateY: translateY - dy * sY / vY
        }, this._source);
      }
    });

    viewer.addEventListener("mouseup", () => {
      this.cache.dragging = false;
    });

    viewer.addEventListener("mouseout", () => {
      this.cache.dragging = false;
    });

    return viewer;
  }

  status() {
    return { source: this.source, viewer: this.viewer, container: this.container, matrix: this.matrix };
  }

  toggle() {
    if (this.viewer.style.display === "none") {
      this.viewer.style.display = this.cache.viewerOriginDisplay || "block";
    } else {
      this.cache.viewerOriginDisplay = this.viewer.style.display;
      this.viewer.style.display = "none";
    }
  }

  destory(): void {
    this.container.removeChild(this.viewer);
    this.observer.disconnect();
    // console.info(`destory zoome ${this.name}`)
  }
}

export class SVGZoome extends Zoome<SVGSVGElement> {
  handleChangeTransform(transform: TransformValue, target: SVGSVGElement | null): void {
    if (target) {
      const { scaleX, scaleY, translateX, translateY } = transform;
      target.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`);
    }
  }

  getSourceTransform(): TransformValue {
    if (this._source) {
      const consolidated = this._source.transform.baseVal.consolidate();
      if (consolidated) {
        const matrix = consolidated.matrix;
        const { a: scaleX, d: scaleY, e: translateX, f: translateY } = matrix;
        return { scaleX, scaleY, translateX, translateY };
      }
    }

    return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
  }
}
