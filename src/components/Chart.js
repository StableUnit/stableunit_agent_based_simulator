import React, { Component } from 'react';
import AmCharts from "@amcharts/amcharts3-react";

const chart = (props) => {
    const style = {
        width: "100%", 
        height: "300px"
    }
    const config = {
        "type": "serial",
        "theme": "light",
        "marginRight": 70,
        "dataProvider": props.history,
        "valueAxes": [{
          "axisAlpha": 0,
          "position": "left",
          "title": "Visitors from country"
        }],
        "startDuration": 1,
        "graphs": [{
          "balloonText": "<b>[[category]]: [[value]]</b>",
          "fillColorsField": "color",
          "fillAlphas": 0.9,
          "lineAlpha": 0.2,
          "type": "line",
          "valueField": "price"
        },{
          "id":"volume",
          "type":"column",
          "valueField": "volume"
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "country",
        "categoryAxis": {
          "gridPosition": "start",
          "labelRotation": 45
        },
        "export": {
          "enabled": true
        }
    };
    return (
        <div>
          <AmCharts.React style={style} options={config} />
        </div>
    );
};

export default chart;