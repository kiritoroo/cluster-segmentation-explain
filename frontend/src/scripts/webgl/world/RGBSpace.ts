import * as $ from "three";
import Experience from "@core/Experience";

export default class RGBSpace {
  private exp: Experience;

  public group: $.Group;

  private rMaxValue: number;
  private rPlaneWidth: number;
  private rPlaneHeight: number;
  private rNumberSegmentHorizontal: number;
  private rNumberSegmentVertical: number;
  private rOffsetSegmentHorizontal: number;
  private rOffsetSegmentVertical: number;
  private rOffsetStartHorizontal: number;
  private rOffsetStartVertical: number;
  private rVertices: Float32Array;
  private rBufferGeometry: $.BufferGeometry;
  private rSegments: $.LineSegments;
  private rPlane: $.Mesh;
  private rGroup: $.Group;

  // private gMaxValue: number;
  // private gPlaneWidth: number;
  // private gPlaneHeight: number;
  // private gNumberSegmentHorizontal: number;
  // private gNumberSegmentVertical: number;
  // private gOffsetSegmentHorizontal: number;
  // private gOffsetSegmentVertical: number;
  // private gVertices: Float32Array;
  // private gBufferGeometry: $.BufferGeometry;
  // private gSegments: $.LineSegments;

  // private bMaxValue: number;
  // private bPlaneWidth: number;
  // private bPlaneHeight: number;
  // private bNumberSegmentHorizontal: number;
  // private bNumberSegmentVertical: number;
  // private bOffsetSegmentHorizontal: number;
  // private bOffsetSegmentVertical: number;
  // private bVertices: Float32Array;
  // private bBufferGeometry: $.BufferGeometry;
  // private bSegments: $.LineSegments;

  constructor() {
    this.exp = new Experience();

    this.group = new $.Group();

    this.rMaxValue = 255;
    this.rPlaneWidth = 255/10;
    this.rPlaneHeight = 180/10;
    this.rNumberSegmentHorizontal = 6;
    this.rNumberSegmentVertical = 8;
    this.rOffsetSegmentHorizontal = this.rPlaneWidth / this.rNumberSegmentHorizontal;
    this.rOffsetSegmentVertical = this.rPlaneHeight / this.rNumberSegmentVertical;
    this.rOffsetStartHorizontal = 0.5;
    this.rOffsetStartVertical = 0.5;
    this.rVertices = new Float32Array();
    this.rBufferGeometry = new $.BufferGeometry();
    this.rSegments = this.configRSegments();
    this.rPlane = this.configRPlane();
    this.rGroup = new $.Group();

    this.init();
    this.bindEvent();
  }

  private init() {
    this.rGroup.add(this.rSegments, this.rPlane);

    this.group.add(this.rGroup);
  }

  private configRSegments(): $.LineSegments {
    const _vertices = []
    for (let i = 0; i < this.rNumberSegmentHorizontal; i++) {
      _vertices.push(i*this.rOffsetSegmentHorizontal+this.rOffsetStartHorizontal, 0, 0);
      _vertices.push(i*this.rOffsetSegmentHorizontal+this.rOffsetStartHorizontal, this.rPlaneHeight, 0);
    }


    for (let i = 0; i < this.rNumberSegmentVertical; i++) {
      _vertices.push(0, i*this.rOffsetSegmentVertical+this.rOffsetStartVertical, 0);
      _vertices.push(this.rPlaneWidth, i*this.rOffsetSegmentVertical+this.rOffsetStartVertical, 0);
    }

    this.rVertices = new Float32Array(_vertices);
    this.rBufferGeometry.setAttribute("position", new $.BufferAttribute(this.rVertices, 3));

    const _mat = new $.LineBasicMaterial({
      color: 0xAAAAAA,
      linewidth: 1
    });

    const _instant = new $.LineSegments(this.rBufferGeometry, _mat);
    return _instant;
  }

  private configRPlane(): $.Mesh {
    const _instant = new $.Mesh(
      new $.PlaneGeometry(this.rPlaneWidth, this.rPlaneHeight, this.rNumberSegmentHorizontal, this.rNumberSegmentVertical),
      new $.MeshBasicMaterial({
        color: 0xffffff,
        side: $.FrontSide,
        transparent: true,
        opacity: 0.2
      })
    )
    _instant.position.set(this.rPlaneWidth/2, this.rPlaneHeight/2, -0.2);

    return _instant;
  }

  private bindEvent() {}

  private update() {
    
  }
}
