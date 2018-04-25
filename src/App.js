// @flow

import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Module, ModuleHeader, ModuleBody } from 'carbon-components-react';

import ExchangeContainer from './components/ExchangeContainer';
import Header from './components/Header';
import TradersContainer from './components/TradersContainer';
import Status from './components/Status';

type Props = {
  start: () => void
};

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1300px;
`;

const Panel = styled.div`
  width: 50%;
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
          <Panel>
            <Module>
              <ModuleHeader>Exchange Simulation</ModuleHeader>
              <ModuleBody>
                <ExchangeContainer />
              </ModuleBody>
            </Module>
            <Module>
              <ModuleHeader>Stable Unit System Simulation</ModuleHeader>
              <ModuleBody>{/* <StableSystemContainer /> */}</ModuleBody>
            </Module>
          </Panel>
          <Panel>
            <Module>
              <ModuleHeader>Media Impact Simulation</ModuleHeader>
              <ModuleBody>{/* <ControlPanelContainer /> */}</ModuleBody>
            </Module>
            <Module>
              <ModuleHeader>Traders</ModuleHeader>
              <ModuleBody>
                <TradersContainer />
              </ModuleBody>
            </Module>
          </Panel>
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
