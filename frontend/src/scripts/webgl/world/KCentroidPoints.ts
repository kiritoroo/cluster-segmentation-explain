import * as $ from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

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

  constructor(pixelsPos: Array<$.Vector3>) {
    this.pixelsPos = pixelsPos;
    this.COLORS = [
      new $.Color(0xf5bbba),
      new $.Color(0xc3e6ae),
      new $.Color(0xf3e0a8),
      new $.Color(0x6c7ee2),
      new $.Color(0x78d2d3),
      new $.Color(0x97daaf),
      new $.Color(0xcce3ab),
    ];

    this.group = new $.Group();
    this.pointNumber = 3;
    this.pointsColor = this.initColors();
    this.pointGeometry = new $.SphereGeometry(0.5, 32, 16);
    this.pointMaterial = new $.MeshBasicMaterial({
      color: new $.Color(0xffffff),
      side: $.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.pointsMesh = new $.InstancedMesh(this.pointGeometry, this.pointMaterial, this.pointNumber);
    this.pointsPosition = this.initPosForgy();
    this.pointsLabelObj = this.initLabelsObj();
    this.pixelsChildPos = this.initPixelsChildPos();

    this.init();
  }

  private init() {
    this.configData();
    this.addToSpace();
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

  public initPosPlus() {}

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
