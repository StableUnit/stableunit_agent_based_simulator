import React, { Component } from 'react';
import styled from 'styled-components';
import { Tile } from 'carbon-components-react';
import { connect } from 'react-redux';

import type { MediaItem, MediaImpact } from '../types';

type Props = {
  style: any,
  mediaItem: MediaItem,
  startNewsCycle: (payload: { mediaId: string, impact: MediaImpact }) => {}
};

const Item = styled(Tile)``;

const ViewCounter = styled.div`
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
  font-size: 0.8em;
  opacity: 0.5;
`;

const Icon = styled.svg`
  width: 14px;
  margin-bottom: -0.2em;
`;

const eyeIcon = (
  <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
    <g transform="matrix(.02146 0 0 .02146 1 1)" fill="#4d4d4d">
      <path d="m466.07 161.53c-205.6 0-382.8 121.2-464.2 296.1-2.5 5.3-2.5 11.5 0 16.9 81.4 174.9 258.6 296.1 464.2 296.1 205.6 0 382.8-121.2 464.2-296.1 2.5-5.3 2.5-11.5 0-16.9-81.4-174.9-258.6-296.1-464.2-296.1m0 514.7c-116.1 0-210.1-94.1-210.1-210.1 0-116.1 94.1-210.1 210.1-210.1 116.1 0 210.1 94.1 210.1 210.1 0 116-94.1 210.1-210.1 210.1" />
      <circle cx="466.08" cy="466.02" r="134.5" />
    </g>
  </Icon>
);

class NewsItem extends Component<Props> {
  render() {
    const { style, mediaItem } = this.props;
    return (
      <Item style={style}>
        {mediaItem.headline}
        <ViewCounter>
          {eyeIcon} {mediaItem.impressions}
        </ViewCounter>
      </Item>
    );
  }
}

const mapDispatch = dispatch => ({
  startNewsCycle: dispatch.simulation.startNewsCycle
});

export default connect(null, mapDispatch)(NewsItem);