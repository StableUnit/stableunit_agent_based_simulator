//@flow

import React from 'react';
import styled from 'styled-components';
import withSimulation from "../util/simulationUpdateHOC"

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

const Status = ({ status }: Props) => (
  <Wrap>{status}</Wrap>
);

const mapPlayerToProps = player => ({
  status: player.status
});

export default withSimulation(mapPlayerToProps)(Status);
