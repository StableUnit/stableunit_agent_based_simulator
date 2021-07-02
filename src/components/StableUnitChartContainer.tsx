import React from "react";
import HistoryWithLayers from "./HistoryWithLayers";
import withSimulation from "../util/simulationUpdateHOC";
import type { Market } from "../models/es6_simulation";
import Player from "../models/player";
type Props = {
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
  market_SUUSD: Market;
};
type State = {
  selectedMarketIndex: number;
};

class StableUnitChartContainer extends React.Component<Props, State> {
  render() {
    const {
      D1,
      D2,
      D3,
      D4,
      D5,
      market_SUUSD
    } = this.props;
    return <HistoryWithLayers title="SU/USD price" market={market_SUUSD} D1={D1} D2={D2} D3={D3} D4={D4} D5={D5} />;
  }

}

const mapPlayerToProps = (player: Player) => {
  const {
    market_SUUSD,
    web4: {
      su: {
        D1,
        D2,
        D3,
        D4,
        D5
      }
    }
  } = player.simulation;
  return {
    D1,
    D2,
    D3,
    D4,
    D5,
    market_SUUSD
  };
};

export default withSimulation(mapPlayerToProps)(StableUnitChartContainer);