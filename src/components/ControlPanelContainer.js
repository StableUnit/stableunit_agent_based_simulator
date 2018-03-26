//@flow

import React from 'react';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';
import { connect } from 'react-redux';
import Responsive from 'react-responsive';

import Hodlometer from './Hodlometer';
import NewsScroller from './NewsScroller';
import blackSwan from '../black-swan.svg';

type Props = {
  increaseFearLevel: () => {},
  decreaseFearLevel: () => {},
  fearLevel: number
};

const Wrap = styled.div`
  display: flex;
`;

const HodlometerContainer = styled.div`
  width: 250px;
`;

const NewsButton = styled(Button)`
  font-size: 2em;
`;

const ButtonWrap = styled.div`
  text-align: center;
  white-space: nowrap;
  position: relative;
`;

const BlackSwanWrap = styled.span`
  position: absolute;
  width: 26px;
  left: 50%;
  top: -30px;
  margin-left: -13px;
`;

const MobileContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  justify-content: center;
`;

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Mobile = props => <Responsive {...props} maxWidth={991} />;

const ControlPanelContainer = (props: Props) => {
  const { increaseFearLevel, decreaseFearLevel, fearLevel } = props;

  const buttons = (
    <ButtonWrap>
      <BlackSwanWrap>
        <img alt="" src={blackSwan} />
      </BlackSwanWrap>
      <NewsButton onClick={decreaseFearLevel}>–</NewsButton>
      <NewsButton onClick={increaseFearLevel} kind="danger--primary">
        +
      </NewsButton>
    </ButtonWrap>
  );

  const mobileButtons = (
    <ButtonWrap>
      <BlackSwanWrap>
        <img alt="" src={blackSwan} />
      </BlackSwanWrap>
      <NewsButton onClick={decreaseFearLevel}>-</NewsButton>
      <NewsButton onClick={increaseFearLevel} kind="danger--primary">
        +
      </NewsButton>
    </ButtonWrap>
  );
  return (
    <div>
      <Desktop>
        <Wrap>
          <HodlometerContainer>
            <Hodlometer fearLevel={fearLevel} />
            {buttons}
          </HodlometerContainer>
          <NewsScroller />
        </Wrap>
      </Desktop>
      <Mobile>
        <MobileContainer>
          <Hodlometer fearLevel={fearLevel} mobile />
          {mobileButtons}
        </MobileContainer>
      </Mobile>
    </div>
  );
};

const mapState = state => ({
  fearLevel: state.simulation.fearLevel
});

const mapDispatch = dispatch => ({
  increaseFearLevel: dispatch.simulation.increaseFearLevel,
  decreaseFearLevel: dispatch.simulation.decreaseFearLevel
});

export default connect(mapState, mapDispatch)(ControlPanelContainer);
