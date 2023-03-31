declare module 'three.meshline' {
    import * as THREE from 'three';
  
    export interface MeshLineProps {
      lineWidth?: number;
      sizeAttenuation?: number;
      color?: THREE.Color | THREE.Color[];
      opacity?: number;
      resolution?: THREE.Vector2;
      dashArray?: number;
      dashOffset?: number;
      dashRatio?: number;
      useMap?: number;
      texture?: THREE.Texture;
      depthTest?: boolean;
      blending?: THREE.Blending;
      transparent?: boolean;
      side?: THREE.Side;
      near?: number;
      far?: number;
    }
  
    export class MeshLine extends THREE.BufferGeometry {
      constructor();
  
      setGeometry(geometry: THREE.BufferGeometry, widths?: number[]): void;
      setPoints(points: THREE.Vector3[]): void;
      setWidth(widths: number[]): void;
      setGeometrySize(widths: number[]): void;
      setColor(color: THREE.Color | THREE.Color[]): void;
      setOpacity(opacity: number): void;
      setResolution(resolution: THREE.Vector2): void;
      setDashArray(dashArray: number): void;
      setDashOffset(dashOffset: number): void;
      setDashRatio(dashRatio: number): void;
      setUseMap(useMap: number): void;
      setTexture(texture: THREE.Texture): void;
      setDepthTest(depthTest: boolean): void;
      setBlending(blending: THREE.Blending): void;
      setTransparent(transparent: boolean): void;
      setSide(side: THREE.Side): void;
      setNear(near: number): void;
      setFar(far: number): void;
  
      static geometryCacheSize: number;
      static maxLineVertices: number;
      static lineGeometryCache: Map<string, THREE.BufferGeometry>;
  
      static generateGeometry(
        points: THREE.Vector3[],
        widths?: number[],
        options?: MeshLineProps
      ): THREE.BufferGeometry;
  
      static geometryToAttributes(geometry: THREE.BufferGeometry): {
        position: THREE.Float32BufferAttribute;
        previous: THREE.Float32BufferAttribute;
        next: THREE.Float32BufferAttribute;
        side: THREE.Float32BufferAttribute;
        uv: THREE.Float32BufferAttribute;
        width: THREE.Float32BufferAttribute;
      };
    }
  
    export class MeshLineMaterial extends THREE.ShaderMaterial {
      constructor(options?: MeshLineProps);
  
      uniforms: {
        lineWidth: { value: number };
        sizeAttenuation: { value: number };
        color: { value: THREE.Color | THREE.Color[] };
        opacity: { value: number };
        resolution: { value: THREE.Vector2 };
        dashArray: { value: number };
        dashOffset: { value: number };
        dashRatio: { value: number };
        useMap: { value: number };
        texture: { value: THREE.Texture };
        depthTest: { value: boolean };
      };
    }
  }
  