import React, { useEffect, useState, useRef } from "react";
import { Line } from "@ant-design/charts";

const config = {
  height: 400,
  xField: "year",
  yField: "value",
  smooth: true,
  meta: {
    value: {
      max: 15,
    },
  },
  data: [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 11 },
  ],
};
const AntChart = (props) => {
  const chartRef = useRef();
  // const [config, setConfig] = useState();
  // useEffect(() => {
  //   conf = { ...conf, ...props.config };
  //   setConfig(conf);
  //   console.log(conf);
  // }, [props.config]);

  // const FindChart = (type, config) => {
  //   switch (type) {
  //     case "pie":
  //       return <Pie config={config} />;
  //     case "line":
  //       return <Line config={config} />;
  //     case "area":
  //       return <Area config={config} />;
  //     case "column":
  //       return <Column config={config} />;
  //     case "bar":
  //       return <Bar config={config} />;
  //     case "scatter":
  //       return <Scatter config={config} />;
  //     default:
  //       return null;
  //   }
  // };
  // return config ? FindChart(props.type, config) : null;
  const onDestroy = () => {
    if (chartRef.current) {
      const plot = chartRef.current;
      console.log(plot.getChart());
      //  plot.on("line:click", (e) => {
      //    console.log(e);
      //  });
    }
  };
  return (
    <>
      <Line theme="dark" {...config} chartRef={chartRef} forceFit />
      <button onClick={onDestroy}>click</button>
    </>
  );
};
export default AntChart;
