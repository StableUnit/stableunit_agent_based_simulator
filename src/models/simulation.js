//@flow

import { List, Record, OrderedMap } from 'immutable';
import type { RecordFactory } from 'immutable';
import { select } from '@rematch/select';
import { store } from '../index';
import { SimulationLoop } from './es6_simulation';
import nanoid from 'nanoid';

import type {
  FullState,
  SimulationState,
  SimulationStateShape
} from '../types';

import { startNewsCycle } from '../util/newsImpressionsCounter';
import { makeRandomTraders } from '../util/randomizers';
import {
  makeMarket,
  updateExchange,
  initializeMarket,
  placeBuyOrder,
  placeSellOrder
} from './exchange';
import {
  generateMediaItem,
  addNewsItem,
  updateMediaItemViews,
  getFearLevel,
  increaseFearLevel,
  decreaseFearLevel
} from './media';
import { makeStableSystem, updateStableSystem } from './stableSystem';
import { addTrader, updateTraders } from './traders';

// Configuration constants. ALL_CAPS
const TICK_INTERVAL = 1000;
const INITIAL_TIME_MULTIPLIER = TICK_INTERVAL * 60 * 5; // 1 second - 5 minutes

// This record is the core of our redux state
export const makeSimulationState: RecordFactory<SimulationStateShape> = Record({
  currentTime: Date.now(),
  timeMultiplier: INITIAL_TIME_MULTIPLIER,
  tick: 0,
  traders: makeRandomTraders(),
  markets: List([
    makeMarket({ name: 'SU-ETH' }),
    makeMarket({ name: 'ETH-USD' })
  ]),
  stableSystem: makeStableSystem(),
  mediaFeed: OrderedMap(),
  fearLevel: 50
});

const initialState = makeSimulationState();

export default {
  state: initialState,

  // Reducer are synchronous updater functions
  // They always receive the state as first argument and must return the state of the same type
  reducers: {
    updateTime: (state: SimulationState): SimulationState =>
      state.update(
        'currentTime',
        currentTime =>
          currentTime ? currentTime + state.timeMultiplier : Date.now()
      ),

    // Traders reducers
    addTrader,
    updateTraders,

    // Exchange reducers
    initializeMarket,
    updateExchange,
    placeBuyOrder,
    placeSellOrder,

    // Stable system reducers
    updateStableSystem,

    // Media impact reducers
    addNewsItem,
    updateMediaItemViews,
    increaseFearLevel,
    decreaseFearLevel,

    // Simple tick counter
    updateTick: (state: SimulationState): SimulationState =>
      state.update('tick', tick => tick + 1)
  },

  selectors: {
    getTick(state: SimulationState) {
      return state.tick;
    },
    getFearLevel
  },

  // Effects are asynchronous functions that can receieve and update state
  // Great for api calls or timed functions
  effects: {
    // The MAIN LOOP starts here:
    async start(payload: any, rootState: FullState) {
      const simulationLoop = new SimulationLoop();


      if (rootState.simulation.tick > 0) {
        return;
      }

      // Quckly create historical data so we don't start with empty state
      for (var i = 0; i < 60; i++) {
        this.updateTime();
        this.updateExchange();
        this.updateStableSystem();
        this.updateTick();

        // Spread roughly 4 news
        if (i % 20 === 0) {
          const impact = (i / 20) % 2 === 0 ? 1 : -1;
          const id = nanoid();
          this.addNewsItem(id, impact);
          this.startNewsCycle(id, impact);
        }
      }

      this.initializeMarket();

      // Main loop
      while (true) {
        simulationLoop.update();
        this.updateTime();
        this.updateExchange();
        this.updateStableSystem();

        // Update all traders
        this.updateTraders();
        this.updateTick();

        // Select full current state
        // console.log(store.getState());

        // Select partial state or derived data
        // console.log(select.simulation.getTick(store.getState()));

        // Wait before next tick
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    },

    startNewsCycle
  }
};
