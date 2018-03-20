//@flow

import React from 'react';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';
import { connect } from 'react-redux';
import Responsive from 'react-responsive';

import Hodlometer from './Hodlometer';
import NewsScroller from './NewsScroller';

import type { MediaImpact } from '../types';

type Props = {
  spreadNews: (impact: MediaImpact) => {}
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

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Mobile = props => <Responsive {...props} maxWidth={991} />;

const ControlPanelContainer = (props: Props) => {
  const { spreadNews } = props;

  const buttons = (
    <div>
      <NewsButton onClick={() => spreadNews(1)} kind="secondary">
        Spread good news
      </NewsButton>
      <NewsButton onClick={() => spreadNews(-1)} kind="danger">
        Spread bad news
      </NewsButton>
      <NewsButton onClick={() => spreadNews(2)}>Positive Black Swan</NewsButton>
      <NewsButton onClick={() => spreadNews(-2)} kind="danger--primary">
        Negative Black Swan
      </NewsButton>
    </div>
  );
  return (
    <div>
      <Desktop>
        <Wrap>
          <HodlometerContainer>
            <Hodlometer />
            {buttons}
          </HodlometerContainer>
          <NewsScroller />
        </Wrap>
      </Desktop>
      <Mobile>
        <Wrap>
          <Hodlometer />
          {buttons}
        </Wrap>
        <NewsScroller />
      </Mobile>
    </div>
  );
};

const mapDispatch = dispatch => ({
  spreadNews: dispatch.simulation.spreadNews
});

export default connect(null, mapDispatch)(ControlPanelContainer);
