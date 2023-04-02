import * as $ from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import Experience from '@core/Experience';
import Size from '@util/Size';
import Camera from '@core/Camera';
import GUI from '@util/GUI';

export default class Renderer {
  private experience: Experience;
  private size: Size;
  private gui: GUI;
  private canvas: HTMLCanvasElement;
  private scene: $.Scene;
  private camera: Camera;

  public renderer: $.WebGLRenderer;
  public labelRenderer: CSS2DRenderer;

  constructor() {
    this.experience = new Experience();
    this.size = this.experience.size;
    this.gui = this.experience.gui;
    this.canvas = this.experience.canvas;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.renderer = this.configRenderer()
    this.labelRenderer = this.configLabelRenderer();

    this.debug();
  }

  private configRenderer(): $.WebGLRenderer {
    const _instant = new $.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    })
    _instant.shadowMap.enabled = true;
    _instant.shadowMap.type = $.PCFShadowMap;
    _instant.shadowMap.needsUpdate = true;
    _instant.outputEncoding = $.LinearEncoding;
    _instant.toneMapping = $.NoToneMapping;
    _instant.toneMappingExposure = 1.25;
    _instant.setSize(this.size.width, this.size.height);
    _instant.setPixelRatio(this.size.pixelRatio);
    _instant.localClippingEnabled = true;
    _instant.domElement.id = "main-canvas";

    return _instant;
  }

  private configLabelRenderer(): CSS2DRenderer {
    const _instant = new CSS2DRenderer();
    _instant.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( _instant.domElement );
    return _instant;
  }

  public resize() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(this.size.pixelRatio);
    this.labelRenderer.setSize(this.size.width, this.size.height);
  }

  public update() {
    this.renderer.clearDepth();

    this.renderer.render(this.scene, this.camera.camera);
    this.labelRenderer.render(this.scene, this.camera.camera);
    this.renderer.render(this.scene, this.camera.camera);
  }

  private debug() {
    const rendererPARAMS = {
      outputEncoding: $.sRGBEncoding,
      shadowMap: $.PCFShadowMap,
      toneMapping: $.ACESFilmicToneMapping,
    }

    const renderFolder = this.gui.addFolder({
      title: 'Renderer',
      expanded: false
    })

    renderFolder.addInput(rendererPARAMS, 'outputEncoding', {
      options: {
        sRGB: $.sRGBEncoding,
        Linear: $.LinearEncoding,
        BasicDepth: $.BasicDepthPacking,
        RGBADepth: $.RGBADepthPacking
      }
    }).on("change", (ev) => {
      this.renderer.outputEncoding = ev.value;
    })

    renderFolder.addInput(rendererPARAMS, 'shadowMap', {
      options: {
        Basic: $.BasicShadowMap,
        VSM: $.VSMShadowMap,
        PCF: $.PCFShadowMap,
        PCFSoft: $.PCFSoftShadowMap,
        WebGL: $.WebGLShadowMap,
      }
    }).on("change", (ev) => {
      this.renderer.shadowMap.type = ev.value;
    })
    
    renderFolder.addInput(rendererPARAMS, 'toneMapping', {
      options: {
        None: $.NoToneMapping,
        Linear: $.LinearToneMapping,
        Reinhard: $.ReinhardToneMapping,
        Cineon: $.CineonToneMapping,
        ACESFilm: $.ACESFilmicToneMapping,
        Custom: $.CustomToneMapping
      }
    }).on("change", (ev) => {
      this.renderer.toneMapping = ev.value;
    })
  }
}