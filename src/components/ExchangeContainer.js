// @flow

import React from 'react';
import type {Market} from "../models/es6_simulation"
import withSimulation from "../util/simulationUpdateHOC"
import {Market_SUmETH} from "../models/es6_simulation"
import History from "./History";
import OrderBook from "./OrderBook";

type Props = {
  market_ETHUSD: Market,
  market_SUETH: Market_SUmETH
};

type State = {
  selectedMarketIndex: number
};

class ExchangeContainer extends React.Component<Props, State> {
  state = { selectedMarketIndex: 0 };

  render() {
    const {  market_SUETH } = this.props;

    return (
      <div>
        <History market={market_SUETH} title="SU-mETH" />
        <OrderBook market={market_SUETH} />
      </div>
    );
  }
}

const mapPlayerToProps = player => {
  const { market_SUETH } = player.simulation;

  return {
    market_SUETH
  };
}

export default withSimulation(mapPlayerToProps)(ExchangeContainer);
