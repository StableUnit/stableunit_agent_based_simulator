import { Utility, web4, market_SUETH, market_mETHUSD, market_demand } from "./es6_simulation";
import type { Order } from "./es6_simulation";
// TODO: Interfaces descriptions
// 
// Superclass for the all trader bots with basic shared methods
// class Trader {
//    name: string
//    portfolio: {balance_SU, balance_mETH, }
//    dna: {time_frame, risk, etc} - behavior parameters 
// }
//
// web4 - provies methods for working with Ethereum and StableUnit blockchains
// market_SUETH, market_mETHUSD, market_demand, 
// 
// Superclass for the all trader bots with basic shared methods
interface PortfolioType {
  balance_SU: number;
  balance_mETH: number;
  balance_BONDs?: number;
  balance_SHAREs?: number;
  total_USD?: number;
}
export class Trader {
  name: string;
  // portfolio = {};
  // for access simplicity lets define balances outside of the portfolio dictionary
  balance_SU: number = 0;
  balance_mETH: number = 0;
  balance_BONDs: number = 0;
  balance_SHAREs: number = 0;
  dna = {} as Record<string, any>;
  time_frame: number;
  time_left_until_update: number;
  isActive: boolean = true;
  orders: Set<Order> = new Set();
  ttl: Map<Order, number> = new Map();
  log: Array<string> = [];
  MAX_LOG_LENGTH = 10;

  constructor(name: string, portfolio?: PortfolioType, dna: Record<string, any> = {
    time_frame: 1
  }) {
    this.name = name;

    // this.portfolio.su_wallet = web4.su.createWallet(portfolio.balance_SU);
    // this.portfolio.eth_wallet = web4.eth.createWallet(portfolio.balance_mETH);
    if (portfolio) {
      this.balance_SU = portfolio.balance_SU || 0;
      this.balance_mETH = portfolio.balance_mETH || 0;
      this.balance_BONDs = portfolio.balance_BONDs || 0;
      this.balance_SHAREs = portfolio.balance_SHAREs || 0;
    }

    this.dna = dna;
    this.time_frame = dna.time_frame;
    this.time_left_until_update = 0;
  }

  getPortfolio() {
    let portfolio = {} as PortfolioType
    portfolio.total_USD = 0;

    if (this.balance_SU > 0) {
      portfolio.balance_SU = this.balance_SU;
      portfolio.total_USD += this.balance_SU * market_SUETH.getCurrentValue() * market_mETHUSD.getCurrentValue();
    }

    if (this.balance_mETH > 0) {
      portfolio.balance_mETH = this.balance_mETH;
      portfolio.total_USD += this.balance_mETH * market_mETHUSD.getCurrentValue();
    }

    if (this.balance_BONDs > 0) {
      portfolio.balance_BONDs = this.balance_BONDs;
    }

    if (this.balance_SHAREs > 0) {
      portfolio.balance_SHAREs = this.balance_SHAREs;
    }

    return portfolio;
  }

  getDNA() {
    return this.dna;
  }

  addOrderTTL(order: Order, ttl: number) {
    if (ttl) {
      this.ttl.set(order, ttl);
    }
  }

  addOrder(order: Order) {
    this.orders.add(order);
  }

  updateOrder(order: Order, status?: string) {
    if (status) {
      this.addLog(order.type + " " + status);
    }
  }

  removeOrder(order: Order, status?: string) {
    this.ttl.delete(order);
    this.orders.delete(order);

    if (status) {
      this.addLog(order.type + " " + status);
    }
  }

  addLog(text: string) {
    if (this.log.length > this.MAX_LOG_LENGTH) {
      this.log = []; // this.log.slice(-this.MAX_LOG_LENGTH);
    }

    this.log.push(text);
  }

  update() {
    // update orders ttl and remove expired
    for (let [order, ttl] of this.ttl) {
      this.ttl.set(order, ttl - 1);

      if (--ttl <= 0) {
        this.ttl.delete(order);
        market_SUETH.removeOrder(order);
      }
    }
  }

  ifTimeToUpdate() {
    // return true is there's time to update
    this.time_left_until_update -= 1;

    if (this.time_left_until_update <= 0) {
      this.time_left_until_update = this.time_frame;
      return true && this.isActive;
    } else {
      return false;
    }
  }

