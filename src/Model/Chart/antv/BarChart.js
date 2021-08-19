import React, { useState, useEffect } from "react";
import { Bar } from "@ant-design/charts";

import "antd/dist/antd.css";

let data = [
  { title: "테스트1", value: 38 },
  { title: "테스트2", value: 52 },
  { title: "테스트3", value: 61 },
  { title: "테스트4", value: 145 },
  { title: "테스트5", value: 48 },
  { title: "테스트6", value: 38 },
  { title: "테스트7", value: 38 },
  { title: "테스트8", value: 38 },
];
let conf = {
  height: 400,
  data: data,
  xField: "title",
  yField: "value",
};
const BarChart = (props) => {
  const [config, setConfig] = useState();
  useEffect(() => {
    conf = { ...conf, ...props.config };
    setConfig(conf);
  }, [props.config]);

  return <>{config && <Bar {...config} />}</>;
};
export default BarChart;
