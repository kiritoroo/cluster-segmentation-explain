import { ICustomEventMap } from "@type/types";

declare global {
  interface Document { 
    addEventListener<K extends keyof ICustomEventMap>(type: K,
      listener: (this: Document, ev: ICustomEventMap[K]) => void): void;
  }
}

export {};