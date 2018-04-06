// @flow

// it's very simplified version Ethereum blockhain
class Ethereum {
    // let's define blockchain as [address->value] dictionary
    // accounts:Map<string, number> = new Map();
    // erc20tokens:Map<string, Map<String, number>> = new Map();
    accounts = {};
    erc20tokens = {};
    
    // blockchain accounts are [addr,private_key]
    createWallet(initial_amount) {
        // some random string which looks like eth address 0xF032eF6D2Bc2dBAF66371cFEC4B1B49F4786A250
        const addr = "0x" + Math.random().toString(39).replace(/[^a-z]+/g, '');
        // we don't simulate security but only general concept of workflow
        const prkey = addr;
        // set inititil funds
        this.accounts.set(addr, initial_amount);
        return {addr, prkey};
    }

    // this operation happend localy
    signTransaction(addr_sender, amount, addr_recipient, prkey) {
        // see prkey generating
        if (addr_sender === prkey) {
            // for simplicity sign of tnx is amount, very simple hash, yes
            return amount;
        }
        return null;
    }

    // this things normally happend on many computers of miners
    doTransaction(addr_sender, amount, addr_recipient, txn_sign) {
        if (amount === txn_sign) {
            if (this.accounts[addr_sender] !== undefined && 
                this.accounts[addr_sender] >= amount) {
                this.accounts[addr_sender] -= amount;
                this.accounts[addr_recipient] = (this.accounts[addr_recipient] || 0) +  amount;
                return true;
            }
        }
        return false;
    }

    // instead of implementing full https://theethereum.wiki/w/index.php/ERC20_Token_Standard, let's do 
    // simple reduction of it for simulation needs
    createERC20(token_name, addr_sender, amount_supply, tnx_sign) {

    }

    sendToken(token_name, addr_sender, amount, addr_recipient, tnx_sign) {

    }
}
const ethereum = new Ethereum();

class StableUnit extends Ethereum {
    PEG = 1.0;
    D1 =  0.05;
    D2 =  0.10;
    D3 =  0.15;
    D4 =  0.20;
    D5 =  0.25;

    SUETH_price: number;
    ETHUSD_price: number;
    SU_price: number;
    Reserve = {};
    FrosenRatio = 0.0;

    constructor() {
        super();
        // create DAO

        // init stabilisation fund
        this.Reserve = ethereum.createWallet(0);        
    }

    oracle(SUETH_price, ETHUSD_price) {
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

    buySUfromReserve(eth_addr, amount_eth, txn_sign, su_addr) {
        // check that sender is owed that money
        // check that SF able to sell SU

    }

    sellSUfromReserve(su_addr, amount_su, txn_sign, eth_addr) {

    }
    // bonds are erc20 tokens so can be store on the same addresses;
    buyBonds(su_addr, amount_su, tnx_sign, eth_addr_erc20token) {

    }

    sellBonds() {

    }

    // during temporaty freeze only part of fund are avaliable for transaction
    doTransaction(addr_sender, amount, addr_recipient, txn_sign) {
        if (this.accounts[addr_sender]*(1.0 - this.FrosenRatio) <= amount) {
            super.doTransaction(addr_sender, amount, addr_recipient, txn_sign)
        }
    }

}




