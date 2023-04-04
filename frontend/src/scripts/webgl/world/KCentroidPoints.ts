import * as $ from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { randFloat } from "three/src/math/MathUtils";

export default class KCentroidPoints {
  private COLORS: Array<$.Color>;

  public group: $.Group;

  private pixelsPos: Array<$.Vector3>;
  public pointNumber: number;
  public pointsColor: Array<$.Color>;
  private pointGeometry: $.SphereGeometry;
  private pointMaterial: $.MeshBasicMaterial;
  private pointsMesh: $.InstancedMesh;
  public pointsPosition: Array<$.Vector3>;
  public pixelsChildPos: Array<Array<$.Vector3>>;

  private pointsLabelObj: Array<CSS2DObject>;

  constructor(numberCentroid: number, pixelsPos: Array<$.Vector3>, initMethod: 'random' | 'forgy' | 'plusplus') {
    this.pointNumber = numberCentroid;
    this.pixelsPos = pixelsPos;
    this.COLORS = [
      new $.Color(0xf5bbba),
      new $.Color(0xc3e6ae),
      new $.Color(0xf3e0a8),
      new $.Color(0x6c7ee2),
      new $.Color(0x78d2d3),
      new $.Color(0x97daaf),
      new $.Color(0xcce3ab),
      
      new $.Color(0xF68B7D),
      new $.Color(0xFDDE99),
      new $.Color(0xD0E6A9),
      new $.Color(0x90E3CF),
      new $.Color(0x403F56),
      new $.Color(0xC62828),
      new $.Color(0x7E4BAD),
      new $.Color(0x1C7BA1),
      new $.Color(0xBE6D93),
      new $.Color(0x41926C),
      new $.Color(0x742092),
      new $.Color(0xC858BA),
      new $.Color(0xED897F),
      new $.Color(0x5193B3),
    ];

    this.group = new $.Group();
    this.pointsColor = this.initColors();
    this.pointGeometry = new $.SphereGeometry(0.2, 32, 16);
    this.pointMaterial = new $.MeshBasicMaterial({
      color: new $.Color(0xffffff),
      side: $.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.pointsMesh = new $.InstancedMesh(this.pointGeometry, this.pointMaterial, this.pointNumber);

    if (initMethod == "plusplus") {
      this.pointsPosition = this.initPosPlusPlus();
    } else if (initMethod == "forgy") {
      this.pointsPosition = this.initPosForgy();
    } else {
      this.pointsPosition = this.initPosRandom();
    }
    
    this.pointsLabelObj = this.initLabelsObj();
    this.pixelsChildPos = this.initPixelsChildPos();

    this.init();
  }

  private init() {
    this.configData();
  }

  public reCreateCentroid(centroidNumber: number, initMethod: 'random' | 'forgy' | 'plusplus') {
    this.removeFromSpace();

    this.pointNumber = centroidNumber;
    this.pointsColor = this.initColors();
    if (initMethod == "plusplus") {
      this.pointsPosition = this.initPosPlusPlus();
    } else if (initMethod == "forgy") {
      this.pointsPosition = this.initPosForgy();
    } else {
      this.pointsPosition = this.initPosRandom();
    }
    this.pointsLabelObj = this.initLabelsObj();
    this.pixelsChildPos = this.initPixelsChildPos();
    this.pointsMesh = new $.InstancedMesh(this.pointGeometry, this.pointMaterial, this.pointNumber);
    this.configData();
  }

  public createUICluster(): string {
    let _content = "";
    this.pointsColor.forEach((_color: $.Color, _index) => {
      _content += `
      <div>
        Cluster ${_index}
        <span class="ms-5 px-5" style="background-color: #${_color.getHexString()}"></span>
      </div>
      `
    })

    return _content;
  }

  public initPosRandom(): Array<$.Vector3> {
    const _minPosX = 0;
    const _minPosY = 0;
    const _minPosZ = 0;
    const _maxPosX = 25;
    const _maxPosY = 18;
    const _maxPosZ = 25;
    const _instant = [];

    for (let i = 0; i < this.pointNumber; i++) {
      _instant.push(new $.Vector3(
        Math.floor(Math.random() * (_maxPosX - _minPosX + 1)) + _minPosX,
        Math.floor(Math.random() * (_maxPosY - _minPosY + 1)) + _minPosY,
        Math.floor(Math.random() * (_maxPosZ - _minPosZ + 1)) + _minPosZ
      ))
    }

    return _instant;
  }

  public initPosForgy() {
    const _instant = Math.randSample(this.pixelsPos, this.pointNumber);
    return _instant;
  }

  public initPosPlusPlus() {
    const getDistance = (pointA: $.Vector3, pointB: $.Vector3): number => {
      return pointA.distanceTo(pointB);
    }

    const getNearestCentroidPos= (pointPos:  $.Vector3): $.Vector3 => {
      let _nearestCentroid = _centroids[0];
      let _minDistance = getDistance(pointPos, _nearestCentroid);

      for (const centroid of _centroids.slice(1)) {
        const _distance = getDistance(pointPos, centroid);
        if (_distance < _minDistance) {
          _nearestCentroid = centroid;
          _minDistance = _distance;
        }
      }
      return _nearestCentroid;
    }

    const _centroids: $.Vector3[] = [];
    _centroids.push(this.pixelsPos[Math.floor(Math.random() * this.pixelsPos.length)])

    while (_centroids.length < this.pointNumber) {
      const _distances: number[] = [];
      let _totalDistance = 0;
      let _maxPointPos: $.Vector3 = this.pixelsPos[0];
      let _maxDistance: number = getDistance(_maxPointPos, getNearestCentroidPos(_maxPointPos));

      for (const pointPos of this.pixelsPos) {
        const _nearestCentroid= getNearestCentroidPos(pointPos);
        const _distance = getDistance(pointPos, _nearestCentroid);
        _distances.push(_distance);
        _totalDistance += _distance;

        if (_distance > _maxDistance) {
          _maxDistance = _distance;
          _maxPointPos = pointPos;
        }
      }

      _centroids.push(_maxPointPos);

      // let _randValue = Math.random() * _totalDistance;

      // for (let i = 0; i < _distances.length; i++) {
      //   _randValue -= _distances[i];
      //   if (_randValue < 0) {
      //     _centroids.push(this.pixelsPos[i])
      //     break;
      //   }
      // }
    }

    return _centroids;
  }

  public addToSpace() {
    this.group.add(this.pointsMesh);
    this.group.add(...this.pointsLabelObj);
  }

  public removeFromSpace() {
    this.group.remove(this.pointsMesh);
    this.group.remove(...this.pointsLabelObj);
  }

  public changeNumberPoins() {}

  public setCentroidPos(pos: $.Vector3, centroidIndex: number) {
    this.pointsPosition[centroidIndex] = pos;

    const _matrix = new $.Matrix4();
    _matrix.setPosition(pos.x, pos.y, pos.z);
    this.pointsMesh.setMatrixAt(centroidIndex, _matrix);
    this.pointsMesh.instanceMatrix!.needsUpdate = true;

    this.pointsLabelObj[centroidIndex].position.set(pos.x, pos.y, pos.z);
  }

  private initColors(): Array<$.Color> {
    const _instant = Math.randSample(this.COLORS, this.pointNumber);
    return _instant;
  }

  private configData() {
    const _matrix = new $.Matrix4();
    const _color = new $.Color();

    for (let i = 0; i < this.pointNumber; i++) {
      _matrix.setPosition(
        this.pointsPosition[i].x,
        this.pointsPosition[i].y,
        this.pointsPosition[i].z
      )
      _color.setRGB(
        this.pointsColor[i].r,
        this.pointsColor[i].g,
        this.pointsColor[i].b
      )
      this.pointsMesh.setMatrixAt(i, _matrix);
      this.pointsMesh.setColorAt(i, _color);    
    }

    this.pointsMesh.instanceMatrix!.needsUpdate = true;
    this.pointsMesh.instanceColor!.needsUpdate = true;
  }

  private initLabelsObj() {
    const _instant = [];
    for (let i = 0; i < this.pointNumber; i++) {
      const _label = document.createElement('div');
      const _point = document.createElement('div');
      const _hint = document.createElement('div');
      const _content = document.createElement('div');
  
      _point.className = 'point';
      _point.style.borderColor = "#" + this.pointsColor[i].getHexString();
      _hint.className = 'hint';
      _label.className = 'label';
      _content.className = 'content';
  
      _hint.textContent = `Cluster ${i}`;
      _content.innerHTML = `
        <div class="w-max flex flex-col items-center justify-center">
          <div class="text-xs text-gray-900 dark:text-white">
            Cluster ${i}
          </div>
        </div>
      `
      _content.style.opacity = "0";
  
      _label.appendChild(_point);
      _label.appendChild(_hint);
      _label.appendChild(_content);
  
      const _cssObj = new CSS2DObject(_label);
      _cssObj.position.set(
        this.pointsPosition[i].x,
        this.pointsPosition[i].y,
        this.pointsPosition[i].z
      )
      _instant.push(_cssObj);
    }

    return _instant;
  }

  public initPixelsChildPos() {
    const _instant = []
    for (let i = 0; i < this.pointNumber; i++) {
      _instant.push([]);
    }

    return _instant;
  }
}
