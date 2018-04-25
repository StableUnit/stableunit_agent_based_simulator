// @flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { Toggle } from 'carbon-components-react';

import { colors } from '../theme';

import { Market } from '../models/es6_simulation';

type Props = {
  market: Market
};

type State = {
  showAll: boolean
};

type Entry = {
  datetime: number,
  price: number
};

type HistoryData = Array<Entry>;

class History extends React.Component<Props, State> {
  state = { showAll: false };

  toggleShowAll = () => {
    this.setState({ showAll: !this.state.showAll });
  };

  render() {
    const { market } = this.props;
    const { showAll } = this.state;
    const sliceLength = showAll ? 0 : -50;

    // Convert data for orderbook
    // const data = convertDataForChart(market.history);
    const data: HistoryData = market.history.slice(sliceLength);

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
          lineColor: colors.green,
          lineAlpha: 1,
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
        <Toggle
          id={`${market.name}-toggle`}
          toggled={showAll}
          labelA="last 50"
          labelB="All"
          onToggle={this.toggleShowAll}
        />
        <AmCharts.React style={style} options={options} />
      </div>
    );
  }
}

export default History;
