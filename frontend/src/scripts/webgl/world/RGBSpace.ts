import * as $ from "three";
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';

import Experience from "@core/Experience";
import Size from "@util/Size";
import RGBPoints from "@world/RGBPoints";

export default class RGBSpace {
  private exp: Experience;
  private size: Size;

  public rgbPoints: RGBPoints;

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

  private gMaxValue: number;
  private gPlaneWidth: number;
  private gPlaneHeight: number;
  private gNumberSegmentHorizontal: number;
  private gNumberSegmentVertical: number;
  private gOffsetSegmentHorizontal: number;
  private gOffsetSegmentVertical: number;
  private gOffsetStartHorizontal: number;
  private gOffsetStartVertical: number;
  private gVertices: Float32Array;
  private gBufferGeometry: $.BufferGeometry;
  private gSegments: $.LineSegments;
  private gPlane: $.Mesh;
  private gGroup: $.Group;

  private bMaxValue: number;
  private bPlaneWidth: number;
  private bPlaneHeight: number;
  private bNumberSegmentHorizontal: number;
  private bNumberSegmentVertical: number;
  private bOffsetSegmentHorizontal: number;
  private bOffsetSegmentVertical: number;
  private bOffsetStartHorizontal: number;
  private bOffsetStartVertical: number;
  private bVertices: Float32Array;
  private bBufferGeometry: $.BufferGeometry;
  private bSegments: $.LineSegments;
  private bPlane: $.Mesh;
  private bGroup: $.Group;

  private rAxis: Line2;
  private gAxis: Line2;
  private bAxis: Line2;

  constructor() {
    this.exp = new Experience();
    this.size = this.exp.size;

    this.rgbPoints = new RGBPoints();

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

    this.gMaxValue = 255;
    this.gPlaneWidth = 255/10;
    this.gPlaneHeight = 180/10;
    this.gNumberSegmentHorizontal = 6;
    this.gNumberSegmentVertical = 8;
    this.gOffsetSegmentHorizontal = this.gPlaneWidth / this.gNumberSegmentHorizontal;
    this.gOffsetSegmentVertical = this.gPlaneHeight / this.gNumberSegmentVertical;
    this.gOffsetStartHorizontal = 0.5;
    this.gOffsetStartVertical = 0.5;
    this.gVertices = new Float32Array();
    this.gBufferGeometry = new $.BufferGeometry();
    this.gSegments = this.configGSegments();
    this.gPlane = this.configGPlane();
    this.gGroup = new $.Group();

    this.bMaxValue = 255;
    this.bPlaneWidth = 255/10;
    this.bPlaneHeight = 255/10;
    this.bNumberSegmentHorizontal = 6;
    this.bNumberSegmentVertical = 6;
    this.bOffsetSegmentHorizontal = this.bPlaneWidth / this.bNumberSegmentHorizontal;
    this.bOffsetSegmentVertical = this.bPlaneHeight / this.bNumberSegmentVertical;
    this.bOffsetStartHorizontal = 0.5;
    this.bOffsetStartVertical = 0.5;
    this.bVertices = new Float32Array();
    this.bBufferGeometry = new $.BufferGeometry();
    this.bSegments = this.configBSegments();
    this.bPlane = this.configBPlane();
    this.bGroup = new $.Group();

    this.rAxis = this.configRAxis();
    this.gAxis = this.configGAxis();
    this.bAxis = this.configBAxis();

    this.init();
    this.bindEvent();
  }

