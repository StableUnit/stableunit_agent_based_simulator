//@flow

import React from 'react';
import { connect } from 'react-redux';

const Exchange = props => {
  return (
    <div>
      <h1>Exchange</h1>
      <button onClick={props.start}>Start</button>
      {props.simulation}
    </div>
  );
};

const mapState = state => ({
  simulation: state.simulation
})

const mapDispatch = dispatch => ({
  start: dispatch.simulation.start
})

export default connect(mapState, mapDispatch)(Exchange);
