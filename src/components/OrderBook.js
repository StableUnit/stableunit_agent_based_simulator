//@flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { connect } from 'react-redux';

import type { Exchange, FullState, Order } from '../types';

type Props = {
  exchange: Exchange
};

const OrderBook = (props: Props) => {
  const { exchange } = props;

  // Convert data for orderbook
  let bidsAccumulator = 0;
  let asksAccumulator = 0;
  const data = [
    ...exchange.buyOrders
      .sort((a, b) => b.price - a.price)
      .map((order: Order) => {
        bidsAccumulator += order.quantity;
        return ({
          price: order.price,
          bidsQuantity: order.quantity,
          bidsTotalQuantity: bidsAccumulator
        })
      })
      .toArray(),
    ...exchange.sellOrders
      .sort((a, b) => a.price - b.price)
      .map((order: Order) => {
        asksAccumulator += order.quantity;
        return ({
          price: order.price,
          asksQuantity: order.quantity,
          asksTotalQuantity: asksAccumulator
        })
      })
      .toArray()
  ].sort((a, b) => a.price - b.price);

  const style = {
    width: '400px',
    height: '300px'
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
        lineColor: '#0f0',
        type: 'step',
        valueField: 'bidsTotalQuantity'
      },
      {
        id: 'asks',
        fillAlphas: 0.1,
        lineAlpha: 1,
        lineThickness: 2,
        lineColor: '#f00',
        type: 'step',
        valueField: 'asksTotalQuantity'
      },
      {
        lineAlpha: 0,
        fillAlphas: 0.2,
        lineColor: '#000',
        type: 'column',
        clustered: false,
        valueField: 'bidsQuantity'
      },
      {
        lineAlpha: 0,
        fillAlphas: 0.2,
        lineColor: '#000',
        type: 'column',
        clustered: false,
        valueField: 'asksQuantity'
      }
    ],
    categoryField: 'price',
    chartCursor: {},
    valueAxes: [
      {
        title: 'Volume'
      }
    ],
    categoryAxis: {
      title: 'Price (SU/ETH)',
      minHorizontalGap: 100,
      startOnAxis: true,
      showFirstLabel: false,
      showLastLabel: false
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

const mapState = (state: FullState) => ({
  exchange: state.simulation.exchange
});

export default connect(mapState)(OrderBook);
