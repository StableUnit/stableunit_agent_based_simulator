// @flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import TitleWithToggle from './TitleWithToggle';
import { colors } from '../theme';
import { Market } from '../models/es6_simulation';

type Props = {
  circulation: Market,
  reverseRatio: Market,
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
    const { circulation, reverseRatio, title } = this.props;
    const { showAll } = this.state;

    // Convert data for orderbook
    // const data = convertDataForChart(market.history);
    const circulationData: HistoryData = showAll ? circulation.history : circulation.history.slice(-50);
    const reverseRatioData: HistoryData = showAll ? reverseRatio.history : reverseRatio.history.slice(-50);
    const data = circulationData.map((item, index) => ({
      datetime: item.datetime,
      circulation: item.price,
      reverseRatio: (reverseRatioData[index] || {}).price
    }));

    const style = {
      width: '100%',
      height: 200
    };

    const options = {
      type: 'serial',
      theme: 'light',
      valueAxes: [
        {
          id: 'g1',
          axisColor: '#FF8800',
          position: 'left',
          minimum: 0.0,
        },
        {
          id: 'g2',
          axisColor: '#FCD202',
          position: 'right',
          minimum: 0.0,
        }
      ],
      graphs: [
        {
          valueAxis: 'g1',
          closeField: 'close',
          lineColor: '#FF8800',
          lineAlpha: 1,
          negativeFillColors: colors.red,
          negativeLineColor: colors.red,
          title: 'SU Circulation:',
          type: 'line',
          valueField: 'circulation',
          labelsEnabled: false
        },
        {
          valueAxis: 'g2',
          closeField: 'close',
          lineColor: '#FCD202',
          lineAlpha: 1,
          negativeFillColors: colors.red,
          negativeLineColor: colors.red,
          title: 'Reverse ratio:',
          type: 'line',
          valueField: 'reverseRatio',
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
          name={circulation.name}
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
