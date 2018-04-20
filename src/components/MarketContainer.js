//@flow

import React from 'react';
import styled from 'styled-components';

// import type { Market } from '../types';
import { Market } from '../models/es6_simulation';

import History from './History';

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

const MarketContainer = (props: Props) => {
  const { market } = props;

  return (
    <div>
      <Wrap>
        <Half>
          <History market={market} />
        </Half>
      </Wrap>
    </div>
  );
};

export default MarketContainer;
