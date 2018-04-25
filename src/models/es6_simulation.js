// @flow
import assert from 'assert';

const Utility = {
    EPS: 1e-6,
    generateRandomPortfolio() {
        return {balance_SU: Math.round(1000*Math.random()), 
                balance_mETH: Math.round(1000*Math.random())
            };
    },
    randomSuOrder() {
        return Math.round(Math.random()*50);
    },
    simulation_tick: 0
};

// it's very simplified version Ethereum blockhain
class Ethereum {
    // let's define blockchain as [address->value] dictionary
    accounts:Map<string, number> = new Map();
    erc20_tokens:Map<string, Map<string, number>> = new Map();

    // this method is a simplification the real process
    // of creating a new wallet and buying some ETH for fiat
    createWallet(initial_amount = 0) {
        // some random string which looks like eth address
        const public_key = Array(40).fill().map(() =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        .charAt(Math.floor(Math.random() * 62))).join("");
        // we don't simulate security - only general concept of workflow
        const priavte_key = public_key;
        const address = "0x" + public_key;
        // set inititil funds
        this.accounts.set(address, initial_amount);
        return { address, priavte_key };
    }

    // send transation to the network, accounts specify blockchain or tokens balances array
    sendTransaction(address_sender, amount, address_recipient, accounts = this.accounts) {
        if (accounts.has(address_sender)) {
            let balance_sender = accounts.get(address_sender) || 0;
            if (balance_sender >= amount) {
                let balance_recipient = accounts.get(address_recipient) || 0;
                balance_sender -= amount;
                balance_recipient += amount;
                accounts.set(address_sender, balance_sender);
                accounts.set(address_recipient, balance_recipient);
                return true;
            }
        }
        return false;
    }

    // instead of implementing full https://theethereum.wiki/w/index.php/ERC20_Token_Standard,
    // let's use simple token functionality
    createTokens(address_sender: string, token_name: string, amount_supply: number) {
        this.erc20_tokens.set(token_name, new Map([[address_sender, amount_supply]]));
    }

    sendToken(address_sender, token_name: string, amount, address_recipient) {
        if (this.erc20_tokens.has(token_name)) {
            const token_accounts = this.erc20_tokens.get(token_name) || new Map();
            return this.sendTransaction(address_sender, amount, address_recipient, token_accounts);
        }
        return false;
    }

    test() {
        const wallet_1 = this.createWallet(17234);
        const wallet_2 = this.createWallet(0);
        assert.equal(this.sendTransaction(wallet_1.address, 234, wallet_2.address), true);
        assert.equal(this.accounts.get(wallet_1.address), 17000);
        assert.equal(this.sendTransaction(wallet_2.address, 235, wallet_1.address), false);
        assert.equal(this.accounts.get(wallet_2.address), 234);
        this.createTokens(wallet_1.address, "test_token", 17);
        assert.equal(this.sendToken(wallet_1.address, "test_token", 7, wallet_2.address), true);
        // $FlowFixMe
        assert.equal(this.erc20_tokens.get("test_token").get(wallet_2.address), 7);
    }
}

class StableUnit extends Ethereum {
    PEG = 1.0;
    D1 = 0.05;
    D2 = 0.1;
    D3 = 0.15;
    D4 = 0.2;
    D5 = 0.25;

    SUmETH_price: number;
    mETHUSD_price: number;
    SU_price: number;
    SU_circulation: number;

    //reserve_account = {};
    //fundation_account = {};
    reserve_mETH: number;
    reserve_ratio: number;
    BONDS_EMISSION = 0.1; // 10% of the SU in circulation
    BOND_circulation: number;
    BOND_price: number;
    SHARE_circulation: number;
    PARKING_current_ratio = 0.0;

    constructor(ethereum: Ethereum) {
        super();
        // init stabilisation fund with some existing funds (after ICO for example)
        //this.reserve_account = ethereum.createWallet(1000);
        this.reserve_mETH = 1000;
        // create DAO
        //this.fundation_account = this.createWallet(1);
        //this.createTokens(this.fundation_account.address, "SU_DAO", 1000);
        this.SHARE_circulation = 1000;
        // create Bonds as type of token
        //this.createTokens(this.fundation_account.address, "SU_BONDS", 0);
        this.BOND_circulation = 0;
    }

