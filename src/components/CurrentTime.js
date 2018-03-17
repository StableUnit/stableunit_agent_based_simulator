//@flow

import React, { Component } from 'react';
import moment from 'moment';
import { getSimulatedTime } from '../util/date';

type Props = {};

class CurrentTime extends Component<Props> {
  componentDidMount() {
    setInterval(() => this.forceUpdate(), 200);
  }
  render() {
    return (
      <div>
        Simulated date and time:
        <div>{moment(getSimulatedTime()).format('dddd, MMMM Do YYYY')}</div>
        <div>{moment(getSimulatedTime()).format('h:mm a')}</div>
      </div>
    );
  }
}

export default CurrentTime;
