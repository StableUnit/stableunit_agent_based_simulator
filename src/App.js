import React, { Component } from 'react';
import './App.css';
import Exchange from './components/Exchange';
import ControlPanel from './components/ControlPanel';
import Test from './components/Test';

//import exchange from './component/simulation'

const mockExchangeData = () => {
  const PEG_PRICE = 1.0;
  const DELTA_PRICE = 0.2;
  const DISPERSSION = 0.3;

  let price = PEG_PRICE;
  let volume = 100.0;
  let history = [];
  let max, min;
  for (let date = 0; date <= 100; date++) {
    price += DELTA_PRICE * (Math.random()-0.5);
    volume = 100.0 * Math.random();
    max = price + DISPERSSION * Math.random();
    min = price - DISPERSSION * Math.random();
    history.push({
      date: date,
      price: price,
      volume: volume,
      max: max,
      min: min
    });
  }
  const orders = { sell: [], buy: [] };
  let prices = [];
  for (let i = 0; i < 50; i++) {
    prices.push(PEG_PRICE + DISPERSSION * Math.random());
  }
  prices.sort((a, b) => (a - b));
  for (let i = 0; i < 25; i++) {
    orders.buy.push({ price: prices[i], volume: 10 * Math.random() });
  }
  for (let i = 25; i < 50; i++) {
    orders.sell.push({ price: prices[i], volume: 10 * Math.random() });
  }

  return {
    history: history,
    orders: orders
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {exchange: mockExchangeData()};
  }

  randomlyShakeData = () => {
    const newData = [];
    for (let i = 0; i < this.state.dataProvider.length; i++) {
      newData.push({ ...this.state.dataProvider[i] });
    }
    newData.push({ country: "Japan", visits: 100, color: "red" });
    for (let i = 0; i < newData.length; i++) {
      newData[i].visits = newData[i].visits * Math.random();
    }

    this.setState({
      dataProvider: newData,
      stateChanged: this.state.stateChanged + 1
    });
  }

  render() {
    return (
      <div className="App">
        <div className="column" style={{ backgroundColor: "#aaa" }}>
          <Exchange 
            history={this.state.exchange.history}
            orders={this.state.exchange.orders}
             />
        </div>
        <div className="column" style={{ backgroundColor: "#bbb" }}>
          <ControlPanel />
          <Test />
        </div>
      </div>
    );
  }
}

export default App;