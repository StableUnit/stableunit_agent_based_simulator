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
  Portfolio,
} from '../types';
import type { RecordFactory, RecordOf } from 'immutable';

const TICK_INTERVAL = 1000;

const initialState = makeSimulationState();

export default {
  state: initialState,
  reducers: {
    addTrader: (state: SimulationState, data: TraderProps): SimulationState =>
      state.update('traders', traders => traders.push(makeTrader(data))),
    updateTraders: (state: SimulationState): SimulationState =>
      state.update('traders', (traders: ListOfTraders) =>
        traders.map((trader: Trader) =>
          trader.updateTrader(trader, state.exchange)
        )
      )
  },
  effects: {
    // The main update loop starts here:
    async start(payload: any, rootState: FullState) {
      if (rootState.simulation.tick > 0) {
        return;
      }
      while (true) {
        // TODO: Update exchange
        // TODO: Update stable system

        // Update all traders
        this.updateTraders();

        // Wait before next tick
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    }
  }
};
