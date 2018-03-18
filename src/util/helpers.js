export function randomizeByDeviation(value: number, deviation: number): number {
  return value + value * (Math.random() * 2 - 1) * deviation;
}

export function accumulateRandomly(value: number, deviation: number): number {
  return value + value * Math.random() * deviation;
}
