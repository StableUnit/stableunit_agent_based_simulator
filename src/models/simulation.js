//@flow

import { List, Record, OrderedMap } from 'immutable';
import type { RecordFactory } from 'immutable';
import nanoid from 'nanoid';
import faker from 'faker';

import type {
  FullState,
  SimulationState,
  SimulationStateShape,
  TraderShape,
  Trader,
  Traders,
  MarketShape,
  Market,
  Markets,
  HistoryEntryShape,
  HistoryEntry,
  History,
  PortfolioShape,
  Portfolio,
  StableSystemShape,
  StableSystem,
  Order,
  OrderList
} from '../types';

// Configuration constants. ALL_CAPS
const TICK_INTERVAL = 1000;
const INITIAL_PRICE = 1;
const MIN_PRICE_BOUNDARY = 0;
const MAX_PRICE_BOUNDARY = 2;

// Records enforce a certain shape of a Map-like object
// The object passed to `Record` is a default shape.
// When creating a new record of this type the ommited keys will fallback
// to the default values below
const makeMarket: RecordFactory<MarketShape> = Record({
  name: 'Market',
  buyOrders: List(),
  sellOrders: List(),
  history: List()
});

function makeRandomBuyOrders(traders: Traders): OrderList {
  const traderIds: List<string> = traders.keySeq().toList();
  return List(Array(50).fill()).map((entry): Order => {
    const randomTraderId =
      traderIds.get(Math.floor(Math.random() * traderIds.size)) || nanoid();

    return {
      datetime: Date.now() - Math.floor(Math.random() * 10000),
      price: Math.random(),
      quantity: Math.random(),
      traderId: randomTraderId
    };
  });
}

function makeRandomSellOrders(traders: Traders): OrderList {
  const traderIds: List<string> = traders.keySeq().toList();
  return List(Array(50).fill()).map((entry): Order => {
    const randomTraderId =
      traderIds.get(Math.floor(Math.random() * traderIds.size)) || nanoid();

    return {
      datetime: Date.now() - Math.floor(Math.random() * 10000),
      price: Math.random() + INITIAL_PRICE,
      quantity: Math.random(),
      traderId: randomTraderId
    };
  });
}

const makeHistoryEntry: RecordFactory<HistoryEntryShape> = Record({
  datetime: Date.now(),
  price: 0,
  quantity: 0
});

export const makePortfolio: RecordFactory<PortfolioShape> = Record({
  eth: 0,
  su: 0
});

export const makeTrader: RecordFactory<TraderShape> = Record({
  id: nanoid(),
  name: 'Trader',
  portfolio: makePortfolio(),
  dna: {
    risk: 0,
    fear: 0,
    greed: 0
  },
  emoji: '😎',
  // The decision making logic of a trader
  // This function is default, you can override it for any new trader when calling makeTrader
  updateTrader: (trader: Trader, markets: Markets): Trader => {
    /*
    if (price_SU < 1.0 - DELTA) {
        buy()
    }
    if (price_SU > 1.0 + DELTA) {
        sell()
    }
     */
    // Cycle through all markets and update the trader's status
    return trader.update('portfolio', (portfolio: Portfolio): Portfolio => {
      return portfolio
        .update('su', amount => amount + amount * (Math.random() - 0.5) * 0.02)
        .update(
          'eth',
          amount => amount + amount * (Math.random() - 0.5) * 0.02
        );
    });
    // return trader;
  }
});

// These helper functions allow to create data parammetrically
function makeRandomPortfolio(): Portfolio {
  // 70% chance for trader to have some of the coins
  return makePortfolio({
    su: Math.random() > 0.3 ? Math.random() * 1000 : 0,
    eth: Math.random() > 0.3 ? Math.random() * 1000 : 0
  });
}

function randomIdentity(): { name: string, emoji: string } {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const identities = [
    { emoji: '🤖', name: `${firstName} Bot` },
    { emoji: '😎', name: `${firstName} Cool` },
    { emoji: '🤓', name: `${firstName} Nerd` },
    { emoji: '😠', name: `Angry ${firstName}` },
    { emoji: '😰', name: `Week Hand ${firstName}` },
    { emoji: '🤑', name: `Richie ${lastName}` },
    { emoji: '😵', name: `${firstName} Panic` },
    { emoji: '😳', name: `Rookie ${firstName}` },
    { emoji: '😜', name: `Unpredictable ${firstName}` },
    { emoji: '🤥', name: `Sneaky ${firstName}` }
  ];
  return identities[Math.floor(Math.random() * identities.length)];
}

