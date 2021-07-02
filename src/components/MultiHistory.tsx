import React, { Component, Fragment } from "react";
import AmCharts from "@amcharts/amcharts3-react";
import TitleWithToggle from "./TitleWithToggle";
import { colors } from "../theme";
import type { StableUnitSystemHistory } from "../models/es6_simulation";
type Props = {
  historyData: StableUnitSystemHistory;
  title: string;
};
type State = {
  showAll: boolean;
};

type ItemType = {
  values: {
    value: string;
  }
}

class History extends Component<Props, State> {
  state = {
    showAll: false
  };
  toggleShowAll = () => {
    this.setState({
      showAll: !this.state.showAll
    });
  };

  render() {
    const {
      historyData,
      title
    } = this.props;
    const {
      showAll
    } = this.state;
    const sliceLength = showAll ? 0 : -50;
    const data: StableUnitSystemHistory = historyData.slice(sliceLength);
    const style = {
      width: '100%',
      height: 200
    };
    const options = {
      type: 'serial',
      theme: 'light',
      valueAxes: [{
        id: 'SU_circulation',
        axisColor: '#FF8800',
        position: 'left',
        minimum: 0.0
      }, {
        id: 'reserve_mETH',
        axisColor: '#ff0011',
        position: 'left',
        offset: 60,
        minimum: 0.0,
        labelFunction: (valueText: number) => (valueText / 1000).toFixed(2)
      }, {
        id: 'reserve_ratio',
        axisColor: '#003dfc',
        position: 'right',
        minimum: 0.0
      }, {
        id: 'REPO_circulation',
        axisColor: '#660000',
        position: 'left',
        offset: 120,
        minimum: 0,
        maximum: 1
      }],
      graphs: [{
        valueAxis: 'SU_circulation',
        closeField: 'close',
        lineColor: '#FF8800',
        lineAlpha: 1,
        negativeFillColors: colors.red,
        negativeLineColor: colors.red,
        title: 'SU Circulation:',
        type: 'line',
        valueField: 'SU_circulation',
        labelsEnabled: false,
        balloonFunction: (item: ItemType) => `SU in circulation: <b>${parseFloat(item.values.value).toFixed(2)}</b>`
      }, {
        valueAxis: 'reserve_mETH',
        closeField: 'close',
        lineColor: '#ff0011',
        lineAlpha: 2,
        negativeFillColors: colors.red,
        negativeLineColor: colors.red,
        title: 'Reverse:',
        type: 'line',
        valueField: 'reserve_mETH',
        labelsEnabled: false,
        balloonFunction: (item: ItemType) => `Reserve (eth): <b>${parseFloat(`${+item.values.value / 1000}`).toFixed(2)}</b>`
      }, {
        valueAxis: 'reserve_ratio',
        closeField: 'close',
        lineColor: '#003dfc',
        lineAlpha: 1,
        negativeFillColors: colors.red,
        negativeLineColor: colors.red,
        title: 'Reverse ratio:',
        type: 'line',
        valueField: 'reserve_ratio',
        labelsEnabled: false,
        balloonFunction: (item: ItemType) => `Reserve ratio: <b>${parseFloat(item.values.value).toFixed(2)}</b>`
      }, {
        valueAxis: 'REPO_circulation',
        closeField: 'close',
        lineColor: '#660000',
        lineAlpha: 2,
        negativeFillColors: colors.red,
        negativeLineColor: colors.red,
        title: 'Reverse:',
        type: 'line',
        valueField: 'REPO_circulation',
        labelsEnabled: false,
        balloonText: 'REPOs in circulation: <b>[[REPO_circulation]]</b>'
      }],
      categoryAxis: {},
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
    return <Fragment>
        <TitleWithToggle name="circulation" //TODO: what's this field?
      title={title} showAll={showAll} toggleShowAll={this.toggleShowAll} />

        <AmCharts.React style={style} options={options} />
      </Fragment>;
  }

}

export default History;