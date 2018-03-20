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

export function generateMediaItem(id: string, impact: MediaImpact): MediaItem {
  const headline = generateHeadline(impact);
  return makeMediaItem({
    id,
    datetime: Date.now(),
    headline
  });
}

export const spreadNews = (
  state: SimulationState,
  impact: MediaImpact
): SimulationState =>
  state.update('mediaFeed', (mediaFeed: MediaFeed): MediaFeed => {
    const id = nanoid();
    return mediaFeed.set(id, generateMediaItem(id, impact));
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
