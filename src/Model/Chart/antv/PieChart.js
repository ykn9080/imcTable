import React from "react";
import { Pie } from "@ant-design/charts";

let data = [
  { rowHeader: "test1", frequency: 1 },
  { rowHeader: "test2", frequency: 2 },
  { rowHeader: "test3", frequency: 3 },
  { rowHeader: "test4", frequency: 4 },
  { rowHeader: "test5", frequency: 5 },
];

const PieChart = (props) => {
  if (props.data) data = props.data;

  let config = {
    // height: 400,
    // appendPadding: 10,
    data: data,
    angleField: "frequency",
    colorField: "rowHeader", //일부 차트는 seriesField
    // 여러 색상 설정
    // color: [
    //   '#d62728', '#2ca02c', '#000000'
    // ],
    // 조건부 색상 설정
    // color: ({ type }) => {
    //   if(type === 'male'){
    //     return 'red';
    //   }
    //   return 'yellow';
    // }
    // 차트 속성변경하고자 할때에는 https://charts.ant.design/demos/pie?type=api
    // api문서 참조
    // legend: {
    //   //범례
    //   layout: "horizontal",
    //   position: "bottom",
    // },
    // radius: 0.8,
    // label: {
    //   type: "outer",
    //   content: "{name} {percentage} ({value})",
    // },
    // interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  };
  if (props.config) {
    config = { ...config, ...props.config };
  }
  return <Pie {...config} />;
};

export default PieChart;
