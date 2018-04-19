//@flow

import React from 'react';

import { connect } from 'react-redux';
import styled from 'styled-components';

const Wrap = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  background: white;
  padding: 0.5em;
`;

type Props = {
  status: string
};

class Status extends React.Component<Props> {
  render() {
    const { status } = this.props;

    return <Wrap>{status}</Wrap>;
  }
}

const mapState = state => ({
  status: state.player.status
});

export default connect(mapState)(Status);
