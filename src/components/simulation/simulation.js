class Actor {
    constructor() {

    }
    update() {

    }
};

class GenericTrader extends Actor {
    constructor() {
        super();
    }
    portfolio = {usd:50,eth:1.5,su:42000};
}

class AlgoTrader extends GenericTrader {
    constructor(DNA, portfolio) {
        this.risk = DNA.risk;
        this.fear = DNA.fear;
        this.greed = DNA.greed;
    }
    update() {
        if (price_SU < 1.0 - DELTA) {
            buy()
        }
        if (price_SU > 1.0 + DELTA) {
            sell()
        }
    }
}

const changeDemand = (factor) => {
    
}

class StockMarket {
    
}

class Currency {
    constructor(amount) {
        this.amount = amount;
    }
}
class USD extends Currency {}
class ETH extends Currency {};
class SC extends Currency {};

class Exchange {
    name = "";
    history = [
        {   datetime,
            price,
            value
        }
    ];
    orders = {
        sell: [{price,volume}],
        buy: []
    }

    addBuyOrder(sc,usd, generictrader, ttl) {

    }

    addSellOrder(sc,usd, generictrader, ttl) {

    }
}