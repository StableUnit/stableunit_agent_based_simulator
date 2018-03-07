//@flow

import { Record, List, Map } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

// Trader
export const makeTrader: RecordFactory<TraderProps> = Record({
  name: 'Igor',
  portfolio: new Map(),
  updateTrader: (trader: Trader) => trader.set('portfolio', Map({ usd: Math.random() * 1000 }))
});

export type TraderProps = {
  name: string,
  portfolio: Portfolio,
  updateTrader: (trader: RecordOf<TraderProps>) => RecordOf<TraderProps>
};

export type Trader = RecordOf<TraderProps>

export type ListOfTraders = List<Trader>;

// Portfolio
export type Portfolio = Map<string, number>;

// Order
export type Order = {
  price: number,
  amountUsd: number,
  amountCoins: number,
  trader: RecordOf<TraderProps>
};

// Exchange
export type Exchange = {
  buyOrders: Array<Order>
};

// Type of the simulation state slice
export type SimulationStateProps = {
  tick: number,
  exchange?: Exchange,
  traders: ListOfTraders,
};

export type SimulationState = RecordOf<SimulationStateProps>;

export const makeSimulationState: RecordFactory<SimulationStateProps> = Record({
  tick: 0,
  traders: List()
});

// Type of entire redux store
export type FullState = {
  simulation: SimulationState
};
