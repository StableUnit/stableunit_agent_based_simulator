// @flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

// import type { Order, OrderList } from '../types';

import type { Order } from '../models/es6_simulation';
import { Market_SUmETH } from '../models/es6_simulation';
type Orders = Array<Order>;

type Props = {
  market: Market_SUmETH,
  mobile: boolean
};

type BidOrderEntry = {
  price: number,
  bidsQuantity: number,
  bidsTotalQuantity: number
};

type AskOrderEntry = {
  price: number,
  asksQuantity: number,
  asksTotalQuantity: number
};

type OrderBookData = Array<BidOrderEntry | AskOrderEntry>;

// We can actually create selectors instead of such functions
// Though this function is only used here, so there's no point
function convertDataForChart(
  buyOrders: Orders,
  sellOrders: Orders
): OrderBookData {
  let bidsAccumulator = 0;
  let asksAccumulator = 0;
  return [
    ...buyOrders
      .sort((a, b) => b.price - a.price)
      .map(order => ({ ...order, price: Number(order.price.toFixed(3)) }))
      .reduce((result, next) => {
        bidsAccumulator += next.amount_SU;
        const currentValue = result.get(next.price) || {
          price: next.price,
          bidsQuantity: 0,
          bidsTotalQuantity: 0
        };
        return result.set(next.price, {
          ...currentValue,
          bidsQuantity: currentValue.bidsQuantity +  next.amount_SU,
          bidsTotalQuantity: bidsAccumulator
        });
      }, new Map())
      .values(),

    ...sellOrders
      .sort((a, b) => a.price - b.price)
      .map(order => ({ ...order, price: Number(order.price.toFixed(3)) }))
      .reduce((result, next) => {
        asksAccumulator +=  next.amount_SU;
        const currentValue = result.get(next.price) || {
          price: next.price,
          asksQuantity: 0,
          asksTotalQuantity: 0
        };
        return result.set(next.price, {
          ...currentValue,
          asksQuantity: currentValue.asksQuantity + next.amount_SU,
          asksTotalQuantity: asksAccumulator
        });
      }, new Map())
      .values()
  ].sort((a, b) => a.price - b.price);
}

const OrderBook = (props: Props) => {
  const { market, mobile } = props;

  // Convert data for orderbook
  const data = convertDataForChart([...market.buy_orders], [...market.sell_orders]);

  const style = {
    width: '100%',
    height: mobile ? 150 : 220
  };

  const options = {
    type: 'serial',
    theme: 'light',
    dataProvider: data,
    graphs: [
      {
        id: 'bids',
        fillAlphas: 0.1,
        lineAlpha: 1,
        lineThickness: 2,
        lineColor: colors.green,
        type: 'step',
        valueField: 'bidsTotalQuantity'
      },
      {
        id: 'asks',
        fillAlphas: 0.1,
        lineAlpha: 1,
        lineThickness: 2,
        lineColor: colors.red,
        type: 'step',
        valueField: 'asksTotalQuantity'
      }
    ],
    categoryField: 'price',
    chartCursor: {},
    valueAxes: [
      {
        id: 'cumulativeVolume',
        title: 'Volume (SU)'
      }
    ],
    categoryAxis: {
      title: `Price (ETH)`,
      minHorizontalGap: 0,
      startOnAxis: true,
      showFirstLabel: false,
      showLastLabel: false,
      labelsEnabled: true
    },
    export: {
      enabled: true
    }
  };

  return (
    <div>
      <AmCharts.React style={style} options={options} />
    </div>
  );
};

OrderBook.defaultProps = {
  mobile: false
};

export default OrderBook;
