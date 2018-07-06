import {Simulation, Trader} from './es6_simulation';

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
  const trader_1 = new Trader("trader_1", {balance_SU: 1000, balance_mETH: 2});
  const trader_2 = new Trader("trader_2", {balance_SU: 1000, balance_mETH: 2});
  m.newLimitBuyOrder(trader_1, 500, 1 );
  m.newLimitSellOrder(trader_2, 1000, 2);
  m.update();
  expect(trader_1.balance_SU).toBe(1500);
  expect(trader_1.balance_mETH).toBe(1);
  expect(trader_2.balance_SU).toBe(500);
  expect(trader_2.balance_mETH).toBe(3);
  expect(m.getCurrentValue()).toBe(0.002);
  //expect(m.newMarketBuyOrder(trader_1, 501)).toBe("The order was partially completed. Not enough sell orders in the queue. ");
  const trader_3 = new Trader("trader_3", {balance_SU: 0, balance_mETH: 10});
  m.newLimitSellOrder(trader_1, 500, 1);
  m.newLimitSellOrder(trader_1, 500, 1.5);
  m.newLimitSellOrder(trader_1, 500, 2);
  m.newLimitSellOrder(trader_1, 500, 3);
  m.newLimitBuyOrder(trader_1, 500, 4);
  m.newLimitBuyOrder(trader_3, 2001, 1);
  m.cancelOrder([...trader_3.orders].pop());
  //m.newMarketBuyOrder(trader_3, 2001);
  //expect(trader_3.balance_mETH).toBe(2.5);
  const trader_4 = new Trader("trader_4", {balance_SU: 2000, balance_mETH: 1000});
  m.newLimitBuyOrder(trader_4, 100, 100);
  m.newLimitBuyOrder(trader_4, 90, 100);
  m.newLimitBuyOrder(trader_4, 80, 100);
  m.newLimitBuyOrder(trader_4, 100, 100);
  m.newLimitBuyOrder(trader_4, 90, 100);
  m.newLimitBuyOrder(trader_4, 80, 100);
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