  // TODO: rewrite
  rebalance_portfolio_SUETH() {
    // want to hedge portfolio, such worth(SU) ~ worth(ETH)
    let worth_SU = this.balance_SU * market_SUETH.getCurrentValue();
    let worth_ETH = this.balance_mETH;
    let ratio_SU = worth_SU / (worth_SU + worth_ETH);

    if (ratio_SU < 0.03) {
      let deal_mETH = this.balance_mETH / 2;
      let deal_price = market_SUETH.getCurrentValue();
      let deal_SU = deal_mETH * deal_price;
      market_SUETH.addBuyMarketOrder(this, deal_SU);
    } else if (ratio_SU > 0.97) {
      market_SUETH.addSellMarketOrder(this, this.balance_SU / 2);
    }
  }

} // This trader randomly sells and buys some arbitrary amount of SU
// Follows the mood of the market (market_demand)

class RandomTrader extends Trader {
  static DEFAULT_RISK = 0.05; // 5% of the portfolio

  constructor(name: string, portfolio: PortfolioType, dna: {
    time_frame: number;
    risk: number;
  }) {
    super(name, portfolio, dna);
    this.time_frame = dna.time_frame;
  }

  update() {
    let deal_mETH = this.balance_mETH * (this.dna.risk || RandomTrader.DEFAULT_RISK);
    let deal_price = market_SUETH.getCurrentValue();
    let deal_SU = deal_mETH * deal_price;

    if (Math.random() < market_demand.getCurrentValue()) {
      market_SUETH.addBuyMarketOrder(this, deal_SU);
    } else {
      market_SUETH.addSellMarketOrder(this, deal_SU);
    }
  }

} // This trader follows the trend by analysing the Buy/Sell volume ratio of the order book


class TrendMaker extends Trader {
  static DEFAULT_RISK = 0.05;
  static DEFAULT_MARGIN = 0.03;
  static DEFAULT_RATIO = 0.5;

  update() {
    super.update();

    if (this.ifTimeToUpdate()) {
      let orderbook_ratio = market_SUETH.getNormalizedBuySellVolumeRatio();
      if (isNaN(orderbook_ratio)) orderbook_ratio = 0.5;
      // when orderbook is empty
      let deal_price = market_SUETH.getCurrentValue();
      let max_mETH = this.balance_mETH;
      let max_SU = Math.min(max_mETH / deal_price, this.balance_SU);
      let deal_SU = max_SU * (this.dna.risk || TrendMaker.DEFAULT_RISK);

      // if there are more buy orders than sell order
      if (orderbook_ratio > (this.dna.r || TrendMaker.DEFAULT_RATIO)) {
        // means there are more demand therefore we might expect the price go up
        // and benefit by placing selling order for higher price
        let sell_price = deal_price * (1 + (this.dna.margin || TrendMaker.DEFAULT_MARGIN));
        this.addOrderTTL(market_SUETH.addSellLimitOrder(this, deal_SU, sell_price), this.time_frame * 2);
      } else {
        // looks like people tend to sell more than buy
        // means there are more supply therefore the price might go down, so we can buy SU cheaper
        let buy_price = deal_price * (1 - (this.dna.margin || TrendMaker.DEFAULT_MARGIN));
        this.addOrderTTL(market_SUETH.addBuyLimitOrder(this, deal_SU, Math.max(buy_price, 0.001)), this.time_frame * 2);
      }

      this.rebalance_portfolio_SUETH();
    }
  }

} // This trader trying to buy SU during crash when it's very cheap
// and sell it after crash for at least x10 of price


class BuyFDeeps extends Trader {
  SU_DEEP = 0.01;
  ROI = 10;

  update() {
    super.update();

    // buy f***ing deeps
    if (this.balance_mETH > Utility.EPS) {
      let SU_buy_price = this.SU_DEEP;
      let SU_buy_amount = this.balance_mETH / this.SU_DEEP;
      this.addOrderTTL(market_SUETH.addBuyLimitOrder(this, SU_buy_amount, SU_buy_price), this.time_frame);
    }

    // sell peaks
    if (this.balance_SU > Utility.EPS) {
      let SU_sell_price = Math.max(market_SUETH.getCurrentValue(), this.SU_DEEP * this.ROI);
      this.addOrderTTL(market_SUETH.addSellLimitOrder(this, this.balance_SU, SU_sell_price), this.time_frame);
    }
  }

} // BasicTrader uses very simple logic to trade:
// It knows that the SU price will always fluctuates around $1 so
// it buys SU cheaper than $1 and sells it back at $1
// it sells SU for higher than $1 and buys it back at $1
// the trader would like to earn dna.roi from this trade and acts every dna.time_frame ticks


