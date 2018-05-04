// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';

import type { FullState, SimulationState } from '../models/player';
import { StableUnit } from '../models/es6_simulation';

import History from './History';
import HistoryWithLayers from './HistoryWithLayers';

type Props = {
  player: SimulationState,
  stableUnit: StableUnit,
};

type State = {
  selectedMarketIndex: number
};

class StableUnitChartContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { selectedMarketIndex: 0 };
  }

  render() {
    const { player, stableUnit } = this.props;
    const { D1, D2, D3, D4, D5 } = stableUnit;

    return (
      <div>
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'stretch' }}
        >
          <div style={{ flex: 1 }}>
            <HistoryWithLayers
              title="SU-USD"
              market={player.simulation.market_SUUSD}
              D1={D1}
              D2={D2}
              D3={D3}
              D4={D4}
              D5={D5}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state: FullState) => ({
  player: state.player,
  stableUnit: state.player.simulation.web4.su
});

export default connect(mapState)(StableUnitChartContainer);
