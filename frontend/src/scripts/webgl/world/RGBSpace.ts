import * as $ from "three";
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import ThreeMeshUI from 'three-mesh-ui';

import FontJson from '@asset/fonts/poppins/poppins-medium.json';
import FontImage from '@asset/fonts/poppins/poppins-medium.png';

import RGBPoints from "@world/RGBPoints";
import KCentroidPoints from "@world/KCentroidPoints";

export default class RGBSpace {
  public rgbPoints: RGBPoints;
  public kCentroidPoints: KCentroidPoints;

  public group: $.Group;

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

  private meshUIRAxis: ThreeMeshUI.Block;
  private meshUIGAxis: ThreeMeshUI.Block;
  private meshUIBAxis: ThreeMeshUI.Block;

  private labelRGridPoints: Array<THREE.Vector3>;
  private labelGGridPoints: Array<THREE.Vector3>;
  private labelBGridPoints: Array<THREE.Vector3>;

  private kmeanCanvas: HTMLCanvasElement;

  private kmeanTimeout: Array<number>;
  private kmeanSpeed: number;

  constructor() {
    this.rgbPoints = new RGBPoints();
    this.kCentroidPoints = new KCentroidPoints(3, this.rgbPoints.img3d_positions_v3);

    this.group = new $.Group();

    this.labelRGridPoints = [];
    this.labelGGridPoints = [];
    this.labelBGridPoints = [];

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

    this.meshUIRAxis = this.configMeshUIRAxis();
    this.meshUIGAxis = this.configMeshUIGAxis();
    this.meshUIBAxis = this.configMeshUIBAxis();

    this.kmeanCanvas = document.getElementById('kmean-canvas') as HTMLCanvasElement;

    this.kmeanSpeed = 0.5;
    this.kmeanTimeout = [];

    this.init();
    this.bindEvent();
  }

  private init() {
    this.rGroup.add(this.rSegments, this.rPlane, this.rAxis, this.meshUIRAxis);
    this.gGroup.add(this.gSegments, this.gPlane, this.gAxis, this.meshUIGAxis);
    this.bGroup.add(this.bSegments, this.bPlane, this.bAxis, this.meshUIBAxis);

    this.group.add(this.rgbPoints.group);
    this.group.add(this.kCentroidPoints.group);

    this.group.add(this.rGroup, this.gGroup, this.bGroup);
    this.group.position.set(-this.rPlaneWidth/2, 0, -this.rPlaneWidth/2);

    this.configLabelRGridPoints();
    this.configLabelGGridPoints();
    this.configLabelBGridPoints();
  }

  public kMeans() {
    const _colors = new Array(this.rgbPoints.img_height * this.rgbPoints.img_width * 3).fill(245/255);
    for (let p = 0; p < this.rgbPoints.pixel_count; p++) {
      this.kmeanTimeout.push(setTimeout(() => {
        let _minDistance = 99999;
        let _closestCentroidIndex = 0;

        for (let k = 0; k < this.kCentroidPoints.pointNumber; k++) {
            const _distance = this.rgbPoints.img3d_positions_v3[p].distanceTo(this.kCentroidPoints.pointsPosition[k]);
            if (_distance < _minDistance) {
              _minDistance = _distance;
              _closestCentroidIndex = k;
            }
        }

        this.kCentroidPoints.pixelsChildPos[_closestCentroidIndex].push(this.rgbPoints.img3d_positions_v3[p])

        _colors[p * 3] = this.kCentroidPoints.pointsColor[_closestCentroidIndex].r;
        _colors[p * 3 + 1] = this.kCentroidPoints.pointsColor[_closestCentroidIndex].g;
        _colors[p * 3 + 2] = this.kCentroidPoints.pointsColor[_closestCentroidIndex].b;
      
        this.rgbPoints.img3d_geo.setAttribute('color', new $.Float32BufferAttribute(_colors, 3));
        this.rgbPoints.img3d_geo.attributes.color.needsUpdate = true;

        const _centroidNewPos: $.Vector3 = this.kCentroidPoints.pixelsChildPos[_closestCentroidIndex]
          .reduce((acc, cur) => acc.add(cur), new $.Vector3())
          .divideScalar(this.kCentroidPoints.pixelsChildPos[_closestCentroidIndex].length);

        this.kCentroidPoints.setCentroidPos(_centroidNewPos, _closestCentroidIndex);
      }, p*this.kmeanSpeed));
    }
    this.draw2Canvas(_colors, this.kmeanCanvas);
  }

