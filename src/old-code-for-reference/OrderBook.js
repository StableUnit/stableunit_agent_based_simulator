import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

// import type { Order, OrderList } from '../types';

import type {Order} from '../models/es6_simulation';
import {Market_SUETH} from '../models/es6_simulation';
type Orders = Array<Order>;

type Props = {
  market: Market_SUETH,
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
      // .sort((a, b) => b.price - a.price)
      .map((order: Order) => {
        bidsAccumulator += order.su_amount;
        return {
          price: order.price,
          bidsQuantity: order.su_amount,
          bidsTotalQuantity: bidsAccumulator
        };
      })
      ,
    ...sellOrders
      // .sort((a, b) => a.price - b.price)
      .map((order: Order) => {
        asksAccumulator += order.su_amount;
        return {
          price: order.price,
          asksQuantity: order.su_amount,
          asksTotalQuantity: asksAccumulator
        };
      })

  ].sort((a, b) => a.price - b.price);
}

const OrderBook = (props: Props) => {
  const { market, mobile } = props;

  // Convert data for orderbook
  const data = convertDataForChart(market.buyOrders, market.sellOrders);

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
        title: 'Volume'
      }
    ],
    categoryAxis: {
      title: `Price (${market.name})`,
      minHorizontalGap: 100,
      startOnAxis: true,
      showFirstLabel: false,
      showLastLabel: false,
      labelsEnabled: false
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
