//@flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { colors } from '../theme';

import type { Market, FullState, Order, OrderList } from '../types';

import OrderBook from './OrderBook';
import CandleSticks from './CandleSticks';

const Wrap = styled.div`
  display: flex;
  width: 100%;
`;

type Props = {
  market: Market
};

const MarketContainer = (props: Props) => {
  const { market } = props;

  return (
    <div>
      <Wrap>
        <OrderBook market={market} />
        <CandleSticks market={market} />
      </Wrap>
    </div>
  );
};

export default MarketContainer;