class BasicTrader extends Trader {
  DEFAULT_ROI = 0.1;
  roi: number;
  time_frame: number;

  constructor(name: string, portfolio: PortfolioType, dna: {
    time_frame: number;
    roi?: number;
  }) {
    super(name, portfolio, dna);
    this.time_frame = dna.time_frame;
    this.roi = dna.roi || this.DEFAULT_ROI;
  }

  update() {
    super.update();

    // execute update ones in time_frame ticks
    if (super.ifTimeToUpdate()) {
      // return on investment = (gain from investment – cost of investment) / cost of investment
      // when trading above 1 for 1+x: roi == (1+x - 1)/1 => x == roi
      let SU_high_price_mETH = (1 + this.roi) / market_mETHUSD.getCurrentValue();
      // when trading below 1 for 1-y: roi == (1 - (1-y))/(1-y) == y/(1-y) => y == roi/(roi+1)
      let SU_low_price_mETH = (1 - this.roi / (1 + this.roi)) / market_mETHUSD.getCurrentValue();
      // buying cheap su and believes that price will rise to peg to sell more expensive
      let buy_order = market_SUETH.addBuyLimitOrder(this, this.balance_mETH / SU_low_price_mETH, SU_low_price_mETH);
      this.addOrderTTL(buy_order, this.time_frame);
      // selling high and believes that price will fall to peg to buy cheap again
      let sell_order = market_SUETH.addSellLimitOrder(this, this.balance_SU, SU_high_price_mETH);
      this.addOrderTTL(sell_order, this.time_frame); // ???
      // profit!
    }
  }

} // This is representation of all users who participate in the oracle smart contract


class OracleSpeculator extends Trader {
  update() {
    web4.su.callOracleSM(this, market_mETHUSD.getCurrentValue());
  }

} // This trader earns on differences between market price and SU_reserve price


class ArbitrageUpTrader extends Trader {
  min_deal_eth = 1;
  max_deal_eth = 10;
  margin = 0.1;

  update() {
    super.update();

    if (this.balance_mETH > this.min_deal_eth) {
      // buy SU from the reserve
      let deal_eth = Math.min(this.balance_mETH, this.max_deal_eth);
      let old_balance_SU = this.balance_SU;
      web4.su.buySUfromReserveSM(this, deal_eth);
      let deal_su = this.balance_SU - old_balance_SU;
      let deal_price = deal_eth / deal_su;
      // sell it more expensive on the market
      const ROI = 1 + this.margin;
      this.addOrderTTL(market_SUETH.addSellLimitOrder(this, deal_su, deal_price * ROI), this.time_frame);
    }
  }

}

class ArbitrageDownTrader extends Trader {
  min_deal_su = 10;
  max_su = 10;
  marginality = 0.01; // su

  update() {
    super.update();

    if (this.ifTimeToUpdate()) {
      let deal_mETH = this.balance_mETH; // play hard

      let deal_price_USD = 1.0 - web4.su.D1 - this.marginality;
      let deal_price_ETH = deal_price_USD / market_mETHUSD.getCurrentValue();
      let deal_su = deal_mETH * deal_price_ETH;
      this.addOrderTTL(market_SUETH.addBuyLimitOrder(this, deal_su, deal_price_ETH), this.time_frame);

      if (this.balance_SU > this.max_su) {
        web4.su.sellSUtoReserveSM(this, this.balance_SU);
      }
    }
  }

} // 


export class TraderPool {
  traders: Map<string, Trader> = new Map();

