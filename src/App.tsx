import React, { Fragment } from "react";
import styled from "styled-components";
import { ModalHeader, ModalBody } from "carbon-components-react";
import ExchangeContainer from "./components/ExchangeContainer";
import StableUnitChartContainer from "./components/StableUnitChartContainer";
import DemandContainer from "./components/DemandContainer";
import PriceContainer from "./components/PriceContainer";
import Header from "./components/Header";
import TradersContainer from "./components/TradersContainer";
import Status from "./components/Status";
import StableUnitContainer from "./components/StableUnitContainer";
import SourceCodeContainer from "./components/SourceCode";
import SimulationControlContainer from "./components/SImulationControlContainer";
import { configurePlayer } from "./util/simulationUpdateHOC";
import type Player from "./models/player";

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

const App = () => <Fragment>
    <Header />
    <Wrap>
      <PanelLeft>
        <div>
          <ModalHeader>Stable Unit Simulation</ModalHeader>
          <ModalBody>
            <StableUnitChartContainer />
            <StableUnitContainer />
          </ModalBody>
        </div>
        <div>
          <ModalHeader>Traders source code</ModalHeader>
          <ModalBody>
            <SourceCodeContainer />
          </ModalBody>
        </div>
      </PanelLeft>
      <PanelRight>
        <div>
          <ModalHeader>Simulation inputs</ModalHeader>
          <ModalBody>
            <DemandContainer />
            <PriceContainer />
          </ModalBody>
        </div>
        <div>
          <ModalHeader>Simulation control</ModalHeader>
          <ModalBody>
            <SimulationControlContainer />
          </ModalBody>
        </div>
        <div>
          <ModalHeader>Exchange Simulation</ModalHeader>
          <ModalBody>
            <ExchangeContainer />
          </ModalBody>
        </div>
        <div>
          <ModalHeader>Traders</ModalHeader>
          <ModalBody>
            <TradersContainer />
          </ModalBody>
        </div>
      </PanelRight>
    </Wrap>
    <Status />
  </Fragment>;

export default App;