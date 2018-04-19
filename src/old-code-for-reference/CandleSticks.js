import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

import {Market} from '../models/es6_simulation';

const CANDLESTICK_COUNT = 50;

type Props = {
  market: Market,
  mobile: boolean
};

type CandleStickEntry = {
  datetime: number,
  open: number,
  high: number,
  low: number,
  close: number
};

type CandleSticksData = Array<CandleStickEntry>;

// We can actually create selectors instead of such functions
// Though this function is only used here, so there's no point
// function convertDataForChart(history: History): CandleSticksData {
//   const lastItems = history.takeLast(CANDLESTICK_COUNT);
//   return lastItems
//     .map((entry: HistoryEntry, index: number): CandleStickEntry => ({
//       datetime: entry.datetime,
//       close: entry.price,
//       high: entry.price + entry.price * 0.03,
//       low: entry.price - entry.price * 0.03,
//       open: lastItems.getIn([index - 1, 'price']) || 1
//     }))
//     .slice(1)
//     .toArray();
// }

const CandleSticks = (props: Props) => {
  const { market, mobile } = props;

  // Convert data for orderbook
  // const data = convertDataForChart(market.history);
  const data = [];

  const style = {
    width: '100%',
    height: mobile ? 150 : 220
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
        highField: 'high',
        lineColor: colors.green,
        lineAlpha: 1,
        lowField: 'low',
        fillAlphas: 0.9,
        negativeFillColors: colors.red,
        negativeLineColor: colors.red,
        openField: 'open',
        title: 'Price:',
        type: 'candlestick',
        valueField: 'close',
        labelsEnabled: false
      }
    ],
    categoryAxis: {
      // labelsEnabled: false,
      parseDates: true,
      minPeriod: 'ss'
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

CandleSticks.defaultProps = {
  mobile: false
};

export default CandleSticks;
