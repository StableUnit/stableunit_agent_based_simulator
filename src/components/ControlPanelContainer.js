import React from 'react';
import styled from 'styled-components';
import { Button } from 'carbon-components-react';

import Hodlometer from './Hodlometer';

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

const ControlPanelContainer = () => {
  return (
    <div>
      <Wrap>
        <HodlometerContainer>
          <Hodlometer />
          <NewsButton kind="secondary">Spread good news</NewsButton>
          <NewsButton kind="danger">Spread bad news</NewsButton>
          <NewsButton>Positive Black Swan</NewsButton>
          <NewsButton kind="danger--primary">Negative Black Swan</NewsButton>
        </HodlometerContainer>
        <div>Scrolling list of news</div>
      </Wrap>
    </div>
  );
};

export default ControlPanelContainer;