  constructor() {
    // temporary array of traders
    let traders = [];
    // UI traders to play around
    traders.push(new Trader("human_1", {
      balance_SU: 500,
      balance_mETH: 1000
    }));
    traders.push(new Trader("human_2", {
      balance_SU: 5000,
      balance_mETH: 10000
    }));

    // general traders for any kind of markets
    for (let i = 0; i < 5; i++) {
      traders.push(new RandomTrader("random_" + i, Utility.generateRandomPortfolio(3000), {
        risk: Math.random() * 0.02,
        time_frame: Math.round(1 + Math.random() * 5)
      }));
    }

    for (let i = 0; i < 15; i++) {
      traders.push(new TrendMaker("trandMaker_" + i, Utility.generateRandomPortfolio(), {
        risk: Math.random() * 0.3,
        r: Utility.randn_bm(),
        margin: Math.random() * 0.1,
        time_frame: Math.round(1 + Math.random() * 5)
      }));
    }

    for (let i = 0; i < 0; i++) {
      traders.push(new BuyFDeeps("BuyDeeps_" + i, Utility.generateRandomPortfolio(10)));
    }

    // Any stable-price specific traders
    for (let i = 0; i < 5; i++) {
      traders.push(new BasicTrader("basic_" + i, Utility.generateRandomPortfolio(), {
        time_frame: Math.round(1 + Math.random() * 5),
        roi: 0.1 * Math.random()
      }));
    }

    // StableUnit specific traders
    // ---
    // Speculator who feeds SU with market data
    traders.push(new OracleSpeculator("Oracles"));

    for (let i = 0; i < 0; i++) {
      traders.push(new ArbitrageUpTrader("ArbitrageUp_" + i, Utility.generateRandomPortfolio(), {
        time_frame: Math.round(1 + Math.random() * 5)
      }));
    }

    // Arbitrage player who move assets from/to reserve and exchange.
    for (let i = 0; i < 0; i++) {
      traders.push(new ArbitrageDownTrader("ArbitrageDown_" + i, Utility.generateRandomPortfolio(), {
        time_frame: Math.round(1 + Math.random() * 5)
      }));
    }

    // move temporarty array to the public map for external access
    for (let trader of traders) {
      this.traders.set(trader.name, trader);
    }
  }

} // class AlgoTrader extends Trader {
//     margin = 0.05;
//     max_deal_eth = 1;
//     max_deal_su = 1000;
//     update() {
//         super.update();
//         // lets calc current prices in USD
//         // const eth_price = market_ETHUSD.getCurrentValue();
//         // const su_peg_price = 1;
//         // const su_price = market_SUETH.getCurrentValue() * eth_price;
//         // // some prices might be NaN if there are not enought liquidity
//         // const su_sell_price = market_SUETH.getCurrentSellPrice() * eth_price;
//         // const su_buy_price = market_SUETH.getCurrentBuyPrice() * eth_price;
//         // if we can buy cheap SU (cheaper than 1-margin)
//         // we can sell it later for the peg price and get profit (ROI = 1+marginaliry)
//         // let calc price in ETH for SU/ETH market
//         let good_su_sell_price = (1 - this.margin) / market_ETHUSD.getCurrentValue();
//         if (market_SUETH.getCurrentSellPrice() < good_su_sell_price ) {
//             // maximum eth we can afford to stake
//             let max_deal_eth = Math.min(this.max_deal_eth, this.balance_mETH);
//             // calc avaliable cheap su
//             let available_cheap_su = 0;
//             let nessesary_eth = 0;
//             for (let i = market_SUETH.sellOrders.length-1; i >= 0; --i) {
//                 const sellOrder = market_SUETH.sellOrders[i];
//                 if (sellOrder.price < good_su_sell_price) {
//                     if (nessesary_eth + sellOrder.eth_amount <= max_deal_eth) {
//                         nessesary_eth += sellOrder.eth_amount;
//                         available_cheap_su += sellOrder.su_amount;
//                     } else {
//                         let deal_eth = max_deal_eth - nessesary_eth;
//                         let deal_su = deal_eth / sellOrder.price - Utility.EPS;
//                         nessesary_eth += deal_eth;
//                         available_cheap_su += deal_su;
//                         break;
//                     }
//                 } else break;
//             }
//             let deal_su = available_cheap_su;
//             market_SUETH.newMarketBuyOrder(this, deal_su);
//             // lets sell it expensive
//             let deal_eth = deal_su / market_ETHUSD.getCurrentValue();
//             market_SUETH.newLimitSellOrder(this, deal_su, deal_eth);
//         }
//         // // if we can sell SU more than (1+margin), lets do that
//         // // we will buy it again aroun 1 USD for SU because the System deisgned to be stable
//         // let good_su_buy_price = (1 + this.margin) / market_ETHUSD.getCurrentValue();
//         // if (market_SUETH.getCurrentBuyPrice() > good_su_buy_price) {
//         //     let max_deal_su = Math.min(this.max_deal_su, this.balance_SU);
//         //     // calc how much su we can sell with profit
//         // }
//     }
// }