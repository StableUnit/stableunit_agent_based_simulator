//@flow

import React from 'react';
import styled from 'styled-components';

// import type { Market } from '../types';
import {Market_SUmETH} from '../models/es6_simulation';

import OrderBook from './OrderBook';
import History from './History';

type Props = {
  market: Market_SUmETH,
  title: string
};

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Half = styled.div`
  width: 100%;
`;

const MarketWithOrderBook = (props: Props) => {
  const { market, title } = props;

  return (
    <div>
      <Wrap>
        <Half>
          <History market={market} title={title} />
        </Half>
        <Half>
          <OrderBook market={market} />
        </Half>
      </Wrap>
    </div>
  );
};

export default MarketWithOrderBook;
