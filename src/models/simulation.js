//@flow

import { SimulationState, FullState } from '../types';

const TICK_INTERVAL = 1000;


const initialState:SimulationState = {
  tick: 0,
}

export default {
  state: initialState,
  reducers: {
    increment: (state: SimulationState) => ({ tick: state.tick + 1 })
  },
  effects: {
    // The main update loop starts here:
    async start(_: any, rootState: FullState) {
      if (rootState.simulation.tick > 0) { return; }
      while (true) {
        this.increment();
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    }
  }
};
