import React from "react";
import { Box } from "@ant-design/charts";
let data = [
  {
    x: "Finance",
    mean: 21,
    stdDev: 0,
    min: 21,
    q1: 21,
    median: 21,
    q3: 21,
    max: 21,
    outliers: [],
  },
  {
    x: "Marketing",
    mean: 8.292,
    stdDev: 16.07,
    min: 0.5,
    q1: 4.5,
    median: 8.5,
    q3: 13,
    max: 15,
    outliers: [],
  },
  {
    x: "Sales",
    mean: 6.222,
    stdDev: 13.695,
    min: 2,
    q1: 3,
    median: 5,
    q3: 7,
    max: 12,
    outliers: [16],
  },
];
const BoxPlot = (props) => {
  if (props.data) data = props.data;
  const config = {
    height: 400,
    data: data,
    xField: "x",
    yField: ["min", "q1", "median", "q3", "max"],
    outliersField: "outliers",
    outliersStyle: { fill: "#f6f" },
  };
  return <Box {...config} />;
};
export default BoxPlot;
