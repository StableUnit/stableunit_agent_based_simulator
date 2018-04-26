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

function printObject(object) {
  return (
    <table style={{ marginBottom: 5, marginTop: 5 }}>
      <tbody>
        {Object.entries(object).map((pair, index) => (
          <tr key={pair[0]}>
            <td>{pair[0]}</td>
            <td style={{ paddingLeft: 10 }}>
              {typeof pair[1] === 'number'
                ? accounting.formatNumber(pair[1], 2)
                : String(pair[1])}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TradersContainer = (props: Props) => {
  const { traders, cancelBuyOrder, cancelSellOrder } = props;

  const tradersArr = Array.from(traders.values());

  return (
    <div>
      {tradersArr.map((trader, index) => {
        return (
          <div key={trader.name} style={{ marginBottom: '1.5em' }}>
            <strong>{trader.name}</strong>
            {printObject(trader.getDNA())}
            {printObject(trader.getPortfolio())}
            <ManualControl trader={trader} />

            <table style={{ width: '100%' }}>
              <tbody>
                {Array.from(trader.buy_orders).map((order, orderIndex) => (
                  <tr key={`buy${orderIndex}`}>
                    <td>{order.type}</td>
                    <td>{accounting.formatNumber(order.amount_SU, 2)}</td>
                    <td>{accounting.formatNumber(order.amount_mETH, 2)}</td>
                    <td>{accounting.formatNumber(order.price, 2)}</td>
                    <td>
                      <Button onClick={() => cancelBuyOrder(order)}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
                {Array.from(trader.sell_orders).map((order, orderIndex) => (
                  <tr key={`sell${orderIndex}`}>
                    <td>{order.type}</td>
                    <td>{accounting.formatNumber(order.amount_SU, 2)}</td>
                    <td>{accounting.formatNumber(order.amount_mETH, 2)}</td>
                    <td>{accounting.formatNumber(order.price, 2)}</td>
                    <td>
                      <Button onClick={() => cancelSellOrder(order)}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
