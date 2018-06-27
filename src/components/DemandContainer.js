// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';

import type { FullState, SimulationState } from '../models/player';

import History from './History';

type Props = {
  player: SimulationState
};

type State = {
  selectedMarketIndex: number
};

class DemandContainer extends React.Component<Props, State> {
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
          <History
            title="Market demand"
            market={player.simulation.market_demand}
          />
        </div>
        <div>
          <Button
            onClick={() =>
              player.simulation.market_demand.setNewValue(
                player.simulation.market_demand.getCurrentValue() * 1.1
              )
            }
          >
            Increase
          </Button>
          <Button
            onClick={() =>
              player.simulation.market_demand.setNewValue(
                player.simulation.market_demand.getCurrentValue() * 0.9
              )
            }
          >
            Decrease
          </Button>
        </div>
      </div>
    );
  }
}

const mapState = (state: FullState) => ({
  player: state.player
});

export default connect(mapState)(DemandContainer);
