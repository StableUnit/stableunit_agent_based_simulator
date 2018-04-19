//@flow

import React from 'react';

import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';
import { Trader } from '../models/es6_simulation';

type Props = {
  trader: Trader,
  placeBuyOrder: (payload: {
    trader: Trader,
    su_amount: string,
    eth_amount: string
  }) => {},
  placeSellOrder: (payload: {
    trader: Trader,
    su_amount: string,
    eth_amount: string
  }) => {}
};

type State = {
  buy_su_amount: string,
  buy_eth_amount: string,
  sell_su_amount: string,
  sell_eth_amount: string
};

class ManualControl extends React.Component<Props, State> {
  state = {
    buy_su_amount: '',
    buy_eth_amount: '',
    sell_su_amount: '',
    sell_eth_amount: ''
  };

  update = data => {
    this.setState(data);
  };

  render() {
    const { placeBuyOrder, placeSellOrder, trader } = this.props;
    const {
      buy_su_amount,
      buy_eth_amount,
      sell_su_amount,
      sell_eth_amount
    } = this.state;

    console.log(buy_eth_amount);

    return (
      <div>
        <div>
          <input
            placeholder="su"
            value={buy_su_amount}
            onChange={e => this.update({ buy_su_amount: e.target.value })}
          />{' '}
          <input
            placeholder="eth"
            value={buy_eth_amount}
            onChange={e => this.update({ buy_eth_amount: e.target.value })}
          />{' '}
          <Button
            small
            onClick={() =>
              placeBuyOrder({
                trader,
                su_amount: buy_su_amount,
                eth_amount: buy_eth_amount
              })
            }
          >
            Buy
          </Button>
        </div>

        <div>
          <input
            placeholder="su"
            value={sell_su_amount}
            onChange={e => this.update({ sell_su_amount: e.target.value })}
          />{' '}
          <input
            placeholder="eth"
            value={sell_eth_amount}
            onChange={e => this.update({ sell_eth_amount: e.target.value })}
          />{' '}
          <Button
            small
            onClick={() =>
              placeSellOrder({
                trader,
                su_amount: sell_su_amount,
                eth_amount: sell_eth_amount
              })
            }
          >
            Sell
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  placeBuyOrder: dispatch.player.placeBuyOrder,
  placeSellOrder: dispatch.player.placeSellOrder
});

export default connect(null, mapDispatch)(ManualControl);
