// @flow
import assert from 'assert';

const Utility = {
    EPS: 1e-6,
    DEFAULT_SUUSD_PRICE: 1,
    DEFAULT_ETHUSD_PRICE: 500,
    generateRandomPortfolio(worth_USD = 1000) {
        //let balance_ETH_USD = worth_USD;
        // let balance_ETH_USD = worth_USD* Math.random();
        // let balance_SU_USD = worth_USD - balance_ETH_USD;
        // //let balance_mETH = Math.round(balance_ETH_USD / Utility.DEFAULT_ETHUSD_PRICE * 1000);
        // let balance_SU = Math.round(balance_SU_USD / Utility.DEFAULT_SUUSD_PRICE);
        // convert USD into ETH
        let balance_mETH = worth_USD / Utility.DEFAULT_ETHUSD_PRICE * 1000;
        let deal_mETH = balance_mETH * /*Utility.randn_bm()*/ 0.5;
        let deal_SU = web4.su.buySU(deal_mETH);
        balance_mETH -= deal_mETH;
        return {
            balance_SU: deal_SU,
            balance_mETH: balance_mETH,
        };
    },
    randn_bm() {
        var u = 0, v = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return this.randn_bm(); // resample between 0 and 1
        return num;
    },
    normalize_ratio(r: number) {
        // map r in [0..+inf] ot [0..1]
        return 1 - (1/(1+r));
    },
    simulation_tick: 0
};

// it's very simplified version Ethereum blockchain
class Ethereum {
    // let's define blockchain as [address->value] dictionary
    accounts: Map<string, number> = new Map();
    erc20_tokens: Map<string, Map<string, number>> = new Map();

    // this method is a simplification the real process
    // of creating a new wallet and buying some ETH for fiat
    createWallet(initial_amount: number = 0) {
        // some random string which looks like eth address
        const public_key = Array(40).fill().map(() =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                .charAt(Math.floor(Math.random() * 62))).join("");
        // we don't simulate security - only general concept of workflow
        const priavte_key = public_key;
        const address = "0x" + public_key;
        // set inititil funds
        this.accounts.set(address, initial_amount);
        return {address, priavte_key};
    }

    // send transation to the network, accounts specify blockchain or tokens balances array
    sendTransaction(address_sender: string, amount: number, address_recipient: string, accounts: Map<string, number> = this.accounts) {
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

    sendToken(address_sender: string, token_name: string, amount: number, address_recipient: string) {
        if (this.erc20_tokens.has(token_name)) {
            const token_accounts = this.erc20_tokens.get(token_name) || new Map();
            return this.sendTransaction(address_sender, amount, address_recipient, token_accounts);
        }
        return false;
    }
}

// StableUnit blockchain is an extension of Ethereum
export class StableUnit extends Ethereum {
    PEG = 1.0;
    D1 = 0.05;
    D2 = 0.1;
    D3 = 0.15;
    D4 = 0.2;
    D5 = 0.25;
    ORACLE_REWARD = 0.1;

    SUmETH_price: number;
    mETHUSD_price: number = 0.5;
    SU_price: number;
    SU_circulation: number = 0;

    //reserve_account = {};
    //fundation_account = {};
    reserve_mETH: number = 0;
    reserve_ratio: number = 0;
    BONDS_EMISSION = 0.1; // 10% of the SU in circulation
    REPO_circulation: number;
    REPO_price: number;
    SU_DAO_TOKEN_circulation: number;
    PARKING_current_ratio = 0.0;

    constructor(ethereum: Ethereum) {
        super();
        this.SU_circulation = 0;
        // init stabilisation fund with some existing funds (after ICO for example)
        //this.reserve_account = ethereum.createWallet(1000);
        this.reserve_mETH = 0;
        // create DAO
        //this.fundation_account = this.createWallet(1);
        //this.createTokens(this.fundation_account.address, "SU_DAO", 1000);
        this.SU_DAO_TOKEN_circulation = 0;
        // create Bonds as type of token
        //this.createTokens(this.fundation_account.address, "SU_BONDS", 0);
        this.REPO_circulation = 0;
    }

    daico() {

    }

