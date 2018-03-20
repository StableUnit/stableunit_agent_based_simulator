//@flow

import { List, Record, OrderedMap } from 'immutable';
import type { RecordFactory } from 'immutable';

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
import { generateMediaItem, spreadNews, updateMediaItemViews } from './media';
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
  mediaFeed: OrderedMap({
    '1': generateMediaItem('1', 1),
    '2': generateMediaItem('2', -1),
    '3': generateMediaItem('3', 1),
    '4': generateMediaItem('4', -1)
  })
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
    spreadNews,
    updateMediaItemViews
  },

  // Effects are asynchronous functions that can receieve and update state
  // Great for api calls or timed functions
  effects: {
    // The main update loop starts here:
    async start(payload: any, rootState: FullState) {
      if (rootState.simulation.tick > 0) {
        return;
      }
      for (var i = 0; i < 60; i++) {
        this.updateTime();
        this.updateExchange();
        this.updateStableSystem();
      }

      this.initializeMarket();

      while (true) {
        this.updateTime();
        this.updateExchange();
        this.updateStableSystem();

        // Update all traders
        this.updateTraders();

        // Wait before next tick
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    },

    startNewsCycle
  }
};
