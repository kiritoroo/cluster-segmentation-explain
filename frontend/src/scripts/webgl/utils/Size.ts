import { emitEvent } from "@script/event";

export default class Size {
  public width: number;
  public height: number;
  public aspect: number;
  public pixelRatio: number;

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    this.bindEvent();
  }

  private bindEvent() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      emitEvent('eResize');
    })
  }
}