    // Oracle smartcontract takes info from outside
    callOracleSM(trader: Trader, mETHUSD_price: number) {
        this.mETHUSD_price = mETHUSD_price;
        this.reserve_ratio = this.reserve_mETH * mETHUSD_price / this.SU_circulation;
        trader.balance_SU += this.ORACLE_REWARD;
        this.SU_circulation += this.ORACLE_REWARD;
    }

    // Not sure yet whether we need SU/ETH or SU/USD as an input for oracle
    // callOracleSM2(SUmETH_price: number, mETHUSD_price: number) {
    //     // reads info from outside world and brings it to the blockchain
    //     // TODO: checks that prices haven't check too much so nobody is trying to compromize the System
    //     this.callOracleSM(mETHUSD_price);
    //     this.SUmETH_price = SUmETH_price;
    //     const SU_price = SUmETH_price * this.mETHUSD_price;
    //     this.SU_price = SU_price;
    //
    //     // expand supply via stabilization fund + reaping bonds
    //     if (this.PEG + this.D1 <= SU_price) {
    //     }
    //     // market stabilization
    //     if (this.PEG - this.D1 < SU_price && SU_price < this.PEG + this.D1) {
    //     }
    //     // stabilization fund
    //     if (this.PEG - this.D2 < SU_price && SU_price <= this.PEG - this.D1) {
    //     }
    //     // bonds
    //     if (this.PEG - this.D3 < SU_price && SU_price <= this.PEG - this.D2) {
    //     }
    //     // shares
    //     if (this.PEG - this.D4 < SU_price && SU_price <= this.PEG - this.D3) {
    //     }
    //     // temporary parking
    //     if (this.PEG - this.D5 < SU_price && SU_price <= this.PEG - this.D4) {
    //     }
    // }

    //buySUfromReserveSM(eth_address, amount_eth, txn_sign, su_addr) {
    buySUfromReserveSM(buyer: Trader, amount_mETH: number) {
        // check that sender is owed that money
        if (buyer.balance_mETH >= amount_mETH) {
            // check that SF able to sell SU (always is able)
            // price of SU is 1+delta_S
            let deal_price = (1 + this.D1) / this.mETHUSD_price;
            let deal_SU = amount_mETH / deal_price;
            buyer.balance_mETH -= amount_mETH;
            buyer.balance_SU += deal_SU;
            this.reserve_mETH += amount_mETH;
            this.SU_circulation += deal_SU;
            return true;
        }
        return false;
    }

    buySU(amount_mETH: number) {
        let deal_price = (1 + this.D1) / this.mETHUSD_price;
        let deal_SU = amount_mETH / deal_price;
        this.reserve_mETH += amount_mETH;
        this.SU_circulation += deal_SU;
        return deal_SU;
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
            this.reserve_mETH -= deal_mETH;
            return true;
        }
        return false;
    }

    unlockBonds() {
        this.REPO_circulation = this.SU_circulation * this.BONDS_EMISSION;
    }

    // bonds are erc20 tokens so can be store on the same addresses;
    //buyBondsSM(su_addr, amount_su, tnx_sign, eth_addr_erc20token) {}
    buyBondsSM(trader: Trader, amount_SU: number) {

    }

    sellBondsSM() {
    }

