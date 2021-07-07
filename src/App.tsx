import React, { Fragment } from "react";
import styled from "styled-components";
import { ModalHeader, ModalBody } from "carbon-components-react";
import "carbon-components/css/carbon-components.min.css";

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

const StyledModalBody = styled(ModalBody)`
  padding: 1rem 1.5rem;
`;

const StyledModalHeader = styled(ModalHeader)`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dfe3e6;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: black;
`;

const StyledContentContainer = styled.div`
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
  background-color: #fff;
  border: 1px solid transparent;
  margin: 0.625rem;
  max-width: 62.5rem;
`;


const player: Player = configurePlayer({
  interval: 100,
  autoStart: true
});

const App = () => <Fragment>
    <Header />
    <Wrap>
      <PanelLeft>
        <StyledContentContainer>
          <StyledModalHeader>Stable Unit Simulation</StyledModalHeader>
          <StyledModalBody>
            <StableUnitChartContainer />
            <StableUnitContainer />
          </StyledModalBody>
        </StyledContentContainer>
        <StyledContentContainer>
          <StyledModalHeader>Traders source code</StyledModalHeader>
          <StyledModalBody>
            <SourceCodeContainer />
          </StyledModalBody>
        </StyledContentContainer>
      </PanelLeft>
      <PanelRight>
        <StyledContentContainer>
          <StyledModalHeader>Simulation inputs</StyledModalHeader>
          <StyledModalBody>
            <DemandContainer />
            <PriceContainer />
          </StyledModalBody>
        </StyledContentContainer>
        <StyledContentContainer>
          <StyledModalHeader>Simulation control</StyledModalHeader>
          <StyledModalBody>
            <SimulationControlContainer />
          </StyledModalBody>
        </StyledContentContainer>
        <StyledContentContainer>
          <StyledModalHeader>Exchange Simulation</StyledModalHeader>
          <StyledModalBody>
            <ExchangeContainer />
          </StyledModalBody>
        </StyledContentContainer>
        <StyledContentContainer>
          <StyledModalHeader>Traders</StyledModalHeader>
          <StyledModalBody>
            <TradersContainer />
          </StyledModalBody>
        </StyledContentContainer>
      </PanelRight>
    </Wrap>
    <Status />
  </Fragment>;

export default App;