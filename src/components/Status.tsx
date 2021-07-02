import React from "react";
import styled from "styled-components";
import withSimulation from "../util/simulationUpdateHOC";
import Player from "../models/player";
const Wrap = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  background: white;
  padding: 0.5em;
`;
type Props = {
  status: string;
};

const Status = ({
  status
}: Props) => <Wrap>{status}</Wrap>;

const mapPlayerToProps = (player: Player) => ({
  status: player.status
});

export default withSimulation(mapPlayerToProps)(Status);