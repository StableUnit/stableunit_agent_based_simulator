//@flow
import { Record } from 'immutable';
import nanoid from 'nanoid';

import type { RecordFactory } from 'immutable';
import type {
  PortfolioShape,
  TraderShape,
  Trader,
  Markets,
  Portfolio,
  SimulationState,
  Traders
} from '../types';

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

export const addTrader = (state: SimulationState, data: any): SimulationState =>
  state.update('traders', traders => {
    const id = data.id || nanoid();
    return traders.set(id, makeTrader({ id, ...data }));
  });

export const updateTraders = (state: SimulationState): SimulationState =>
  state.update('traders', (traders: Traders): Traders =>
    traders.map((trader: Trader): Trader =>
      trader.updateTrader(trader, state.markets)
    )
  );
