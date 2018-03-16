//@flow

import { Record, List, OrderedMap } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

// Simple type
// Portfolio
export type PortfolioShape = {
  eth: number,
  su: number
};

export type Portfolio = RecordOf<PortfolioShape>;

// Internal types don't have to be exposed with `export`
// Trader
type DNA = {
  risk: number,
  fear: number
};

// The Record types are broken down into three parts:
// 1. shape of data definition. Useful to enforce a certan shape when initializing new data
export type TraderShape = {
  id: string,
  name: string,
  portfolio: Portfolio,
  dna: DNA,
  emoji: string,
  updateTrader: (trader: Trader, markets: Markets) => Trader
};

// 2. the actual type of the record. Useful to enforce the proper usage in functions etc.
export type Trader = RecordOf<TraderShape>;

// 3. the record factory. Useful for simple initializers. Treat as class. The shape is like a constructor
/*
const makeTrader: RecordFactory<TraderShape> = Record({
  name: 'Trader',
  portfolio: new Map(),
  dna: {
    risk: 0,
    fear: 0,
    greed: 0
  }
});
 */

// Optionally create a ListOf type as it's widely used
export type Traders = OrderedMap<string, Trader>;

// Order
export type Order = {
  datetime: number, // for correct order matching algorithm
  price: number,
  quantity: number,
  traderId: string
};

export type OrderList = List<Order>;

// History
export type HistoryEntryShape = {
  datetime: number,
  price: number,
  quantity: number
};

export type HistoryEntry = RecordOf<HistoryEntryShape>;

export type History = List<HistoryEntry>;

// Market
export type MarketShape = {
  name: string,
  history: History,
  buyOrders: OrderList,
  sellOrders: OrderList
};

export type Market = RecordOf<MarketShape>;

export type Markets = List<Market>;

// Stable system
export type SULogEntryShape = {
  datetime: number,
  totalSupply: number,
  piggyBankUSD: number,
  piggyBankETH: number
};

export type SULogEntry = RecordOf<SULogEntryShape>;

export type SULog = List<SULogEntry>;

export type StableSystemShape = {
  log: SULog
};

export type StableSystem = RecordOf<StableSystemShape>;

// Type of the simulation state slice
export type SimulationStateShape = {
  tick: number,
  markets: Markets,
  stableSystem: StableSystem,
  traders: Traders
};

export type SimulationState = RecordOf<SimulationStateShape>;

// Type of entire redux store
export type FullState = {
  simulation: SimulationState
};
