import { Simulation } from './es6_simulation';

// https://facebook.github.io/jest/docs/en/expect.html

const simulation = new Simulation();

test('market to initialize', () => {
  expect(simulation.market_SUETH).toBeDefined();
  expect(simulation.traders.size).toBe(7);
  
});
