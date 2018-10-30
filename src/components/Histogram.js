// @flow

import React, { Component, Fragment } from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import TitleWithToggle from './TitleWithToggle';
import { colors } from '../theme';
import { Market } from '../models/es6_simulation';

type Props = {
  market: Market,
  title: string
};

type State = {
  showAll: boolean
};

type HistorgamEntry = {
  price: number,
  count: number
};

type HistogramData = HistorgamEntry[];

class Histogram extends Component<Props, State> {
  state = { showAll: false };

  toggleShowAll = () => {
    this.setState({ showAll: !this.state.showAll });
  };

  render() {
    const { market, title } = this.props;
    const { showAll } = this.state;
    const sliceLength = showAll ? 0 : -50;

    // Convert data for orderbook
    // const data = convertDataForChart(market.history);
    const data: HistogramData = market.histogram.slice(sliceLength).map(item => ({ price: Number(item.price), count: item.count })).sort((a, b) => b.price - a.price);

    const style = {
      width: '100%',
      height: 400
    };

    const options = {
      type: 'serial',
      theme: 'light',
      graphs: [{
        id: 'g1',
        fillColors: colors.green,
        fillAlphas: 1,
        lineColor: colors.green,
        lineAlpha: 1,
        type: 'column',
        valueField: 'count'
      }],
      rotate: true,
      categoryField: 'price',
      categoryAxis: {
        gridPosition: 'start',
        fillAlpha: 0.05,
        position: "left",
      },
      dataProvider: data,
      export: {
        enabled: true,
        position: 'bottom-right'
      }
    };

    return (
      <Fragment>
        <TitleWithToggle
          name={market.name}
          title={title}
          showAll={showAll}
          toggleShowAll={this.toggleShowAll}
        />
        <AmCharts.React style={style} options={options} />
      </Fragment>
    );
  }
}

export default Histogram;
