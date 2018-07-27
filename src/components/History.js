// @flow

import React from 'react';
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
    const { market, title } = this.props;
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
          position: 'left',
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
      <div style={{ flex: 1 }}>
        <TitleWithToggle
          name={market.name}
          title={title}
          showAll={showAll}
          toggleShowAll={this.toggleShowAll}
        />

        <AmCharts.React style={style} options={options} />
      </div>
    );
  }
}

export default History;
