//@flow

import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { formatNumber } from 'accounting';

import { colors } from '../theme';

import type { StableSystem, FullState } from '../types';

import StableSystemChart from './StableSystemChart';

const Wrap = styled.div`
  display: flex;
  width: 100%;
`;

const ChartPanel = styled.div`
  width: 330px;
  margin-left: -16px;
`;

const StatItem = styled.div`
  margin-bottom: 1em;
  color: ${({ color }) => color};
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
    <Wrap>
      <ChartPanel>
        <StableSystemChart log={stableSystem.log} />
      </ChartPanel>
      {lastEntry && (
        <div>
          <StatItem color={colors.green}>
            <Title>Total SU issued</Title>
            <StatNumber>{formatNumber(lastEntry.totalSupply)}</StatNumber>
          </StatItem>
          <StatItem color={colors.red}>
            <Title>Piggy bank USD</Title>
            <StatNumber>{formatNumber(lastEntry.piggyBankUSD)}</StatNumber>
          </StatItem>
          <StatItem color={colors.yellow}>
            <Title>Piggy bank ETH</Title>
            <StatNumber>{formatNumber(lastEntry.piggyBankETH)}</StatNumber>
          </StatItem>
        </div>
      )}
    </Wrap>
  );
};

const mapState = (state: FullState) => ({
  stableSystem: state.simulation.stableSystem
});

export default connect(mapState)(StableSystemContainer);
