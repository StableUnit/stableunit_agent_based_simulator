// @flow

import React from 'react';
import { Button } from 'carbon-components-react';

import History from './History';
import withSimulation from "../util/simulationUpdateHOC"
import type {Market} from "../models/es6_simulation"

type Props = {
  market_demand: Market
};

type State = {
  selectedMarketIndex: number
};

class DemandContainer extends React.Component<Props, State> {
  state = { selectedMarketIndex: 0 };

  render() {
    const { market_demand } = this.props;

    return (
      <div>
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'stretch' }}
        >
          <History
            title="Market demand [0..1], ½ - equilibrium"
            market={market_demand}
          />
        </div>
        <div>
          <Button
            onClick={() =>
              market_demand.setNewValue(
                market_demand.getCurrentValue() * 1.1
              )
            }
          >
            Increase
          </Button>
          <Button
            onClick={() =>
              market_demand.setNewValue(
                market_demand.getCurrentValue() * 0.9
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

const mapPlayerToProps = player => ({
  market_demand: player.simulation.market_demand
});

export default withSimulation(mapPlayerToProps)(DemandContainer);
