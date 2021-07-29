import React, { useState } from 'react';
import { Scatter } from '@ant-design/charts';
import scatterData from './scatterData';
import _ from "lodash";

let data = [
  { XAxisVector: 1.0, YAxisVector: 1.0 },
  { XAxisVector: 2.0, YAxisVector: 2.0 },
  { XAxisVector: 3.0, YAxisVector: 3.0 },
  { XAxisVector: 4.0, YAxisVector: 4.0 },
  { XAxisVector: 5.0, YAxisVector: 5.0 },
  { XAxisVector: 6.0, YAxisVector: 4.0 },
  { XAxisVector: 7.0, YAxisVector: 3.0 },
  { XAxisVector: 8.0, YAxisVector: 2.0 }
]

  const ScatterPlot = (props) => {
    if(props.data) data = props.data;

    const config = {
      appendPadding: 10,
      data: data,
      xField: 'XAxisVector',
      yField: 'YAxisVector',
      seriesField: 'XAxisVector',  //일부 차트는 seriesField
      // colorField : 'XAxisVector',
      shape: 'circle',
      size: 4,
      yAxis: {
        nice: true,
        line: { style: { stroke: '#aaa' } },
      },
      xAxis: {
        grid: { line: { style: { stroke: '#eee' } } },
        line: { style: { stroke: '#aaa' } },
      },
      legend: { //범례
        layout: 'horizontal',
        position: 'bottom'
      },
      // label: {
      //   type: 'outer',
      //   content: '{name}',
      // },
    };
    return <Scatter {...config} />;
  };

  export default ScatterPlot;