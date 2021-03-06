// @flow

import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Module, ModuleHeader, ModuleBody} from 'carbon-components-react';

import ExchangeContainer from './components/ExchangeContainer';
import StableUnitChartContainer from './components/StableUnitChartContainer';
import DemandContainer from './components/DemandContainer';
import PriceContainer from './components/PriceContainer';
import Header from './components/Header';
import TradersContainer from './components/TradersContainer';
import Status from './components/Status';
import StableUnitContainer from './components/StableUnitContainer';
import SourceCodeContainer from './components/SourceCode';
import SimulationControlContainer from './components/SImulationControlContainer';
import {configurePlayer} from "./util/simulationUpdateHOC";
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
  <Fragment>
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
          <ModuleHeader>Traders source code</ModuleHeader>
          <ModuleBody>
            <SourceCodeContainer/>
          </ModuleBody>
        </Module>
      </PanelLeft>
      <PanelRight>
        <Module>
          <ModuleHeader>Simulation inputs</ModuleHeader>
          <ModuleBody>
            <DemandContainer />
            <PriceContainer />
          </ModuleBody>
        </Module>
        <Module>
          <ModuleHeader>Simulation control</ModuleHeader>
          <ModuleBody>
            <SimulationControlContainer />
          </ModuleBody>
        </Module>
        <Module>
          <ModuleHeader>Exchange Simulation</ModuleHeader>
          <ModuleBody>
            <ExchangeContainer />
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
    <Status/>
  </Fragment>
);

export default App;