  private init() {
    this.rGroup.add(this.rSegments, this.rPlane, this.rAxis);
    this.gGroup.add(this.gSegments, this.gPlane, this.gAxis);
    this.bGroup.add(this.bSegments, this.bPlane, this.bAxis);

    this.group.add(this.rgbPoints.group);

    this.group.add(this.rGroup, this.gGroup, this.bGroup);
    this.group.position.set(-this.rPlaneWidth/2, 0, -this.rPlaneWidth/2);
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
      color: 0xFFFFFF,
      linewidth: 1
    });

    const _instant = new $.LineSegments(this.rBufferGeometry, _mat);
    return _instant;
  }

  private configRPlane(): $.Mesh {
    const _instant = new $.Mesh(
      new $.PlaneGeometry(this.rPlaneWidth, this.rPlaneHeight, this.rNumberSegmentHorizontal, this.rNumberSegmentVertical),
      new $.MeshBasicMaterial({
        color: 0xEEEEEE,
        side: $.DoubleSide,
        transparent: true,
        opacity: 0.2
      })
    )
    _instant.position.set(this.rPlaneWidth/2, this.rPlaneHeight/2, -0.01);

    return _instant;
  }

  private configGSegments(): $.LineSegments {
    const _vertices = []
    for (let i = 0; i < this.gNumberSegmentHorizontal; i++) {
      _vertices.push(i*this.gOffsetSegmentHorizontal+this.gOffsetStartHorizontal, 0, 0);
      _vertices.push(i*this.gOffsetSegmentHorizontal+this.gOffsetStartHorizontal, this.gPlaneHeight, 0);
    }


    for (let i = 0; i < this.gNumberSegmentVertical; i++) {
      _vertices.push(0, i*this.gOffsetSegmentVertical+this.gOffsetStartVertical, 0);
      _vertices.push(this.gPlaneWidth, i*this.gOffsetSegmentVertical+this.gOffsetStartVertical, 0);
    }

    this.gVertices = new Float32Array(_vertices);
    this.gBufferGeometry.setAttribute("position", new $.BufferAttribute(this.gVertices, 3));

    const _mat = new $.LineBasicMaterial({
      color: 0xFFFFFF,
      linewidth: 1
    });

    const _instant = new $.LineSegments(this.gBufferGeometry, _mat);
    _instant.rotation.set(0, Math.PI/2, 0);
    _instant.position.set(this.gPlaneWidth, 0, this.gPlaneWidth);

    return _instant;
  }

  private configGPlane(): $.Mesh {
    const _instant = new $.Mesh(
      new $.PlaneGeometry(this.gPlaneWidth, this.gPlaneHeight, this.gNumberSegmentHorizontal, this.gNumberSegmentVertical),
      new $.MeshBasicMaterial({
        color: 0xEEEEEE,
        side: $.DoubleSide,
        transparent: true,
        opacity: 0.2
      })
    )
    _instant.rotation.set(0, Math.PI/2, 0);
    _instant.position.set(this.gPlaneWidth+0.01, this.gPlaneHeight/2, this.gPlaneWidth/2);

    return _instant;
  }

  private configBSegments(): $.LineSegments {
    const _vertices = []
    for (let i = 0; i < this.bNumberSegmentHorizontal; i++) {
      _vertices.push(i*this.bOffsetSegmentHorizontal+this.bOffsetStartHorizontal, 0, 0);
      _vertices.push(i*this.bOffsetSegmentHorizontal+this.bOffsetStartHorizontal, 0, this.bPlaneHeight);
    }


    for (let i = 0; i < this.bNumberSegmentVertical; i++) {
      _vertices.push(0, 0, i*this.bOffsetSegmentVertical+this.bOffsetStartVertical);
      _vertices.push(this.bPlaneWidth, 0, i*this.bOffsetSegmentVertical+this.bOffsetStartVertical);
    }

    this.bVertices = new Float32Array(_vertices);
    this.bBufferGeometry.setAttribute("position", new $.BufferAttribute(this.bVertices, 3));

    const _mat = new $.LineBasicMaterial({
      color: 0xFFFFFF,
      linewidth: 1
    });

    const _instant = new $.LineSegments(this.bBufferGeometry, _mat);
    _instant.rotation.set(Math.PI, 0, 0);
    _instant.position.set(0, 0, this.gPlaneWidth);

    return _instant;
  }

  private configBPlane(): $.Mesh {
    const _instant = new $.Mesh(
      new $.PlaneGeometry(this.bPlaneWidth, this.bPlaneHeight, this.bNumberSegmentHorizontal, this.bNumberSegmentVertical),
      new $.MeshBasicMaterial({
        color: 0xEEEEEE,
        side: $.BackSide,
        transparent: true,
        opacity: 0.5
      })
    )
    _instant.rotation.set(Math.PI/2, 0, 0);
    _instant.position.set(this.bPlaneWidth/2, 0, this.bPlaneWidth/2);

    return _instant;
  }

  private configRAxis(): Line2 {
    const _numPoints = 2;

    const _points = [
      0, 0, 0,
      0, 0, this.rPlaneWidth
    ];

    const colors = [];

    for (let i = 0; i < _numPoints; i++) {
      const r = i / (_numPoints - 1) * 255;
      colors.push(r/255, 0, 0);
    }

    const _geo = new LineGeometry()
    _geo.setPositions(_points);
    _geo.setColors(colors);

    const _mat = new LineMaterial({
      color: 0xFC5C4E,
      linewidth: 0.2,
      vertexColors: true,
      dashed: false,
      alphaToCoverage: true,
      worldUnits: true,
      depthTest: false,
      depthWrite: false
    });

    const _instant = new Line2(_geo, _mat);
    _instant.computeLineDistances();
    _instant.scale.set(1, 1, 1);
    _instant.renderOrder = 999;

    return _instant;
  }

  private configGAxis(): Line2 {
    const _numPoints = 2;

    const _points = [
      0+this.gOffsetStartHorizontal, 0, this.gPlaneWidth-this.gOffsetStartHorizontal,
      0+this.rOffsetStartHorizontal+this.gPlaneWidth-this.gOffsetStartHorizontal, 0, this.gPlaneWidth-this.gOffsetStartHorizontal
    ];

    const colors = [];

    for (let i = 0; i < _numPoints; i++) {
      const r = i / (_numPoints - 1) * 255;
      colors.push(0, r/255, 0);
    }

    const _geo = new LineGeometry()
    _geo.setPositions(_points);
    _geo.setColors(colors);

    const _mat = new LineMaterial({
      color: 0x71C08E,
      linewidth: 0.2,
      vertexColors: true,
      dashed: false,
      alphaToCoverage: true,
      worldUnits: true,
      depthTest: false,
      depthWrite: false
    });

    const _instant = new Line2(_geo, _mat);
    _instant.computeLineDistances();
    _instant.scale.set(1, 1, 1);
    _instant.renderOrder = 999;

    return _instant;
  }

  private configBAxis(): Line2 {
    const _numPoints = 2;

    const _points = [
      0+this.rOffsetStartHorizontal+this.bPlaneWidth-this.bOffsetStartHorizontal, 0, this.bPlaneWidth-this.bOffsetStartHorizontal,
      0+this.rOffsetStartHorizontal+this.bPlaneWidth-this.bOffsetStartHorizontal, this.gPlaneHeight, this.bPlaneWidth-this.bOffsetStartHorizontal
    ];

    const colors = [];

    for (let i = 0; i < _numPoints; i++) {
      const r = i / (_numPoints - 1) * 255;
      colors.push(0, 0, r/255);
    }

    const _geo = new LineGeometry()
    _geo.setPositions(_points);
    _geo.setColors(colors);

    const _mat = new LineMaterial({
      color: 0x1C7BA1,
      linewidth: 0.2,
      vertexColors: true,
      dashed: false,
      alphaToCoverage: true,
      worldUnits: true,
      depthTest: false,
      depthWrite: false
    });

    const _instant = new Line2(_geo, _mat);
    _instant.computeLineDistances();
    _instant.scale.set(1, 1, 1);
    _instant.renderOrder = 999;

    return _instant;
  }

  private bindEvent() {}

  private update() {
    
  }
}
