// @flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

import {Market} from '../models/es6_simulation';

type Props = {
  market: Market,
};

type Entry = {
  datetime: number,
  price: number
}

type HistoryData = Array<Entry>;

const History = (props: Props) => {
  const { market } = props;

  // Convert data for orderbook
  // const data = convertDataForChart(market.history);
  const data: HistoryData = market.history;

  console.log(data)

  const style = {
    width: '100%',
    height: 200
  };

  const options = {
    type: 'serial',
    theme: 'light',
    valueAxes: [
      {
        position: 'left'
      }
    ],
    graphs: [
      {
        id: 'g1',
        // balloonText:
        //   'Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>',
        closeField: 'close',
        fillColors: colors.green,
        lineColor: colors.green,
        lineAlpha: 1,
        fillAlphas: 0.9,
        negativeFillColors: colors.red,
        negativeLineColor: colors.red,
        title: 'Price:',
        type: 'line',
        valueField: 'price',
        labelsEnabled: false
      }
    ],
    categoryAxis: {
      // labelsEnabled: false,
      // parseDates: true,
      // minPeriod: 'ss'
    },
    chartCursor: {
      valueLineEnabled: true,
      valueLineBalloonEnabled: true
    },
    categoryField: 'datetime',
    dataProvider: data,

    export: {
      enabled: true,
      position: 'bottom-right'
    }
  };

  return (
    <div>
      <AmCharts.React style={style} options={options} />
    </div>
  );
};

History.defaultProps = {
  mobile: false
};

export default History;
