//@flow

import { Record, List, Map } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

// Portfolio
export type Portfolio = Map<string, number>;

// Trader
type DNA = {
  risk: number,
  fear: number
};

export type TraderProps = {
  name: string,
  portfolio: Portfolio,
  dna: DNA,
  updateTrader: (trader: Trader, exchange: Exchange) => RecordOf<TraderProps>
};

export type Trader = RecordOf<TraderProps>;

export type ListOfTraders = List<Trader>;

// Order
export type Order = {
  price: number,
  amountUsd: number,
  amountCoins: number,
  trader: RecordOf<TraderProps>
};

export type HistoryEntryProps = {
  datetime: number,
  price: number,
  quantity: number
};

export type HistoryEntry = RecordOf<HistoryEntryProps>;

export type History = List<HistoryEntry>;

// Exchange
export type ExchangeProps = {
  name: string,
  history: History,
  buyOrders: List<Order>,
  sellOrders: List<Order>
};

export type Exchange = RecordOf<ExchangeProps>;

// Type of the simulation state slice
export type SimulationStateProps = {
  tick: number,
  exchange: Exchange,
  traders: ListOfTraders
};

export type SimulationState = RecordOf<SimulationStateProps>;

// Type of entire redux store
export type FullState = {
  simulation: SimulationState
};