    // during temporaty freeze only part of fund are avaliable for transaction
    // so we have to reimplement basic transation logic
    sendTransaction(address_sender: string, amount: number, address_recipient: string) {
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

// Generic class for generating, adding and storing values for market
// such as price history, market demand etc
export class Market {
    name: string;
    history: Array<{ datetime: number, price: number }> = [];

    volatility_factor = 0.05;
    random_change: number;

    constructor(initial_value: number, name: string = 'no_name') {
        this.name = name;
        this.setNewValue(initial_value);
        this.random_change = initial_value * this.volatility_factor;
    }

    setNewValue(new_price: number) {
        this.history.push({datetime: Utility.simulation_tick, price: new_price});
    }

    getCurrentValue() {
        return this.history[this.history.length - 1].price;
    }

    addValueRandomMove() {
        let rand = Math.random() - 0.5; // liner [-½ .. ½]
        let newValue = Math.max(this.getCurrentValue() + rand * this.random_change, 0);
        this.setNewValue(newValue);
    }

    addValueNormRandomMove() {

    }

    addValueHistoricalData() {

    }
}

// In this simulation we're going to use milliEther as the more convenient
// unit of measurement for Ether value in SU/ETH exchange
const market_mETHUSD = new Market(0.5 /*USD per mETH */, "mETH/USD");

export type Order = {
    trader: Trader;
    type: string; // buy, sell
    price: number; // ==SU/mETH
    amount_SU: number;
    amount_mETH?: number;
    ttl?: number;   // time to live, in ticks, or NaN
    isActive: bool;
}

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

    getNormalizedBuySellVolumeRatio() {
        let total_buy_volume = 0;
        let total_sell_volume = 0;
        for (let order of market_SUETH.buy_orders) {
            total_buy_volume += order.amount_SU;
        }
        for (let order of market_SUETH.sell_orders) {
            total_sell_volume += order.amount_SU;
        }
        return Utility.normalize_ratio(total_buy_volume / total_sell_volume);
    }

    // method for exchanging SU for ETH if possible
    atomicSuEthExchange(buyer: Trader, seller: Trader, deal_SU: number, deal_mETH: number) {
        // check that buyer has enough ETH to pay and seller enough SU to sell
        if (buyer.balance_mETH + Utility.EPS > deal_mETH && seller.balance_SU + Utility.EPS > deal_SU) {
            buyer.balance_mETH -= deal_mETH;
            seller.balance_mETH += deal_mETH;
            buyer.balance_SU += deal_SU;
            seller.balance_SU -= deal_SU;
            // save this deal in the history
            this.setNewValue(deal_mETH / deal_SU);
            return true;
        }
        return false;
    }

    removeOrder(order: Order, status?: string) {
        order.isActive = false;
        order.trader.removeOrder(order, status);
        if (order.type === "buy") {
            let i = this.buy_orders.indexOf(order);
            if (i >= 0) {
                this.buy_orders.splice(i, 1);
                return true;
            }
        } else if (order.type === "sell") {
            let i = this.sell_orders.indexOf(order);
            if (i >= 0) {
                this.sell_orders.splice(i, 1);
                return true;
            }
        } else {
            throw new Error("Order doesn't have correct type!");
        }
        return false;
    }

    makeDeal(buy_order: Order, sell_order: Order, deal_price: number) {
        const necessary_SU = Math.min(buy_order.amount_SU, sell_order.amount_SU);
        // the seller might not have enough SU to sell, so some reasons
        const max_SU = Math.min(necessary_SU, sell_order.trader.balance_SU);
        const necessary_mETH = max_SU * deal_price;
        // there are two options (default b):
        // a) cancel deal if the buyer doesn't have enough ETH
        // b) do the biggest deal possible
        const deal_mETH = Math.min(necessary_mETH, buy_order.trader.balance_mETH);
        const deal_SU = deal_mETH / deal_price;
        if (this.atomicSuEthExchange(buy_order.trader, sell_order.trader, deal_SU, deal_mETH)) {
            buy_order.amount_SU -= deal_SU;
            sell_order.amount_SU -= deal_SU;
            if (buy_order.amount_SU < Utility.EPS) {
                this.removeOrder(buy_order, "Order was completed.");
            } else if (buy_order.trader.balance_mETH < Utility.EPS) {
                this.removeOrder(buy_order, "Insufficient ETH balance.");
            }
            if (sell_order.amount_SU < Utility.EPS) {
                this.removeOrder(sell_order, "Order was completed.");
            } else if (sell_order.trader.balance_SU < Utility.EPS) {
                this.removeOrder(sell_order, "Insufficient SU balance.");
            }
        } else {
            throw new Error("Make a deal calc error!");
        }
    }

    addBuyOrder(buy_order: Order) {
        // before place it into queue, lets try to buy from existing sell orders
        while (buy_order.amount_SU > Utility.EPS && buy_order.trader.balance_mETH > Utility.EPS && this.sell_orders.length > 0) {
            // taking the cheapest sell order
            let sell_order = this.sell_orders.slice(-1)[0];
            // if the sell price is better than we want or we don't care about price
            if (sell_order.price < buy_order.price + Utility.EPS || isNaN(buy_order.price)) {
                let deal_price = sell_order.price;
                this.makeDeal(buy_order, sell_order, deal_price);
            } else {
                // there are not any good sell orders
                break;
            }
        }
        // add the remaining to the buy queue
        if (buy_order.amount_SU > Utility.EPS && buy_order.trader.balance_mETH > Utility.EPS) {
            if (isNaN(buy_order.price)) {
                // if we place this order in the orderbook potential seller might offer +INF price
                this.removeOrder(buy_order, "Not enough SU market supply.");
            } else {
                this.buy_orders.push(buy_order);
                this.buy_orders.sort((a, b) => a.price - b.price);
            }
        } else {
            if (buy_order.isActive) {
                this.removeOrder(buy_order, "Not enough balance to place the order.");
            }
        }
    }

    addSellOrder(sell_order: Order) {
        while (sell_order.amount_SU > Utility.EPS && sell_order.trader.balance_SU > Utility.EPS && this.buy_orders.length > 0) {
            let buy_order = this.buy_orders.slice(-1)[0];
            if (buy_order.price + Utility.EPS > sell_order.price || isNaN(sell_order.price)) {
                let deal_price = buy_order.price;
                this.makeDeal(buy_order, sell_order, deal_price);
            } else {
                break;
            }
        }
        if (sell_order.amount_SU > Utility.EPS && sell_order.trader.balance_SU > Utility.EPS) {
            if (isNaN(sell_order.price)) {
                this.removeOrder(sell_order, "Not enough SU market demand.");
            } else {
                this.sell_orders.push(sell_order);
                this.sell_orders.sort((a, b) => b.price - a.price);
            }
        } else {
            if (sell_order.isActive) {
                this.removeOrder(sell_order, "Not enough balance to place the order.");
            }
        }
    }

    addBuyLimitOrder(buyer: Trader, amount_SU: number, max_price: number) {
        const buy_order: Order = {
            trader: buyer,
            type: "buy",
            price: max_price,
            amount_SU: amount_SU,
            isActive: true,
        };
        buyer.addOrder(buy_order);
        this.addBuyOrder(buy_order);
        return buy_order;
    }

    addSellLimitOrder(seller: Trader, amount_SU: number, min_price: number) {
        const sell_order: Order = {
            trader: seller,
            type: "sell",
            price: min_price,
            amount_SU: amount_SU,
            isActive: true,
        };
        seller.addOrder(sell_order);
        this.addSellOrder(sell_order);
        return sell_order;
    }

    addBuyMarketOrder(buyer: Trader, amount_SU: number) {
        return this.addBuyLimitOrder(buyer, amount_SU, NaN);
    }

    addSellMarketOrder(seller: Trader, amount_SU: number) {
        return this.addSellLimitOrder(seller, amount_SU, NaN);
    }

    // TODO: legacy
    newLimitBuyOrder(trader: Trader, amount_SU: number, amount_mETH: number, ttl?: number) {
        let max_price = amount_SU / amount_mETH;
        this.addBuyLimitOrder(trader, amount_SU, max_price);
        return "";
    }

    // TODO: legacy
    newLimitSellOrder(trader: Trader, amount_SU: number, amount_mETH: number, ttl: number = -1) {
        let min_price = amount_SU / amount_mETH;
        this.addSellLimitOrder(trader, amount_SU, min_price); 
        return "";
    }

    // TODO: legacy
    buyMarketOrder(buyer: Trader, amount_SU: number) {
        this.addBuyMarketOrder(buyer, amount_SU);
        return "";
    }

    // TODO: legacy
    sellMarketOrder(seller: Trader, amount_SU: number) {
        this.addSellMarketOrder(seller, amount_SU);
        return "";
    }

    // TODO: legacy
    cancelOrder(order: Order) {
        this.removeOrder(order);
    }

    // TODO: legacy
    update() {
    }

}

const market_SUETH = new Market_SUmETH(2/* mETH per SU */);
const market_SUUSD = new Market(1, "SU/USD");
// it's not a real market but control pannel for traders behaviour
const market_demand = new Market(0.5, "SU demand");

// Super class for the all trader bots with basic shared methods
export class Trader {
    name: string;
    // portfolio = {};
    // for access simplicity lets define balances outside of the portfolio dictionary
    balance_SU: number = 0;
    balance_mETH: number = 0;
    balance_BONDs: number = 0;
    balance_SHAREs: number = 0;

