//@flow
import type { MediaImpact } from '../types';

const stages = [50, 60, 80, 120, 110, 80, 65, 50, 40, 35, 27, 20, 10, 5, 2];
const ITERATIONS_PER_STAGE = 10;

export async function startNewsCycle(id: string, impact: MediaImpact) {
  const koefficient = Math.abs(impact) === 2 ? 40 : 1;
  const countPerStage = Math.floor((3 + Math.random()) * 10 * koefficient);
  for (var i = 0; i < stages.length; i++) {
    for (var j = 0; j < ITERATIONS_PER_STAGE; j++) {
      const currentStage = stages[i];
      const newViews =
        currentStage * countPerStage + Math.floor(Math.random() * 10);
      this.updateMediaItemViews(id, newViews);
      await new Promise(resolve => setTimeout(resolve, 560));
    }
  }
}