function makeRandomTraders(): Traders {
  return OrderedMap(
    Array(10)
      .fill()
      .map((entry, index) => {
        const id: string = nanoid();
        const identity =
          index === 0
            ? { emoji: '🤖', name: 'Stable Unit Piggy' }
            : randomIdentity();
        const traderId = index === 0 ? '0' : id;
        return [
          traderId,
          makeTrader({
            id: traderId,
            name: identity.name,
            portfolio: makeRandomPortfolio(),
            emoji: identity.emoji
          })
        ];
      })
  );
}

function randomizeByDeviation(value: number, deviation: number): number {
  return value + value * (Math.random() * 2 - 1) * deviation;
}

function randomizeLastHistoryEntry(history: History): HistoryEntry {
  const deviation = 0.05;
  const randomFallback = makeHistoryEntry({
    datetime: Date.now(),
    price: 0.5 + Math.random(),
    quantity: Math.random()
  });
  const lastHistoryItem = history.last() || randomFallback;
  const newHistoryItem = makeHistoryEntry({
    datetime: Date.now(),
    price: randomizeByDeviation(lastHistoryItem.price, deviation),
    quantity: Math.random()
  });
  return newHistoryItem;
}

const makeStableSystem: RecordFactory<StableSystemShape> = Record({
  log: List()
});

// This record is the core of our redux state
export const makeSimulationState: RecordFactory<SimulationStateShape> = Record({
  tick: 0,
  traders: makeRandomTraders(),
  markets: List([
    makeMarket({ name: 'ETH-USD' }),
    makeMarket({ name: 'SU-ETH' })
  ]),
  stableSystem: makeStableSystem()
});

const initialState = makeSimulationState();

export default {
  state: initialState,

  // Reducer are synchronous updater functions
  // They always receive the state as first argument and must return the state of the same type
  reducers: {
    // Add trader
    addTrader: (state: SimulationState, data: any): SimulationState =>
      state.update('traders', traders => {
        const id = data.id || nanoid();
        return traders.set(id, makeTrader({ id, ...data }));
      }),

    placeBuyOrder: (
      state: SimulationState,
      { trader, order }: { trader: Trader, order: Order }
    ): SimulationState =>
      // - remove (lock?) money from the trader
      // - add the order to the buy order list on market
      state,

    placeSellOrder: (
      state: SimulationState,
      { trader, order }: { trader: Trader, order: Order }
    ): SimulationState =>
      // - remove (lock?) money from the trader
      // - add the order to the buy order list on market
      state,

    // Run internal update logic of each trader
    updateTraders: (state: SimulationState): SimulationState =>
      state.update('traders', (traders: Traders): Traders =>
        traders.map((trader: Trader): Trader =>
          trader.updateTrader(trader, state.markets)
        )
      ),

    // A separate reducer cause we depend on traders to exist in state when this happens
    initializeMarket: (state: SimulationState): SimulationState =>
      state.update('markets', (markets: Markets): Markets =>
        markets.map((market: Market): Market =>
          market
            .set('buyOrders', makeRandomBuyOrders(state.traders))
            .set('sellOrders', makeRandomSellOrders(state.traders))
        )
      ),

    // TODO: some internal logic to reconcile orderbook?
    updateExchange: (state: SimulationState): SimulationState =>
      state.update('markets', (markets: Markets): Markets =>
        markets.map((market: Market): Market => {
          // Update history
          // Update order books
          return market
            .update('history', (history: History): History =>
              history.push(randomizeLastHistoryEntry(history))
            )
            .set('buyOrders', makeRandomBuyOrders(state.traders))
            .set('sellOrders', makeRandomSellOrders(state.traders));
        })
      ),

    // TODO: some logic to update stable system
    updateStableSystem: (state: SimulationState): SimulationState =>
      state.update(
        'stableSystem',
        (stableSystem: StableSystem): StableSystem => stableSystem
      ),

    // Simple tick counter
    updateTick: (state: SimulationState): SimulationState =>
      state.update('tick', tick => tick + 1)
  },

  // Effects are asynchronous functions that can receieve and update state
  // Great for api calls or timed functions
  effects: {
    // The main update loop starts here:
    async start(payload: any, rootState: FullState) {
      if (rootState.simulation.tick > 0) {
        return;
      }
      for (var i = 0; i < 30; i++) {
        this.updateExchange();
      }

      this.initializeMarket();

      while (true) {
        // TODO: Update market
        this.updateExchange();

        // TODO: Update stable system

        // Update all traders
        this.updateTraders();
        // this.updateTick();

        // Wait before next tick
        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
      }
    }
  }
};
