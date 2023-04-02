declare interface Math {
  clamp(value: number, min: number, max: number): number;
  lerp(start: number, end: number, amt: number): number;
  median(arr: Array<number>): number;
  mularr(arr1: Array<number>, arr2: Array<number>): Array<number>;
  minMaxScale(value: number, min: number, max: number, new_min: number, new_max: number): number;
  randSample(list: Array<any>, count: number);
}