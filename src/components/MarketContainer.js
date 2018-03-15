//@flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { connect } from 'react-redux';


import { colors } from '../theme';

import type { Market, FullState, Order, OrderList } from '../types';

type Props = {
  market: Market
};



const MarketContainer = (props: Props) => {
  const { market } = props;

  return (
    <div>
      <h2>{market.name}</h2>

      Gonna render Order book and Candle sticks
    </div>
  );
};


export default MarketContainer;