    // Oracle smartcontract takes info from outside
    callOracleSM(mETHUSD_price: number) {
        this.mETHUSD_price = mETHUSD_price;
        this.reserve_ratio = this.reserve_mETH*mETHUSD_price / this.SU_circulation;
    }

    // Not sure yet whether we need SU/ETH or SU/USD as an input for oracle
    callOracleSM2(SUmETH_price: number, mETHUSD_price: number) {
        // reads info from outside world and brings it to the blockchain
        // TODO: checks that prices haven't check too much so nobody is trying to compromize the System
        this.callOracleSM(mETHUSD_price);
        this.SUmETH_price = SUmETH_price;
        const SU_price = SUmETH_price * this.mETHUSD_price;
        this.SU_price = SU_price;

        // expand supply via stablization fund + repaing bonds
        if (this.PEG + this.D1 <= SU_price) {
        }
        // market stabilization
        if (this.PEG - this.D1 < SU_price && SU_price < this.PEG + this.D1) {
        }
        // stablization fund
        if (this.PEG - this.D2 < SU_price && SU_price <= this.PEG - this.D1) {
        }
        // bonds
        if (this.PEG - this.D3 < SU_price && SU_price <= this.PEG - this.D2) {
        }
        // shares
        if (this.PEG - this.D4 < SU_price && SU_price <= this.PEG - this.D3) {
        }
        // temporary parking
        if (this.PEG - this.D5 < SU_price && SU_price <= this.PEG - this.D4) {
        }
    }

    //buySUfromReserveSM(eth_address, amount_eth, txn_sign, su_addr) {
    buySUfromReserveSM(buyer: Trader, amount_mETH: number) {
        // check that sender is owed that money
        if (buyer.balance_mETH >= amount_mETH) {
            // check that SF able to sell SU (always is able)
            // price of SU is 1+delta_S
            let deal_price /*SUETH*/ = (1 + this.D1) /*SU/USD*/ /  this.mETHUSD_price;
            let deal_SU = amount_mETH / deal_price;
            buyer.balance_mETH -= amount_mETH;
            buyer.balance_SU += deal_SU;
            this.SU_circulation += deal_SU;
            return true;
        }
        return false;
    }

    //sellSUtoReserveSM(su_addr, amount_su, txn_sign, eth_addr) {}
    sellSUtoReserveSM(seller: Trader, amount_SU: number) {
        if (seller.balance_SU >= amount_SU) {
            // TODO: calc accurate price according wp
            let deal_price = (1 - this.D1) / this.mETHUSD_price;
            let deal_mETH = amount_SU * deal_price;
            // check that SF able to buy SU (enougth ETH)
            if (this.reserve_mETH < deal_mETH) {
                deal_mETH = Math.min(this.reserve_mETH, deal_mETH);
                // reserve is empty, unlock bonds mechanism
                this.unlockBonds();
            }
            seller.balance_mETH += deal_mETH;
            seller.balance_SU -= amount_SU;
            this.SU_circulation -= amount_SU;
            return true;
        }
    }

    unlockBonds() {
        this.BOND_circulation = this.SU_circulation * this.BONDS_EMISSION;
    }
    // bonds are erc20 tokens so can be store on the same addresses;
    //buyBondsSM(su_addr, amount_su, tnx_sign, eth_addr_erc20token) {}
    buyBondsSM(trader: Trader, amount_SU) {

    }

    sellBondsSM() {}

    // during temporaty freeze only part of fund are avaliable for transaction
    // so we have to reimplement basic transation logic
    sendTransaction(address_sender, amount, address_recipient) {
        // check that avaliable unparked balace is sufficient for transaction
        if ((this.accounts.get(address_sender) || 0) * (1.0 - this.PARKING_current_ratio) >= amount) {
            super.sendTransaction(address_sender, amount, address_recipient);
        }
    }
}

