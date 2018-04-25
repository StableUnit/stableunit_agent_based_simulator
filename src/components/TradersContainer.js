//@flow

import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';
import { colors } from '../theme';
import accounting from 'accounting';

import type { Traders, Order } from '../models/es6_simulation';
import { Trader } from '../models/es6_simulation';

import ManualControl from './ManualControl';

type Props = {
  traders: Traders,
  tick: number,
  cancelBuyOrder: Order => {},
  cancelSellOrder: Order => {}
};

const TradersContainer = (props: Props) => {
  const { traders, cancelBuyOrder, cancelSellOrder } = props;

  const tradersArr = Array.from(traders.values());

  return (
    <div>
      {tradersArr.map((trader, index) => {
        return (
          <div key={trader.name}>
            <strong>{trader.name}</strong>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td>SU</td>
                  <td>{trader.su_balance.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>ETH</td>
                  <td>{trader.eth_balance.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <ManualControl trader={trader} />
            {Array.from(trader.buyOrders).map((order, orderIndex) => (
              <div key={orderIndex}>
                {order.type} {order.su_amount.toFixed(2)}, {order.eth_amount.toFixed(2)}, {order.price.toFixed(4)}{' '}
                <Button onClick={() => cancelBuyOrder(order)}>Cancel</Button>
              </div>
            ))}
            {Array.from(trader.sellOrders).map((order, orderIndex) => (
              <div key={orderIndex}>
                {order.type} {order.su_amount.toFixed(2)}, {order.eth_amount.toFixed(2)}, {order.price.toFixed(4)}{' '}
                <Button onClick={() => cancelSellOrder(order)}>Cancel</Button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const mapState = state => ({
  traders: state.player.simulation.traders,
  tick: state.player.tick
});

const mapDispatch = dispatch => ({
  cancelBuyOrder: dispatch.player.cancelBuyOrder,
  cancelSellOrder: dispatch.player.cancelSellOrder
});

export default connect(mapState, mapDispatch)(TradersContainer);
