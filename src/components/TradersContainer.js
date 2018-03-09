//@flow

import React from 'react';
import { connect } from 'react-redux';

import type { Traders, FullState } from '../types';

type Props = {
  traders: Traders
};

const TradersContainer = (props: Props) => {
  return (
    <div>
      <h1>Traders</h1>

      {props.traders.toList().map(trader => (
        <div key={trader.name}>
          <h2>{trader.name}</h2>
          <p>{JSON.stringify(trader.portfolio)}</p>
        </div>
      ))}
    </div>
  );
};

const mapState = (state: FullState) => ({
  traders: state.simulation.traders
});

export default connect(mapState)(TradersContainer);
