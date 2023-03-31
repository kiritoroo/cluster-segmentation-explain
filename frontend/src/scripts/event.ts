import { ICustomEventMap } from "@type/types";

export const emitEvent = <K extends keyof ICustomEventMap>(eventType: K): void => {
  document.dispatchEvent(new CustomEvent(eventType));
}