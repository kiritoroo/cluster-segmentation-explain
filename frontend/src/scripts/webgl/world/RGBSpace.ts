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
  private rVertices: Float32Array;
  private rBufferGeometry: $.BufferGeometry;
  private rSegments: $.LineSegments;

  private gMaxValue: number;
  private gPlaneWidth: number;
  private gPlaneHeight: number;
  private gNumberSegmentHorizontal: number;
  private gNumberSegmentVertical: number;
  private gOffsetSegmentHorizontal: number;
  private gOffsetSegmentVertical: number;
  private gVertices: Float32Array;
  private gBufferGeometry: $.BufferGeometry;
  private gSegments: $.LineSegments;

  private bMaxValue: number;
  private bPlaneWidth: number;
  private bPlaneHeight: number;
  private bNumberSegmentHorizontal: number;
  private bNumberSegmentVertical: number;
  private bOffsetSegmentHorizontal: number;
  private bOffsetSegmentVertical: number;
  private bVertices: Float32Array;
  private bBufferGeometry: $.BufferGeometry;
  private bSegments: $.LineSegments;

  constructor() {
    this.exp = new Experience();

    this.group = new $.Group();

    this.init();
    this.bindEvent();
  }

  private init() {

  }

  private bindEvent() {}

  private update() {}
}
