// @flow
import assert from 'assert';

const Utility = {
    EPS: 1e-6
};

// it's very simplified version Ethereum blockhain
class Ethereum {
    // let's define blockchain as [address->value] dictionary
    accounts:Map<string, number> = new Map();
    erc20tokens:Map<string, Map<string, number>> = new Map();

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
        this.erc20tokens.set(token_name, new Map([[address_sender, amount_supply]]));
    }

    sendToken(address_sender, token_name: string, amount, address_recipient) {
        if (this.erc20tokens.has(token_name)) {
            const token_accounts = this.erc20tokens.get(token_name) || new Map();
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
        assert.equal(this.erc20tokens.get("test_token").get(wallet_2.address), 7);
    }
}

class StableUnit extends Ethereum {
    PEG = 1.0;
    D1 = 0.05;
    D2 = 0.1;
    D3 = 0.15;
    D4 = 0.2;
    D5 = 0.25;

    SUETH_price: number;
    ETHUSD_price: number;
    SU_price: number;
    SU_circulation: number;

    //reserve_account = {};
    //fundation_account = {};
    reserve_eth: number;
    reserve_ratio: number;
    bonds: number;
    BONDS_EMISSION = 0.1; // 10% of the SU in circulation
    bond_price: number;
    shares: number;
    FrosenRatio = 0.0;

    constructor(ethereum: Ethereum) {
        super();
        // init stabilisation fund with some existing funds (after ICO for example)
        //this.reserve_account = ethereum.createWallet(1000);
        this.reserve_eth = 1000;
        // create DAO
        //this.fundation_account = this.createWallet(1);
        //this.createTokens(this.fundation_account.address, "SU_DAO", 1000);
        this.shares = 1000;
        // create Bonds as type of token
        //this.createTokens(this.fundation_account.address, "SU_BONDS", 0);
        this.bonds = 0;
    }

    // Oracle smartcontract takes info from outside
    callOracleSM(ETHUSD_price: number) {
        this.ETHUSD_price = ETHUSD_price;
        this.reserve_ratio = this.reserve_eth*ETHUSD_price / this.SU_circulation;
    }

