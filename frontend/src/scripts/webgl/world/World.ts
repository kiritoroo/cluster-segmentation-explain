import * as $ from 'three';
import Experience from '@core/Experience';
import Environment from '@world/Environment';
import RGBSpace from './RGBSpace';
import KCentroidPoints from './KCentroidPoints';


export default class World {
  private experience: Experience;
  private scene: $.Scene;

  public world: $.Group;
  public environment: Environment;
  public rgbSpace: RGBSpace;

  private iteration: number;
  private centroidNumber: number;
  private isCreateCentroided: boolean;
  private selectInitMedthod: 'random' | 'forgy' | 'plusplus';  

  public ui_button_kmeanPlay: HTMLButtonElement;
  public ui_button_kmeanReset: HTMLButtonElement;
  public ui_input_iteration: HTMLInputElement;
  public ui_input_speed: HTMLInputElement;
  public ui_input_kcentroid: HTMLInputElement;
  public ui_option_initcentroid: HTMLSelectElement;
  public ui_button_createcentroid: HTMLButtonElement;
  public ui_option_image_input: HTMLSelectElement;

  public ui_image_view: HTMLImageElement;
  public ui_image_caption: HTMLElement;

  public ui_container_kmean_result: HTMLDivElement;
  public ui_container_cluster: HTMLDivElement;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.world = new $.Group();
    this.environment = new Environment();
    this.rgbSpace = new RGBSpace();

    this.iteration = 1;
    this.centroidNumber = 3;
    this.isCreateCentroided = false;
    this.selectInitMedthod = 'plusplus'

    this.ui_button_kmeanPlay = document.getElementById('button-kmean-play') as HTMLButtonElement;
    this.ui_button_kmeanReset = document.getElementById('button-kmean-reset') as HTMLButtonElement;
    this.ui_input_speed = document.getElementById('input-speed') as HTMLInputElement;
    this.ui_input_iteration = document.getElementById('input-iteration') as HTMLInputElement;
    this.ui_input_kcentroid = document.getElementById('input-kcentroid') as HTMLInputElement;
    this.ui_option_initcentroid = document.getElementById('option-initcentroid') as HTMLSelectElement;
    this.ui_button_createcentroid = document.getElementById('button-createcentroid') as HTMLButtonElement;
    this.ui_option_image_input = document.getElementById('option-image-input') as HTMLSelectElement;
    this.ui_image_view = document.getElementById('image-view') as HTMLImageElement;
    this.ui_image_caption = document.getElementById('image-caption') as HTMLElement;
    this.ui_container_kmean_result = document.getElementById('container-kmean-result') as HTMLDivElement;
    this.ui_container_cluster = document.getElementById('container-cluster') as HTMLDivElement;

    this.init();
    this.bindEvent();
  }

  private init() {
    this.ui_container_kmean_result.style.opacity = "0";
    this.ui_image_caption.innerHTML = `${this.rgbSpace.rgbPoints.img_width} x ${this.rgbSpace.rgbPoints.img_height} pixel`

    this.scene.add(this.world);
    this.world.add(this.environment.ambientLightGroup);
    this.world.add(this.environment.directionLightGroup);

    this.world.add(this.rgbSpace.group);
  }

  private bindEvent() {
    this.ui_button_kmeanPlay.addEventListener("click", () => {
      this.rgbSpace.kMeansLoop(this.iteration);
      this.handleUIPlay();
    })

    this.ui_button_kmeanReset.addEventListener("click", () => {
      this.handleUIReset();
    })

    this.ui_input_iteration.addEventListener("change", (event: any) => {
      this.iteration = event.target.value;
    })

    this.ui_input_speed.addEventListener("change", (event: any) => {
      this.rgbSpace.kmeanSpeed = event.target.value;
    })

    this.ui_input_kcentroid.addEventListener("change", (event: any) => {
      this.centroidNumber = event.target.value;
    })

    this.ui_option_initcentroid.addEventListener("change", (event: any) => {
      const _s = String(event.target.value);
      this.selectInitMedthod = (_s) as 'random' | 'forgy' | 'plusplus';  
    })

    this.ui_button_createcentroid.addEventListener("click", () => {
      this.handleUICreateCentroid();
    })

    this.ui_option_image_input.addEventListener("change", (event: any) => {
      const _s = event.target.value;
      this.ui_image_view.src = `./public/static/textures/${_s}.jpg`
      this.rgbSpace.rgbPoints.reCreatePoints(_s);
      this.ui_image_caption.innerHTML = `${this.rgbSpace.rgbPoints.img_width} x ${this.rgbSpace.rgbPoints.img_height} pixel`
    })
  }

  private handleUIPlay() {
    if (!this.isCreateCentroided) this.handleUICreateCentroid();
    this.rgbSpace.kmeanCanvas.style.height = "400px";
    this.ui_container_kmean_result.style.opacity = "1";
    this.rgbSpace.kMeansLoop(this.iteration);
    this.disableUI(true);
  }

  private handleUIReset() {
    this.ui_container_cluster.innerHTML = "";
    this.isCreateCentroided = false;
    this.rgbSpace.rgbPoints.setPixelsColors();
    this.rgbSpace.kmeanCanvas.style.height = "0px";
    this.ui_container_kmean_result.style.opacity = "0";
    this.rgbSpace.kmeanCanvas.getContext('2d')!.clearRect(0, 0, this.rgbSpace.kmeanCanvas.width, this.rgbSpace.kmeanCanvas.height);
    this.rgbSpace.kmeanTimeout.forEach(id => clearTimeout(id));
    this.disableUI(false);
    this.rgbSpace.kCentroidPoints.removeFromSpace();
  }

  private handleUICreateCentroid() {
    this.ui_container_kmean_result.style.opacity = "1";
    this.isCreateCentroided = true;
    this.rgbSpace.rgbPoints.setPixelsColorDefault();
    this.rgbSpace.kCentroidPoints.reCreateCentroid(this.centroidNumber, this.selectInitMedthod);
    this.rgbSpace.kCentroidPoints.addToSpace();
    this.ui_container_cluster.innerHTML = this.rgbSpace.kCentroidPoints.createUICluster();
  }

  private disableUI(v: boolean) {
    this.ui_button_kmeanPlay.disabled = v;
    this.ui_button_createcentroid.disabled = v;
    this.ui_input_iteration.disabled = v;
    this.ui_input_speed.disabled = v;
    this.ui_input_kcentroid.disabled = v;
    this.ui_option_initcentroid.disabled = v;
    this.ui_option_image_input.disabled = v;
  }

  public resize() {

  }
  
  public update() {
    this.environment.update();
    this.rgbSpace.update();
  }
}