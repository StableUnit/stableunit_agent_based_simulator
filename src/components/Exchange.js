//@flow

import React from 'react';
import { connect } from 'react-redux';

import type { SimulationState, FullState } from '../types';

import OrderBook from './OrderBook';

type Props = {
  simulation: SimulationState,
  start: () => void
};

const Exchange = (props: Props) => {
  return (
    <div>
      <h1>Exchange</h1>
      <OrderBook />

      {props.simulation.traders.toList().map(trader => (
        <div key={trader.name}>
          <h2>{trader.name}</h2>
          <p>{JSON.stringify(trader.portfolio)}</p>
        </div>
      ))}
    </div>
  );
};

const mapState = (state: FullState) => ({
  simulation: state.simulation
});

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
});

export default connect(mapState, mapDispatch)(Exchange);
