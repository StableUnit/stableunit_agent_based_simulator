// @flow
import assert from 'assert';

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

const ethereum = new Ethereum();

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

    reserve_account = {};
    fundation_account = {};
    FrosenRatio = 0.0;

    constructor(ethereum: Ethereum) {
        super();
        // init stabilisation fund with already 
        this.reserve_account = ethereum.createWallet(1000);
        // create DAO
        this.fundation_account = this.createWallet(1);
        this.createTokens(this.fundation_account.address, "SU_DAO", 1000);
        // create Bonds as type of token
        this.createTokens(this.fundation_account.address, "SU_BONDS", 0);
    }

    // Oracle smartcontract takes info from outside
    oracleSM(SUETH_price, ETHUSD_price) {
        // reads info from outside world and brings it to the blockchain
        // TODO: checks that prices haven't check too much so nobody is trying to compromize the System
        this.SUETH_price = SUETH_price;
        this.ETHUSD_price = ETHUSD_price;
        const SU_price = SUETH_price * ETHUSD_price;
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

    buySUfromReserveSM(eth_addr, amount_eth, txn_sign, su_addr) {
        // check that sender is owed that money
        // check that SF able to sell SU
    }

    sellSUtoReserveSM(su_addr, amount_su, txn_sign, eth_addr) {}
    // bonds are erc20 tokens so can be store on the same addresses;
    buyBondsSM(su_addr, amount_su, tnx_sign, eth_addr_erc20token) {}

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

class Web4 {
    eth: Ethereum;
    su: StableUnit;
    constructor() {
        this.eth = new Ethereum();
        this.su = new StableUnit(this.eth);
    }
}
const web4 = new Web4();


class Trader {
    portfolio = {};
    constructor(portfolio) {
        this.portfolio.su_wallet = web4.su.createWallet(portfolio.su_balance);
        this.portfolio.eth_wallet = web4.eth.createWallet(portfolio.eth_balance);
    }
    
    getEthBalance() {
        return web4.eth.accounts.get(this.portfolio.eth_wallet.address) || 0;
    }

    getSuBalance() {
        return web4.su.accounts.get(this.portfolio.su_wallet.address) || 0;
    }

    test() {

    }
}

// https://en.wikipedia.org/wiki/Order_(exchange)
class Market_SU_ETH {
    buyOrders: Array<Object> = [];
    sellOrders: Array<Object> = [];
    EPS = 1e-6;
    history: Array<{ datetime: number, price: number }> = [];

    getCurrentPrice() {
        return this.history[this.history.length-1].price;
    }

    limitBuyOrder(Trader, su_amount, eth_amount) {
        this.buyOrders.push({trader: Trader, su_amount: su_amount, eth_amount: eth_amount, price: eth_amount / su_amount});
        // the last item has the buggest price
        this.buyOrders.sort((a,b) => b.price - a.price);
    }
    
    limitSellOrder(Trader, su_amount, eth_amount) {
        this.sellOrders.push({trader: Trader, su_amount: su_amount, eth_amount: eth_amount, price: eth_amount / su_amount});
        // the last item has the smallest price
        this.buyOrders.sort((a,b) => a.price - b.price);
    }

    update() {
        while (this.buyOrders.length > 0 && this.sellOrders.length > 0 
            && this.buyOrders.slice(-1)[0].price >= this.sellOrders.slice(-1)[0].price) {
            let buyOrder = this.buyOrders.pop();
            let sellOrder = this.sellOrders.pop();
            // fair exchange doesn't try to earn on this kind of deals
            let deal_price = (buyOrder.price + sellOrder.price) / 2;
            let deal_su = Math.min(buyOrder.su_amount, sellOrder.su_amount);
            let deal_eth = deal_su * deal_price;
            // make a deal between buyer and seller
            buyOrder.su_amount -= deal_su;
            sellOrder.su_amount -= deal_su;
            web4.su.sendTransaction(sellOrder.trader.portfolio.su_wallet.address, 
                                    deal_su, 
                                    buyOrder.trader.portfolio.su_wallet.address);
            buyOrder.eth_amount -= deal_eth;
            sellOrder.eth_amount -= deal_eth;
            web4.eth.sendTransaction(buyOrder.trader.portfolio.eth_wallet.address,
                                    deal_eth,
                                    sellOrder.trader.portfolio.eth_wallet.address);
            // save this deal in the history
            this.history.push({datetime: this.history.length, price: deal_price});
            // if the one of the orders is only partially completed - add reminder back
            if (sellOrder.su_amount > this.EPS) {
                this.sellOrders.push(sellOrder);
            }
            if (buyOrder.su_amount > this.EPS) {
                this.buyOrders.push(buyOrder);
            }
        }
    }

    testLimitOrder() {
        let trader_1 = new Trader({su_balance: 1000, eth_balance: 2});
        let trader_2 = new Trader({su_balance: 1000, eth_balance: 2});
        this.limitBuyOrder(trader_1, 500, 1 );
        this.limitSellOrder(trader_2, 1000, 2);
        this.update();
        assert.equal(trader_1.getSuBalance(), 1500);    
        assert.equal(trader_1.getEthBalance(), 1);
        assert.equal(trader_2.getSuBalance(), 500);
        assert.equal(trader_2.getEthBalance(), 3);
        assert.equal(this.getCurrentPrice(), 0.002);
    }


    marketBuyOrder(Trader, su_amount) {

    }

    marketSellOrder(Trader, su_amount) {

    }

    

}
const market_SU_ETH = new Market_SU_ETH();

class Market {
    name: string;
    history: Array<{ datetime: number, price: number }>;

    constructor(name: string = 'no_name') {
        this.name = name;
    }

    getCurrentPrice() {
        return this.history[this.history.length-1].price;
    }
}

export class Simulation {
    web4: Web4;
    market_SU_ETH: Market_SU_ETH;
    
    ethUsdPrice: number;
    // takes callBack funtions for visualisation
    constructor() {
        // init all instances of the simulation:
        // blokchains,
        this.web4 = web4;
        // exchanges,
        this.market_SU_ETH = market_SU_ETH;
        // traders
        market_SU_ETH.testLimitOrder();
    }
    // execute one tick of the simulation
    update() {
        console.log('tick');
    }
}