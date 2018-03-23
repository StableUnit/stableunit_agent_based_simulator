//@flow
import { Record } from 'immutable';
import nanoid from 'nanoid';
import generateHeadline from '../util/newsGenerator';

import type { RecordFactory } from 'immutable';
import type {
  MediaItemShape,
  MediaImpact,
  MediaItem,
  SimulationState,
  MediaFeed
} from '../types';

export const makeMediaItem: RecordFactory<MediaItemShape> = Record({
  id: nanoid(),
  datetime: Date.now(),
  headline: 'Default headline',
  impressions: 0,
  impact: 1
});

export function generateMediaItem(
  id: string,
  impact: MediaImpact,
  datetime: number
): MediaItem {
  const headline = generateHeadline(impact);
  return makeMediaItem({
    id,
    datetime,
    headline,
    impact
  });
}

// Selectors
// Returns fear level from 0 to 100
export const getFearLevel = (state: SimulationState): number => {
  // Take the array of last news
  // Filter the ones that are one day old already
  // Linear fadeout of effect
  // impact * impressions * datetime of -24hr (now - news.datetime)
  // const newsExpiration = 1000 * 60 * 60 * 24;
  const newsExpiration = 1000 * 60 * 60 * 24;
  const { currentTime } = state;

  const relevantMediaItems = state.mediaFeed.filter(
    item => item.datetime + newsExpiration > currentTime
  );

  const totalImpact = relevantMediaItems.reduce((sum, item) => {
    return (
      sum +
      item.impact *
        item.impressions /
        300000 *
        Math.max(
          (newsExpiration - (currentTime - item.datetime)) / newsExpiration,
          0
        )
    );
  }, 1);

  return Math.min(Math.max(0, 50 + totalImpact * -10), 100);
};

// Reducers
export const addNewsItem = (
  state: SimulationState,
  id: string,
  impact: MediaImpact
): SimulationState =>
  state.update('mediaFeed', (mediaFeed: MediaFeed): MediaFeed => {
    return mediaFeed.set(id, generateMediaItem(id, impact, state.currentTime));
  });

export const updateMediaItemViews = (
  state: SimulationState,
  mediaId: string,
  newViews: number
): SimulationState => {
  // debugger;
  return state.updateIn(
    ['mediaFeed', mediaId],
    (mediaItem: MediaItem): MediaItem =>
      mediaItem.update('impressions', impressions => impressions + newViews)
  );
};
