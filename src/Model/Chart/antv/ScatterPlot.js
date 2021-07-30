import React, { useState } from "react";
import { Scatter } from "@ant-design/charts";
import scatterData from "./scatterData";
import _ from "lodash";

let data = [
  { XAxisVector: 1.0, YAxisVector: 4.0, type: "a" },
  { XAxisVector: 2.0, YAxisVector: 6.0, type: "a" },
  { XAxisVector: 3.0, YAxisVector: 7.0, type: "c" },
  { XAxisVector: 4.0, YAxisVector: 2.0, type: "b" },
  { XAxisVector: 5.0, YAxisVector: 6.0, type: "a" },
  { XAxisVector: 6.0, YAxisVector: 1.0, type: "c" },
  { XAxisVector: 7.0, YAxisVector: 3.0, type: "a" },
  { XAxisVector: 8.0, YAxisVector: 2.0, type: "b" },
];

const ScatterPlot = (props) => {
  //if(props.data) data = props.data;

  const config = {
    appendPadding: 10,
    data: data,
    xField: "XAxisVector",
    yField: "YAxisVector",
    seriesField: "type", //일부 차트는 seriesField
    // colorField : 'XAxisVector',
    shape: "circle",
    size: [2, 16],
    yAxis: {
      nice: true,
      line: { style: { stroke: "#aaa" } },
    },
    xAxis: {
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
    },
    legend: {
      //범례
      layout: "horizontal",
      position: "bottom",
    },
    // label: {
    //   type: 'outer',
    //   content: '{name}',
    // },
  };
  return <Scatter {...config} />;
};

export default ScatterPlot;
