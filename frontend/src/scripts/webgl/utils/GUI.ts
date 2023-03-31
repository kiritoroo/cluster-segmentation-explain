import { Pane } from "tweakpane";
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

import Experience from "@core/Experience";

export default class GUI extends Pane {
  private experience: Experience;

  constructor() {
    super();
    this.registerPlugin(EssentialsPlugin);
    this.experience = new Experience();
    this.init();
  }

  private init() {
    const PARAMS = {
      time: ''
    }

    const updateTime = () => {
      const matches = String(new Date()).match(/\d{2}:\d{2}:\d{2}/);
      PARAMS.time = (matches && matches[0]) ?? '';
    };

    window.setInterval(updateTime, 1000);
    updateTime();

    this.addMonitor(PARAMS, 'time', {
      label: 'Time',
      interval: 1000
    })
  }
}