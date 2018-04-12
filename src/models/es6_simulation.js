// @flow

// it's very simplified version Ethereum blockhain
class Ethereum {
    // let's define blockchain as [address->value] dictionary
    accounts:Map<string, number> = new Map();
    erc20tokens:Map<string, Map<string, number>> = new Map();

    // blockchain accounts 
    createWallet(initial_amount) {
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
    Reserve = {};
    FrosenRatio = 0.0;

    constructor() {
        super();
        // create DAO
        let fundation_account = this.createWallet(1);
        this.createTokens(fundation_account.address, "SU_DAO", 1000);
        // init stabilisation fund

        // Commented out as `ethereum` is not declared
        // this.Reserve = ethereum.createWallet(0);
    }

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
        if ((this.accounts.get(address_sender) || 0) * (1.0 - this.FrosenRatio) <= amount) {
        super.sendTransaction(address_sender, amount, address_recipient);
        }
    }
}

class Market {
  name: string;
  history: Array<{ datetime: number, price: number }>;

  constructor(name: string = 'no_name') {
    this.name = name;
  }

  getCurrentPrice() {
    return this.history[this.history.length].price;
  }
}

export class Simulation {
  ethereum: Ethereum;
  markets: Map<string, Market>;
  ethUsdPrice: number;
  // takes callBack funtions for visualisation
  constructor() {
    // init all instances of the simulation:
    // blokchains,
    // exchanges,
    // traders
    this.ethereum = new Ethereum();
    this.markets = new Map([['su_eth', new Market('ETH-SU')]]);
  }
  // execute one tick of the simulation
  update() {
    console.log('tick');
  }
}