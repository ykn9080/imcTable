import React, { useState, useEffect } from "react";
import { Scatter } from "@ant-design/charts";

const ScatterPlot = (props) => {
  const [config, setConfig] = useState();
  useEffect(() => {
    const conff = { ...props.config };
    setConfig(conff);
  }, [props.config]);
  return config ? <Scatter {...config} /> : null;
};

export default ScatterPlot;
