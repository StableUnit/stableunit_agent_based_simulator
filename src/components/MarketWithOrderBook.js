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
  width: 50%;
`;

const MarketContainer = (props: Props) => {
  const { market, title } = props;

  return (
    <div>
        <h3>{title}</h3>
        <Wrap>
          <Half>
            <History market={market} />
          </Half>
          <Half>
            <OrderBook market={market} />
          </Half>
        </Wrap>
    </div>
  );
};

export default MarketContainer;
