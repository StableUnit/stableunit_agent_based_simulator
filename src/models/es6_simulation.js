// @flow
import assert from 'assert';

const Utility = {
    EPS: 1e-6,
    DEFAULT_SUUSD_PRICE: 1,
    DEFAULT_ETHUSD_PRICE: 500,
    generateRandomPortfolio(worth_USD = 1000) {
        let balance_SU_USD = worth_USD * Math.random();
        let balance_ETH_USD = worth_USD - balance_SU_USD;
        return {
            balance_SU: Math.round(balance_SU_USD / Utility.DEFAULT_SUUSD_PRICE),
            balance_mETH: Math.round(balance_ETH_USD / Utility.DEFAULT_ETHUSD_PRICE * 1000),
        };
    },
    randomSuOrder() {
        return Math.round(Math.random() * 10);
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
        return {address, priavte_key};
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
        this.reserve_ratio = this.reserve_mETH * mETHUSD_price / this.SU_circulation;
    }

    // Not sure yet whether we need SU/ETH or SU/USD as an input for oracle
    callOracleSM2(SUmETH_price: number, mETHUSD_price: number) {
        // reads info from outside world and brings it to the blockchain
        // TODO: checks that prices haven't check too much so nobody is trying to compromize the System
        this.callOracleSM(mETHUSD_price);
        this.SUmETH_price = SUmETH_price;
        const SU_price = SUmETH_price * this.mETHUSD_price;
        this.SU_price = SU_price;

        // expand supply via stabilization fund + reaping bonds
        if (this.PEG + this.D1 <= SU_price) {
        }
        // market stabilization
        if (this.PEG - this.D1 < SU_price && SU_price < this.PEG + this.D1) {
        }
        // stabilization fund
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
            let deal_price = (1 + this.D1) / this.mETHUSD_price;
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

    addRandomValueMove() {
        this.setNewValue(this.getCurrentValue() + (Math.random() - 1 / 2) * this.random_change);
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

    getOrderbookVolumeRatio() {
        let total_buy_volume = 0;
        let total_sell_volume = 0;
        for (let order of market_SUETH.buy_orders) {
            total_buy_volume += order.amount_SU;
        }
        for (let order of market_SUETH.sell_orders) {
            total_sell_volume += order.amount_SU;
        }
        return total_buy_volume / total_sell_volume;
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
            this.removeOrder(buy_order, "Not enough balance to place the order.");
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
                this.sell_orders.sort((a,b) => b.price - a.price);
            }
        } else {
            this.removeOrder(sell_order, "Not enough balance to place the order.");
        }
    }

    addBuyLimitOrder(buyer: Trader, amount_SU: number, max_price: number) {
        const buy_order: Order = {
            trader: buyer,
            type: "buy",
            price: max_price,
            amount_SU: amount_SU
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
            amount_SU: amount_SU
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

    newLimitBuyOrder(trader: Trader, amount_SU: number, amount_mETH: number, ttl?: number) {
        // if (amount_mETH < Utility.EPS || amount_SU < Utility.EPS) {
        //     return "Incorrect order";
        // }
        // // check that the trader can afford that
        // if (trader.balance_mETH >= amount_mETH) {
        //     const order: Order = {
        //         trader: trader,
        //         type: "buy",
        //         price: amount_mETH / amount_SU,
        //         amount_SU: amount_SU,
        //         amount_mETH: amount_mETH,
        //         ttl: ttl ? ttl : NaN,
        //     };
        //     // add to the trader
        //     trader.orders.add(order);
        //     if (ttl) {
        //         trader.ttl.set(order, ttl);
        //     }
        //     // add to the market
        //     this.buy_orders.push(order);
        //     // the last item has the highest price
        //     this.buy_orders.sort((a, b) => a.price - b.price);
        //     //return {order: order, status: "Added limited buy order"};
        //     return "Added limited buy order";
        // } else {
        //     //return {status: "No enough ETH"};
        //     return "No enough ETH";
        // }
        return "";
    }

    newLimitSellOrder(trader: Trader, amount_SU: number, amount_mETH: number, ttl: number = -1) {
        // if (amount_mETH < Utility.EPS || amount_SU < Utility.EPS) {
        //     return "Incorrect order";
        // }
        // if (trader.balance_SU >= amount_SU) {
        //     const order: Order = {
        //         trader: trader,
        //         amount_SU: amount_SU,
        //         amount_mETH: amount_mETH,
        //         price: amount_mETH / amount_SU,
        //         type: "sell",
        //         ttl: ttl ? ttl : NaN,
        //     };
        //     trader.orders.add(order);
        //     if (ttl > 0) {
        //         trader.ttl.set(order, ttl);
        //     }
        //     this.sell_orders.push(order);
        //     // the last item has the smallest price
        //     this.sell_orders.sort((a, b) => b.price - a.price);
        //     return "Added limited sell order";
        // } else {
        //     return "Not enough SU";
        // }
        return "";
    }

    // A market order is a buy or sell order to be executed immediately at current market prices.
    // Like pacman it eats all available sell order until reach su_amount
    buyMarketOrder(buyer: Trader, amount_SU: number) {
        // let status = "was not completed.";
        // while (amount_SU > Utility.EPS && buyer.balance_mETH > Utility.EPS && this.sell_orders.length > 0) {
        //     let sell_order = this.sell_orders.slice(-1)[0];
        //     let deal_price = sell_order.price;
        //     let max_SU = Math.min(amount_SU, sell_order.amount_SU);
        //     let max_mETH = max_SU * deal_price;
        //     let deal_mETH = Math.min(buyer.balance_mETH, max_mETH);
        //     let deal_SU = deal_mETH / deal_price;
        //     assert(deal_price - deal_mETH / deal_SU < Utility.EPS);
        //     if (this.atomicSuEthExchange(buyer, sell_order.trader, deal_SU, deal_mETH)) {
        //         status = "was partially completed.";
        //         amount_SU -= deal_SU;
        //         sell_order.amount_SU -= deal_SU;
        //         sell_order.amount_mETH -= deal_mETH;
        //
        //         if (sell_order.amount_mETH < Utility.EPS) {
        //             assert(sell_order.amount_SU < Utility.EPS);
        //             this.sell_orders.pop();
        //             sell_order.trader.removeOrder(sell_order, "was completed");
        //         } else {
        //             assert(sell_order.price - sell_order.amount_mETH / sell_order.amount_SU < Utility.EPS);
        //             sell_order.trader.log.push("was partially completed");
        //             break;
        //         }
        //     } else {
        //         throw new Error("can't perform exchange");
        //     }
        // }
        // if (amount_SU <= Utility.EPS) {
        //     status = "was completed.";
        // } else {
        //     if (this.sell_orders.length === 0) {
        //         status += " Not enough sell orders in the queue.";
        //     } else {
        //         status += " Not enough ETH to buy.";
        //     }
        // }
        // return "Buy Market Order " + status;
        return "";
    }

    sellMarketOrder(seller: Trader, amount_SU: number) {
        // let status = "was not completed. ";
        // // if the orderbook has buy orders and seller still wants to sell
        // while (amount_SU > Utility.EPS && seller.balance_SU > Utility.EPS && this.buy_orders.length > 0) {
        //     // take the most expensive one
        //     let buy_order = this.buy_orders.slice(-1)[0];
        //     // calc the deal details
        //     let deal_price = buy_order.price;
        //     let max_SU = Math.min(amount_SU, seller.balance_SU);
        //     let deal_SU = Math.min(max_SU, buy_order.amount_SU);
        //     let deal_mETH = deal_SU * deal_price;
        //     assert(deal_price - deal_mETH / deal_SU < Utility.EPS);
        //     // try to make a deal
        //     if (this.atomicSuEthExchange(buy_order.trader, seller, deal_SU, deal_mETH)) {
        //         status = "was partially completed. ";
        //         amount_SU -= deal_SU;
        //         buy_order.amount_SU -= deal_SU;
        //         buy_order.amount_mETH -= deal_mETH;
        //         // if the buy order is only partially completed
        //         if (buy_order.amount_SU > Utility.EPS) {
        //             // check that we calculted everything correctly
        //             assert(Math.abs(buy_order.price - buy_order.amount_mETH / buy_order.amount_SU) < Utility.EPS);
        //             buy_order.trader.updateOrder(buy_order, "was partially compeleted. ");
        //             break;
        //         } else {
        //             // check that order is really completed
        //             assert(buy_order.amount_mETH < Utility.EPS);
        //             this.buy_orders.pop();
        //             buy_order.trader.removeOrder(buy_order, "was completed. ");
        //         }
        //     } else {
        //         throw new Error("can't perform exchange");
        //     }
        // }
        // if (amount_SU <= Utility.EPS) {
        //     status = "was completed. ";
        // } else {
        //     status += this.buy_orders.length > 0 ? "Not enough SU to sell. " : "Not enough buy orders in the queue. ";
        // }
        // return "Sell Market Order " + status;
        return "";
    }

    cancelOrder(order: Order) {
        // delete ref to the order from the trader
        order.trader.orders.delete(order);
        if (order.type === "buy") {
            // remove the order from the market queue
            for (let i = 0; i < this.buy_orders.length; i++) {
                if (this.buy_orders[i] === order) {
                    this.buy_orders.splice(i, 1);
                    return true;
                }
            }
        } else if (order.type === "sell") {
            // remove the order from the market queue
            for (let i = 0; i < this.sell_orders.length; i++) {
                if (this.sell_orders[i] === order) {
                    this.sell_orders.splice(i, 1);
                    return true;
                }
            }
        } else {
            throw new Error("Order doesn't have correct type");
        }
        return false;
    }

    // This method is trying to complete all possible deals if any available
    update() {
        // // check is any limit orders are possible to complete
        // while (this.getCurrentBuyPrice() >= this.getCurrentSellPrice()) {
        //     // let buy_order = this.buy_orders.pop();
        //     // buy_order.trader.orders.delete(buy_order);
        //     // let sell_order = this.sell_orders.pop();
        //     // sell_order.trader.orders.delete(sell_order);
        //     let buy_order = this.buy_orders.slice(-1)[0];
        //     let sell_order = this.sell_orders.slice(-1)[0];
        //     // TODO: make fair exchange
        //     // temp solution: market doesn't try to earn on this kind of deals
        //     let max_SU = Math.min(buy_order.amount_SU, sell_order.amount_SU);
        //     let deal_price = (buy_order.price + sell_order.price) / 2;
        //     let deal_SU = Math.min(buy_order.amount_SU, sell_order.amount_SU);
        //     let deal_mETH = deal_SU * deal_price;
        //     // make a deal between buyer and seller
        //     if (this.atomicSuEthExchange(buy_order.trader, sell_order.trader, deal_SU, deal_mETH)) {
        //         buy_order.amount_SU -= deal_SU;
        //         buy_order.amount_mETH -= deal_mETH;
        //         sell_order.amount_SU -= deal_SU;
        //         sell_order.amount_mETH -= deal_mETH;
        //     } else {
        //         //WTF
        //         throw new Error("can't perform exchange");
        //     }
        //     // if the one of the orders is only partially completed - add reminder back
        //     if (sell_order.amount_SU < Utility.EPS) {
        //         //this.sell_orders.push(sell_order);
        //         //sell_order.trader.sell_orders.add(sell_order);
        //         //this.newLimitSellOrder(sell_order.trader, sell_order.amount_SU, sell_order.amount_mETH);
        //         this.sell_orders.pop();
        //         sell_order.trader.removeOrder(sell_order, "was completed by another Limit Order. ");
        //     } else {
        //
        //     }
        //     if (buy_order.amount_SU < Utility.EPS) {
        //         // this.buy_orders.push(buy_order);
        //         // buy_order.trader.buy_orders.add(buy_order);
        //         //this.newLimitBuyOrder(buy_order.trader, buy_order.amount_SU, buy_order.amount_mETH, buy_order.ttl);
        //         this.buy_orders.pop();
        //         buy_order.trader.removeOrder(buy_order, "was completed by another Limit Order. ");
        //     }
        // }
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
    balance_SU: number;
    balance_mETH: number;
    balance_BONDs: number;
    balance_SHAREs: number;

    dna = {};
    time_frame: number;
    time_left_until_update: number;

    orders: Set<Order> = new Set();
    ttl: Map<Order, number> = new Map();
    log: Array<string> = [];
    MAX_LOG_LENGTH = 10;

    constructor(name: string, portfolio: { balance_SU: number, balance_mETH: number }, dna: Object = {}, time_frame: number = 1) {
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
                market_SUETH.cancelOrder(order);
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

}

// Pool of all trader instances for outside control
export type Traders = Map<string, Trader>;

// SimpleTrader uses very simple logic to trade:
// It knows that the SU price will always fluctuates around $1 so
// it buys SU cheaper than $1 and sells it back at $1
// it sells SU for higher than $1 and buys it back at $1
// the trader would like to earn dna.roi from this trade and acts every dna.time_frame ticks
class SimpleTrader extends Trader {
    DEFAULT_ROI = 0.1;
    roi: number;
    time_frame: number;

    constructor(name: string, portfolio, dna: { time_frame: number, roi?: number }) {
        super(name, portfolio, dna, dna.time_frame);
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

// This trader randomly sells and buys some arbitrary amount of SU
// Follows the mood of the market
class RandomTrader extends Trader {
    update() {
        super.update();
        if (super.ifTimeToUpdate()) {
            if (Math.random() < market_demand.getCurrentValue()) {
                //market_SUETH.buyMarketOrder(this, Utility.randomSuOrder());
                market_SUETH.addBuyMarketOrder(this, Utility.randomSuOrder());
            } else {
                //market_SUETH.sellMarketOrder(this, Utility.randomSuOrder());
                market_SUETH.addSellMarketOrder(this, Utility.randomSuOrder());
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
        traders.push(new Trader("human_1", {balance_SU: 500, balance_mETH: 500}));
        traders.push(new Trader("human_2", {balance_SU: 5000, balance_mETH: 5000}));
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
        for (let i = 0; i < 5; i++) {
            traders.push(new SimpleTrader(
                "simple_" + i,
                Utility.generateRandomPortfolio(),
                {type: "none", time_frame: Math.round(1 + Math.random() * 5), roi: 0.1 * Math.random()}
            ));
        }
        // traders.push(new RandomTrader("random_t1", Utility.generateRandomPortfolio(), {}, 3));
        // traders.push(new RandomTrader("random_t2", Utility.generateRandomPortfolio(), {}, 5));
        for (let i = 0; i < 5; i++) {
            traders.push(new RandomTrader(
                "random_" + i,
                Utility.generateRandomPortfolio(),
                {time_frame: Math.round(1 + Math.random() * 5)}
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
        market_mETHUSD.addRandomValueMove();
        this.market_demand.setNewValue(this.market_demand.getCurrentValue());

        // simulation execution
        web4.su.callOracleSM(market_mETHUSD.getCurrentValue());
        market_SUUSD.setNewValue(market_SUETH.getCurrentValue() * market_mETHUSD.getCurrentValue());

        for (let [, trader] of this.traders) {
            trader.update();
        }
        market_SUETH.update();

        // update the time
        Utility.simulation_tick += 1;
        // console.log("r = " + market_SUETH.getOrderbookVolumeRatio().toFixed(3));
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
//         // const eth_price = market_ETHUSD.getCurrentValue();
//         // const su_peg_price = 1;
//         // const su_price = market_SUETH.getCurrentValue() * eth_price;
//         // // some prices might be NaN if there are not enought liquidity
//         // const su_sell_price = market_SUETH.getCurrentSellPrice() * eth_price;
//         // const su_buy_price = market_SUETH.getCurrentBuyPrice() * eth_price;

//         // if we can buy cheap SU (cheaper than 1-marginality)
//         // we can sell it later for the peg price and get profit (ROI = 1+marginaliry)
//         // let calc price in ETH for SU/ETH market
//         let good_su_sell_price = (1 - this.marginality) / market_ETHUSD.getCurrentValue();
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

//         // // if we can sell SU more than (1+marginality), lets do that
//         // // we will buy it again aroun 1 USD for SU because the System deisgned to be stable
//         // let good_su_buy_price = (1 + this.marginality) / market_ETHUSD.getCurrentValue();
//         // if (market_SUETH.getCurrentBuyPrice() > good_su_buy_price) {
//         //     let max_deal_su = Math.min(this.max_deal_su, this.balance_SU);
//         //     // calc how much su we can sell with profit

//         // }
//     }
// }
