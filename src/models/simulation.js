//@flow

import { List, Record, Map } from 'immutable';
import type { RecordFactory } from 'immutable';

import type {
  FullState,
  SimulationState,
  SimulationStateShape,
  TraderShape,
  Trader,
  ListOfTraders,
  ExchangeShape,
  Exchange,
  HistoryEntryShape,
  Portfolio
} from '../types';

// Configuration constants. ALL_CAPS
const TICK_INTERVAL = 1000;

// Records enforce a certain shape of a Map-like object
// The object passed to `Record` is a default shape.
// When creating a new record of this type the ommited keys will fallback
// to the default values below
const makeExchange: RecordFactory<ExchangeShape> = Record({
  name: 'Exchange',
  buyOrders: List(),
  sellOrders: List(),
  history: List()
});

const makeHistoryEntry: RecordFactory<HistoryEntryShape> = Record({
  datetime: Date.now(),
  price: 0,
  quantity: 0
});

const makeTrader: RecordFactory<TraderShape> = Record({
  name: 'Trader',
  portfolio: new Map(),
  dna: {
    risk: 0,
    fear: 0,
    greed: 0
  },
  updateTrader: (trader: Trader, exchange: Exchange): Trader => {
    /*
    if (price_SU < 1.0 - DELTA) {
        buy()
    }
    if (price_SU > 1.0 + DELTA) {
        sell()
    }
     */
    return trader.update('portfolio', portfolio =>
      portfolio.map(amount =>
        Math.max((amount += (Math.random() - 0.5) * 100), 0)
      )
    );
  }
});

// These helper functions allow to create data parammetrically
function makeRandomPortfolio(): Portfolio {
  // 70% chance for trader to have some of the coins
  return Map({
    usd: Math.random() > 0.3 ? Math.random() * 1000 : 0,
    su: Math.random() > 0.3 ? Math.random() * 1000 : 0,
    eth: Math.random() > 0.3 ? Math.random() * 1000 : 0
  });
}

function makeRandomTraders(): ListOfTraders {
  return List(Array(10).fill()).map((entry, index) =>
    makeTrader({ name: `Trader ${index}`, portfolio: makeRandomPortfolio() })
  );
}

// This record is the core of our redux state
const makeSimulationState: RecordFactory<SimulationStateShape> = Record({
  tick: 0,
  traders: makeRandomTraders(),
  exchange: makeExchange()
});

const initialState = makeSimulationState();

export default {
  state: initialState,

  // Reducer are synchronous updater functions
  // They always receive the state as first argument and must return the state of the same type
  reducers: {
    // Add trader
    addTrader: (state: SimulationState, data: TraderShape): SimulationState =>
      state.update('traders', traders => traders.push(makeTrader(data))),

    // Run internal update logic of each trader
    updateTraders: (state: SimulationState): SimulationState =>
      state.update('traders', (traders: ListOfTraders): ListOfTraders =>
        traders.map((trader: Trader): Trader =>
          trader.updateTrader(trader, state.exchange)
        )
      )
  },

  // Effects are asynchronous functions that can receieve and update state
  // Great for api calls or timed functions
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
