import React from 'react';
import AmCharts from "@amcharts/amcharts3-react";


const arraysToArrayOfObjects = (arrays) => {
    const result = [];
    Object.keys(arrays).forEach((key) => {
        const a = arrays[key];
        for (let i = 0; i < a.length; i++) {
            if (result.length <= i) {
                result.push({});
            }
            result[i][key] = a[i];
        }
    });
    return result;
}

const OrderBook = (props) => {
    const style = {
        width: "200px",
        height: "300px"
    }

    const config = {
        "type": "serial",
        "theme": "light",
        "dataProvider": props.orders.buy,
        "graphs": [{
            "id": "bids",
            "fillAlphas": 0.1,
            "lineAlpha": 1,
            "lineThickness": 2,
            "lineColor": "#0f0",
            "type": "step",
            "valueField": "price",
            "balloonFunction": balloon
        }, {
            "id": "asks",
            "fillAlphas": 0.1,
            "lineAlpha": 1,
            "lineThickness": 2,
            "lineColor": "#f00",
            "type": "step",
            "valueField": "askstotalvolume",
            "balloonFunction": balloon
        }, {
            "lineAlpha": 0,
            "fillAlphas": 0.2,
            "lineColor": "#000",
            "type": "column",
            "clustered": false,
            "valueField": "volume",
            "showBalloon": false
        }, {
            "lineAlpha": 0,
            "fillAlphas": 0.2,
            "lineColor": "#000",
            "type": "column",
            "clustered": false,
            "valueField": "asksvolume",
            "showBalloon": false
        }],
        "categoryField": "value",
        "chartCursor": {},
        "balloon": {
            "textAlign": "left"
        },
        "valueAxes": [{
            "title": "Volume"
        }],
        "categoryAxis": {
            "title": props.title,
            "minHorizontalGap": 100,
            "startOnAxis": true,
            "showFirstLabel": false,
            "showLastLabel": false
        },
        "export": {
            "enabled": true
        }

    }

    function balloon(item, graph) {
        let txt;
        if (graph.id === "asks") {
            txt = "Ask: <strong>" + formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
                + "Total volume: <strong>" + formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + "</strong><br />"
                + "Volume: <strong>" + formatNumber(item.dataContext.asksvolume, graph.chart, 4) + "</strong>";
        }
        else {
            txt = "Bid: <strong>" + formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
                + "Total volume: <strong>" + formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + "</strong><br />"
                + "Volume: <strong>" + formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + "</strong>";
        }
        return txt;
    }

    function formatNumber(val, chart, precision) {
        return AmCharts.formatNumber(
            val,
            {
                precision: precision ? precision : chart.precision,
                decimalSeparator: chart.decimalSeparator,
                thousandsSeparator: chart.thousandsSeparator
            }
        );
    }

    return (
        <div>
            <AmCharts.React style={style} options={config} />
        </div>
    );
};

export default OrderBook;
