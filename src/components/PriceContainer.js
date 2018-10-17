// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';

import History from './History';
import withSimulation from "../util/simulationUpdateHOC"
import type {Market} from "../models/es6_simulation"

type Props = {
  market_ETHUSD: Market
};

type State = {
  selectedMarketIndex: number
};

const ButtonsWrapper = styled.div`
  text-align: center;
`;

class PriceContainer extends React.Component<Props, State> {
  state = { selectedMarketIndex: 0 };

  render() {
    const { market_ETHUSD } = this.props;

    return (
      <Fragment>
        <History
          title="mETH-USD"
          market={market_ETHUSD}
        />
        <ButtonsWrapper>
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
        </ButtonsWrapper>
      </Fragment>
    );
  }
}

const mapPlayerToProps = player => {
  const { market_ETHUSD } = player.simulation;

  return {
    market_ETHUSD
  };
}

export default withSimulation(mapPlayerToProps)(PriceContainer);
