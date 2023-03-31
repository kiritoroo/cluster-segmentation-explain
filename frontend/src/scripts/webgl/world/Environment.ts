import * as $ from 'three';

import Experience from '@core/Experience';
import GUI from '@util/GUI';

export default class Environment {
  private experience: Experience;
  private gui: GUI;

  private ambientLightPARAMS: {
    color: number,
    intensity: number,
    enable: boolean
  }
  private directionLightPARAMS: {
    color: number,
    intensity: number,
    position: $.Vector3,
    castShadow: true,
    enable: boolean
  }
  public ambientLightGroup: $.Group;
  public directionLightGroup: $.Group;
  private ambientLight: $.AmbientLight;
  private directionLight: $.DirectionalLight;
  private directionLightHelper!: $.DirectionalLightHelper;


  constructor() {
    this.experience = new Experience();
    this.gui = this.experience.gui;

    this.ambientLightPARAMS = {
      color: 0xffffff,
      intensity: 1,
      enable: true
    }
    this.ambientLightGroup = new $.Group();
    this.ambientLight = this.configAmbientlight();
    this.directionLightPARAMS = {
      color: 0xffffff,
      intensity: 1,
      position: new $.Vector3(-5, 10, 3),
      castShadow: true,
      enable: true
    }
    this.directionLightGroup = new $.Group();
    this.directionLight = this.configDirectionLight();

    this.debug();
  }

  private configAmbientlight(): $.AmbientLight {
    const _light = new $.AmbientLight(
      this.ambientLightPARAMS.color,
      this.ambientLightPARAMS.intensity
    );
    this.ambientLightGroup.add(_light);
    return _light;
  }

  private configDirectionLight(): $.DirectionalLight {
    const _light = new $.DirectionalLight(
      this.directionLightPARAMS.color,
      this.directionLightPARAMS.intensity
    )
    _light.position.set(
      this.directionLightPARAMS.position.x,
      this.directionLightPARAMS.position.y,
      this.directionLightPARAMS.position.z  
    )
    _light.castShadow = true;
    _light.shadow.camera.top = 10;
    _light.shadow.camera.bottom = -10;
    _light.shadow.camera.left = -10;
    _light.shadow.camera.right = 10;
    _light.shadow.camera.near = 0.1;
    _light.shadow.camera.far = 50
    _light.shadow.normalBias = 0.05;
    _light.shadow.mapSize.set( 2048, 2048 );
    _light.shadow.camera.visible = true;
    this.directionLightHelper = new $.DirectionalLightHelper(
      _light, 5, this.directionLightPARAMS.color
    )
    this.directionLightGroup.add(_light);
    if (window.location.hash === '#debug') this.directionLightGroup.add(this.directionLightHelper);
    return _light;
  }

  public update() {

  }

  private debug() {
    const environmentFolder = this.gui.addFolder({
      title: 'Environment',
      expanded: false
    })

    const ambientLightFolder = environmentFolder.addFolder({
      title: 'Ambient',
      expanded: true
    })

    ambientLightFolder.addInput(this.ambientLightPARAMS, 'color', {
      view: 'color',
      picker: 'popup',
      expanded: false
    }).on("change", (ev) => {
      this.ambientLight.color = new $.Color(ev.value);
    })

    ambientLightFolder.addInput(this.ambientLightPARAMS, 'intensity', {
      min: 0, max: 2, step: 0.1
    }).on("change", (ev) => {
      this.ambientLight.intensity = ev.value;
    })

    ambientLightFolder.addInput(this.ambientLightPARAMS, 'enable', {
    }).on("change", (ev) => {
      ev.value == false
        ? this.ambientLightGroup.remove(this.ambientLight)
        : this.ambientLightGroup.add(this.ambientLight);
    })

    const directLightFolder = environmentFolder.addFolder({
      title: 'Direction',
      expanded: true
    })

    directLightFolder.addInput(this.directionLightPARAMS, 'color', {
      view: 'color',
      picker: 'popup',
      expanded: false
    }).on("change", (ev) => {
      this.directionLight.color.setHex(ev.value);
      this.directionLightHelper.color = new $.Color(ev.value);
      this.directionLightHelper.update();
    })

    directLightFolder.addInput(this.directionLightPARAMS, 'intensity', {
      min: 0, max: 2, step: 0.1
    }).on("change", (ev) => {
      this.directionLight.intensity = ev.value;
    })

    directLightFolder.addInput(this.directionLightPARAMS, 'position', {
      x: { step: 0.5 },
      y: { step: 0.5 },
      z: { step: 0.5 }
    }).on("change", (ev) => {
      this.directionLight.position.set(
        ev.value.x,
        ev.value.y,
        ev.value.z
      )
      this.directionLightHelper.update();
    })

    directLightFolder.addInput(this.directionLightPARAMS, 'castShadow', {
    }).on("change", (ev) => {
      this.directionLight.castShadow = ev.value;
    })

    directLightFolder.addInput(this.directionLightPARAMS, 'enable', {
    }).on("change", (ev) => {
      ev.value == false
        ? (() => {
          this.directionLightGroup.remove(this.directionLight);
          this.directionLightGroup.remove(this.directionLightHelper);
        })()
        : (() => {
          this.directionLightGroup.add(this.directionLight);
          this.directionLightGroup.add(this.directionLightHelper);
        })()
    })
  }
}