import React from 'react';
import Chart from './Chart';
import OrderBook from './OrderBook';

const Exchange = (props) => {
    return (
        <div>
            <h1>Exchange</h1>
            <Chart
                title="Exhange history!" 
                history={props.history}/>
            <OrderBook 
                title="OrderBook!"
                orders={props.orders}/>
        </div>
    );
}

export default Exchange;