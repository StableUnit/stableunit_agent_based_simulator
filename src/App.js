// @flow

import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import ControlPanel from './components/ControlPanel';
import Exchange from './components/Exchange';

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Panel = styled.div`
  width: 50%;
`

const StableFund = styled.div``;
const Traders = styled.div``;

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
          <Exchange />
        </Panel>
        <Panel>
          <ControlPanel />
        </Panel>
        <Panel>
          <StableFund>
            Stable fund
          </StableFund>
        </Panel>
        <Panel>
          <Traders>
            Traders
          </Traders>
        </Panel>
      </Wrap>
    );
  }
}

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
});

export default connect(null, mapDispatch)(App);
