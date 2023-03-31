import * as $ from 'three';

export default class Raycaster {
  public mouse: $.Vec2;
  public raycaster: $.Raycaster;
  public intersects: Array<$.Intersection<$.Object3D>>;
  public activeIntersects: Array<$.Object3D>;
  public activeFocus: $.Group | null;
  public point: $.Vector3;
  public arrowHelper: $.ArrowHelper | null;
  public mouseState: {
    clicked: boolean,
    lastClick: number,
    hold: boolean,
    move: boolean,
    focus: boolean
  }
  private mouseMoveTimeout: number | undefined;
  private mouseDownTimeout: number | undefined;

  constructor() {
    this.mouse = new $.Vector2();
    this.raycaster = new $.Raycaster();
    this.intersects = [];
    this.activeIntersects = [];
    this.activeFocus = null;
    this.point = new $.Vector3();
    this.arrowHelper = null;
    this.mouseState = {
      clicked: false,
      lastClick: Date.now(),
      hold: false,
      move: false,
      focus: false
    }
    this.mouseMoveTimeout = undefined;
    this.mouseDownTimeout = undefined;

    this.bindEvent();
  }

  private bindEvent() {
    window.addEventListener('mousemove',(event) => this.onMouseMoveHandle(event));
    window.addEventListener('mousedown', () => this.onMouseDownHandle());
    window.addEventListener('mouseup', () => this.onMouseUpHandle());
  }

  private onMouseMoveHandle(e: MouseEvent) {
    this.mouseState.move = true;
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; 

    clearTimeout(this.mouseMoveTimeout);
    this.mouseMoveTimeout = window.setTimeout(() => {
      this.mouseState.move = false
    }, 100)
  }

  private onMouseDownHandle() {
    this.mouseState.clicked = true;
    this.mouseState.hold = true;
    this.mouseState.lastClick = Date.now();

    clearTimeout(this.mouseDownTimeout);
    this.mouseDownTimeout = window.setTimeout(() => {
      this.mouseState.clicked = false
    }, 500)
  }

  private onMouseUpHandle() {
    this.mouseState.clicked = false;
    this.mouseState.hold = false;
  }
}