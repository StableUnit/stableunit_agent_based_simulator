// @flow
import { Record } from 'immutable';

import type { RecordOf, RecordFactory } from 'immutable';
import type {Order} from './es6_simulation';
import { Simulation, Trader } from './es6_simulation';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type SimulationStateShape = {
  simulation: Simulation,
  status: string,
  tick: number
};

export type FullState = {
  player: SimulationStateShape
};

export type SimulationState = RecordOf<SimulationStateShape>;

const makeSimulationState: RecordFactory<SimulationStateShape> = Record({
  simulation: new Simulation(),
  status: '',
  tick: 0
});

const initialState = makeSimulationState();

let isInitialized = false;

export default {
  state: initialState,
  reducers: {
    updateSimulationState: (
      state: SimulationState,
      simulation: Simulation
    ): SimulationState => {
      return state
        .set('simulation', simulation)
        .update('tick', tick => tick + 1)
    },
    placeBuyOrder: (
      state: SimulationState,
      payload: {
        trader: Trader,
        su_amount: string,
        eth_amount: string
      }
    ) => {
      const status = state.simulation.market_SUETH.newLimitBuyOrder(
        payload.trader,
        Number(payload.su_amount),
        Number(payload.eth_amount)
      );
      return state.set('status', status);
    },

    placeSellOrder: (
      state: SimulationState,
      payload: {
        trader: Trader,
        su_amount: string,
        eth_amount: string
      }
    ) => {
      const status = state.simulation.market_SUETH.newLimitSellOrder(
        payload.trader,
        Number(payload.su_amount),
        Number(payload.eth_amount)
      );
      return state.set('status', status);
    },

    cancelBuyOrder: (state: SimulationState, order: Order): SimulationState => {
      state.simulation.market_SUETH.deleteLimitBuyOrder(order);
      return state;
    },
    cancelSellOrder: (state: SimulationState, order: Order): SimulationState => {
      state.simulation.market_SUETH.deleteLimitSellOrder(order);
      return state;
    }
  },

  effects: {
    async start(payload: any, rootState: FullState) {
      if (isInitialized) {
        return;
      }
      isInitialized = true;
      while (true) {
        rootState.player.simulation.update();
        this.updateSimulationState(rootState.player.simulation);
        await delay(1000);
      }
    }
  }
};