// simple interface of communication with blockchain networks
class Web4 {
    eth: Ethereum;
    su: StableUnit;
    constructor() {
        this.eth = new Ethereum();
        this.su = new StableUnit(this.eth);
    }
}
const web4 = new Web4();

// market of two particular asserts, i.e. ETH/USD, in this case prices are in USD
export class Market {
    name: string;
    history: Array<{ datetime: number, price: number }> = [];
    volatility_factor = 0.05;
    random_change: number;

    constructor(initial_price: number, name: string = 'no_name') {
        this.name = name;
        this.setNewPrice(initial_price);
        this.random_change = initial_price*this.volatility_factor;
    }

    setNewPrice(new_price: number) {
        this.history.push({datetime: Utility.simulation_tick, price: new_price});
    }

    getCurrentPrice() {
        return this.history[this.history.length-1].price;
    }

    addRandomPriceChange() {
        this.setNewPrice(this.getCurrentPrice() + (Math.random()-1/2)*this.random_change);
    }
}
const market_mETHUSD = new Market(0.5 /*USD per mETH */, "mETH/USD");

// https://en.wikipedia.org/wiki/Order_(exchange)
export class Market_SUmETH extends Market {
    buy_orders: Array<Order> = [];
    sell_orders: Array<Order> = [];

    constructor(initial_price: number) {
        super(initial_price, "SUmETH");
    }

    getCurrentBuyPrice() {
        if (this.buy_orders.length > 0)
            return this.buy_orders.slice(-1)[0].price;
        else
            return NaN;
    }
    getCurrentSellPrice() {
        if (this.sell_orders.length > 0)
            return this.sell_orders.slice(-1)[0].price;
        else
            return NaN;
    }

    makeTrade(buyer: Trader, seller: Trader, deal_SU: number, deal_mETH: number) {
        // check that buyer has enougth eth to pay and seller enoguth su to sell
        if (buyer.balance_mETH >= deal_mETH && seller.balance_SU >= deal_SU) {
            buyer.balance_mETH -= deal_mETH;
            seller.balance_mETH += deal_mETH;
            buyer.balance_SU += deal_SU;
            seller.balance_SU -= deal_SU;
            // save this deal in the history
            this.setNewPrice(deal_mETH/deal_SU);
            return true;
        }
        return false;
    }

    newLimitBuyOrder(trader: Trader, amount_SU: number, amount_mETH: number, ttl?: number) {
        if (amount_mETH < Utility.EPS || amount_SU < Utility.EPS) {
            return "Incorrect order";
        }
        // check that the trader can afford that
        if (trader.balance_mETH >= amount_mETH) {
            const order:Order = {
                trader: trader, 
                type: "buy",
                price: amount_mETH / amount_SU,
                amount_SU: amount_SU, 
                amount_mETH: amount_mETH, 
            };
            this.buy_orders.push(order);
            trader.buy_orders.add(order);
            if (ttl) {
                trader.ttl.set(order, ttl);
            }

            // the last item has the highest price
            this.buy_orders.sort((a,b) => a.price - b.price);
            //return {order: order, status: "Added limited buy order"};
            return "Added limited buy order";
        } else {
            //return {status: "No enough ETH"};
            return "No enough ETH";
        }
    }

    newLimitSellOrder(trader: Trader, amount_SU: number, amount_mETH: number, ttl: number = -1) {
        if (amount_mETH < Utility.EPS || amount_SU < Utility.EPS) {
            return "Incorrect order";
        }
        if (trader.balance_SU >= amount_SU) {
            const order:Order = {
                trader: trader, 
                amount_SU: amount_SU, 
                amount_mETH: amount_mETH, 
                price: amount_mETH / amount_SU,
                type: "sell"
            };
            this.sell_orders.push(order);
            trader.sell_orders.add(order);
            if (ttl > 0) {
                trader.ttl.set(order, ttl);
            }
            // the last item has the smallest price
            this.sell_orders.sort((a,b) => b.price - a.price);
            return "Added limited sell order";
        } else {
            return "Not enough SU";
        }
    }

