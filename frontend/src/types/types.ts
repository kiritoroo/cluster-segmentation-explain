export type TAsset = {
  name: string,
  type: 'model' | 'texture' | 'hdr',
  path: string
}

export interface ICustomEventMap {
  "eResize": CustomEvent;
  "eUpdate": CustomEvent;
}