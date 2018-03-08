import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

import { colors } from '../theme';

const Hodlometer = () => {
  const style = {
    width: '300px',
    height: '300px'
  };

  const options = {
    type: 'gauge',
    theme: 'light',
    axes: [
      {
        axisThickness: 1,
        axisAlpha: 0.2,
        tickAlpha: 0.2,
        valueInterval: 20,
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
            innerRadius: '95%',
            startValue: 70
          }
        ],
        bottomText: 'Hodlometer',
        bottomTextYOffset: -20,
        endValue: 100
      }
    ],
    arrows: [{}],
    export: {
      enabled: true
    },
    allLabels: [
      { x: 0, y: 230, text: 'HODL', bold: true },
      { x: '!0', y: 230, text: 'SELL', bold: true, align: 'right' }
    ]
  };
  return (
    <div>
      <AmCharts.React style={style} options={options} />
    </div>
  );
};

export default Hodlometer;