    deleteLimitBuyOrder(order: Order) {
        // remove the order from the market queue
        for (let i = 0; i < this.buy_orders.length; i++) {
            if (this.buy_orders[i] === order) {
                this.buy_orders.splice(i, 1);
            }
        }
        // remove order from trader refference
        order.trader.buy_orders.delete(order);
    }

    deleteLimitSellOrder(order: Order) {
        // remove the order from the market queue
        for (let i = 0; i < this.sell_orders.length; i++) {
            if (this.sell_orders[i] === order) {
                this.sell_orders.splice(i, 1);
            }
        }
        // remove order from trader refference
        order.trader.sell_orders.delete(order);
    }

    deleteLimitOrder(order: Order) {
        if (order.type === "buy") 
            this.deleteLimitBuyOrder(order); 
        else 
            this.deleteLimitSellOrder(order);
    }

    checkInvariant() {
        for (let i = 1; i < this.sell_orders.length; i++) {
            if (this.sell_orders[i-1].price < this.sell_orders[i].price) {
                return false;
            }
        }
        for (let i = 1; i < this.buy_orders.length; i++) {
            if (this.buy_orders[i-1].price > this.buy_orders[i].price) {
                return false;
            }
        }
        return true;
    }
    // This method is trying to complete all possible deals if any available
    update() {
        // check is any limit orders are possible to complete
        while (this.getCurrentBuyPrice() >= this.getCurrentSellPrice()) {
            let buy_order = this.buy_orders.pop();
            buy_order.trader.buy_orders.delete(buy_order);
            let sell_order = this.sell_orders.pop();
            sell_order.trader.sell_orders.delete(sell_order);
            // TODO: make fair exchange
            // temp solution: market doesn't try to earn on this kind of deals
            let deal_price = (buy_order.price + sell_order.price) / 2;
            let deal_SU = Math.min(buy_order.amount_SU, sell_order.amount_SU);
            let deal_mETH = deal_SU * deal_price;
            // make a deal between buyer and seller
            if( this.makeTrade(buy_order.trader, sell_order.trader, deal_SU, deal_mETH) ) {
                buy_order.amount_SU -= deal_SU;
                buy_order.amount_mETH -= deal_mETH;
                sell_order.amount_SU -= deal_SU;
                sell_order.amount_mETH -= deal_mETH;
            }
            // if the one of the orders is only partially completed - add reminder back
            if (sell_order.amount_SU > Utility.EPS) {
                //this.sell_orders.push(sell_order);
                //sell_order.trader.sell_orders.add(sell_order);
                this.newLimitSellOrder(sell_order.trader, sell_order.amount_SU, sell_order.amount_mETH);
            }
            if (buy_order.amount_SU > Utility.EPS) {
                // this.buy_orders.push(buy_order);
                // buy_order.trader.buy_orders.add(buy_order);
                this.newLimitBuyOrder(buy_order.trader, buy_order.amount_SU, buy_order.amount_mETH);
            }
        }
    }

    // A market order is a buy or sell order to be executed immediately at current market prices.
    // Like pacman it eats all avalibile sell order until reach su_amount
    newMarketBuyOrder(buyer: Trader, amount_SU: number) {
        let status_prefix = "Order was not completed. ";
        // if orderbook has sell orders and buyer is still wants to buy
        while (this.sell_orders.length > 0 && amount_SU > Utility.EPS) {
            // take the cheapest one
            let sell_order = this.sell_orders.pop();
            sell_order.trader.sell_orders.delete(sell_order);
            // calc the deal details
            let deal_price = sell_order.price;
            let deal_SU = Math.min(amount_SU, sell_order.amount_SU);
            let deal_ETH = deal_SU*deal_price;
            // try to make a deal
            if (this.makeTrade(buyer, sell_order.trader, deal_SU, deal_ETH)) {
                status_prefix = "The order was partialy completed. ";
                amount_SU -= deal_SU;
                sell_order.amount_SU -= deal_SU;
                sell_order.amount_mETH -= deal_ETH;
                // if the sell order is only partially completed - add reminder back
                if (sell_order.amount_SU > Utility.EPS) {
                    // this.sell_orders.push(sell_order);
                    // sell_order.trader.sell_orders.add(sell_order);
                    this.newLimitSellOrder(sell_order.trader, sell_order.amount_SU, sell_order.amount_mETH);
                }
            }
        }
        if (amount_SU <= Utility.EPS) {
            return "Market buy order was completed. ";
        } else {
            if (this.sell_orders.length === 0) {
                return status_prefix + "Not enough sell orders in the queue. ";
            } else {
                return status_prefix + "Not enough ETH to buy. ";
            }
        }
    }

