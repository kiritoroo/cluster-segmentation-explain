import * as $ from 'three';

import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import Experience from '@core/Experience';
import Renderer from '@core/Renderer';

export default class Loader {

  private manager: $.LoadingManager;

  private dracoLoader: DRACOLoader;
  private ktx2Loader: KTX2Loader;
  private gltfLoader: GLTFLoader;

  private pmremGenerator: $.PMREMGenerator;
  private rgbeLoader: RGBELoader;

  private textureLoader: $.TextureLoader;

  private experience: Experience;
  private renderer: Renderer;

  constructor() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer;
    this.manager = new $.LoadingManager();
    this.dracoLoader = new DRACOLoader(this.manager);
    this.ktx2Loader = new KTX2Loader(this.manager);
    this.gltfLoader = new GLTFLoader(this.manager);

    this.pmremGenerator = new $.PMREMGenerator( this.renderer.renderer );
    this.rgbeLoader = new RGBELoader(this.manager);

    this.textureLoader = new $.TextureLoader(this.manager);

    this.init();
  }

  private init(): void {
    this.dracoLoader
      .setDecoderPath('/libs/draco/');
    this.ktx2Loader
      .setTranscoderPath('/libs/basis/');

    this.gltfLoader
      .setCrossOrigin('anonymous')
      .setDRACOLoader(this.dracoLoader)
      .setKTX2Loader(this.ktx2Loader.detectSupport(this.renderer.renderer))
      .setMeshoptDecoder(MeshoptDecoder);

    this.pmremGenerator.compileEquirectangularShader();
  }

  public LoaderModel(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader
        .load(url, (gltf: GLTF) => {
          if (!gltf.scene) {
            throw new Error('Model no contains scene');
          }
          const result = gltf;
          resolve(result);
        }, undefined, reject);
    })
  }

  public loaderTexture(url: string): Promise<$.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader
        .load(url, (texture: $.Texture) => {
          texture.needsUpdate = true;
          const result = texture;
          resolve(result);
        }, undefined, reject);
    })
  }

  public loaderHdr(url: string): Promise<$.Texture> {
    return new Promise((resolve, reject) => {
      this.rgbeLoader
        .load( url, (texture: $.Texture) => {
          const result = this.pmremGenerator.fromEquirectangular(texture).texture;
          this.pmremGenerator.dispose();
          resolve(result);
        }, undefined, reject);
    })
  }
}