import React, {ChangeEvent, Fragment} from "react";
import styled from "styled-components";
import { Button, Select, SelectItem } from "carbon-components-react";
import History from "./History";
import withSimulation from "../util/simulationUpdateHOC";
import { Market } from "../models/es6_simulation";
import Player from "../models/player";
type Props = {
  market_demand: Market;
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

class DemandContainer extends React.Component<Props, State> {
  state = {
    selectedMarketIndex: 0
  };
  setMovementType = ({
    target
  }: ChangeEvent<any>) => {
    this.props.setMovementType.call(this.props.market_demand, target.value);
  };

  render() {
    const {
      market_demand
    } = this.props;
    return <Fragment>
        <History title="Market demand [0..1], ½ - equilibrium" market={market_demand} />
        <ButtonsWrapper>
          <Button onClick={() => market_demand.setNewValue(market_demand.getCurrentValue() * 1.1)}>
            Increase
          </Button>
          <Button onClick={() => market_demand.setNewValue(market_demand.getCurrentValue() * 0.9)}>
            Decrease
          </Button>
          <SelectWrapper>
            <Select id="movement-selector" hideLabel inline defaultValue={market_demand.movement_type} onChange={this.setMovementType}>
              {Market.MOVEMENT_TYPES.map(movement_type => <SelectItem key={movement_type} value={movement_type} text={movement_type} />)}
            </Select>
          </SelectWrapper>
        </ButtonsWrapper>
      </Fragment>;
  }

}

const mapPlayerToProps = (player: Player) => ({
  market_demand: player.simulation.market_demand
});

const mapPlayerMethodsToProps = (player: Player) => ({
  setMovementType: player.simulation.market_ETHUSD.setMovementType
});

export default withSimulation(mapPlayerToProps, mapPlayerMethodsToProps)(DemandContainer);