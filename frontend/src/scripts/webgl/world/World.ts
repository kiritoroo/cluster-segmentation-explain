import * as $ from 'three';
import Experience from '@core/Experience';
import Environment from '@world/Environment';
import RGBSpace from './RGBSpace';


export default class World {
  private experience: Experience;
  private scene: $.Scene;

  public world: $.Group;
  public environment: Environment;
  public rgbSpace: RGBSpace;

  public ui_button_kmeanPlay: HTMLButtonElement;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.world = new $.Group();
    this.environment = new Environment();
    this.rgbSpace = new RGBSpace();

    this.ui_button_kmeanPlay = document.getElementById('button-kmean-play') as HTMLButtonElement;

    this.init();
    this.bindEvent();
  }

  private init() {
    this.scene.add(this.world);
    this.world.add(this.environment.ambientLightGroup);
    this.world.add(this.environment.directionLightGroup);

    this.world.add(this.rgbSpace.group);
  }

  private bindEvent() {
    this.ui_button_kmeanPlay.addEventListener("click", (event: any) => {
      this.rgbSpace.kMeansLoop();
    })
  }

  public resize() {

  }
  
  public update() {
    this.environment.update();
    this.rgbSpace.update();
  }
}