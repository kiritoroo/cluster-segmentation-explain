import * as $ from 'three';

export const getImageTexture = (image: any, scale:number=1): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  ctx?.drawImage(image, 0, 0, canvas.width, canvas.height)
  return ctx?.getImageData(0, 0, canvas.width, canvas.height)!;
}

export const rgb2Gray = (r: number, g: number, b: number): number => {
  const gray_value = 0.2989 * r + 0.5870 * g + 0.1140 * b;
  return Math.floor(gray_value);
}