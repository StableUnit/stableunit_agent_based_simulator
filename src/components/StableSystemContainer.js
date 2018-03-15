//@flow

import React from 'react';
import { connect } from 'react-redux';

import type { StableSystem, FullState } from '../types';

type Props = {
  stableSystem: StableSystem
};

const StableSystemContainer = (props: Props) => {
  return <div />;
};

const mapState = (state: FullState) => ({
  stableSystem: state.simulation.stableSystem
});

export default connect(mapState)(StableSystemContainer);
