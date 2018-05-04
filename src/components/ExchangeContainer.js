// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';

import type { FullState, SimulationState } from '../models/player';

import History from './History';
import HistoryWithLayers from './HistoryWithLayers';
import MarketWithOrderBook from './MarketWithOrderBook';

type Props = {
  player: SimulationState,
};

type State = {
  selectedMarketIndex: number
};

class ExchangeContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { selectedMarketIndex: 0 };
  }

  render() {
    const { player } = this.props;

    return (
      <div>
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'stretch' }}
        >
          <div style={{ flex: 1 }}>
            <History
              title="ETH-USD"
              market={player.simulation.market_ETHUSD}
            />
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() =>
                  player.simulation.market_ETHUSD.setNewPrice(
                    player.simulation.market_ETHUSD.getCurrentPrice() * 1.1
                  )
                }
              >
                Increase
              </Button>
              <Button
                onClick={() =>
                  player.simulation.market_ETHUSD.setNewPrice(
                    player.simulation.market_ETHUSD.getCurrentPrice() * 0.9
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
            title="SU-ETH"
            market={player.simulation.market_SUETH}
          />
        </div>
      </div>
    );
  }
}

const mapState = (state: FullState) => ({
  player: state.player
});

export default connect(mapState)(ExchangeContainer);
