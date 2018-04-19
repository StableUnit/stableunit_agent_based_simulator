import { List, Record } from 'immutable';
import { randomizeByDeviation, accumulateRandomly } from '../util/helpers';

import type { RecordFactory } from 'immutable';
import type {
  SULogEntryShape,
  StableSystemShape,
  StableSystem,
  SULog,
  SimulationState
} from '../types';

export const makeSULogEntry: RecordFactory<SULogEntryShape> = Record({
  datetime: Date.now(),
  totalSupply: 10000000,
  piggyBankUSD: 24000000,
  piggyBankETH: 25000
});

export const makeStableSystem: RecordFactory<StableSystemShape> = Record({
  log: List([makeSULogEntry()])
});

export const updateStableSystem = (state: SimulationState): SimulationState =>
  state.update('stableSystem', (stableSystem: StableSystem): StableSystem =>
    stableSystem.update('log', (log: SULog): SULog => {
      const lastEntry = log.last() || makeSULogEntry();
      return log.push(
        makeSULogEntry({
          datetime: state.currentTime,
          totalSupply: accumulateRandomly(lastEntry.totalSupply, 0.01),
          piggyBankETH: randomizeByDeviation(lastEntry.piggyBankETH, 0.01),
          piggyBankUSD: randomizeByDeviation(lastEntry.piggyBankUSD, 0.01)
        })
      );
    })
  );
