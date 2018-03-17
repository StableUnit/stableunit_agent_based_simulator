// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import NewsItem from './NewsItem';

import type { MediaFeed } from '../types';

type Props = {
  mediaFeed: MediaFeed
};

const Wrap = styled.div`
  margin-left: 22px;
  flex-grow: 1;
  max-height: 480px;
  overflow: hidden;
`;

class NewsScroller extends Component<Props> {
  render() {
    const { mediaFeed } = this.props;

    if (!mediaFeed) {
      return null;
    }
    return (
      <Wrap>
        {mediaFeed
          .toList()
          .reverse()
          .map((mediaItem, index) => (
            <NewsItem
              key={mediaItem.id}
              style={{ opacity: 1 - index / 7 }}
              mediaItem={mediaItem}
            />
          ))}
      </Wrap>
    );
  }
}

const mapState = state => ({
  mediaFeed: state.simulation.mediaFeed
});

export default connect(mapState)(NewsScroller);
