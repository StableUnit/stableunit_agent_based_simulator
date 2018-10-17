// @flow
import {TraderPool, Trader} from './traders';

export const Utility = {
    EPS: 1e-6,
    DEFAULT_SUUSD_PRICE: 1,
    DEFAULT_ETHUSD_PRICE: 500,
    generateRandomPortfolio(worth_USD: number = 1000) {
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
    // random value [0..1] with normal distribution
    randn_bm() {
        var u = 0, v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return this.randn_bm(); // resample between 0 and 1
        return num;
    },
    // maps r from [0..+inf] to [0..1]
    normalize_ratio(r: number) {
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

// Market - is a generic class for generating, adding and storing values for market
// such as price history, market demand etc
export class Market {
    name: string;
    history: Array<{ datetime: number, price: number }> = [];

    static TYPE_NONE = "none";
    static TYPE_LINER = "liner";
    static TYPE_GBM = "gbm";
    static TYPE_LBM = "lbm";
    static TYPE_HISTORICAL = "historical";
    movement_type: string;

    volatility_factor = 0.05;
    random_change: number;

    constructor(initial_value: number, name: string = 'no_name', movement_type: string = Market.TYPE_NONE) {
        this.name = name;
        this.movement_type = movement_type;
        this.setNewValue(initial_value);

        this.random_change = initial_value * this.volatility_factor;
    }

    setNewValue(new_price: number) {
        this.history.push({datetime: Utility.simulation_tick, price: new_price});
    }

    getCurrentValue() {
        return this.history[this.history.length - 1].price;
    }

    update() {
        if (this.movement_type === Market.TYPE_NONE) {
            this.setNewValue(this.getCurrentValue());
        } else if (this.movement_type === Market.TYPE_LINER) {
            this.addRandomValue();
        } else if (this.movement_type === Market.TYPE_LBM) {
            this.addLbmValue();
        } else if (this.movement_type === Market.TYPE_GBM) {
            this.addGbmValue();
        } else if (this.movement_type === Market.TYPE_HISTORICAL) {
            this.addHistoricalValue();
        } else {
            throw new Error("Incorrect movement type!");
        }
    }

    // TODO: make the research about stochastics process deistributions for finantial markets

    // adds random value from range [-½ .. ½] with liner distribution
    addRandomValue() {
        let rand = Math.random() - 0.5;
        let newValue = this.getCurrentValue() + rand * this.random_change;
        this.setNewValue(Math.max(newValue, 0));
    }

    // simulate random walk ?Liner Brownian Motion
    addLbmValue() {
        let rand = Math.random() - 0.5;
        let newValue = this.getCurrentValue()*(1 + rand * this.volatility_factor);
        this.setNewValue(Math.max(newValue, 0));
    }

    // Geometric Brownian Motion
    // adds random value from range [-½ .. ½] with normal distribution
    addGbmValue() {
        let rand = Utility.randn_bm() - 0.5;
        let newValue = this.getCurrentValue()* (1 + rand * this.volatility_factor);
        this.setNewValue(Math.max(newValue, 0));
    }

    // TODO: add hostorical data of the price, possible three types: rise, crash and plateu
    addHistoricalValue() {

    }
}

// Helper data type to store statistics and send it for rendering
export type StableUnitSystemHistory = Array<{
    datetime: number,
    SU_circulation: number,
    reserve_mETH: number,
    reserve_ratio: number,
    REPO_circulation: number,
    SU_DAO_TOKEN_circulation: number,
    PARKING_ratio: number
}>;

// StableUnit blockchain is an extension of Ethereum blockchain 
export class StableUnit extends Ethereum {
    // StableUnit has three types of internal values:
    // 1: [Settings]. Contants of the system which can be change only via DAO referendum. 
    // 2: [Assets]. SU, REPO, SHARE, Stabilization Reserve which keeps Ether.
    // 3: [Variable]. Statitics, helpers and other internal variables nessesary for the implementation.

    //
    //    CONSTANTS
    //
    // The target price for one StableUnit(SU). 
    // Generally, it might be a function from {time, SU in circulation} aka adoption metric
    PEG() {
        return 1.0;
    }
    // Constants for for stabilisation layer's ranges
    D1 = 0.05;
    D2 = 0.10;
    D3 = 0.15;
    D4 = 0.20;
    D5 = 0.25;
    // Repurchaseable Agreement
    REPOS_EMISSION = 0.1; // 10% of the SU in circulation
    // Shares which are both shares and governence token
    SHARES_LIMIT = 1e9;
    // Reward for one oracle voting term [in SHAREs]
    ORACLE_REWARD = 0.1;
    // Miner's Reward for one block [in SHAREs]
    MINER_REWARD(n_block: number) {
        return 1/n_block;
    }

    //
    //  ASSETS
    // 
    // SU - core token of the system and unit of accounting
    // In this version of simulation, assets implemented as variables at Traders portfolio, so 
    // SU_circulation == SUM(Trader.balance_SU for_each(Trader in TraderPool))
    SU_circulation: number;
    // Stabilization Reserve - smartcontract which stores Ether
    reserve_mETH: number;
    // 
    REPO_circulation: number;
    // tokens of ownership for decentralized autonomous organization
    SU_DAO_TOKEN_circulation: number;
    // How much fund is parking (frozen) on each account
    PARKING_ratio: number;

    //
    //  VARIABLES
    //
    // the last info provided by oracles
    mETHUSD_price: number = 0.5;
    SUmETH_price: number;
    // additional variables
    SU_price: number;    
    reserve_ratio: number;
    REPO_price: number;
    

    constructor(ethereum: Ethereum) {
        super();

        this.SU_circulation = 0;

        // init stabilisation fund with some existing funds (after ICO for example)
        //this.reserve_account = ethereum.createWallet(1000);
        this.reserve_mETH = 0;
        this.reserve_ratio = 0;

        // create REPOs as type of token
        //this.createTokens(this.fundation_account.address, "SU_BONDS", 0);
        this.REPO_circulation = 0;

        // create DAO
        //this.fundation_account = this.createWallet(1);
        //this.createTokens(this.fundation_account.address, "SU_DAO", 1000);
        this.SU_DAO_TOKEN_circulation = 0;

        this.PARKING_ratio = 0;
    }

    // Security token offering
    STO() {
        // 
    }
 
    // Oracle smartcontract takes info from outside
    callOracleSM(trader: Trader, mETHUSD_price: number) {
        this.mETHUSD_price = mETHUSD_price;
        this.reserve_ratio = (this.reserve_mETH * mETHUSD_price) / this.SU_circulation;

        trader.balance_SU += this.ORACLE_REWARD;
        this.SU_circulation = this.SU_circulation + this.ORACLE_REWARD;
    }

    //
    //  Stabilizarion Reserve
    //
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
            this.SU_circulation = this.SU_circulation + deal_SU;
            return true;
        }
        return false;
    }

    buySU(amount_mETH: number) {
        let deal_price = (1 + this.D1) / this.mETHUSD_price;
        let deal_SU = amount_mETH / deal_price;
        this.reserve_mETH += amount_mETH;
        this.SU_circulation = this.SU_circulation + deal_SU;
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

            this.SU_circulation = this.SU_circulation - amount_SU;
            this.reserve_mETH -= deal_mETH;

            return true;
        }
        return false;
    }


    unlockBonds() {
        this.REPO_circulation += this.SU_circulation * this.REPOS_EMISSION;
    }

    // bonds are erc20 tokens so can be store on the same addresses;
    //buyBondsSM(su_addr, amount_su, tnx_sign, eth_addr_erc20token) {}
    buyBondsSM(trader: Trader, amount_SU: number) {

    }

    sellBondsSM() {
    }

    // This is overwrited Ethereum method to send transation
    // During temporaty parking only part of funds are avaliable for transaction
    // so we have to reimplement basic transation logic
    sendTransaction(address_sender: string, amount: number, address_recipient: string) {
        // check that avaliable unparked balace is sufficient for transaction
        if ((this.accounts.get(address_sender) || 0) * (1.0 - this.PARKING_ratio) >= amount) {
            super.sendTransaction(address_sender, amount, address_recipient);
        }
    }

    //variables and methonds for rendering statistics
    history: StableUnitSystemHistory = [];

    // save current values of StableUnit system for printing statistics
    updateHistory() {
        this.history.push({
            datetime: Utility.simulation_tick,
            SU_circulation: this.SU_circulation,
            reserve_mETH: this.reserve_mETH,
            reserve_ratio: this.reserve_ratio,
            REPO_circulation: this.REPO_circulation,
            SU_DAO_TOKEN_circulation: this.SU_DAO_TOKEN_circulation,
            PARKING_ratio: this.PARKING_ratio
        });
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
export const web4 = new Web4();

// In this simulation we're going to use milliEther 
// as the more convenient unit of measurement for Ether value in SU/ETH exchange
export const market_mETHUSD = new Market(0.5 /*USD per mETH */, "mETH/USD", Market.TYPE_LBM);

// TODO: make it in [-1 .. +1]
// market_demand shows market demand for SU. 
// Traders (bots) use it as an input for desicion making whether buy or sell SU
export const market_demand = new Market(0.5, "SU demand", Market.TYPE_NONE);

// Type for the exhange order book:
export type Order = {
    trader: Trader; // to whom this Order belong to
    type: string; // buy, sell
    price: number; // ==SU/mETH
    amount_SU: number;
    amount_mETH?: number;
    ttl?: number;   // time to live, in ticks, or NaN
    isActive: bool;
}

// SU/ETH market which provides several methods to place an order
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

export const market_SUETH = new Market_SUmETH(2 /* mETH per SU */);
// market_SUUSD is market_SUETH where all prices recalculated in USD (using market_mETHUSD) for simple visulisation
export const market_SUUSD = new Market(1, "SU-USD");


// Pool of all trader instances for outside control
export type Traders = Map<string, Trader>;

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
        // exchanges, inputs
        this.market_ETHUSD = market_mETHUSD;
        this.market_demand = market_demand;
        // exchanges, output
        this.market_SUETH = market_SUETH;
        this.market_SUUSD = market_SUUSD;

        const traderPool = new TraderPool();
        this.traders = traderPool.traders;
    }

    // execute one tick of the simulation
    update() {
        // generate inputs
        this.market_ETHUSD.update();
        this.market_demand.update();

        // exec logic of all bots which interact with markets
        for (let [, trader] of this.traders) {
            trader.update();
        }
        // update market date based of bot's transaction
        market_SUETH.update();
        market_SUUSD.setNewValue(market_SUETH.getCurrentValue() * market_mETHUSD.getCurrentValue());
        this.web4.su.updateHistory();

        // update the time
        Utility.simulation_tick += 1;
    }
}

