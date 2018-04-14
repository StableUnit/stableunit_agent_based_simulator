// @flow

import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Module, ModuleHeader, ModuleBody } from 'carbon-components-react';
import Responsive from 'react-responsive';

import ControlPanelContainer from './components/ControlPanelContainer';
import Header from './components/Header';
import ExchangeContainer from './components/ExchangeContainer';
import TradersContainer from './components/TradersContainer';
import StableSystemContainer from './components/StableSystemContainer';

type Props = {
  start: () => void
};

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1300px;
`;

const MobileWrap = styled.div`
  display: flex;
`;

const Panel = styled.div`
  width: 50%;
`;

// const Spacing = styled.div`
//   padding: 0.625rem;
// `;

const Half = styled.div`
  width: 50%;
`;

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Mobile = props => <Responsive {...props} maxWidth={991} />;

class App extends React.Component<Props> {
  componentDidMount() {
    this.props.start();
  }
  render() {
    return (
      <div>
        <Header />

        <Desktop>
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
                <ModuleBody>
                  <StableSystemContainer />
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
                <ModuleHeader>Traders</ModuleHeader>
                <ModuleBody>
                  <TradersContainer />
                </ModuleBody>
              </Module>
            </Panel>
          </Wrap>
        </Desktop>

        <Mobile>
          <ExchangeContainer />
          <MobileWrap>
            <Half>
              <StableSystemContainer />
            </Half>
            <Half>
              <ControlPanelContainer />
            </Half>
          </MobileWrap>
        </Mobile>
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
});

export default connect(null, mapDispatch)(App);
