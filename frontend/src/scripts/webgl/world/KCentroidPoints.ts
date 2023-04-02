import * as $ from "three";

export default class KCentroidPoints {
  private COLORS: Array<$.Color>;

  public group: $.Group;

  private pixelsPos: Array<$.Vector3>;
  private pointNumber: number;
  private pointsColor: Array<$.Color>;
  private pointGeometry: $.SphereGeometry;
  private pointMaterial: $.MeshBasicMaterial;
  private pointsMesh: $.InstancedMesh;
  private pointsPosition: Array<$.Vector3>;

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
      opacity: 0.5,
    });
    this.pointsMesh = new $.InstancedMesh(this.pointGeometry, this.pointMaterial, this.pointNumber);
    this.pointsPosition = this.initPosForgy();
    
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
  }

  public removeFromSpace() {
    this.group.remove(this.pointsMesh);
  }

  public changeNumberPoins() {}

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

    this.pointsMesh.instanceColor!.needsUpdate = true;
    this.pointsMesh.instanceMatrix!.needsUpdate = true;
  }
}
