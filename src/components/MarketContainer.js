//@flow

import React from 'react';
import styled from 'styled-components';

import type { Market } from '../types';

import OrderBook from './OrderBook';
import CandleSticks from './CandleSticks';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Half = styled.div`
  width: 50%;
`;

type Props = {
  market: Market
};

const MarketContainer = (props: Props) => {
  const { market } = props;

  return (
    <div>
      <Wrap>
        <Half>
          <CandleSticks market={market} />
        </Half>
        <Half>
          <OrderBook market={market} />
        </Half>
      </Wrap>
    </div>
  );
};

export default MarketContainer;
