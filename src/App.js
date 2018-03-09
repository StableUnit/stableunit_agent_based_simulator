// @flow

import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import ControlPanelContainer from './components/ControlPanelContainer';
import ExchangeContainer from './components/ExchangeContainer';
import TradersContainer from './components/TradersContainer';
import StableSystemContainer from './components/StableSystemContainer';

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Panel = styled.div`
  width: 50%;
`

type Props = {
  start: () => void
}

class App extends React.Component<Props> {
  componentDidMount() {
    this.props.start();
  }
  render() {
    return (
      <Wrap>
        <Panel>
          <ExchangeContainer />
        </Panel>
        <Panel>
          <ControlPanelContainer />
        </Panel>
        <Panel>
          <StableSystemContainer />
        </Panel>
        <Panel>
          <TradersContainer />
        </Panel>
      </Wrap>
    );
  }
}

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
});

export default connect(null, mapDispatch)(App);
