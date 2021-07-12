import React from "react";
import AmCharts from "@amcharts/amcharts3-react";
import TitleWithToggle from "./TitleWithToggle";
import { colors } from "../theme";
import { Market } from "../models/es6_simulation";
import Histogram from "./Histogram";
import styled from "styled-components";
type Props = {
  market: Market;
  title: string;
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
};
type State = {
  showAll: boolean;
};
type Entry = {
  datetime: number;
  price: number;
};
type HistoryData = Array<Entry>;
const PanelLeft = styled.div`
  width: 60%;
`;
const PanelRight = styled.div`
  width: 40%;
`;
const FlexContainer = styled.div`
  display: flex;
`;

class History extends React.Component<Props, State> {
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
      market,
      title,
      D1,
      D2,
      D3,
      D4
    } = this.props;
    const {
      showAll
    } = this.state;
    const sliceLength = showAll ? 0 : -50;
    const guides = [{
      value: 1 + D1,
      label: 'market stabilization',
      lineColor: "#660000"
    }, {
      value: 1 - D1,
      label: 'Δs: stabilization fund',
      lineColor: "#990000"
    }, {
      value: 1 - D2,
      label: 'Δb: bonds',
      lineColor: "#CC0000"
    }, {
      value: 1 - D3,
      label: 'Δd: shares dilution',
      lineColor: "#FF0000"
    }, {
      value: 1 - D4,
      label: 'Δp: temporary parking',
      lineColor: "#FF0000"
    }].map(guide => ({ ...guide,
      lineAlpha: 1,
      dashLength: 2,
      inside: true,
      labelRotation: 90
    }));
    const data: HistoryData = market.history.slice(sliceLength);
    const style = {
      width: '100%',
      height: 400
    };
    const options = {
      type: 'serial',
      theme: 'light',
      valueAxes: [{
        position: 'left',
        guides,
        gridCount: 7,
        minimum: 0.0,
        //maximum: 1.2,
        autoGridCount: false,
        includeGuidesInMinMax: true
      }],
      graphs: [{
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
    return <div style={{
      flex: 1
    }}>
        <TitleWithToggle name={market.name} title={title} showAll={showAll} toggleShowAll={this.toggleShowAll} />

        <FlexContainer>
          <PanelLeft>
            <AmCharts.React style={style} options={options} />
          </PanelLeft>
          <PanelRight>
            <Histogram market={market} />
          </PanelRight>
        </FlexContainer>
      </div>;
  }

}

export default History;