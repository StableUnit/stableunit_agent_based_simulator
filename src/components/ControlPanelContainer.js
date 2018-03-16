//@flow

import React from 'react';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';
import { connect } from 'react-redux';

import Hodlometer from './Hodlometer';
import NewsScroller from './NewsScroller';

const Wrap = styled.div`
  display: flex;
`;

const NewsContainer = styled.div``;

const HodlometerContainer = styled.div`
  width: 300px;
`;

const NewsButton = styled(Button)`
  width: 100%;
  margin-bottom: 0.4em;
`;

type Props = {
  spreadNews: (-2 | 2 | -1 | 1) => {}
};

const ControlPanelContainer = (props: Props) => {
  const { spreadNews } = props;
  return (
    <div>
      <Wrap>
        <HodlometerContainer>
          <Hodlometer />
          <NewsButton onClick={() => spreadNews(1)} kind="secondary">
            Spread good news
          </NewsButton>
          <NewsButton onClick={() => spreadNews(-1)} kind="danger">
            Spread bad news
          </NewsButton>
          <NewsButton onClick={() => spreadNews(2)}>
            Positive Black Swan
          </NewsButton>
          <NewsButton onClick={() => spreadNews(-2)} kind="danger--primary">
            Negative Black Swan
          </NewsButton>
        </HodlometerContainer>
        <NewsScroller />
      </Wrap>
    </div>
  );
};

const mapDispatch = dispatch => ({
  spreadNews: dispatch.simulation.spreadNews
});

export default connect(null, mapDispatch)(ControlPanelContainer);
