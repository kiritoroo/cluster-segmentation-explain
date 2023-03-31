import * as $ from 'three';
import { EventEmitter } from 'events';
import Size from '@util/Size';
import Time from '@util/Time';
import GUI from '@util/GUI';
import Resources from '@util/Resources';
import Camera from '@core/Camera';
import Renderer from '@core/Renderer';
import World from '@world/World';

import { assets } from '@/scripts/assets';
import Raycaster from './Raycaster';

export default class Experience extends EventEmitter {
  private static instance: Experience | undefined = undefined;

  public clock!: $.Clock;
  public size!: Size
  public time!: Time
  public gui!: GUI
  public canvas!: HTMLCanvasElement;
  public scene!: $.Scene;
  public camera!: Camera;
  public renderer!: Renderer;
  public raycaster!: Raycaster;
  public resources!: Resources;
  public world!: World;
  private sceneDebugPARAMS!: {
    bgColor: number,
  }

  constructor() {
    super();
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this;
    
    this.sceneDebugPARAMS = {
      bgColor: 0xDEDEDE,
    }

    this.clock = new $.Clock();
    this.canvas = this.configCanvas();
    this.size = new Size();
    this.time = new Time();
    this.gui = new GUI();
    this.scene = this.configScene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.raycaster = new Raycaster();
    this.resources = new Resources(assets);

    this.init();
    this.bindEvent();
    this.start();
  }

  private init() {
    this.gui.dispose();
    
    // const axesHelper = new $.AxesHelper(15);
    // const gridHelper = new $.GridHelper(15);
    // this.scene.add(axesHelper);
    // this.scene.add(gridHelper);

    this.resources
      .on('e_resourcesReady', () => {
        this.world = new World();
        this.emit('e_createdWorld')
      })
  }

  private configCanvas(): HTMLCanvasElement {
    const _instant = document.createElement('canvas');
    document.body.appendChild(_instant);
    return _instant;
  }

  private configScene(): $.Scene {
    const _instant = new $.Scene();
    _instant.background = new $.Color(this.sceneDebugPARAMS.bgColor);
    return _instant;
  }

  private bindEvent() {
    document.addEventListener('eResize', () => this.resize());
    document.addEventListener('eUpdate', () => this.update());
  }

  private start() {

  }

  private update() {
    if (this.world) this.world.update();
    this.gui.refresh();
    this.camera.update();
    this.renderer.update();
  }

  private resize() {
    if (this.world) this.world.resize();
    this.camera.resize();
    this.renderer.resize();
  }
}