// @flow

import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Module, ModuleHeader, ModuleBody } from 'carbon-components-react';

import ControlPanelContainer from './components/ControlPanelContainer';
import ExchangeContainer from './components/ExchangeContainer';
import TradersContainer from './components/TradersContainer';
import StableSystemContainer from './components/StableSystemContainer';

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1300px;
`;

const Panel = styled.div`
  width: 50%;
`;

type Props = {
  start: () => void
};

class App extends React.Component<Props> {
  componentDidMount() {
    this.props.start();
  }
  render() {
    return (
      <Wrap>
        <Panel>
          <Module>
            <ModuleHeader>Exchange Simulation</ModuleHeader>
            <ModuleBody>
              <ExchangeContainer />
              <TradersContainer />
            </ModuleBody>
          </Module>
        </Panel>
        <Panel>
          <Module>
            <ModuleHeader>Media Impact Simulation</ModuleHeader>
            <ModuleBody>
              <ControlPanelContainer />
            </ModuleBody>
          </Module>
          <Module>
            <ModuleHeader>Stable Unit System Simulation</ModuleHeader>
            <ModuleBody>
              <StableSystemContainer />
            </ModuleBody>
          </Module>
        </Panel>
      </Wrap>
    );
  }
}

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
});

export default connect(null, mapDispatch)(App);
