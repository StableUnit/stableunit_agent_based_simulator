// @flow

import * as React from 'react';
import styled from 'styled-components';
import { Module, ModuleHeader, ModuleBody, Button } from 'carbon-components-react';

import ExchangeContainer from './components/ExchangeContainer';
import StableUnitChartContainer from './components/StableUnitChartContainer';
import DemandContainer from './components/DemandContainer';
import Header from './components/Header';
import TradersContainer from './components/TradersContainer';
import Status from './components/Status';
import StableUnitContainer from './components/StableUnitContainer';
import { configurePlayer } from "./util/simulationUpdateHOC";
import type Player from "./models/player"

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

const player: Player = configurePlayer({
  interval: 100,
  autoStart: true
});

const App = () => (
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
        <Module>
          <ModuleHeader>Simulation control</ModuleHeader>
          <ModuleBody>
            <div style={{flex: 1}}>
              <Button small onClick={() => player.start()}>
                Start simulation
              </Button>
              <Button small onClick={() => player.stop()}>
                Stop simulation
              </Button>
            </div>
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

export default App;
