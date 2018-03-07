//@flow

import { List, Record, Map } from 'immutable';

import { makeTrader, makeSimulationState } from '../types';

import type {
  FullState,
  TraderProps,
  SimulationState,
  SimulationStateProps,
  ListOfTraders,
  Trader,
} from '../types';
import type { RecordFactory, RecordOf } from 'immutable';

const TICK_INTERVAL = 1000;

const initialState = makeSimulationState();

export default {
  state: initialState,
  reducers: {
    generateTraders: (state: SimulationState) => {
      // Create 10 traders with empty portfolios
      const newTraders = List(Array(10).fill()).map((entry, index) => makeTrader({ name: `Trader ${index}`, portfolio: new Map() }))
      return state.set('traders', newTraders);
    },
    addTrader: (state: SimulationState, data: TraderProps): SimulationState =>
      state.update('traders', traders => traders.push(makeTrader(data))),
    updateTraders: (state: SimulationState): SimulationState =>
      state.update('traders', (traders: ListOfTraders) =>
        traders.map((trader: Trader) => trader.updateTrader(trader))
      )
  },
  effects: {
    // The main update loop starts here:
    async start(_: any, rootState: FullState) {
      if (rootState.simulation.tick > 0) {
        return;
      }
      this.generateTraders();
      while (true) {
        // Update exchange
        // Update stable system
        // Update all traders
        this.updateTraders();
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    }
  }
};
