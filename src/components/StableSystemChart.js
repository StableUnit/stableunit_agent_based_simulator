//@flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

import type { SULog } from '../types';

type Props = {
  log: SULog
};

type Entry = {
  datetime: number,
  totalSupply: number,
  piggyBankUSD: number,
  piggyBankETH: number
};

type StableSystemData = Array<Entry>;

// We can actually create selectors instead of such functions
// Though this function is only used here, so there's no point
function convertDataForChart(log: SULog): StableSystemData {
  return log
    .toList()
    .map(entry => {
      return {
        datetime: entry.datetime,
        totalSupply: entry.totalSupply,
        piggyBankUSD: entry.piggyBankUSD,
        piggyBankETH: entry.piggyBankETH
      };
    })
    .toArray();
}

const StableSystemChart = (props: Props) => {
  const { log } = props;

  // Convert data for orderbook
  const data = convertDataForChart(log);

  const style = {
    width: '330px',
    height: '200px'
  };

  const options = {
    type: 'serial',
    categoryField: 'datetime',
    fontSize: 13,
    theme: 'default',
    categoryAxis: {
      gridPosition: 'start',
      axisThickness: 0,
      gridThickness: 0,
      parseDates: true,
      minPeriod: 'mm'
    },
    trendLines: [],
    graphs: [
      {
        id: 'totalSupply',
        showBalloon: false,
        title: 'Total SU Supply',
        valueField: 'totalSupply',
        lineColor: colors.green
      },
      {
        id: 'piggyBankUSD',
        title: 'Piggy bank USD',
        valueAxis: 'piggyBankUSD',
        valueField: 'piggyBankUSD',
        lineColor: colors.red
      },
      {
        id: 'piggyBankETH',
        title: 'Piggy bank ETH',
        valueAxis: 'piggyBankETH',
        valueField: 'piggyBankETH',
        lineColor: colors.yellow
      }
    ],
    guides: [],
    valueAxes: [
      {
        id: 'totalSupply',
        autoGridCount: false,
        axisThickness: 0,
        gridCount: 0,
        gridThickness: 0,
        title: ''
      },
      {
        id: 'piggyBankUSD',
        autoGridCount: false,
        axisThickness: 0,
        gridCount: 0,
        gridThickness: 0
      },
      {
        id: 'piggyBankETH',
        autoGridCount: false,
        axisThickness: 0,
        gridCount: 0,
        gridThickness: 0
      }
    ],
    allLabels: [],
    balloon: {},
    titles: [],
    dataProvider: data
  };

  return (
    <div>
      <AmCharts.React style={style} options={options} />
    </div>
  );
};

export default StableSystemChart;
