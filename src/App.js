// @flow

import * as React from 'react';
import styled from 'styled-components';

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

class App extends React.Component {
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

export default App;