    dna = {};
    time_frame: number;
    time_left_until_update: number;

    orders: Set<Order> = new Set();
    ttl: Map<Order, number> = new Map();
    log: Array<string> = [];
    MAX_LOG_LENGTH = 10;

    constructor(name: string,
                portfolio?: { balance_SU: number, balance_mETH: number, balance_BONDs?: number, balance_SHAREs?: number },
                dna: Object = {time_frame: 1}
    ) {
        this.name = name;
        // this.portfolio.su_wallet = web4.su.createWallet(portfolio.balance_SU);
        // this.portfolio.eth_wallet = web4.eth.createWallet(portfolio.balance_mETH);
        if (portfolio) {
            this.balance_SU = (portfolio.balance_SU || 0);
            this.balance_mETH = portfolio.balance_mETH || 0;
            this.balance_BONDs = portfolio.balance_BONDs || 0;
            this.balance_SHAREs = portfolio.balance_SHAREs || 0;
        }

        this.dna = dna;
        this.time_frame = dna.time_frame;
        this.time_left_until_update = 0;
    }

    getPortfolio() {
        let portfolio = {};
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
            return true;
        } else {
            return false;
        }
    }

    rebalance_portfolio_SUETH() {
        // want to hedge portfolio, such worth(SU) ~ worth(ETH)
        let worth_SU = this.balance_SU * market_SUETH.getCurrentValue() ;
        let worth_ETH = this.balance_mETH;
        let ratio_SU = worth_SU / (worth_SU + worth_ETH);
        if (ratio_SU < 0.03) {
            let deal_mETH = this.balance_mETH / 2;
            let deal_price = market_SUETH.getCurrentValue();
            let deal_SU = deal_mETH * deal_price;
            market_SUETH.addBuyMarketOrder(this, deal_SU);
        } else if (ratio_SU > 0.97) {
            market_SUETH.addSellMarketOrder(this, this.balance_SU/2);
        }
    }
}

