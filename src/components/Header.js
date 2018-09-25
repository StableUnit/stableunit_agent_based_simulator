//@flow

import React, { Component } from 'react';
import styled from 'styled-components';

import logo from '../logo.svg';
import { colors } from '../theme';
import Subscribe from './Subscribe';
import Share from './Share';

type Props = {};

const Wrap = styled.div`
  display: flex;
  padding: 0.625rem;
  padding-top: 1rem;
  width: 100%;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 40px;
`;
const LogoType = styled.span`
  font-size: 1.5em;
  color: ${colors.green};
  margin-left: 0.3em;
`;
const DescriptionContainer = styled.div`
  max-width: 29em;
  padding-right: 40px;
`;
const SubscribeContainer = styled.div`
  padding-right: 40px;
`;
const ShareContainer = styled.div`
  padding-right: 10px;
  padding-top: 20px;
  display: flex;
  align-items: center;
`;
const TimeContainer = styled.div`
  text-align: right;
  flex-grow: 1;
`;


class Header extends Component<Props> {
  render() {
    return (
      <Wrap>
        <LogoContainer>
          <img alt="" src={logo} style={{ width: 36 }} />
          <LogoType>StableUnit</LogoType>
        </LogoContainer>
        <DescriptionContainer>
          This demo simulates the traders' reaction to major media news and
          shows mechanics that StableUnit uses to keep it's price pegged to US
          dollar in a trustless way
        </DescriptionContainer>
        <SubscribeContainer>
          <Subscribe />
        </SubscribeContainer>
        <TimeContainer>
        </TimeContainer>
        <ShareContainer>
          <Share />
        </ShareContainer>
      </Wrap>
    );
  }
}

export default Header;
