//@flow

import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { formatNumber } from 'accounting';

import type { StableSystem, FullState } from '../types';

const StatItem = styled.div`
  margin-bottom: 1em;
`;

const Title = styled.div``;

const StatNumber = styled.div`
  font-size: 200%;
`;

type Props = {
  stableSystem: StableSystem
};

const StableSystemContainer = (props: Props) => {
  const { stableSystem } = props;

  const { log } = stableSystem;
  const lastEntry = log.last();

  return (
    <div>
      {lastEntry && (
        <div>
          <StatItem>
            <Title>Total SU issued</Title>
            <StatNumber>{formatNumber(lastEntry.totalSupply)}</StatNumber>
          </StatItem>
          <StatItem>
            <Title>Piggy bank $</Title>
            <StatNumber>{formatNumber(lastEntry.piggyBankUSD)}</StatNumber>
          </StatItem>
          <StatItem>
            <Title>Piggy bank ETH</Title>
            <StatNumber>{formatNumber(lastEntry.piggyBankETH)}</StatNumber>
          </StatItem>
        </div>
      )}
    </div>
  );
};

const mapState = (state: FullState) => ({
  stableSystem: state.simulation.stableSystem
});

export default connect(mapState)(StableSystemContainer);