    // Not sure yet whether we need SU/ETH or SU/USD as an input for oracle
    callOracleSM2(SUETH_price: number, ETHUSD_price: number) {
        // reads info from outside world and brings it to the blockchain
        // TODO: checks that prices haven't check too much so nobody is trying to compromize the System
        this.callOracleSM(ETHUSD_price);
        this.SUETH_price = SUETH_price;
        const SU_price = SUETH_price * this.ETHUSD_price;
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
    buySUfromReserveSM(buyer: Trader, eth_amount: number) {
        // check that sender is owed that money
        if (buyer.eth_balance >= eth_amount) {
            // check that SF able to sell SU (always is able)
            // price of SU is 1+delta_S
            let deal_price /*SUETH*/ = (1 + this.D1) /*SU/USD*/ /  this.ETHUSD_price;
            let deal_su = eth_amount / deal_price;
            buyer.eth_balance -= eth_amount;
            buyer.su_balance += deal_su;
            this.SU_circulation += deal_su;
            return true;
        }
        return false;
    }

    //sellSUtoReserveSM(su_addr, amount_su, txn_sign, eth_addr) {}
    sellSUtoReserveSM(seller: Trader, su_amount: number) {
        if (seller.su_balance >= su_amount) {
            // TODO: calc accurate price according wp
            let deal_price = (1 - this.D1) / this.ETHUSD_price;
            let deal_eth = su_amount * deal_price;
            // check that SF able to buy SU (enougth ETH)
            if (this.reserve_eth < deal_eth) {
                deal_eth = Math.min(this.reserve_eth, deal_eth);
                // reserve is empty, unlock bonds mechanism
                this.unlockBonds();
            }
            seller.eth_balance += deal_eth;
            seller.su_balance -= su_amount;
            this.SU_circulation -= su_amount;
            return true;
        }
    }

    unlockBonds() {
        this.bonds = this.SU_circulation * this.BONDS_EMISSION;
    }
    // bonds are erc20 tokens so can be store on the same addresses;
    //buyBondsSM(su_addr, amount_su, tnx_sign, eth_addr_erc20token) {}
    buyBondsSM(trader: Trader, amount_su) {

    }

    sellBondsSM() {}

    // during temporaty freeze only part of fund are avaliable for transaction
    // so we have to reimplement basic transation logic
    sendTransaction(address_sender, amount, address_recipient) {
        // check that avaliable unparked balace is sufficient for transaction
        if ((this.accounts.get(address_sender) || 0) * (1.0 - this.FrosenRatio) >= amount) {
            super.sendTransaction(address_sender, amount, address_recipient);
        }
    }

    test() {

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

export class Trader {
    //portfolio = {};
    su_balance: number;
    eth_balance: number;
    bonds_balance: number;
    shares_balance: number;

    constructor(portfolio: {su_balance: number, eth_balance: number}) {
        // this.portfolio.su_wallet = web4.su.createWallet(portfolio.su_balance);
        // this.portfolio.eth_wallet = web4.eth.createWallet(portfolio.eth_balance);
        this.su_balance = portfolio.su_balance;
        this.eth_balance = portfolio.eth_balance;
        this.bonds_balance = 0;
        this.shares_balance = 0;
    }
    buyOrders: Set<Order> = new Set();
    sellOrders: Set<Order> = new Set();

    // getEthBalance() {
    //     return web4.eth.accounts.get(this.portfolio.eth_wallet.address) || 0;
    // }

    // getSuBalance() {
    //     return web4.su.accounts.get(this.portfolio.su_wallet.address) || 0;
    // }

    test() {}
}
export type Order = {
    trader: Trader;
    su_amount: number;
    eth_amount: number;
    price: number;
}

// market of two particular asserts, i.e. ETH/USD, in this case prices are in USD
export class Market {
    name: string;
    history: Array<{ datetime: number, price: number }> = [];

    constructor(initial_price: number, name: string = 'no_name') {
        this.name = name;
        this.setNewPrice(initial_price);
    }

    setNewPrice(new_price: number) {
        this.history.push({datetime: this.history.length, price: new_price});
    }

    getCurrentPrice() {
        return this.history[this.history.length-1].price;
    }
}
const market_ETHUSD = new Market(500 /*USD per ETH */, "ETH/USD");

// https://en.wikipedia.org/wiki/Order_(exchange)
export class Market_SUETH extends Market {
    buyOrders: Array<Order> = [];
    sellOrders: Array<Order> = [];

    constructor(initial_price: number) {
        super(initial_price, "SUETH");
    }

    getCurrentBuyPrice() {
        if (this.buyOrders.length > 0)
            return this.buyOrders.slice(-1)[0].price;
        else
            return NaN;
    }
    getCurrentSellPrice() {
        if (this.sellOrders.length > 0)
            return this.sellOrders.slice(-1)[0].price;
        else
            return NaN;
    }

    makeTrade(buyer: Trader, seller: Trader, deal_su: number, deal_eth: number) {
        // check that buyer has enougth eth to pay and seller enoguth su to sell
        if (buyer.eth_balance >= deal_eth && seller.su_balance >= deal_su) {
            buyer.eth_balance -= deal_eth;
            seller.eth_balance += deal_eth;
            buyer.su_balance += deal_su;
            seller.su_balance -= deal_su;
            // web4.su.sendTransaction(sellOrder.trader.portfolio.su_wallet.address,
            //                         deal_su,
            //                         buyOrder.trader.portfolio.su_wallet.address);
            // buyOrder.eth_amount -= deal_eth;
            // sellOrder.eth_amount -= deal_eth;
            // web4.eth.sendTransaction(buyOrder.trader.portfolio.eth_wallet.address,
            //                         deal_eth,
            //                         sellOrder.trader.portfolio.eth_wallet.address);
            return true;
        }
        return false;
    }

    newLimitBuyOrder(trader: Trader, su_amount: number, eth_amount: number) {
        // check that the trader can afford that
        if (trader.eth_balance >= eth_amount) {
            const order:Order = {trader: trader, su_amount: su_amount, eth_amount: eth_amount, price: eth_amount / su_amount};
            this.buyOrders.push(order);
            trader.buyOrders.add(order);
            // the last item has the highest price
            this.buyOrders.sort((a,b) => b.price - a.price);
            return "Added limited buy order";
        } else {
            return "No enough ETH";
        }
    }

    newLimitSellOrder(trader: Trader, su_amount: number, eth_amount: number) {
        if (trader.su_balance >= su_amount) {
            const order:Order = {trader: trader, su_amount: su_amount, eth_amount: eth_amount, price: eth_amount / su_amount};
            this.sellOrders.push(order);
            trader.sellOrders.add(order);
            // the last item has the smallest price
            this.buyOrders.sort((a,b) => a.price - b.price);
            return "Added limited sell order";
        } else {
            return "Not enough SU";
        }

    }

    deleteLimitBuyOrder(order:Order) {
        // remove the order from the market queue
        for (let i = 0; i < this.buyOrders.length; i++) {
            if (this.buyOrders[i] === order) {
                this.buyOrders.splice(i, 1);
            }
        }
        // remove order from trader refference
        order.trader.buyOrders.delete(order);
    }

    deleteLimitSellOrder(order:Order) {
        // remove the order from the market queue
        for (let i = 0; i < this.sellOrders.length; i++) {
            if (this.sellOrders[i] === order) {
                this.sellOrders.splice(i, 1);
            }
        }
        // remove order from trader refference
        order.trader.sellOrders.delete(order);
    }

    // This method is trying to complete all possible deals if any available
    update() {
        // check is any limit orders are possible to complete
        while (this.getCurrentBuyPrice() >= this.getCurrentSellPrice()) {
            let buyOrder = this.buyOrders.pop();
            buyOrder.trader.buyOrders.delete(buyOrder);
            let sellOrder = this.sellOrders.pop();
            sellOrder.trader.sellOrders.delete(sellOrder);
            // TODO: make fair exchange
            // temp solution: market doesn't try to earn on this kind of deals
            let deal_price = (buyOrder.price + sellOrder.price) / 2;
            let deal_su = Math.min(buyOrder.su_amount, sellOrder.su_amount);
            let deal_eth = deal_su * deal_price;
            // make a deal between buyer and seller
            if( this.makeTrade(buyOrder.trader, sellOrder.trader, deal_su, deal_eth) ) {
                buyOrder.su_amount -= deal_su;
                sellOrder.su_amount -= deal_su;
                // save this deal in the history
                this.setNewPrice(deal_price);
            }
            // if the one of the orders is only partially completed - add reminder back
            if (sellOrder.su_amount > Utility.EPS) {
                this.sellOrders.push(sellOrder);
                sellOrder.trader.sellOrders.add(sellOrder);
            }
            if (buyOrder.su_amount > Utility.EPS) {
                this.buyOrders.push(buyOrder);
                buyOrder.trader.buyOrders.add(buyOrder);
            }
        }
    }

    // A market order is a buy or sell order to be executed immediately at current market prices.
    // Like pacman it eats all avalibile sell order until reach su_amount
    newMarketBuyOrder(buyer: Trader, su_amount: number) {
        let status_prefix = "Order was not completed. ";
        // if orderbook has sell orders and buyer is still wants to buy
        while (this.sellOrders.length > 0 && su_amount > Utility.EPS) {
            // take the cheapest one
            let sellOrder = this.sellOrders.pop();
            // calc the deal details
            let deal_price = sellOrder.price;
            let deal_su = Math.min(su_amount, sellOrder.su_amount);
            let deal_eth = deal_su*deal_price;
            // try to make a deal
            if (this.makeTrade(buyer, sellOrder.trader, deal_su, deal_eth)) {
                status_prefix = "The order was partialy completed. ";
                su_amount -= deal_su;
                sellOrder.su_amount -= deal_su;
                sellOrder.eth_amount -= deal_eth;
                // if the sell order is only partially completed - add reminder back
                if (sellOrder.su_amount > Utility.EPS) {
                    this.sellOrders.push(sellOrder);
                }
            }
        }
        if (su_amount <= Utility.EPS) {
            return "Market buy order was completed. ";
        } else {
            if (this.sellOrders.length === 0) {
                return status_prefix + "Not enough sell orders in the queue. ";
            } else {
                return status_prefix + "Not enough ETH to buy. ";
            }
        }
    }

    newMarketSellOrder(seller: Trader, su_amount: number) {
        let status_prefix = "Order was not completed. ";
        if (seller.su_balance < su_amount) {
            return status_prefix + "Not enough SU to sell. ";
        }
        // if orderbook has sell orders and buyer is still wants to buy
        while (this.buyOrders.length > 0 && su_amount > Utility.EPS) {
        // take the cheapest one
            let buyOrder = this.buyOrders.pop();
            // calc the deal details
            let deal_price = buyOrder.price;
            let deal_su = Math.min(su_amount, buyOrder.su_amount);
            let deal_eth = deal_su*deal_price;
            // try to make a deal
            if (this.makeTrade(buyOrder.trader, seller, deal_su, deal_eth)) {
                status_prefix = "The order was partialy completed. ";
                su_amount -= deal_su;
                buyOrder.su_amount -= deal_su;
                buyOrder.eth_amount -= deal_eth;
                // if the sell order is only partially completed - add reminder back
                if (buyOrder.su_amount > Utility.EPS) {
                    this.buyOrders.push(buyOrder);
                }
            }
        }
        if (su_amount <= Utility.EPS) {
            return "Market sell order was completed. ";
        } else {
            if (this.buyOrders.length === 0) {
                return status_prefix + "Not enough buy orders in the queue. ";
            } else {
                throw new Error("Market sell order error!");
            }
        }
    }

    test() {
        const trader_1 = new Trader({su_balance: 1000, eth_balance: 2});
        const trader_2 = new Trader({su_balance: 1000, eth_balance: 2});
        this.newLimitBuyOrder(trader_1, 500, 1 );
        this.newLimitSellOrder(trader_2, 1000, 2);
        this.update();
        assert.equal(trader_1.su_balance, 1500);
        assert.equal(trader_1.eth_balance, 1);
        assert.equal(trader_2.su_balance, 500);
        assert.equal(trader_2.eth_balance, 3);
        assert.equal(this.getCurrentPrice(), 0.002);
        assert.equal(this.newMarketBuyOrder(trader_1, 501), "The order was partialy completed. Not enough sell orders in the queue. ");
        const trader_3 = new Trader({su_balance: 0, eth_balance: 10});
        this.newLimitSellOrder(trader_1, 500, 1);
        this.newLimitSellOrder(trader_1, 500, 1.5);
        this.newLimitSellOrder(trader_1, 500, 2);
        this.newLimitSellOrder(trader_1, 500, 3);
        this.newLimitBuyOrder(trader_1, 500, 4);
        this.newLimitBuyOrder(trader_3, 2001, 1);
        this.deleteLimitBuyOrder([...trader_3.buyOrders].pop());
        this.newMarketBuyOrder(trader_3, 2001);
        assert.equal(trader_3.eth_balance, 2.5);
    }
}
const market_SUETH = new Market_SUETH(0.002/* ETH per SU */);

export type Traders = Map<string, Trader>;

export class Simulation {
    web4: Web4;
    market_ETHUSD: Market;
    market_SUETH: Market_SUETH;
    traders: Traders = new Map();

    // takes callBack funtions for visualisation
    constructor() {
        // init all instances of the simulation:
        // blokchains,
        this.web4 = web4;
        // exchanges,
        this.market_ETHUSD = market_ETHUSD;
        this.market_SUETH = market_SUETH;
        // traders
        this.traders.set("human_1", new Trader({su_balance: 1000, eth_balance: 2}));
        this.traders.set("human_2", new Trader({su_balance: 1000, eth_balance: 2}));
        // tests
        market_SUETH.test();
    }
    // execute one tick of the simulation
    update() {
        // console.log('tick');
        //this.traders.forEach()
    }
}
