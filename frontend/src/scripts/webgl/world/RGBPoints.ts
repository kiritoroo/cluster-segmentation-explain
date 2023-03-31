import { getImageTexture } from "@/scripts/dip/utils";
import * as $ from "three";
import Experience from "@core/Experience";
import Resources from "@util/Resources";

export default class RGBPoints {
  private exp: Experience;
  private resources: Resources;

  private r_scale: number;
  private g_scale: number;
  private b_scale: number;

  private img_texture: $.Texture;
  private img_data: ImageData;
  private img_rgba: Uint8ClampedArray;
  private img_width: number;
  private img_height: number;
  private pixel_count: number;
  private img_rgb: Uint8ClampedArray;

  private img3d_geo: $.SphereGeometry;
  private img3d_mat: $.MeshBasicMaterial;
  private img3d_mesh: $.InstancedMesh;

  public group: $.Group;

  constructor() {

    this.r_scale = 255/10;
    this.g_scale = 255/10;
    this.b_scale = 180/10;

    this.exp = new Experience();
    this.resources = this.exp.resources;

    this.img_texture = this.resources.items['demo'] as $.Texture;
    this.img_data = getImageTexture(this.img_texture.image, 0.5);
    this.img_rgba = this.img_data.data;
    this.img_width = this.img_data.width;
    this.img_height = this.img_data.height;
    this.pixel_count = this.img_width * this.img_height;
    this.img_rgb = new Uint8ClampedArray(this.pixel_count*3);

    this.img3d_geo = new $.SphereGeometry(0.1, 32, 16);
    this.img3d_mat = new $.MeshBasicMaterial({
      color: 0xffffff,
      side: $.FrontSide
    })
    this.img3d_mesh = new $.InstancedMesh(this.img3d_geo, this.img3d_mat, this.pixel_count);
    
    this.group = new $.Group();

    this.init();
  }

  private init() {
    this.configData();

    this.group.add(this.img3d_mesh);
  }

  private configData() {
    for (let y = 0; y < this.img_height; y++) {
      for (let x = 0; x < this.img_width; x++) {
        const _index = (y * this.img_width + x);
        const _r = this.img_rgba[_index * 4];
        const _g = this.img_rgba[_index * 4 + 1];
        const _b = this.img_rgba[_index * 4 + 2];

        this.img_rgb[_index * 3] = _r;
        this.img_rgb[_index * 3 + 1] = _g;
        this.img_rgb[_index * 3 + 2] = _b;

        const _matrix = new $.Matrix4();
        const _color = new $.Color();

        const _r_factor = Math.minMaxScale(_r,0,255,0,this.r_scale);
        const _g_factor = Math.minMaxScale(_g,0,255,0,this.g_scale);
        const _b_factor = Math.minMaxScale(_b,0,255,0,this.b_scale);

        _matrix.setPosition(_r_factor, _b_factor, _g_factor);
        _color.setRGB(_r/255, _g/255, _b/255);
        this.img3d_mesh.setMatrixAt(_index, _matrix);
        this.img3d_mesh.setColorAt(_index, _color);
      }
    }

    this.img3d_mesh.instanceColor!.needsUpdate = true;
    this.img3d_mesh.instanceMatrix!.needsUpdate = true;
  }
}
