//@flow

import type { FullState, TraderProps, SimulationState } from '../types';
import { makeTrader, makeSimulationState } from '../types';
import { List, Record } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

const TICK_INTERVAL = 1000;

const initialState = makeSimulationState();

export default {
  state: initialState,
  reducers: {
    increment: (state: SimulationState) => state.set('tick', state.tick + 1),
    addTrader: (state: SimulationState, data: TraderProps): SimulationState =>
      state.update('traders', traders => traders.push(makeTrader(data)))
  },
  effects: {
    // The main update loop starts here:
    async start(_: any, rootState: FullState) {
      if (rootState.simulation.tick > 0) {
        return;
      }
      while (true) {
        // Update exchange
        // Update stable system
        this.increment();
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    }
  }
};
