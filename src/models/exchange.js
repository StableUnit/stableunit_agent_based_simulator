//@flow
import { List, Record } from 'immutable';
import {
  randomizeLastHistoryEntry,
  makeRandomBuyOrders,
  makeRandomSellOrders
} from '../util/randomizers';

import type {
  SimulationState,
  MarketShape,
  HistoryEntryShape,
  Markets,
  Market,
  History,
  Trader,
  Order
} from '../types';
import type { RecordFactory } from 'immutable';
// Records enforce a certain shape of a Map-like object
// The object passed to `Record` is a default shape.
// When creating a new record of this type the ommited keys will fallback
// to the default values below
export const makeMarket: RecordFactory<MarketShape> = Record({
  name: 'Market',
  buyOrders: List(),
  sellOrders: List(),
  history: List()
});

export const makeHistoryEntry: RecordFactory<HistoryEntryShape> = Record({
  datetime: Date.now(),
  price: 0,
  quantity: 0
});

export const updateExchange = (state: SimulationState): SimulationState =>
  state.update('markets', (markets: Markets): Markets =>
    markets.map((market: Market): Market => {
      // Update history
      // Update order books
      return market
        .update('history', (history: History): History =>
          history.push(randomizeLastHistoryEntry(history, state.currentTime))
        )
        .set('buyOrders', makeRandomBuyOrders(state.traders))
        .set('sellOrders', makeRandomSellOrders(state.traders));
    })
  );

export const initializeMarket = (state: SimulationState): SimulationState =>
  state.update('markets', (markets: Markets): Markets =>
    markets.map((market: Market): Market =>
      market
        .set('buyOrders', makeRandomBuyOrders(state.traders))
        .set('sellOrders', makeRandomSellOrders(state.traders))
    )
  );

export const placeBuyOrder = (
  state: SimulationState,
  { trader, order }: { trader: Trader, order: Order }
): SimulationState =>
  // - remove (lock?) money from the trader
  // - add the order to the buy order list on market
  state;

export const placeSellOrder = (
  state: SimulationState,
  { trader, order }: { trader: Trader, order: Order }
): SimulationState =>
  // - remove (lock?) money from the trader
  // - add the order to the buy order list on market
  state;
