import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";

let data = [
  { title: "test1", value: 15 },
  { title: "test2", value: 30 },
  { title: "test3", value: 45 },
  { title: "test4", value: 17 },
  { title: "test5", value: 23 },
  { title: "test6", value: 53 },
  { title: "test7", value: 68 },
  { title: "test8", value: 38 },
];

const LineChart = (props) => {
  let config = {
    height: 400,
    data: data,
    padding: "auto",
    xField: "title",
    yField: "value",
    // xAxis: {
    //   type: 'timeCat',
    //   tickCount: 5,
    // },
  };
  if (props.config) {
    config = { ...config, ...props.config };
  }
  return <Line {...config} />;
};
export default LineChart;
