import simulation, { makeSimulationState } from './simulation';

import { makeTrader } from './traders';

import type { SimulationState, Trader } from '../types';

const initialState: SimulationState = makeSimulationState();

it('should create initial state', () => {
  expect(initialState.traders.size).toBe(10);
  expect(initialState.tick).toBe(0);
});

it('should handle adding a trader', () => {
  const newTraderData = {
    id: 'id',
    name: 'Test trader',
    dna: {
      risk: 1,
      fear: 2,
      greed: 3
    }
  };
  const referenceTrader: Trader = makeTrader(newTraderData);
  const updatedState = simulation.reducers.addTrader(
    initialState,
    newTraderData
  );
  expect(referenceTrader);
  expect(referenceTrader.name).toBe('Test trader');

  const traderFromUpdatedState = updatedState.traders.get('id');
  expect(traderFromUpdatedState).toEqual(referenceTrader);
});
