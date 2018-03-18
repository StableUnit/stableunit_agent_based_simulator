//@flow

import React, { Component } from 'react';
import moment from 'moment';
// import { getSimulatedTime } from '../util/date';
import { connect } from 'react-redux';

type Props = {
  currentTime: number
};

class CurrentTime extends Component<Props> {
  render() {
    const { currentTime } = this.props;
    return (
      <div>
        Simulated date and time:
        <div>{moment(currentTime).format('dddd, MMMM Do YYYY')}</div>
        <div>{moment(currentTime).format('h:mm a')}</div>
      </div>
    );
  }
}

const mapState = state => ({ currentTime: state.simulation.currentTime });

export default connect(mapState)(CurrentTime);
