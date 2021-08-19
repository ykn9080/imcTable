import React from "react";
import { Area } from "@ant-design/charts";

var data = [
  {
    nodeset: "Club1",
    name: "John",
    value: 2,
  },
  {
    nodeset: "Club1",
    name: "Thomas",
    value: 5,
  },
  {
    nodeset: "Club1",
    name: "Anna",
    value: 7,
  },
  {
    nodeset: "Club1",
    name: "James",
    value: 5,
  },
  {
    nodeset: "Club1",
    name: "Peter",
    value: 23,
  },
  {
    nodeset: "Club1",
    name: "Mary",
    value: 22,
  },
  {
    nodeset: "Club1",
    name: "Michael",
    value: 16,
  },
  {
    nodeset: "Club2",
    name: "John",
    value: 16,
  },
  {
    nodeset: "Club2",
    name: "Thomas",
    value: 17,
  },
  {
    nodeset: "Club2",
    name: "Anna",
    value: 11,
  },
  {
    nodeset: "Club2",
    name: "James",
    value: 8,
  },
  {
    nodeset: "Club2",
    name: "Peter",
    value: 21,
  },
  {
    nodeset: "Club2",
    name: "Mary",
    value: 5,
  },
  {
    nodeset: "Club2",
    name: "Michael",
    value: 16,
  },
  {
    nodeset: "Club3",
    name: "John",
    value: 13,
  },
  {
    nodeset: "Club3",
    name: "Thomas",
    value: 23,
  },
  {
    nodeset: "Club3",
    name: "Anna",
    value: 26,
  },
  {
    nodeset: "Club3",
    name: "James",
    value: 48,
  },
  {
    nodeset: "Club3",
    name: "Peter",
    value: 12,
  },
  {
    nodeset: "Club3",
    name: "Mary",
    value: 29,
  },
  {
    nodeset: "Club3",
    name: "Michael",
    value: 10,
  },
];

const AreaBox = (props) => {
  var config = {
    // height: 400,
    data: data,
    xField: "name",
    yField: "value",
    seriesField: "nodeset",
    //isPercent: true,
    //isStack: true,
    // legend: {
    //   layout: "vertical",
    //   position: "right",
    // },
    // label: {
    //   position: "middle",
    //   // content: function content(item) {
    //   //   return item.value.toFixed(2);
    //   // },
    //   style: {
    //     fill: "#fff",
    //   },
    // },
    // legend: {
    //   layout: "horizontal",
    //   position: "bottom",
    // },
  };
  if (props.config) {
    config = { ...config, ...props.config };
  }
  return (
    <>
      <div>
        <Area {...config} />
      </div>
    </>
  );
};
export default AreaBox;