    newMarketSellOrder(seller: Trader, amount_SU: number) {
        let status_prefix = "Order was not completed. ";
        if (seller.balance_SU < amount_SU) {
            return status_prefix + "Not enough SU to sell. ";
        }
        // if orderbook has sell orders and buyer is still wants to buy
        while (this.buy_orders.length > 0 && amount_SU > Utility.EPS) {
        // take the cheapest one
            let buy_order = this.buy_orders.pop();
            buy_order.trader.buy_orders.delete(buy_order);
            // calc the deal details
            let deal_price = buy_order.price;
            let deal_SU = Math.min(amount_SU, buy_order.amount_SU);
            let deal_mETH = deal_SU*deal_price;
            // try to make a deal
            if (this.makeTrade(buy_order.trader, seller, deal_SU, deal_mETH)) {
                status_prefix = "The order was partialy completed. ";
                amount_SU -= deal_SU;
                buy_order.amount_SU -= deal_SU;
                buy_order.amount_mETH -= deal_mETH;
                // if the sell order is only partially completed - add reminder back
                if (buy_order.amount_SU > Utility.EPS) {
                    // this.buy_orders.push(buy_order);
                    // buy_order.trader.buy_orders.add(buy_order);
                    this.newLimitBuyOrder(buy_order.trader, buy_order.amount_SU, buy_order.amount_mETH);
                }
            }
        }
        if (amount_SU <= Utility.EPS) {
            return "Market sell order was completed. ";
        } else {
            if (this.buy_orders.length === 0) {
                return status_prefix + "Not enough buy orders in the queue. ";
            } else {
                throw new Error("Market sell order error!");
            }
        }
    }

    test() {
        const trader_1 = new Trader("trader_1", {balance_SU: 1000, balance_mETH: 2});
        const trader_2 = new Trader("trader_2", {balance_SU: 1000, balance_mETH: 2});
        this.newLimitBuyOrder(trader_1, 500, 1 );
        this.newLimitSellOrder(trader_2, 1000, 2);
        this.update();
        assert.equal(trader_1.balance_SU, 1500);
        assert.equal(trader_1.balance_mETH, 1);
        assert.equal(trader_2.balance_SU, 500);
        assert.equal(trader_2.balance_mETH, 3);
        assert.equal(this.getCurrentPrice(), 0.002);
        assert.equal(this.newMarketBuyOrder(trader_1, 501), "The order was partialy completed. Not enough sell orders in the queue. ");
        const trader_3 = new Trader("trader_3", {balance_SU: 0, balance_mETH: 10});
        this.newLimitSellOrder(trader_1, 500, 1);
        this.newLimitSellOrder(trader_1, 500, 1.5);
        this.newLimitSellOrder(trader_1, 500, 2);
        this.newLimitSellOrder(trader_1, 500, 3);
        this.newLimitBuyOrder(trader_1, 500, 4);
        this.newLimitBuyOrder(trader_3, 2001, 1);
        this.deleteLimitBuyOrder([...trader_3.buy_orders].pop());
        this.newMarketBuyOrder(trader_3, 2001);
        assert.equal(trader_3.balance_mETH, 2.5);
        const trader_4 = new Trader("trader_4", {balance_SU: 2000, balance_mETH: 1000});
        this.newLimitBuyOrder(trader_4, 100, 100);
        this.newLimitBuyOrder(trader_4, 90, 100);
        this.newLimitBuyOrder(trader_4, 80, 100);
        this.newLimitBuyOrder(trader_4, 100, 100);
        this.newLimitBuyOrder(trader_4, 90, 100);
        this.newLimitBuyOrder(trader_4, 80, 100);
        assert.equal(this.checkInvariant(), true);
        
    }
}
const market_SUETH = new Market_SUmETH(0.002/* ETH per SU */);

