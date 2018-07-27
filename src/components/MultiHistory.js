// @flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import TitleWithToggle from './TitleWithToggle';
import { colors } from '../theme';
import type { StableUnitSystemHistory } from '../models/es6_simulation';

type Props = {
  historyData: StableUnitSystemHistory,
  title: string
};

type State = {
  showAll: boolean
};

class History extends React.Component<Props, State> {
  state = { showAll: false };

  toggleShowAll = () => {
    this.setState({ showAll: !this.state.showAll });
  };

  render() {
    const { historyData, title } = this.props;
    const { showAll } = this.state;
    const sliceLength = showAll ? 0 : -50;

    const data: StableUnitSystemHistory = historyData.slice(sliceLength);

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
          valueField: 'SU_circulation',
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
          valueField: 'reserve_ratio',
          labelsEnabled: false,
          balloonText: 'rr: <b>[[reserve_ratio]]</b> <br> reserve(mETH):<b>[[reserve_mETH]]</b><br>',
        },
        {
          valueAxis: 'g1',
          closeField: 'close',
          lineColor: '#660000',
          lineAlpha: 2,
          negativeFillColors: colors.red,
          negativeLineColor: colors.red,
          title: 'Reverse:',
          type: 'line',
          valueField: 'REPO_circulation',
          labelsEnabled: false
        },

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
          name={"circulation"} //TODO: what's this field?
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
