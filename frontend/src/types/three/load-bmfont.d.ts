declare module 'load-bmfont' {
    function loadFont(fontFile: string, textureFile: string, callback: (err: Error | null, font: any) => void): void;
    export default loadFont;
  }
  