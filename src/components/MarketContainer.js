//@flow

import React from 'react';
import styled from 'styled-components';

// import type { Market } from '../types';
import { Market } from '../models/es6_simulation';

import History from './History';

type Props = {
  market: Market,
  title: string
};

const MarketContainer = (props: Props) => {
  const { market, title } = props;

  return (
    <div style={{ flex: 1 }}>
      <h3>{title}</h3>
      <History market={market} />
    </div>
  );
};

export default MarketContainer;
