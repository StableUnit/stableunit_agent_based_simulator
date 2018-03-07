//@flow

import React from 'react';
import { connect } from 'react-redux';

import type { SimulationState, FullState } from '../types';

type Props = {
  simulation: SimulationState,
  start: () => void
}
 
const Exchange = (props: Props) => {
  return (
    <div>
      <h1>Exchange</h1>
      <button onClick={props.start}>Start</button>
      {props.simulation.tick}
      {props.simulation.traders.map(
        trader => <h2 key={trader.name}>{trader.name}</h2>
      )}
    </div>
  );
};

const mapState = (state: FullState) => ({
  simulation: state.simulation
});

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
});

export default connect(mapState, mapDispatch)(Exchange);
