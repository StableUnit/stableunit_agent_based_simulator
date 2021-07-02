import React, {ChangeEvent, Fragment} from "react";
import styled from "styled-components";
import { Button, Select, SelectItem } from "carbon-components-react";
import History from "./History";
import withSimulation from "../util/simulationUpdateHOC";
import { Market_mETHUSD } from "../models/es6_simulation";
import Player from "../models/player";
type Props = {
  market_ETHUSD: Market_mETHUSD;
  setMovementType: (arg0: string) => void;
};
type State = {
  selectedMarketIndex: number;
};
const ButtonsWrapper = styled.div`
  text-align: center;
`;
const SelectWrapper = styled.div`
  width: 150px;
  display: inline-block;
`;

class PriceContainer extends React.Component<Props, State> {
  state = {
    selectedMarketIndex: 0
  };
  setMovementType = ({
    target
  }: ChangeEvent<any>) => {
    this.props.setMovementType.call(this.props.market_ETHUSD, target.value);
  };

  render() {
    const {
      market_ETHUSD
    } = this.props;
    return <Fragment>
        <History title="mETH-USD" market={market_ETHUSD} />
        <ButtonsWrapper>
          <Button onClick={() => market_ETHUSD.setNewValue(market_ETHUSD.getCurrentValue() * 1.1)}>
            Increase
          </Button>
          <Button onClick={() => market_ETHUSD.setNewValue(market_ETHUSD.getCurrentValue() * 0.9)}>
            Decrease
          </Button>
          <SelectWrapper>
            <Select id="movement-selector" hideLabel inline defaultValue={market_ETHUSD.movement_type} onChange={this.setMovementType}>
              {Market_mETHUSD.MOVEMENT_TYPES.map(movement_type => <SelectItem key={movement_type} value={movement_type} text={movement_type} />)}
            </Select>
          </SelectWrapper>
        </ButtonsWrapper>
      </Fragment>;
  }

}

const mapPlayerToProps = (player: Player) => {
  const {
    market_ETHUSD
  } = player.simulation;
  return {
    market_ETHUSD
  };
};

const mapPlayerMethodsToProps = (player: Player) => ({
  setMovementType: player.simulation.market_ETHUSD.setMovementType
});

export default withSimulation(mapPlayerToProps, mapPlayerMethodsToProps)(PriceContainer);