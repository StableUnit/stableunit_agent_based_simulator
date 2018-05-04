//@flow

import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';
import { colors } from '../theme';
import accounting from 'accounting';

import type { Traders, Order } from '../models/es6_simulation';
import { Trader } from '../models/es6_simulation';

import ManualControl from './ManualControl';

const f = num => accounting.formatNumber(num, 2);

const format = value => typeof value === 'number' ?
  f(value) : String(value);

function printObject(object) {
  return Object.entries(object).map(([ name, value], index) => (
    <span style={{ paddingRight: '20px' }}>
      <strong>{name}</strong>: { ' ' }
      <span>{format(value)}</span>
    </span>
  ));
}

const Symbol = ({ children }) =>
  <span style={{ color: '#ccc', paddingRight: '10px' }}>{ children }</span>;



type SingleTraderProps = {
  trader: Trader,
  expandAll: bool,
  cancelBuyOrder: Order => {},
  cancelSellOrder: Order => {}
};

type SingleTraderState = {
  expanded: bool
};


class SingleTrader extends React.Component<SingleTraderProps, SingleTraderState> {
  state = {
    expanded: false,
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { trader, expandAll, cancelBuyOrder, cancelSellOrder } = this.props;
    const { expanded } = this.state;
    const portfolio = trader.getPortfolio();
    const { total_USD, balance_SU, balance_mETH, balance_SHAREs, balance_BONDs } = portfolio;

    return (
      <div key={trader.name} style={{ marginTop: '2em' }}>
        <strong>{trader.name}</strong>

        <span style={{ padding: '0 10px' }}>
          {f(balance_SU)}<Symbol>SU</Symbol>
          {f(balance_mETH)}<Symbol>mETH</Symbol>
          (~ {f(total_USD)}$)
        </span>

        <button onClick={this.toggleExpand}>↕</button>

        <div className="traderDNA">
          {printObject(trader.getDNA())}
        </div>

        { (expanded || expandAll) &&
          <div>
            <ManualControl trader={trader} />

            <table style={{ width: '100%' }}>
              <tbody>
                {Array.from(trader.buy_orders).map((order, orderIndex) => (
                  <tr key={`buy${orderIndex}`}>
                    <td>{order.type}</td>
                    <td>{f(order.amount_SU)}</td>
                    <td>{f(order.amount_mETH)}</td>
                    <td>{f(order.price)}</td>
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
                    <td>{f(order.amount_SU)}</td>
                    <td>{f(order.amount_mETH)}</td>
                    <td>{f(order.price)}</td>
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
        }
      </div>
    )
  }
}



type TradersContainerProps = {
  traders: Traders,
  tick: number,
  cancelBuyOrder: Order => {},
  cancelSellOrder: Order => {}
};

type TradersContainerState = {
  expandAll: bool
};

class TradersContainer extends React.Component<TradersContainerProps, TradersContainerState> {
  state = {
    expandAll: false,
  }

  render() {
    const { traders, cancelBuyOrder, cancelSellOrder } = this.props;
    const { expandAll } = this.state;

    const tradersArr = Array.from(traders.values());

    return (
      <div>
        <button onClick={() => this.setState({ expandAll: !expandAll })}>
          expand / collapse all
        </button>
        {
          tradersArr.map((trader, index) =>
            <SingleTrader
              trader={trader}
              cancelBuyOrder={cancelBuyOrder}
              cancelSellOrder={cancelSellOrder}
              expandAll={expandAll}
              key={index}
            />
          )
        }
      </div>
    );
  }
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
