import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

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
            color: '#84b761',
            endValue: 30,
            startValue: 0
          },
          {
            color: '#fdd400',
            endValue: 70,
            startValue: 30
          },
          {
            color: '#cc4748',
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
