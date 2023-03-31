import * as $ from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Experience from '@core/Experience';
import Size from '@util/Size';
import GUI from '../utils/GUI';

export default class Camera {
  private experience: Experience;
  private canvas: HTMLCanvasElement;
  private size: Size;
  private gui: GUI;

  public camera: $.PerspectiveCamera;
  public controls: OrbitControls;
  public defaultCameraPosition: $.Vector3;
  public defaultSpherical:  $.Spherical;
  public enableControls: Boolean;
  private cameraDebugPARAMS: {
    position: $.Vector3,
    rotation: $.Euler,
    controls: Boolean,
    sphericalTarget: $.Vector3
  }

  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.size = this.experience.size;
    this.gui = this.experience.gui;

    this.defaultCameraPosition = new $.Vector3(-18, 15, 26);
    this.defaultSpherical = new $.Spherical(4, -1.1, 0.5);
    this.camera = this.configCamera();
    this.controls = this.configControls();
    this.enableControls = true;

    this.cameraDebugPARAMS = {
      position: this.camera.position,
      rotation: this.camera.rotation,
      controls: this.enableControls,
      sphericalTarget: new $.Vector3(1, 1, 1)
    }
    this.debug();
  }

  private configCamera(): $.PerspectiveCamera {
    const FOV = 74;
    const ASPECT = this.size.aspect;
    const NEAR = 0.1;
    const FAR = 1000;
    const _instant = new $.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    _instant.position.set(
      this.defaultCameraPosition.x,
      this.defaultCameraPosition.y,
      this.defaultCameraPosition.z);
    return _instant;
  }

  private configControls(): OrbitControls {
    const _instant = new OrbitControls(
      this.camera, this.canvas
    );
    _instant.enableDamping = true;
    _instant.enablePan = true;
    _instant.enableZoom = true;
    _instant.enableRotate = true;
    let sphTarget = this.defaultSpherical;
    let target = new $.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
    ).setFromSpherical(sphTarget)
    _instant.target = target;  
    return _instant;
  }

  public resize() {
    this.camera.aspect = this.size.aspect;
    this.camera.updateProjectionMatrix();
  }

  public update() {
    if (this.enableControls) {
      this.controls.update();
    }

    this.cameraDebugPARAMS.position = this.camera.position;
    this.cameraDebugPARAMS.rotation = this.camera.rotation;
  }

  private debug() {
    const cameraFolder = this.gui.addFolder({
      title: 'Camera',
      expanded: false
    })

    cameraFolder.addInput(this.cameraDebugPARAMS, 'position', {
    }).on("change", (ev) => {
      this.camera.position.set(ev.value.x, ev.value.y, ev.value.z);
    })

    cameraFolder.addInput(this.cameraDebugPARAMS, 'rotation', {
    }).on("change", (ev) => {
      this.camera.rotation.set(ev.value.x, ev.value.y, ev.value.z);
    })

    cameraFolder.addInput(this.cameraDebugPARAMS, 'controls', {
    }).on("change", (ev) => {
      this.enableControls = ev.value;
    })

    cameraFolder.addInput(this.cameraDebugPARAMS, 'sphericalTarget', {
      expanded: false
    }).on("change", (ev) => {
      let sphTarget = new $.Spherical(
        ev.value.x,
        ev.value.y,
        ev.value.z,
      );
      let target = new $.Vector3(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
      ).setFromSpherical(sphTarget)
      this.controls.target = target;
    })
  }
}