// @flow

import React from 'react';
import { connect } from 'react-redux';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import styled from 'styled-components';

import type { FullState, SimulationState } from '../models/player';

import MarketContainer from './MarketContainer';
import MarketWithOrderBook from './MarketWithOrderBook';

type Props = {
  player: SimulationState
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
        <MarketContainer market={player.simulation.market_ETHUSD} />
        <MarketWithOrderBook market={player.simulation.market_SUETH} />
      </div>
    );
  }
}

const mapState = (state: FullState) => ({
  player: state.player
});

export default connect(mapState)(ExchangeContainer);
