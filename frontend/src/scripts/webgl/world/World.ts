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

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.world = new $.Group();
    this.environment = new Environment();
    this.rgbSpace = new RGBSpace();

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

  }

  public resize() {

  }
  
  public update() {
    this.environment.update();
  }
}