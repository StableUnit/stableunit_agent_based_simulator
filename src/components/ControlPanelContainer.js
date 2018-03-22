//@flow

import React from 'react';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';
import { connect } from 'react-redux';
import Responsive from 'react-responsive';
import { select } from '@rematch/select';
import nanoid from 'nanoid';

import Hodlometer from './Hodlometer';
import NewsScroller from './NewsScroller';

import type { MediaImpact } from '../types';

type Props = {
  addNewsItem: (id: string, impact: MediaImpact) => {},
  startNewsCycle: (id: string, impact: MediaImpact) => {},
  fearLevel: number
};

const Wrap = styled.div`
  display: flex;
`;

const HodlometerContainer = styled.div`
  width: 250px;
`;

const NewsButton = styled(Button)`
  width: 100%;
  margin-bottom: 0.4em;
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
  const { addNewsItem, startNewsCycle, fearLevel } = props;

  console.log('fearLevel', fearLevel);

  function spreadNewsItem(impact) {
    const id = nanoid();
    addNewsItem(id, impact);
    startNewsCycle(id, impact);
  }

  const buttons = (
    <div>
      <NewsButton onClick={() => spreadNewsItem(1)} kind="secondary">
        Spread good news
      </NewsButton>
      <NewsButton onClick={() => spreadNewsItem(-1)} kind="danger">
        Spread bad news
      </NewsButton>
      <NewsButton onClick={() => spreadNewsItem(2)}>
        Positive Black Swan
      </NewsButton>
      <NewsButton onClick={() => spreadNewsItem(-2)} kind="danger--primary">
        Negative Black Swan
      </NewsButton>
    </div>
  );

  const mobileButtons = (
    <div>
      <NewsButton onClick={() => spreadNewsItem(2)}>
        Positive Black Swan
      </NewsButton>
      <NewsButton onClick={() => spreadNewsItem(-2)} kind="danger--primary">
        Negative Black Swan
      </NewsButton>
    </div>
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
  fearLevel: select.simulation.getFearLevel(state)
});

const mapDispatch = dispatch => ({
  addNewsItem: dispatch.simulation.addNewsItem,
  startNewsCycle: dispatch.simulation.startNewsCycle
});

export default connect(mapState, mapDispatch)(ControlPanelContainer);