export class Trader {
    name: string;
    //portfolio = {};
    dna = {};
    balance_SU: number;
    balance_mETH: number;
    balance_BONDs: number;
    balance_SHAREs: number;

    time_frame: number;
    time_left_until_update: number;

    buy_orders: Set<Order> = new Set();
    sell_orders: Set<Order> = new Set();
    ttl: Map<Order, number> = new Map();

    constructor(name: string, portfolio: {balance_SU: number, balance_mETH: number}, dna: Object = {}, time_frame: number = 1) {
        this.name = name;
        // this.portfolio.su_wallet = web4.su.createWallet(portfolio.balance_SU);
        // this.portfolio.eth_wallet = web4.eth.createWallet(portfolio.balance_mETH);
        this.balance_SU = portfolio.balance_SU;
        this.balance_mETH = portfolio.balance_mETH;
        this.balance_BONDs = 0;
        this.balance_SHAREs = 0;
        this.dna = dna;
        this.time_frame = time_frame;
        this.time_left_until_update = 0;
    }
    
    getPortfolio() {
        let portfolio = {};
        portfolio.total_USD = 0;
        if (this.balance_SU > 0) {
            portfolio.balance_SU = this.balance_SU;
            portfolio.total_USD += this.balance_SU * market_SUETH.getCurrentPrice() * market_mETHUSD.getCurrentPrice();
        } 
        if (this.balance_mETH > 0) {
            portfolio.balance_mETH = this.balance_mETH;
            portfolio.total_USD += this.balance_mETH * market_mETHUSD.getCurrentPrice();
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

    update() {
        // update orders ttl and remove expired
        for (let [order, ttl] of this.ttl) {
            this.ttl.set(order, ttl-1);
            if (--ttl <= 0) {
                this.ttl.delete(order);
                market_SUETH.deleteLimitOrder(order);
            }
        }
    }

    isTimeToUpdate() {
        // return true is there's time to update
        this.time_left_until_update -= 1;
        if (this.time_left_until_update <= 0) {
            this.time_left_until_update = this.time_frame;
            return true;
        } else {
            return false;
        } 
    }

    // getEthBalance() {
    //     return web4.eth.accounts.get(this.portfolio.eth_wallet.address) || 0;
    // }

    // getSuBalance() {
    //     return web4.su.accounts.get(this.portfolio.su_wallet.address) || 0;
    // }

    test() {
        // let returned_status = market_SUETH.newLimitBuyOrder(this, 1*Math.random(), 0.1);
        // if (returned_status.order !== undefined) {
        //     returned_status.order.type = "buy";
        //     this.ttl.set( returned_status.order, 5);
        // } 
    }
}

export type Order = {
    trader: Trader;
    type?:string;
    price: number;
    amount_SU: number;
    amount_mETH: number;
}

export type Traders = Map<string, Trader>;

// SimpleTrader uses very simple logic to trade:
// It know that the SU price will always fluctate around $1 so
// if trader' dna.type is "bull" - it buys SU cheaper than $1 and sells it back at $1
// if trader' dna.type is "bear" - it sells SU for higher than $1 and buys it back at $1
// the trader whould like to earn dna.roi from this trade and acts every dna.time_frame ticks
class SimpleTrader extends Trader {
    DEFAULT_ROI = 0.1;
    roi: number;
    type: string;
    time_frame: number; 

    constructor(name:string, portfolio, dna:{type: string, time_frame: number, roi?: number}) {
        super(name, portfolio, dna, dna.time_frame);
        this.type = dna.type;
        this.time_frame = dna.time_frame;
        this.roi = dna.roi || this.DEFAULT_ROI;
    }
    update() {
        super.update();
        // execute update ones in time_frame ticks
        if (super.isTimeToUpdate()) {
            let SU_peg_price_mETH = 1 / market_mETHUSD.getCurrentPrice();
            // return on investment = (gain from investment – cost of investment) / cost of investment
            // when trading above 1 for 1+x: roi == (1+x - 1)/1 => x == roi
            let SU_high_price_mETH = (1+this.roi) / market_mETHUSD.getCurrentPrice();
            // when trading below 1 for 1-y: roi == (1 - (1-y))/(1-y) == y/(1-y) => y == roi/(roi+1)
            let SO_low_price_mETH = (1-this.roi/(1+this.roi)) / market_mETHUSD.getCurrentPrice();
            //if (this.type === "bull") {
                // buying cheap su and belive that price will rise to peg
                market_SUETH.newLimitBuyOrder(this, this.balance_mETH / SO_low_price_mETH, this.balance_mETH, this.time_frame);
              //  market_SUETH.newLimitSellOrder(this, this.balance_mETH / (SU_peg_price_mETH-Utility.EPS), this.balance_mETH, this.time_frame);
            //} else {
                // selling hight and belibe that price will fall to peg
                //market_SUETH.newLimitBuyOrder(this, this.balance_mETH / (SU_peg_price_mETH+Utility.EPS), this.balance_mETH, this.time_frame);
                market_SUETH.newLimitSellOrder(this, this.balance_mETH / SU_high_price_mETH, this.balance_mETH, this.time_frame);
            //}
        }
    }
}

// This trader randomly sells and buys some arbitary amount of SU
class RandomTrader extends Trader {
    trade_freqnefy: number = 0.5;
    update() {
        super.update();
        if (super.isTimeToUpdate()) {
            if (Math.random() < 1/2) {
                market_SUETH.newMarketBuyOrder(this, Utility.randomSuOrder());
            } else {
                market_SUETH.newMarketSellOrder(this, Utility.randomSuOrder());
            }
        }
    }
}




export class Simulation {
    web4: Web4;
    market_ETHUSD: Market;
    market_SUETH: Market_SUmETH;
    traders: Traders = new Map();
    
    // takes callBack funtions for visualisation
    constructor() {
    
        // init all instances of the simulation:
        // blokchains,
        this.web4 = web4;
        // exchanges,
        this.market_ETHUSD = market_mETHUSD;
        this.market_SUETH = market_SUETH;
        // traders
        let traders = [];
        traders.push(new Trader("human_1", {balance_SU: 1000, balance_mETH: 500}));
        traders.push(new Trader("human_2",{balance_SU: 2000, balance_mETH: 1000}));
        // traders.push(new SimpleTrader(  
        //     "simple_bull_1", 
        //     Utility.generateRandomPortfolio(), 
        //     {type: "bull", time_frame: 2, roi: 0.2}));
        // traders.push(new SimpleTrader(
        //     "simple_bull_2", 
        //     Utility.generateRandomPortfolio(), 
        //     {type: "bull", time_frame: 1, roi: 0.1}));
        // traders.push(new SimpleTrader(
        //     "simple_bear_1", 
        //     Utility.generateRandomPortfolio(), 
        //     {type: "bear", time_frame: 2, roi: 0.2}));
        // traders.push(new SimpleTrader(
        //     "simple_bear_2", 
        //     Utility.generateRandomPortfolio(), 
        //     {type: "bear", time_frame: 1, roi: 0.1}));
        for (let i = 0; i < 10; i++) {
            traders.push(new SimpleTrader(
                "simple_" + i,
                Utility.generateRandomPortfolio(),
                {type:"none", time_frame: Math.round(1+Math.random()*5), roi: 0.3*Math.random()}
            ));
        }
        // traders.push(new RandomTrader("random_t1", Utility.generateRandomPortfolio(), {}, 3));
        // traders.push(new RandomTrader("random_t2", Utility.generateRandomPortfolio(), {}, 5));
        for (let i = 0; i < 5; i++) {
            traders.push(new RandomTrader(
                "random_" + i,
                Utility.generateRandomPortfolio(),
                {time_frame: Math.round(1+Math.random()*5)}
            ));
        }
        for (let trader of traders) {
            this.traders.set(trader.name, trader);
        }
        //this.traders.set("arbitrage_1", new ArbitrageUpTrader(Utility.generateRandomPortfolio()));
        //this.traders.set("algo_1", new AlgoTrader(Utility.generateRandomPortfolio()));
        // tests
        //market_SUETH.test();
        // for (let [, trader] of this.traders) {
        //     trader.test();
        // }
        
    }
    // execute one tick of the simulation
    update() {
        // generate inputs
        market_mETHUSD.addRandomPriceChange();
        web4.su.callOracleSM(market_mETHUSD.getCurrentPrice());
        
        // simulation exectution
        for (let [, trader] of this.traders) {
            trader.update();
            // if( !market_SUETH.checkInvariant() ) {
            //     console.log(trader);
            //     debugger;
            // }
        }
        market_SUETH.update();

        // updates
        Utility.simulation_tick += 1;
        console.log(Utility.simulation_tick);
    }
}

// // This trader earns on differences between market price and SU reserve price
// class ArbitrageUpTrader extends Trader {
//     min_deal_eth = 1;
//     max_deal_eth = 10;
//     marginality = 0.1;

//     update() {
//         super.update();
//         if (this.balance_mETH > this.min_deal_eth) {
//             // buy SU from the reserve
//             let deal_eth = Math.min(this.balance_mETH, this.max_deal_eth);
//             let old_balance_SU = this.balance_SU;
//             web4.su.buySUfromReserveSM(this, deal_eth);
//             let deal_su = this.balance_SU - old_balance_SU;
//             let deal_price = deal_eth / deal_su;
//             // sell it more expensive on the market
//             const ROI = 1 + this.marginality;
//             market_SUETH.newLimitSellOrder(this, deal_su, deal_su*deal_price*ROI);
//         }
//     }
// }

// class ArbitrageDownTrader extends Trader {

// }

// class AlgoTrader extends Trader {
//     marginality = 0.05;
//     max_deal_eth = 1;
//     max_deal_su = 1000;
//     update() {
//         super.update();
//         // lets calc current prices in USD
//         // const eth_price = market_ETHUSD.getCurrentPrice();
//         // const su_peg_price = 1;
//         // const su_price = market_SUETH.getCurrentPrice() * eth_price;
//         // // some prices might be NaN if there are not enought liquidity
//         // const su_sell_price = market_SUETH.getCurrentSellPrice() * eth_price;
//         // const su_buy_price = market_SUETH.getCurrentBuyPrice() * eth_price;

//         // if we can buy cheap SU (cheaper than 1-marginality)
//         // we can sell it later for the peg price and get profit (ROI = 1+marginaliry)
//         // let calc price in ETH for SU/ETH market
//         let good_su_sell_price = (1 - this.marginality) / market_ETHUSD.getCurrentPrice();
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
//             let deal_eth = deal_su / market_ETHUSD.getCurrentPrice();
//             market_SUETH.newLimitSellOrder(this, deal_su, deal_eth);
//         }

//         // // if we can sell SU more than (1+marginality), lets do that
//         // // we will buy it again aroun 1 USD for SU because the System deisgned to be stable
//         // let good_su_buy_price = (1 + this.marginality) / market_ETHUSD.getCurrentPrice();
//         // if (market_SUETH.getCurrentBuyPrice() > good_su_buy_price) {
//         //     let max_deal_su = Math.min(this.max_deal_su, this.balance_SU);
//         //     // calc how much su we can sell with profit

//         // }
//     }
// }