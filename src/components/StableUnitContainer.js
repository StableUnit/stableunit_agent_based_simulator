// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, NumberInput } from 'carbon-components-react';
import { StableUnit } from '../models/es6_simulation';

type State = {
  d1: string,
  d2: string,
  d3: string,
  d4: string,
  d5: string
};

type Props = {
  stableUnit: StableUnit,
  updateStableUnitDeltas: (State) => {}
};


const STEP = 0.01;

class StableUnitContainer extends Component<Props, State> {
  state = { d1: '', d2: '', d3: '', d4: '', d5: '' };

  componentDidMount() {
    const { D1, D2, D3, D4, D5 } = this.props.stableUnit;
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
    const renderInput = (name: string) => <NumberInput
      id={name}
      style={{ minWidth: '5em' }}
      key={name}
      label={name.toUpperCase()}
      value={Number(this.state[name])}
      step={STEP}
      onChange={this.updateValue(name)}
    />

    return (
      <div>
        <div style={{ display: 'flex' }}>
          {['d1', 'd2', 'd3', 'd4', 'd5'].map(renderInput)}
        </div>
        <Button onClick={this.apply}>Apply</Button>
      </div>
    );
  }
}

const mapState = state => ({
  stableUnit: state.player.simulation.web4.su
});

const mapDispatch = dispatch => ({
  updateStableUnitDeltas: dispatch.player.updateStableUnitDeltas
});

export default connect(mapState, mapDispatch)(StableUnitContainer);
