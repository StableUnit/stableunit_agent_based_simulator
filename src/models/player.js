// @flow
import { Record } from 'immutable';

import type { RecordOf, RecordFactory } from 'immutable';
import type { Order } from './es6_simulation';
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
        .update('tick', tick => tick + 1);
    },
    placeLimitBuyOrder: (
      state: SimulationState,
      payload: {
        trader: Trader,
        price: string,
        quantity: string
      }
    ) => {
      const status = state.simulation.market_SUETH.newLimitBuyOrder(
        payload.trader,
        Number(payload.quantity),
        Number(payload.price) * Number(payload.quantity)
      );
      return state.set('status', status);
    },

    placeLimitSellOrder: (
      state: SimulationState,
      payload: {
        trader: Trader,
        price: string,
        quantity: string
      }
    ) => {
      const status = state.simulation.market_SUETH.newLimitSellOrder(
        payload.trader,
        Number(payload.quantity),
        Number(payload.price) * Number(payload.quantity)
      );
      return state.set('status', status);
    },

    placeMarketBuyOrder: (
      state: SimulationState,
      payload: {
        trader: Trader,
        quantity: string
      }
    ) => {
      const status = state.simulation.market_SUETH.buyMarketOrder(
        payload.trader,
        Number(payload.quantity)
      );
      return state.set('status', status);
    },

    placeMarketSellOrder: (
      state: SimulationState,
      payload: {
        trader: Trader,
        quantity: string
      }
    ) => {
      const status = state.simulation.market_SUETH.newMarketSellOrder(
        payload.trader,
        Number(payload.quantity)
      );
      return state.set('status', status);
    },

    cancelBuyOrder: (state: SimulationState, order: Order): SimulationState => {
      state.simulation.market_SUETH.deleteLimitBuyOrder(order);
      return state;
    },
    cancelSellOrder: (
      state: SimulationState,
      order: Order
    ): SimulationState => {
      state.simulation.market_SUETH.deleteLimitSellOrder(order);
      return state;
    },

    cancelOrder: (state: SimulationState, order: Order):
      SimulationState => {
      state.simulation.market_SUETH.cancelOrder(order);
      return state;
    },

    updateStableUnitDeltas: (
      state: SimulationState,
      payload: { d1: string, d2: string, d3: string, d4: string, d5: string }
    ): SimulationState => {
      const su = state.simulation.web4.su;
      su.D1 = Number(payload.d1);
      su.D2 = Number(payload.d2);
      su.D3 = Number(payload.d3);
      su.D4 = Number(payload.d4);
      su.D5 = Number(payload.d5);
      return state;
    }
  },

  effects: {
    async start(payload: any, rootState: FullState) {
      if (isInitialized) {
        return;
      }
      isInitialized = true;

      // Making simulation global to be able to watch
      // TODO: Remove later
      window.simulation = rootState.player.simulation;

      while (true) {
        rootState.player.simulation.update();
        this.updateSimulationState(rootState.player.simulation);
        await delay(100);
      }
    }
  }
};
