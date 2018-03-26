//@flow

import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

type Props = {
  mobile: boolean,
  fearLevel: number
};

const Hodlometer = ({ mobile, fearLevel }: Props) => {
  const style = {
    width: mobile ? 150 : 250,
    height: mobile ? 150 : 220,
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const options = {
    type: 'gauge',
    theme: 'light',
    axes: [
      {
        axisThickness: 0,
        axisAlpha: 0.2,
        tickAlpha: 0,
        valueInterval: 20,
        labelFrequency: 100,
        showFirstLabel: false,
        showLastLabel: false,
        bands: [
          {
            color: colors.green,
            endValue: 30,
            startValue: 0
          },
          {
            color: colors.yellow,
            endValue: 70,
            startValue: 30
          },
          {
            color: colors.red,
            endValue: 100,
            startValue: 70
          }
        ],
        bottomText: 'HODLOMETER',
        bottomTextFontSize: mobile ? 12 : 20,
        bottomTextYOffset: -20,
        endValue: 100
      }
    ],
    arrows: [
      {
        id: 'fear-level',
        value: fearLevel
      }
    ],
    export: {
      enabled: true
    },
    allLabels: [
      { x: 0, y: 180, text: 'HODL', bold: true },
      { x: '!0', y: 180, text: 'SELL', bold: true, align: 'right' }
    ]
  };
  return <AmCharts.React style={style} options={options} />;
};

Hodlometer.defaultProps = {
  mobile: false
};

export default Hodlometer;
