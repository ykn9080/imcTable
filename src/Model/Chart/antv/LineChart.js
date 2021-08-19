import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";

const LineCht = (props) => {
  const [config, setConfig] = useState();
  useEffect(() => {
    const conff = { ...props.config };
    setConfig(conff);
  }, [props.config]);

  return config ? <Line {...config} /> : null;
};
export default LineCht;
