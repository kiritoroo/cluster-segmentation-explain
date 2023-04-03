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
  public img_width: number;
  public img_height: number;
  public pixel_count: number;
  private img_rgb: Uint8ClampedArray;

  public img3d_positions: Array<number>;
  public img3d_positions_v3: Array<$.Vector3>;
  public img3d_colors: Array<number>;
  private img3d_colors_v3: Array<$.Vector3>;
  public img3d_geo: $.BufferGeometry;
  private img3d_mat: $.PointsMaterial;
  private img3d_mesh: $.Points;

  public group: $.Group;

  constructor() {
    this.r_scale = 255/10;
    this.g_scale = 255/10;
    this.b_scale = 180/10;

    this.exp = new Experience();
    this.resources = this.exp.resources;

    this.img_texture = this.resources.items['demo'] as $.Texture;
    this.img_data = getImageTexture(this.img_texture.image, 0.3);
    this.img_rgba = this.img_data.data;
    this.img_width = this.img_data.width;
    this.img_height = this.img_data.height;
    this.pixel_count = this.img_width * this.img_height;
    this.img_rgb = new Uint8ClampedArray(this.pixel_count*3);

    const point_mark = this.resources.items['disc_mark'] as $.Texture
    point_mark.minFilter = $.LinearFilter;
    point_mark.magFilter = $.LinearFilter;
    
    this.img3d_positions = [];
    this.img3d_positions_v3 = [];
    this.img3d_colors = [];
    this.img3d_colors_v3 = [];
    this.img3d_geo = new $.BufferGeometry();
    this.img3d_mat = new $.PointsMaterial({ 
      size: 10,
      sizeAttenuation: false,
      map: point_mark,
      alphaTest: 0.9,
      transparent: true,
      vertexColors: true,
      opacity: 1
    });
    this.img3d_mesh = new $.Points(this.img3d_geo, this.img3d_mat);
    
    this.group = new $.Group();

    this.init();
  }

  private init() {
    this.configData();
    this.setPixelsColorDefault();

    this.group.add(this.img3d_mesh);
  }

  public setPixelsColorDefault() {
    const _colors = new Array(this.img_height * this.img_width * 3).fill(200/255);
    this.img3d_geo.setAttribute('color', new $.Float32BufferAttribute(_colors, 3));

    this.img3d_mat.alphaTest = 0.3;
    this.img3d_mat.opacity = 0.3;
  }

  public setPixelsOpcacity(value: number) {
    this.img3d_mat.opacity = value;
  }

  public setPixelsColors() {
    this.img3d_geo.setAttribute('color', new $.Float32BufferAttribute(this.img3d_colors, 3));
  
    this.img3d_mat.alphaTest = 0.9;
    this.img3d_mat.opacity = 1;
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

        const _r_factor = Math.minMaxScale(_r,0,255,0,this.r_scale);
        const _g_factor = Math.minMaxScale(_g,0,255,0,this.g_scale);
        const _b_factor = Math.minMaxScale(_b,0,255,0,this.b_scale);

        this.img3d_positions.push(_r_factor, _b_factor, _g_factor);
        this.img3d_colors.push(_r / 255, _g / 255, _b / 255);
        this.img3d_positions_v3.push(new $.Vector3(_r_factor, _b_factor, _g_factor));
        this.img3d_colors_v3.push(new $.Vector3(_r / 255, _g / 255, _b / 25));
      }
    }

    this.img3d_geo.setAttribute('position', new $.Float32BufferAttribute(this.img3d_positions, 3));
    this.img3d_geo.setAttribute('color', new $.Float32BufferAttribute(this.img3d_colors, 3));
  }
}
