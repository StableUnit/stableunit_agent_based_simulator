//@flow

import { Record, List } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

export const TraderRecord = Record({ name: 'Igor'});

export type Trader = {

}

export type Order = {
  price: number,
  amountUsd: number,
  amountCoins: number,
  trader: Trader,
}

export type Exchange = {
  buyOrders: Array<Order>
}

// Type of the simulation state slice
type SimulationStateProps = {
  tick: number,
  exchange?: Exchange,
  traders: RecordOf<TraderRecord>,
  another: bool
}

export type SimulationState = RecordOf<SimulationStateProps>;

export const makeSimulationState: RecordFactory<SimulationStateProps>
= Record({
  tick: 0,
  traders: [
    { name: 'Test '},
    { name: 'Test2 '}
  ]
});


// export makeSimulationState;

// Type of entire redux store
export type FullState = {
  simulation: SimulationState
}
