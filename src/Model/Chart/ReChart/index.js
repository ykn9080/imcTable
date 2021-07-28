import React, { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  Brush,
  Cell,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Rechart = (props) => {
  const [data, setData] = useState(props.data);
  const [charttype, setCharttype] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (props.data) setData(props.data);
    if (props.charttype) setCharttype(props.charttype);
    // if (props.aggregate && props.aggregate !== "none") aggre();
    // console.log("im useeffect", props.aggregate);
  }, [props]);

  const handleClick = (data, index) => {
    setActiveIndex(index);
  };

  let BarMake =
    // props.value &&
    // props.value.map((k, i) => {
    //   switch (charttype) {
    //     case "bar":
    //     default:
    //       return <Bar dataKey={k} fill={COLORS[i % COLORS.length]} />;
    //   }
    // });
    props.value &&
    props.value.map((k, i) => {
      switch (charttype) {
        case "bar":
        default:
          return (
            // <Bar dataKey={k} fill={COLORS[i % COLORS.length]} />
            <Bar key={k} dataKey={k} onClick={handleClick}>
              {data &&
                data.map((entry, index) => (
                  <Cell
                    cursor="pointer"
                    fill={index === activeIndex ? "#82ca9d" : "#8884d8"}
                    key={`cell-${index}`}
                  />
                ))}
            </Bar>
          );
        // case "pie":
        //   return;
        //   <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />;
        case "line":
          return (
            <Line
              type="monotone"
              key={k}
              dataKey={k}
              stroke={COLORS[i % COLORS.length]}
              activeDot={{ r: 8 }}
            />
          );
      }
    });
  let brush = props.brush && (
    <Brush
      dataKey={props.xaxis}
      height={20}
      stroke="#8884d8"
      onChange={(e) => console.log(e)}
    />
  );
  let whsetting = { height: "85%" };
  if (props.aspect) whsetting = { aspect: props.aspect };

  const barCht = (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis dataKey={props.xaxis} />
      <YAxis />
      {props.cartesiangrid && <CartesianGrid strokeDasharray="3 3" />}
      {props.tooltip && <Tooltip />}
      {props.legend && <Legend />}
      {BarMake}
      {brush}
    </BarChart>
  );

  const lineCht = (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey={props.xaxis} />
      <YAxis />
      {props.cartesiangrid && <CartesianGrid strokeDasharray="3 3" />}
      {props.tooltip && <Tooltip />}
      {props.legend && <Legend />}
      {props.value &&
        props.value.map((k, i) => {
          return (
            <Line
              type="monotone"
              key={k}
              dataKey={k}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          );
        })}

      {brush}
    </LineChart>
  );
  const scatterCht = (
    <ScatterChart
      width={400}
      height={400}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <XAxis type="category" dataKey={"src"} name="source" unit="" />
      <YAxis type="category" dataKey={"tgt"} name="target" unit="" />
      <ZAxis dataKey={"wgt"} range={[60, 400]} name="weight" unit="" />

      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Legend />
      <Scatter name="Linkset" data={data} fill="#8884d8" />
    </ScatterChart>
  );
  return (
    <>
      <ResponsiveContainer {...whsetting} width="100%">
        {(() => {
          switch (props.charttype) {
            case "bar":
            default:
              return barCht;
            case "line":
              return lineCht;
            case "scatter":
              return scatterCht;
          }
        })()}
      </ResponsiveContainer>
    </>
  );
};

export default Rechart;