  public kMeansLoop(_maxIteration: number) {
    let _iteration = 0;
    let _hasChanged = true;
    let _timeoutPromies: Array<Promise<void>> = [];

    for (; _iteration < _maxIteration; _iteration++) {
      this.kmeanTimeout.push(setTimeout(async () => {
        _hasChanged = false;
        this.kCentroidPoints.initPixelsChildPos();
        const _colors = new Array(this.rgbPoints.img_height * this.rgbPoints.img_width * 3).fill(245/255);
        _timeoutPromies = [];
  
        for (let p = 0; p < this.rgbPoints.pixel_count; p++) {
          _timeoutPromies.push(new Promise<void>((resolve, reject) => {
            this.kmeanTimeout.push(setTimeout(() => {
              let _minDistance = 99999;
              let _closestCentroidIndex = 0;
      
              for (let k = 0; k < this.kCentroidPoints.pointNumber; k++) {
                // this.kmeanTimeout.push(setTimeout(() => {
                  const _distance = this.rgbPoints.img3d_positions_v3[p].distanceTo(this.kCentroidPoints.pointsPosition[k]);
                  if (_distance < _minDistance) {
                    _minDistance = _distance;
                    _closestCentroidIndex = k;
                  }
                // }, 1));
              }
      
              this.kCentroidPoints.pixelsChildPos[_closestCentroidIndex].push(this.rgbPoints.img3d_positions_v3[p])
      
              _colors[p * 3] = this.kCentroidPoints.pointsColor[_closestCentroidIndex].r;
              _colors[p * 3 + 1] = this.kCentroidPoints.pointsColor[_closestCentroidIndex].g;
              _colors[p * 3 + 2] = this.kCentroidPoints.pointsColor[_closestCentroidIndex].b;
            
              this.rgbPoints.img3d_geo.setAttribute('color', new $.Float32BufferAttribute(_colors, 3));
              this.rgbPoints.img3d_geo.attributes.color.needsUpdate = true;
  
              // const _centroidNewPos: $.Vector3 = this.kCentroidPoints.pixelsChildPos[_closestCentroidIndex]
              //   .reduce((acc, cur) => acc.add(cur), new $.Vector3())
              //   .divideScalar(this.kCentroidPoints.pixelsChildPos[_closestCentroidIndex].length);
      
              // this.kCentroidPoints.setCentroidPos(_centroidNewPos, _closestCentroidIndex);
              resolve();
            }, p*this.kmeanSpeed));
          }))
        }

        await Promise.all(_timeoutPromies).then(() => {
          for (let k = 0; k < this.kCentroidPoints.pointNumber; k++) {
            // this.kmeanTimeout.push(setTimeout(() => {
              const _centroidNewPos: $.Vector3 = this.kCentroidPoints.pixelsChildPos[k]
                .reduce((acc, cur) => acc.add(cur), new $.Vector3())
                .divideScalar(this.kCentroidPoints.pixelsChildPos[k].length);

              if (_centroidNewPos.equals(this.kCentroidPoints.pointsPosition[k])) {
                _hasChanged = false;
              } else {
                this.kCentroidPoints.setCentroidPos(_centroidNewPos, k);
                _hasChanged = true;
              }
            // }, 1));
          }
          this.draw2Canvas(_colors, this.kmeanCanvas)
          if (!_hasChanged) return;
        });
        
      }, _iteration * this.rgbPoints.pixel_count * this.kmeanSpeed * 1.15));
    }
    console.log("done")
  }

