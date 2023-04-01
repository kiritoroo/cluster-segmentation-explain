declare module 'three-bmfont-text' {
    import * as THREE from 'three';
  
    interface BMFontOptions {
      text?: string;
      font?: string;
      width?: number;
      align?: string;
      letterSpacing?: number;
      lineHeight?: number;
      mode?: string;
      flipY?: boolean;
      material?: THREE.Material;
    }
  
    class BMFontText extends THREE.Mesh {
      constructor(text: string, options: BMFontOptions);
    }
  
    export = BMFontText;
  }
  