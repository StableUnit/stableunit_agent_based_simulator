//@flow

import React from 'react';
import { connect } from 'react-redux';

import type { SimulationState, FullState } from '../types';

import OrderBook from './OrderBook';

type Props = {
  simulation: SimulationState,
};

const ExchangeContainer = (props: Props) => {
  return (
    <div>
      <h1>Exchange</h1>
      <OrderBook />
    </div>
  );
};

const mapState = (state: FullState) => ({
  simulation: state.simulation
});

export default connect(mapState)(ExchangeContainer);