  public draw2Canvas(matrix: Array<number>, canvas: HTMLCanvasElement) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.translate(canvas.width, 0);
    // ctx.scale(-1, 1);
  
    const cellSize = Math.min(canvas.width / this.rgbPoints.img_width, canvas.height / this.rgbPoints.img_height);
  
    for (let i = 0; i < matrix.length; i += 3) {
        const r = matrix[i] * 255;
        const g = matrix[i + 1] * 255;  
        const b = matrix[i + 2] * 255;

        const x = i / 3 % this.rgbPoints.img_width;
        const y = Math.floor(i / 3 / this.rgbPoints.img_width);

        const color = `rgb(${r},${g},${b})`;
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
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
        side: $.FrontSide,
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
      const _s = new $.Vector3(0, i*this.gOffsetSegmentVertical+this.gOffsetStartVertical, 0);
      const _e = new $.Vector3(this.gPlaneWidth, i*this.gOffsetSegmentVertical+this.gOffsetStartVertical, 0);

      _vertices.push(_s.x, _s.y, _s.z);
      _vertices.push(_e.x, _e.y, _e.z);

      this.labelBGridPoints.push(_e);
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
        side: $.BackSide,
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
      const _s = new $.Vector3(i*this.bOffsetSegmentHorizontal+this.bOffsetStartHorizontal, 0, 0);
      const _e = new $.Vector3(i*this.bOffsetSegmentHorizontal+this.bOffsetStartHorizontal, 0, this.bPlaneHeight);

      _vertices.push(_s.x, _s.y, _s.z);
      _vertices.push(_e.x, _e.y, _e.z);

      this.labelGGridPoints.push(_e);
    }


