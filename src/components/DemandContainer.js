// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
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

const ButtonsWrapper = styled.div`
  text-align: center;
`;

class DemandContainer extends React.Component<Props, State> {
  state = { selectedMarketIndex: 0 };

  render() {
    const { market_demand } = this.props;

    return (
      <Fragment>
        <History
          title="Market demand [0..1], ½ - equilibrium"
          market={market_demand}
        />
        <ButtonsWrapper>
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
        </ButtonsWrapper>
      </Fragment>
    );
  }
}

const mapPlayerToProps = player => ({
  market_demand: player.simulation.market_demand
});

export default withSimulation(mapPlayerToProps)(DemandContainer);