// Pool of all trader instances for outside control
export type Traders = Map<string, Trader>;

// This trader randomly sells and buys some arbitrary amount of SU
// Follows the mood of the market (market_demand)
class RandomTrader extends Trader {
    update() {
        super.update();
        if (super.ifTimeToUpdate()) {
            let deal_mETH = this.balance_mETH * this.dna.risk;
            let deal_price = market_SUETH.getCurrentValue();
            let deal_SU = deal_mETH * deal_price;
            if (Math.random() < market_demand.getCurrentValue()) {
                market_SUETH.addBuyMarketOrder(this, deal_SU);
            } else {
                market_SUETH.addSellMarketOrder(this, deal_SU);
            }
        }
    }
}

// This trader follows the trend by analysing the Buy/Sell volument ratio of the order book
class TrendMaker extends Trader {
    update() {
        super.update();
        if (this.ifTimeToUpdate()) {
            let orderbook_ratio = market_SUETH.getNormalizedBuySellVolumeRatio();
            if (isNaN(orderbook_ratio)) 
                orderbook_ratio = 0.5; // when orderbook is empty

            let deal_price = market_SUETH.getCurrentValue();
            let max_mETH = this.balance_mETH;
            let max_SU = Math.min(max_mETH / deal_price, this.balance_SU);
            let deal_SU = max_SU * this.dna.risk;

            // if there are more buy orders than sell order
            if (orderbook_ratio > this.dna.r) {
                // means there are more demand therefore we might expect the price go up 
                // and benefit by placing selling order for higher price
                let sell_price = deal_price * (1 + this.dna.margin);
                this.addOrderTTL(market_SUETH.addSellLimitOrder(
                    this,
                    deal_SU,
                    sell_price),
                    this.time_frame * 2);
            } else {
                // looks like people tend to sell more than buy
                // means there are more supply therefore the price might go down, so we can buy SU cheaper
                let buy_price = deal_price * (1 - this.dna.margin);
                this.addOrderTTL(market_SUETH.addBuyLimitOrder(
                    this,
                    deal_SU,
                    Math.max(buy_price, 0.001)),
                    this.time_frame * 2);
            }
            this.rebalance_portfolio_SUETH();
        }
    }
}

// This trader trying to buy SU during crash when it's very cheap and see it after for at least x10 of price
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
}

// BasicTrader uses very simple logic to trade:
// It knows that the SU price will always fluctuates around $1 so
// it buys SU cheaper than $1 and sells it back at $1
// it sells SU for higher than $1 and buys it back at $1
// the trader would like to earn dna.roi from this trade and acts every dna.time_frame ticks
class BasicTrader extends Trader {
    DEFAULT_ROI = 0.1;
    roi: number;
    time_frame: number;

