// @flow

import React from 'react';
import styled from 'styled-components';
import { Button, Select, SelectItem } from 'carbon-components-react';

import withSimulation from "../util/simulationUpdateHOC";
import Player from "../models/player";

type Props = {
  interval: number,
  player: Player
};

const ButtonsWrapper = styled.div`
  text-align: center;
`;

const SelectWrapper = styled.div`
  width: 150px;
  display: inline-block;
`;

const intervals = {
  '1000': '1/10',
  '500': '1/5',
  '200': '1/2',
  '100': '1/1'
};

class PriceContainer extends React.Component<Props> {
  changeInterval = ({target}) => {
    this.props.player.changeInterval(Number(target.value))
  }

  render() {
    const { player, interval } = this.props;

    return (
      <ButtonsWrapper>
        <Button small onClick={() => player.start()}>
          Start simulation
        </Button>
        <Button small onClick={() => player.stop()}>
          Stop simulation
        </Button>
        <SelectWrapper>
          <Select id="speed-select" hideLabel inline defaultValue={interval} onChange={this.changeInterval}>
            {Object.keys(intervals).map(intervalKey => (
              <SelectItem key={intervalKey} value={intervalKey} text={intervals[intervalKey]} />
            ))}
          </Select>
        </SelectWrapper>
      </ButtonsWrapper>
    );
  }
}

const mapPlayerToProps = player => ({
  interval: player.options.interval
})

const mapPlayerMethodsToProps = player => ({ player });

export default withSimulation(mapPlayerToProps, mapPlayerMethodsToProps)(PriceContainer);
