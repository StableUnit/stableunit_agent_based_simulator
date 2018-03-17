//@flow

import { TIME_MULTIPLIER } from '../config';

const startMoment = Date.now();

export function getSimulatedTime(): number {
  const delta = Date.now() - startMoment;
  return startMoment + delta * TIME_MULTIPLIER;
}
