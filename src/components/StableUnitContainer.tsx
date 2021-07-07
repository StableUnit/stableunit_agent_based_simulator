import React, { Component } from "react";
import styled from "styled-components";
import { Button, NumberInput, Tooltip } from "carbon-components-react";
import MultiHistory from "./MultiHistory";
import withSimulation from "../util/simulationUpdateHOC";
import type { StableUnitSystemHistory } from "../models/es6_simulation";
import Player from "../models/player";
type StateKeyType = 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
type State = Record<StateKeyType, string>;
type Props = {
  history: StableUnitSystemHistory;
  SU_circulation: number;
  reserve_mETH: number;
  reserve_ratio: number;
  REPO_circulation: number;
  SU_DAO_TOKEN_circulation: number;
  PARKING_ratio: number;
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
  updateStableUnitDeltas: (arg0: State) => void;
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
  state = {
    d1: '',
    d2: '',
    d3: '',
    d4: '',
    d5: ''
  };

  componentDidMount() {
    const {
      D1,
      D2,
      D3,
      D4,
      D5
    } = this.props;
    this.setState({
      d1: String(D1),
      d2: String(D2),
      d3: String(D3),
      d4: String(D4),
      d5: String(D5)
    }); // check the values in the simulation (state)
  }

  updateValue = (key: StateKeyType) => (e: any, direction: string) => {
    const value = e.target.value ? e.target.value : direction === 'up' ? (Number(this.state[key]) + STEP).toFixed(2) : (Number(this.state[key]) - STEP).toFixed(2);
    this.setState({ [key]: String(value) } as Record<StateKeyType, string>);
  };
  apply = () => {
    this.props.updateStableUnitDeltas(this.state);
  };
  renderInput = ({ name, label }: { name: StateKeyType, label: string }) =>(
      <NumberInput
          id={name}
          style={{ minWidth: '5em' }}
          key={name}
          label={label}
          value={Number(this.state[name])}
          step={STEP}
          onChange={this.updateValue(name)}
          hideSteppers
      />
  );

  renderTextHelpers() {
    const {
      SU_circulation,
      reserve_mETH,
      reserve_ratio,
      REPO_circulation,
      SU_DAO_TOKEN_circulation,
      PARKING_ratio
    } = this.props;
    return (
        <>
          <div>
            <Tooltip triggerText={<SUCirculationParagraph>SU in circulation = {SU_circulation.toFixed(2)}</SUCirculationParagraph>}>
              This value represents SU in circulation
            </Tooltip>
          </div>
          <div>
            <Tooltip triggerText={<ReservemEthParagraph>Reserve (eth) = {(reserve_mETH / 1000).toFixed(2)}</ReservemEthParagraph>}>
              This value represents Reserve (eth)
            </Tooltip>
          </div>
          <div>
            <Tooltip triggerText={<ReserveRatioParagraph>Reserve ratio = {reserve_ratio.toFixed(2)}</ReserveRatioParagraph>}>
              This value represents Reserve ratio
            </Tooltip>
          </div>
          <div>
            <Tooltip triggerText={<REPOCirculationParagraph>REPOs in circulation = {REPO_circulation.toFixed(2)}</REPOCirculationParagraph>}>
              This value represents REPOs in circulation
            </Tooltip>
          </div>
          <div>
            <Tooltip triggerText={<p>SU_DAO_Tokens in circulation = {SU_DAO_TOKEN_circulation.toFixed(2)}</p>}>
              This value represents SU_DAO_Tokens in circulation
            </Tooltip>
          </div>
          <div>
            <Tooltip triggerText={<p>Parking ratio = {PARKING_ratio.toFixed(2)}</p>}>
              This value represents Parking ratio
            </Tooltip>
          </div>
      </>
    );
  }

  render() {
    const {
      history
    } = this.props;
    return <div>
        <FlexDiv>
          {([{
          name: 'd1' as StateKeyType,
          label: 'Δs'
        }, {
          name: 'd2' as StateKeyType,
          label: 'Δb'
        }, {
          name: 'd3' as StateKeyType,
          label: 'Δd'
        }, {
          name: 'd4' as StateKeyType,
          label: 'Δp'
        }]).map(this.renderInput)}
        </FlexDiv>

        <Button onClick={this.apply}>Apply</Button>

        <MultiHistory title="StableUnit system paramenters" historyData={history} />

        {this.renderTextHelpers()}
      </div>;
  }

}

const mapPlayerToProps = (player: Player) => {
  const {
    su: {
      history,
      SU_circulation,
      reserve_mETH,
      reserve_ratio,
      REPO_circulation,
      SU_DAO_TOKEN_circulation,
      PARKING_ratio,
      D1,
      D2,
      D3,
      D4,
      D5
    }
  } = player.simulation.web4;
  return {
    history,
    SU_circulation,
    reserve_mETH,
    reserve_ratio,
    REPO_circulation,
    SU_DAO_TOKEN_circulation,
    PARKING_ratio,
    D1,
    D2,
    D3,
    D4,
    D5
  };
};

const mapPlayerMethodToProps = (player: Player) => ({
  updateStableUnitDeltas: player.updateStableUnitDeltas
});

export default withSimulation(mapPlayerToProps, mapPlayerMethodToProps)(StableUnitContainer);