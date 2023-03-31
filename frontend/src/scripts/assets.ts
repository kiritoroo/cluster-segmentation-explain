import { TAsset } from "@type/types";

const TEXTURE_URL = "./static/textures/";

export const assets: Array<TAsset> = [
  {
    name: "demo",
    type: "texture",
    path: TEXTURE_URL + "demo3.png",
  },
  {
    name: "disc_mark",
    type: "texture",
    path: TEXTURE_URL + "disc_mark.png",
  }
];
