//@flow

import { Record, List } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

// Trader types
export const makeTrader: RecordFactory<TraderProps>
  = Record({ name: 'Igor'});

export type TraderProps = {
  name: string,
}

// Order
export type Order = {
  price: number,
  amountUsd: number,
  amountCoins: number,
  trader: RecordOf<TraderProps>,
}

// Exchange
export type Exchange = {
  buyOrders: Array<Order>
}

// Type of the simulation state slice
type SimulationStateProps = {
  tick: number,
  exchange?: Exchange,
  traders: List<RecordOf<TraderProps>>,
}

export type SimulationState = RecordOf<SimulationStateProps>;

export const makeSimulationState: RecordFactory<SimulationStateProps>
= Record({
  tick: 0,
  traders: List(),
});


// Type of entire redux store
export type FullState = {
  simulation: SimulationState
}