    for (let i = 0; i < this.bNumberSegmentVertical; i++) {
      const _s = new $.Vector3(0, 0, i*this.bOffsetSegmentVertical+this.bOffsetStartVertical);
      const _e = new $.Vector3(this.bPlaneWidth, 0, i*this.bOffsetSegmentVertical+this.bOffsetStartVertical);
      
      _vertices.push(_s.x, _s.y, _s.z);
      _vertices.push(_e.x, _e.y, _e.z);

      this.labelRGridPoints.push(_s);
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
      0+this.rOffsetStartHorizontal, 0, 0,
      0+this.rOffsetStartHorizontal, 0, this.rPlaneWidth-this.rOffsetStartHorizontal
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

  private configMeshUIRAxis(): ThreeMeshUI.Block {
    const _instant = new ThreeMeshUI.Block({
      width: 20,
      height: 2,
      padding: 0.2,
      fontFamily: FontJson,
      fontTexture: FontImage,
      fontColor: new $.Color(0x535353),
      backgroundOpacity: 0
    })

    const _text = new ThreeMeshUI.Text({
      content: "X Axis (Red Channel)",
      fontSize: 1
    })

    _instant.add(_text);

    _instant.quaternion.setFromEuler(new $.Euler(
      -Math.PI / 2, -0.25, 0
    ));
    _instant.rotation.z = -Math.PI/2;
    _instant.position.set(-2.25, -0.25, this.rPlaneWidth/2);

    return _instant;
  }

  private configMeshUIGAxis(): ThreeMeshUI.Block {
    const _instant = new ThreeMeshUI.Block({
      width: 20,
      height: 2,
      padding: 0.2,
      fontFamily: FontJson,
      fontTexture: FontImage,
      fontColor: new $.Color(0x535353),
      backgroundOpacity: 0
    })

    const _text = new ThreeMeshUI.Text({
      content: "Y Axis (Green Channel)",
      fontSize: 1
    })

    _instant.add(_text);

    _instant.quaternion.setFromEuler(new $.Euler(
      -Math.PI/2.25, 0, 0
    ));
    _instant.position.set(this.gPlaneWidth/2, 0, this.gPlaneWidth + 2.25);

    return _instant;
  }

  private configMeshUIBAxis(): ThreeMeshUI.Block {
    const _instant = new ThreeMeshUI.Block({
      width: 20,
      height: 2,
      padding: 0.2,
      fontFamily: FontJson,
      fontTexture: FontImage,
      fontColor: new $.Color(0x535353),
      backgroundOpacity: 0
    })

    const _text = new ThreeMeshUI.Text({
      content: "Z Axis (Blue Channel)",
      fontSize: 1
    })

    _instant.add(_text);

    _instant.quaternion.setFromEuler(new $.Euler(
      0, -Math.PI/2.25, Math.PI/2
    ));
    _instant.position.set(this.gPlaneWidth, this.rPlaneHeight/2, this.gPlaneWidth + 2.25);

    return _instant;
  }

  private configLabelRGridPoints() {
    const _gridValue = [0, 50, 100, 150, 200, 250];
    for (let i = 1; i < this.labelRGridPoints.length; i++) {
      const _content = document.createElement('div');
      _content.className = 'content';
      _content.innerHTML = `${_gridValue[i]}`;
      _content.style.opacity = "1";
      const _rect = _content.getBoundingClientRect();
      _content.style.marginLeft = -_rect.width/2 + 'px';
      _content.style.marginTop = -_rect.height - 20 + 'px';
      
      const _divContainer = document.createElement('div');
      _divContainer.className = 'grid-label';
      _divContainer.appendChild(_content);

      const _cssObj = new CSS2DObject(_divContainer);
      _cssObj.position.set(
        this.labelRGridPoints[i].x,
        this.labelRGridPoints[i].y,
        this.labelRGridPoints[i].z
      );

      this.rGroup.add(_cssObj);  
    }
  }

  private configLabelGGridPoints() {
    const _gridValue = [0, 50, 100, 150, 200, 250];
    for (let i = 1; i < this.labelGGridPoints.length; i++) {
      const _content = document.createElement('div');
      _content.className = 'content';
      _content.innerHTML = `${_gridValue[i]}`;
      _content.style.opacity = "1";
      const _rect = _content.getBoundingClientRect();
      _content.style.marginLeft = -_rect.width/2 + 'px';
      _content.style.marginTop = -_rect.height - 20 + 'px';
      
      const _divContainer = document.createElement('div');
      _divContainer.className = 'grid-label';
      _divContainer.appendChild(_content);

      const _cssObj = new CSS2DObject(_divContainer);
      _cssObj.position.set(
        this.labelGGridPoints[i].x,
        this.labelGGridPoints[i].y,
        this.labelGGridPoints[i].z + 0.8
      );

      this.gGroup.add(_cssObj);  
    }
  }

  private configLabelBGridPoints() {
    const _gridValue = [0, 30, 60, 90, 120, 150, 180, 210];
    for (let i = 1; i < this.labelBGridPoints.length; i++) {
      const _content = document.createElement('div');
      _content.className = 'content';
      _content.innerHTML = `${_gridValue[i]}`;
      _content.style.opacity = "1";
      const _rect = _content.getBoundingClientRect();
      _content.style.marginLeft = -_rect.width/2 + 'px';
      _content.style.marginTop = -_rect.height - 20 + 'px';
      
      const _divContainer = document.createElement('div');
      _divContainer.className = 'grid-label';
      _divContainer.appendChild(_content);

      const _cssObj = new CSS2DObject(_divContainer);
      _cssObj.position.set(
        this.labelBGridPoints[i].x,
        this.labelBGridPoints[i].y,
        this.labelBGridPoints[i].z + + this.gPlaneWidth + 0.8
      );

      this.bGroup.add(_cssObj);  
    }
  }

  private bindEvent() {

  }

  public update() {
    ThreeMeshUI.update();
  }
}
