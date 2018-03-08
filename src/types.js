//@flow

import { Record, List, Map } from 'immutable';
import type { RecordFactory, RecordOf } from 'immutable';

// Trader
type DNA = {
  risk: number,
  fear: number
}
export const makeTrader: RecordFactory<TraderProps> = Record({
  name: 'Trader',
  portfolio: new Map(),
  dna: {
    risk: 0,
    fear: 0
  },
  updateTrader: (trader: Trader, exchange: Exchange): Trader => {
    return trader.set('portfolio', Map({ usd: Math.random() * 1000 }))
  }
});

function makeRandomTraders(): List<Trader> {
  return List(Array(10).fill()).map((entry, index) =>
    makeTrader({ name: `Trader ${index}`, portfolio: makeRandomPortfolio() })
  )
}

export type TraderProps = {
  name: string,
  portfolio: Portfolio,
  dna: DNA,
  updateTrader: (trader: Trader, exchange: Exchange) => RecordOf<TraderProps>
};

export type Trader = RecordOf<TraderProps>;

export type ListOfTraders = List<Trader>;

// Portfolio
export type Portfolio = Map<string, number>;

export function makeRandomPortfolio(): Portfolio {
  // 70% chance for trader to have some of the coins
  return Map({
    usd: Math.random() > 0.3 ? Math.random() * 1000 : 0,
    su: Math.random() > 0.3 ? Math.random() * 1000 : 0,
  });
}

// Order
export type Order = {
  price: number,
  amountUsd: number,
  amountCoins: number,
  trader: RecordOf<TraderProps>
};

// Exchange
export type ExchangeProps = {
  buyOrders: List<Order>,
  sellOrders: List<Order>,
}

export type Exchange = RecordOf<ExchangeProps>;

const makeExchange: RecordFactory<ExchangeProps> = Record({
  buyOrders: List(),
  sellOrders: List()
})

// Type of the simulation state slice
export type SimulationStateProps = {
  tick: number,
  exchange: Exchange,
  traders: ListOfTraders
};

export type SimulationState = RecordOf<SimulationStateProps>;

export const makeSimulationState: RecordFactory<SimulationStateProps> = Record({
  tick: 0,
  traders: makeRandomTraders(),
  exchange: makeExchange(),
});

// Type of entire redux store
export type FullState = {
  simulation: SimulationState
};