    constructor(name: string, portfolio, dna: { time_frame: number, roi?: number }) {
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
            this.addOrderTTL(sell_order, this.time_frame);
            // ???
            // profit!
        }
    }
}

// This is representation of all users who participate in the oracle smart contract
class OracleSpeculator extends Trader {
    update() {
        web4.su.callOracleSM(this, market_mETHUSD.getCurrentValue());
    }
}

// This trader earns on differences between market price and SU_reserve price
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
}

// main loop of the simulation
export class Simulation {
    web4: Web4;
    market_ETHUSD: Market;
    market_SUETH: Market_SUmETH;
    market_SUUSD: Market;
    market_demand: Market;
    traders: Traders = new Map();

    // takes callBack functions for visualisation
    constructor() {
        // init all instances of the simulation:
        this.web4 = web4;
        // exchanges,
        this.market_ETHUSD = market_mETHUSD;
        this.market_SUETH = market_SUETH;
        this.market_SUUSD = market_SUUSD;
        this.market_demand = market_demand;
        // temporary array of traders
        let traders = [];
        // UI traders to play around
        traders.push(new Trader("human_1", {balance_SU: 500, balance_mETH: 1000}));
        traders.push(new Trader("human_2", {balance_SU: 5000, balance_mETH: 10000}));
        
        // general traders for any kind of markets
        for (let i = 0; i < 5; i++) {
            traders.push(new RandomTrader(
                "random_" + i,
                Utility.generateRandomPortfolio(3000),
                {risk: Math.random() * 0.02, time_frame: Math.round(1 + Math.random() * 5)}
            ));
        }
        for (let i = 0; i < 15; i++) {
            traders.push(new TrendMaker(
                "trandMaker_" + i,
                Utility.generateRandomPortfolio(),
                {
                    risk: Math.random() * 0.3,
                    r: Utility.randn_bm(),
                    margin: Math.random() * 0.1,
                    time_frame: Math.round(1 + Math.random() * 5)
                }
            ));
        }
        //traders.push(new BuyFDeeps("BuyDeeps", Utility.generateRandomPortfolio(10)));

        // Any stable-price specific traders
        for (let i = 0; i < 5; i++) {
            traders.push(new BasicTrader(
                "basic_" + i,
                Utility.generateRandomPortfolio(),
                {type: "none", time_frame: Math.round(1 + Math.random() * 5), roi: 0.1 * Math.random()}
            ));
        }

        // StableUnit specific traders
        // Speculator who feeds SU with market data
        traders.push(new OracleSpeculator("Oracles"));

        // for (let i = 0; i < 1; i++) {
        //     traders.push(new ArbitrageUpTrader(
        //         "ArbitrageUp_" + i,
        //         Utility.generateRandomPortfolio(),
        //         {time_frame: Math.round(1 + Math.random() * 5)}
        //     ));
        // }
        //
        // for (let i = 0; i < 1; i++) {
        //     traders.push(new ArbitrageDownTrader(
        //         "ArbitrageDown_" + i,
        //         Utility.generateRandomPortfolio(),
        //         {time_frame: Math.round(1 + Math.random() * 5)}
        //     ));
        // }

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
        market_mETHUSD.addValueRandomMove();
        this.market_demand.setNewValue(this.market_demand.getCurrentValue());

        // simulation execution
        market_SUUSD.setNewValue(market_SUETH.getCurrentValue() * market_mETHUSD.getCurrentValue());

        for (let [, trader] of this.traders) {
            trader.update();
        }
        market_SUETH.update();

        // update the time
        Utility.simulation_tick += 1;

        // Debug output
        // console.log("r = " + market_SUETH.getNormalizedBuySellVolumeRatio().toFixed(3));
        // console.log("b = " + market_SUETH.buy_orders.length + ", s = " + market_SUETH.sell_orders.length);
        // let i = 0;
        // let j = 0;
        // for (let [, trader] of this.traders) {
        //     if (trader.dna.r) {
        //         if (trader.dna.r < 0.5) i++; else j++;
        //     }
        // }
        // console.log("i,j = " + i + ", " + j);
        // console.log("total_buy,total_sell = " + total_buy_orders + ", " + total_sell_orders);
    }
}

// class AlgoTrader extends Trader {
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
