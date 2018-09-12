//@flow

import React from 'react';
import { Button } from 'carbon-components-react';
import accounting from 'accounting';

import type { Traders, Order } from '../models/es6_simulation';
import {Trader} from '../models/traders'

import ManualControl from './ManualControl';
import withSimulation from "../util/simulationUpdateHOC"

const f = num => accounting.formatNumber(num, 2);

const format = value => typeof value === 'number' ?
  f(value) : String(value);

function printObject(object) {
  return Object.entries(object).map(([ name, value], index) => (
    <span style={{ paddingRight: '20px' }} key={index}>
      <strong>{name}</strong>: { ' ' }
      <span>{format(value)}</span>
    </span>
  ));
}

function printTraderLogs(logs) {
  let text = "";
  if (logs.length > 0) {
    text = logs[0];
  }
  return (
    <div>
      <span>log: {text}</span>
      <br/>
    </div>
  );
}

const Symbol = ({ children }) =>
  <span style={{ color: '#ccc', paddingRight: '10px' }}>{ children }</span>;


type SingleTraderProps = {
  trader: Trader,
  expandAll: boolean,
  cancelOrder: Order => void
};

type SingleTraderState = {
  expanded: boolean
};

class SingleTrader extends React.Component<SingleTraderProps, SingleTraderState> {
  state = {
    expanded: false,
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { trader, expandAll, cancelOrder } = this.props;
    const { expanded } = this.state;
    const portfolio = trader.getPortfolio();
    const { total_USD, balance_SU, balance_mETH } = portfolio;

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

            <table style={{ width: '60%' }}>
              <tbody>
                {Array.from(trader.orders).sort((a,b) => a.price - b.price).map((order, orderIndex) => (
                  <tr key={`buy${orderIndex}`}>
                    <td>{order.type}</td>
                    <td>{f(order.amount_SU)} SU</td>
                    <td>for {f(order.price)}</td>
                    <td>
                      <Button onClick={() => cancelOrder(order)}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="traderLogs">
              {printTraderLogs(trader.log)}
            </div>

          </div>
        }
      </div>
    )
  }
}

type TradersContainerProps = {
  traders: Traders,
  cancelOrder: Order => void,
};

type TradersContainerState = {
  expandAll: boolean
};

class TradersContainer extends React.Component<TradersContainerProps, TradersContainerState> {
  state = {
    expandAll: false,
  }

  render() {
    const { traders, cancelOrder } = this.props;
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
              cancelOrder={cancelOrder}
              expandAll={expandAll}
              key={index}
            />
          )
        }
      </div>
    );
  }
}

const mapPlayerToProps = player => ({
  traders: player.simulation.traders
});

const mapPlayerMethodsToProps = player => ({
  cancelOrder: player.cancelOrder
});

export default withSimulation(mapPlayerToProps, mapPlayerMethodsToProps)(TradersContainer);
