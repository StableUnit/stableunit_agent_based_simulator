import {Simulation} from './es6_simulation';
import {Trader} from './traders'

// https://facebook.github.io/jest/docs/en/expect.html

const simulation = new Simulation();

test('market to initialize', () => {
  expect(simulation.market_SUETH).toBeDefined();
  //expect(simulation.traders.size).toBe(7);
});

test("market works correct", () => {
  let m = simulation.market_SUETH;

  // check that orders are sorted in the expected way
  m.checkInvariant = () => {
    for (let i = 1; i < m.sell_orders.length; i++) {
      if (m.sell_orders[i-1].price < m.sell_orders[i].price) {
        return false;
      }
    }
    for (let i = 1; i < m.buy_orders.length; i++) {
      if (m.buy_orders[i-1].price > m.buy_orders[i].price) {
        return false;
      }
    }
    return true;
  }
  const trader_1 = new Trader("trader_1", {balance_SU: 1000, balance_mETH: 2000});
  const trader_2 = new Trader("trader_2", {balance_SU: 1000, balance_mETH: 2000});
  //m.newLimitBuyOrder(trader_1, 500, 1 );
  m.addBuyLimitOrder(trader_1, 500, 2);
  //m.newLimitSellOrder(trader_2, 1000, 2);
  m.addSellLimitOrder(trader_2, 1000, 2);
  //m.update();
  expect(trader_1.balance_SU).toBe(1500);
  expect(trader_1.balance_mETH).toBe(1000);
  expect(trader_2.balance_SU).toBe(500);
  expect(trader_2.balance_mETH).toBe(3000);
  expect(m.getCurrentValue()).toBe(2);
  //expect(m.newMarketBuyOrder(trader_1, 501)).toBe("The order was partially completed. Not enough sell orders in the queue. ");
  const trader_3 = new Trader("trader_3", {balance_SU: 0, balance_mETH: 10});
  m.addSellLimitOrder(trader_1, 500, 1);
  m.addSellLimitOrder(trader_1, 500, 2);
  m.addSellLimitOrder(trader_1, 500, 3);
  m.addBuyLimitOrder(trader_1, 500, 5);
  m.addBuyLimitOrder(trader_3, 100500, 2);
  m.addBuyMarketOrder(trader_3, 2001);
  expect(trader_3.balance_SU).toBe(5);
  const trader_4 = new Trader("trader_4", {balance_SU: 2000, balance_mETH: 1001});
  m.addBuyLimitOrder(trader_4, 400, 2);
  m.addBuyLimitOrder(trader_4, 70, 2);
  m.addBuyLimitOrder(trader_4, 30, 2);
  m.addBuyLimitOrder(trader_4, 80, 1);
  expect(trader_4.balance_SU).toBe(2500);
  expect(trader_4.balance_mETH).toBe(1);
  expect(m.checkInvariant()).toBe(true);
});


test('ethereum simulation', () => {
    expect(simulation.web4.eth).toBeDefined();
    let this_ = simulation.web4.eth;
    const wallet_1 = this_.createWallet(17234);
    const wallet_2 = this_.createWallet(0);
    expect(this_.sendTransaction(wallet_1.address, 234, wallet_2.address)).toBe(true);
    expect(this_.accounts.get(wallet_1.address)).toBe( 17000);
    expect(this_.sendTransaction(wallet_2.address, 235, wallet_1.address)).toBe(false);
    expect(this_.accounts.get(wallet_2.address)).toBe( 234);
    this_.createTokens(wallet_1.address, "test_token", 17);
    expect(this_.sendToken(wallet_1.address, "test_token", 7, wallet_2.address)).toBe(true);
    // $FlowFixMe
    expect(this_.erc20_tokens.get("test_token").get(wallet_2.address)).toBe(7);
});