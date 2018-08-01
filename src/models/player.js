// @flow
import {Simulation, Trader} from './es6_simulation'
import type {Order} from './es6_simulation'

export type BuySellOrder = {
  trader: Trader,
  price?: string,
  quantity?: string
};

export type PlayerOptions = {
  interval: number,
  autoStart: boolean
};

class Player {
  simulation = new Simulation()
  status = ''
  tick = 0
  playing = false
  intervalId: ?IntervalID = null
  events: Function[] = []
  options: PlayerOptions = {
    interval: 500,
    autoStart: false
  }

  constructor(options?: PlayerOptions = this.options) {
    this.options = Object.assign({}, this.options, options);

    if (this.options.autoStart) {
      this.start()
    }
  }

  subscribe(callbackFn: Function) {
    this.events.push(callbackFn)
    callbackFn.call(this, {simulation: this.simulation, status: this.status, tick: this.tick})
  }

  dispatch() {
    this.events.forEach(event => {
      event.call(this, {simulation: this.simulation, status: this.status, tick: this.tick})
    })
  }

  updateSimulation(simulation: Simulation) {
    this.simulation = simulation
    this.tick += 1
  }

  placeLimitBuyOrder = (order: BuySellOrder) => {
    this.status = this.simulation.market_SUETH.newLimitBuyOrder(
      order.trader,
      Number(order.quantity),
      Number(order.price) * Number(order.quantity)
    )
  };

  placeLimitSellOrder = (order: BuySellOrder) => {
    this.status = this.simulation.market_SUETH.newLimitSellOrder(
      order.trader,
      Number(order.quantity),
      Number(order.price) * Number(order.quantity)
    )
  };

  placeMarketBuyOrder = (order: BuySellOrder) => {
    this.status = this.simulation.market_SUETH.buyMarketOrder(
      order.trader,
      Number(order.quantity)
    )
  };

  placeMarketSellOrder = (order: BuySellOrder) => {
    this.status = this.simulation.market_SUETH.sellMarketOrder(
      order.trader,
      Number(order.quantity)
    )
  };

  cancelOrder = (order: Order) => {
    this.simulation.market_SUETH.cancelOrder(order)
  };

  cancelBuyOrder = (order: Order) => {
    this.simulation.market_SUETH.cancelOrder(order)
  }

  cancelSellOrder = (order: Order) => {
    this.simulation.market_SUETH.cancelOrder(order)
  }

  updateStableUnitDeltas = (deltas: { d1: string, d2: string, d3: string, d4: string, d5: string }) => {
    const su = this.simulation.web4.su

    su.D1 = Number(deltas.d1)
    su.D2 = Number(deltas.d2)
    su.D3 = Number(deltas.d3)
    su.D4 = Number(deltas.d4)
    su.D5 = Number(deltas.d5)
  }

  start() {
    if (this.playing) {
      return
    }

    this.playing = true

    window.simulation = this.simulation

    this.intervalId = setInterval(() => {
      this.simulation.update()
      this.updateSimulation(this.simulation)
      this.dispatch()
    }, this.options.interval)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.playing = false
    }
  }
}

export default Player
