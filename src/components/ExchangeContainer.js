// @flow

import React from 'react';
import { Button } from 'carbon-components-react';
import History from './History';
import MarketWithOrderBook from './MarketWithOrderBook';
import type {Market} from "../models/es6_simulation"
import withSimulation from "../util/simulationUpdateHOC"
import {Market_SUmETH} from "../models/es6_simulation"

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
    const { market_ETHUSD, market_SUETH } = this.props;

    return (
      <div>
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'stretch' }}
        >
          <div style={{ flex: 1 }}>
            <History
              title="mETH-USD"
              market={market_ETHUSD}
            />
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() =>
                  market_ETHUSD.setNewValue(
                    market_ETHUSD.getCurrentValue() * 1.1
                  )
                }
              >
                Increase
              </Button>
              <Button
                onClick={() =>
                  market_ETHUSD.setNewValue(
                    market_ETHUSD.getCurrentValue() * 0.9
                  )
                }
              >
                Decrease
              </Button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2em' }}>
          <MarketWithOrderBook
            title="SU-mETH"
            market={market_SUETH}
          />
        </div>
      </div>
    );
  }
}

const mapPlayerToProps = player => {
  const { market_ETHUSD, market_SUETH } = player.simulation;

  return {
    market_ETHUSD,
    market_SUETH
  };
}

export default withSimulation(mapPlayerToProps)(ExchangeContainer);
