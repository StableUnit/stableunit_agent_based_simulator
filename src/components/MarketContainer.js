//@flow

import React from 'react';
import styled from 'styled-components';
import Responsive from 'react-responsive';

import type { Market } from '../types';

import OrderBook from './OrderBook';
import CandleSticks from './CandleSticks';

type Props = {
  market: Market
};

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Half = styled.div`
  width: 50%;
`;

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Mobile = props => <Responsive {...props} maxWidth={991} />;

const MarketContainer = (props: Props) => {
  const { market } = props;

  return (
    <div>
      <Desktop>
        <Wrap>
          <Half>
            <CandleSticks market={market} />
          </Half>
          <Half>
            <OrderBook market={market} />
          </Half>
        </Wrap>
      </Desktop>
      <Mobile>
        <Wrap>
          <Half>
            <CandleSticks market={market} mobile />
          </Half>
          <Half>
            <OrderBook market={market} mobile />
          </Half>
        </Wrap>
      </Mobile>
    </div>
  );
};

export default MarketContainer;
