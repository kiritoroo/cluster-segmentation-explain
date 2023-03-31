import { EventEmitter } from 'events';

import Loader from './Loader';
import { TAsset } from '@type/types';

class Resources extends EventEmitter {

  public items: any;
  private loader: Loader;
  private queue: number;
  private loaded: number;

  constructor(private readonly assets: Array<TAsset>) {
    super();

    this.items = {};
    this.loader = new Loader();
    this.queue = assets.length;
    this.loaded = 0;

    this.preload()
      .then(() => {
        console.log(this.items);
        this.emit('e_resourcesReady');
      })
  }

  private async preload(): Promise<void> {
    for (const asset of this.assets) {
      if (asset.type === 'model') {
        await this.loader.LoaderModel(asset.path).then((result) => {
          this.save(asset, result);
        })
      } else if (asset.type === 'hdr') {
        await this.loader.loaderHdr(asset.path).then((result) => {
          this.save(asset, result);
        })
      } else if (asset.type === 'texture') {
        await this.loader.loaderTexture(asset.path).then((result) => {
          this.save(asset, result);
        })
      }
    }
  }

  private save(asset: TAsset, result: any): void {
    this.items[asset.name] = result;
    this.loaded++;
    if (this.loaded === this.queue) {
      return;
    }
  }
}

export default Resources;