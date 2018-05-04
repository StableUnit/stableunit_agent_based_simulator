// @flow

import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Module, ModuleHeader, ModuleBody } from 'carbon-components-react';

import ExchangeContainer from './components/ExchangeContainer';
import StableUnitChartContainer from './components/StableUnitChartContainer';
import DemandContainer from './components/DemandContainer';
import Header from './components/Header';
import TradersContainer from './components/TradersContainer';
import Status from './components/Status';
import StableUnitContainer from './components/StableUnitContainer';

type Props = {
  start: () => void
};

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1300px;
`;

const PanelLeft = styled.div`
  width: 60%;
`;

const PanelRight = styled.div`
  width: 40%;
`;

class App extends React.Component<Props> {
  componentDidMount() {
    this.props.start();
  }
  render() {
    return (
      <div>
        <Header />

        <Wrap>
          <PanelLeft>
            <Module>
              <ModuleHeader>Stable Unit Simulation</ModuleHeader>
              <ModuleBody>
                <StableUnitChartContainer />
                <StableUnitContainer />
              </ModuleBody>
            </Module>
            <Module>
              <ModuleHeader>Exchange Simulation</ModuleHeader>
              <ModuleBody>
                <ExchangeContainer />
              </ModuleBody>
            </Module>
          </PanelLeft>
          <PanelRight>
            <Module>
              <ModuleHeader>Media Impact Simulation</ModuleHeader>
              <ModuleBody>
                <DemandContainer />
              </ModuleBody>
            </Module>
            <Module>
              <ModuleHeader>Traders</ModuleHeader>
              <ModuleBody>
                <TradersContainer />
              </ModuleBody>
            </Module>
          </PanelRight>
        </Wrap>
        <Status />
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  start: dispatch.player.start
});

export default connect(null, mapDispatch)(App);
