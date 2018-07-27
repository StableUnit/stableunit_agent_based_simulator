//@flow

import React from 'react';

import { Button } from 'carbon-components-react';
import { Trader } from '../models/es6_simulation';
import withSimulation from "../util/simulationUpdateHOC"
import type { BuySellOrder } from '../models/player'

type Props = {
  trader: Trader,
  placeLimitBuyOrder: BuySellOrder => void,
  placeMarketBuyOrder: BuySellOrder => void,
  placeLimitSellOrder: BuySellOrder => void,
  placeMarketSellOrder: BuySellOrder => void
};

type State = {
  buy_price_in_eth?: string,
  buy_su_quantity?: string,
  sell_price_in_eth?: string,
  sell_su_quantity?: string
};

class ManualControl extends React.Component<Props, State> {
  state = {
    buy_price_in_eth: '',
    buy_su_quantity: '',
    sell_price_in_eth: '',
    sell_su_quantity: '',
  };

  update = (data: State) => {
    this.setState(data);
  };

  render() {
    const { trader, placeLimitBuyOrder, placeLimitSellOrder, placeMarketBuyOrder, placeMarketSellOrder } = this.props;

    const {
      buy_price_in_eth,
      buy_su_quantity,
      sell_price_in_eth,
      sell_su_quantity,
    } = this.state;

    return (
      <div className="manualOrderForm">
        <div>
          <input
            placeholder="Price in mETH"
            value={buy_price_in_eth}
            onChange={e => this.update({ buy_price_in_eth: e.target.value })}
          />{' '}
          <input
            placeholder="SU quantity"
            value={buy_su_quantity}
            onChange={e => this.update({ buy_su_quantity: e.target.value })}
          />{' '}
          <Button
            disabled={!buy_price_in_eth || !buy_su_quantity}
            small
            onClick={() =>
              placeLimitBuyOrder({
                trader,
                price: buy_price_in_eth,
                quantity: buy_su_quantity
              })
            }
          >
            Buy Limit
          </Button>
          <Button
            disabled={!buy_su_quantity}
            small
            onClick={() =>
              placeMarketBuyOrder({
                trader,
                quantity: buy_su_quantity
              })
            }
          >
            Buy Market
          </Button>

        </div>

        <div>
          <input
            placeholder="Price in mETH"
            value={sell_price_in_eth}
            onChange={e => this.update({ sell_price_in_eth: e.target.value })}
          />{' '}
          <input
            placeholder="SU quantity"
            value={sell_su_quantity}
            onChange={e => this.update({ sell_su_quantity: e.target.value })}
          />{' '}
          <Button
            disabled={!sell_price_in_eth || !sell_su_quantity}
            small
            onClick={() =>
              placeLimitSellOrder({
                trader,
                price: sell_price_in_eth,
                quantity: sell_su_quantity
              })
            }
          >
            Sell Limit
          </Button>
          <Button
            disabled={!sell_su_quantity}
            small
            onClick={() =>
              placeMarketSellOrder({
                trader,
                quantity: sell_su_quantity
              })
            }
          >
            Sell Market
          </Button>
        </div>
      </div>
    );
  }
}

const mapPlayerMethodsToProps = player => ({
  placeLimitBuyOrder: player.placeLimitBuyOrder,
  placeMarketBuyOrder: player.placeMarketBuyOrder,
  placeLimitSellOrder: player.placeLimitSellOrder,
  placeMarketSellOrder: player.placeMarketSellOrder
});

export default withSimulation(null, mapPlayerMethodsToProps)(ManualControl);
