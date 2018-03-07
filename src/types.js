export type Trader = {

}

export type Order = {
  price: number,
  amountUsd: number,
  amountCoins: number,
  trader: Trader,
}

export type Exchange = {
  buyOrders: Array<Order>
}

// Type of the simulation state slice
export type SimulationState = {
  tick: number,
  exchange?: Exchange
}

// Type of entire redux store
export type FullState = {
  simulation: SimulationState
}
