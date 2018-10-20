// @flow

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { Button, NumberInput, Tooltip } from 'carbon-components-react';
import MultiHistory from "./MultiHistory"
import withSimulation from "../util/simulationUpdateHOC"
import type {StableUnitSystemHistory} from "../models/es6_simulation"

type State = {
  d1: string,
  d2: string,
  d3: string,
  d4: string,
  d5: string
};

type Props = {
  history: StableUnitSystemHistory,
  SU_circulation: number,
  reserve_mETH: number,
  reserve_ratio: number,
  REPO_circulation: number,
  SU_DAO_TOKEN_circulation: number,
  PARKING_ratio: number,
  D1: number,
  D2: number,
  D3: number,
  D4: number,
  D5: number,
  updateStableUnitDeltas: State => void
};

const STEP = 0.01;

const FlexDiv = styled.div`
  display: flex;
`;

const SUCirculationParagraph = styled.p`
  color: #FF8800;
`;

const ReservemEthParagraph = styled.p`
  color: #ff0011;
`;

const ReserveRatioParagraph = styled.p`
  color: #003dfc;
`;

const REPOCirculationParagraph = styled.p`
  color: #660000;
`;

class StableUnitContainer extends Component<Props, State> {
  state = { d1: '', d2: '', d3: '', d4: '', d5: '' };

  componentDidMount() {
    const { D1, D2, D3, D4, D5 } = this.props;
    this.setState({
      d1: String(D1),
      d2: String(D2),
      d3: String(D3),
      d4: String(D4),
      d5: String(D5)
    });
    // check the values in the simulation (state)
  }

  updateValue = key => (e, direction) => {
    const value = e.target.value
      ? e.target.value
      : direction === 'up'
        ? (Number(this.state[key]) + STEP).toFixed(2)
        : (Number(this.state[key]) - STEP).toFixed(2);
    this.setState({ [key]: String(value) });
  };

  apply = () => {
    this.props.updateStableUnitDeltas(this.state);
  }

  renderInput = ({ name, label }) =>
    <NumberInput
      id={name}
      style={{ minWidth: '5em' }}
      key={name}
      label={label}
      value={Number(this.state[name])}
      step={STEP}
      onChange={this.updateValue(name)}
    />

  renderTextHelpers() {
    const {SU_circulation, reserve_mETH, reserve_ratio, REPO_circulation, SU_DAO_TOKEN_circulation, PARKING_ratio} = this.props;
    return (
      <Fragment>
        <Tooltip
          clickToOpen={false}
          triggerText={<SUCirculationParagraph>SU in circulation = {(SU_circulation).toFixed(2)}</SUCirculationParagraph>}
        >
          This value represents SU in circulation
        </Tooltip>
        <Tooltip
          clickToOpen={false}
          triggerText={<ReservemEthParagraph>Reserve (eth) = {(reserve_mETH / 1000).toFixed(2)}</ReservemEthParagraph>}
        >
          This value represents Reserve (eth)
        </Tooltip>
        <Tooltip
          clickToOpen={false}
          triggerText={<ReserveRatioParagraph>Reserve ratio = {(reserve_ratio).toFixed(2)}</ReserveRatioParagraph>}
        >
          This value represents Reserve ratio
        </Tooltip>
        <Tooltip
          clickToOpen={false}
          triggerText={<REPOCirculationParagraph>REPOs in circulation = {(REPO_circulation).toFixed(2)}</REPOCirculationParagraph>}
        >
          This value represents REPOs in circulation
        </Tooltip>
        <Tooltip
          clickToOpen={false}
          triggerText={<p>SU_DAO_Tokens in circulation = {(SU_DAO_TOKEN_circulation).toFixed(2)}</p>}
        >
          This value represents SU_DAO_Tokens in circulation
        </Tooltip>
        <Tooltip
          clickToOpen={false}
          triggerText={<p>Parking ratio = {(PARKING_ratio).toFixed(2)}</p>}
        >
          This value represents Parking ratio
        </Tooltip>
      </Fragment>
    )
  }

  render() {
    const {history} = this.props;

    return (
      <div>
        <FlexDiv>
          {
            [
              { name: 'd1', label: 'Δs' },
              { name: 'd2', label: 'Δb' },
              { name: 'd3', label: 'Δd' },
              { name: 'd4', label: 'Δp' },
            ].map(this.renderInput)
          }
        </FlexDiv>

        <Button onClick={this.apply}>Apply</Button>

        <MultiHistory
            title="StableUnit system paramenters"
            historyData={history}
        />

        {this.renderTextHelpers()}
      </div>
    );
  }
}

const mapPlayerToProps = player => {
  const { su: { history, SU_circulation, reserve_mETH, reserve_ratio, REPO_circulation, SU_DAO_TOKEN_circulation, PARKING_ratio, D1, D2, D3, D4, D5 } } = player.simulation.web4;

  return { history, SU_circulation, reserve_mETH, reserve_ratio, REPO_circulation, SU_DAO_TOKEN_circulation, PARKING_ratio, D1, D2, D3, D4, D5 };
};

const mapPlayerMethodToProps = player => ({
  updateStableUnitDeltas: player.updateStableUnitDeltas
});

export default withSimulation(mapPlayerToProps, mapPlayerMethodToProps)(StableUnitContainer);
