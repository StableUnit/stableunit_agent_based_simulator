// @flow

import React, { Component } from 'react';

import { Button, NumberInput } from 'carbon-components-react';
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
  D1: number,
  D2: number,
  D3: number,
  D4: number,
  D5: number,
  updateStableUnitDeltas: State => void
};

const STEP = 0.01;

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

  render() {
    const renderInput = ({ name, label }) =>
      <NumberInput
        id={name}
        style={{ minWidth: '5em' }}
        key={name}
        label={label}
        value={Number(this.state[name])}
        step={STEP}
        onChange={this.updateValue(name)}
      />

    const {history, SU_circulation, reserve_mETH, reserve_ratio, REPO_circulation, SU_DAO_TOKEN_circulation} = this.props;

    return (
      <div>
        <div style={{ display: 'flex' }}>
          {
            [
              { name: 'd1', label: 'Δs' },
              { name: 'd2', label: 'Δb' },
              { name: 'd3', label: 'Δd' },
              { name: 'd4', label: 'Δp' },
            ].map(renderInput)
          }
        </div>

        <Button onClick={this.apply}>Apply</Button>

        <MultiHistory
            title="StableUnit system paramenters"
            historyData={history}
        />

        <div>
            <p>SU in circulation = {(SU_circulation).toFixed(2)}</p>
            <p>Reserve (eth) = {(reserve_mETH/1000).toFixed(2)}</p>
            <p>Reserve ratio = {(reserve_ratio).toFixed(2) }</p>
            <p>REPOs in circulation = {(REPO_circulation).toFixed(2) }</p>
            <p>SU_DAO_Tokens in circulation = {(SU_DAO_TOKEN_circulation).toFixed(2) }</p>
        </div>
      </div>
    );
  }
}

const mapPlayerToProps = player => {
  const { su: { history, SU_circulation, reserve_mETH, reserve_ratio, REPO_circulation, SU_DAO_TOKEN_circulation, D1, D2, D3, D4, D5 } } = player.simulation.web4;

  return { history, SU_circulation, reserve_mETH, reserve_ratio, REPO_circulation, SU_DAO_TOKEN_circulation, D1, D2, D3, D4, D5 };
};

const mapPlayerMethodToProps = player => ({
  updateStableUnitDeltas: player.updateStableUnitDeltas
});

export default withSimulation(mapPlayerToProps, mapPlayerMethodToProps)(StableUnitContainer);
