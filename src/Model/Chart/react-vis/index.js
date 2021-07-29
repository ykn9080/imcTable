import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  Treemap,
} from "react-vis";
import "components/Chart/react-vis/style.css";

const myData = {
  title: "analytics",
  color: "#12939A",
  children: [
    {
      title: "cluster",
      children: [
        { title: "AgglomerativeCluster", color: "#12939A", size: 39 },
        { title: "CommunityStructure", color: "#12939A", size: 38 },
        { title: "HierarchicalCluster", color: "#12939A", size: 67 },
        { title: "MergeEdge", color: "#12939A", size: 7 },
      ],
    },
    {
      title: "graph",
      children: [
        { title: "BetweennessCentrality", color: "#12939A", size: 35 },
        { title: "LinkDistance", color: "#12939A", size: 57 },
        { title: "MaxFlowMinCut", color: "#12939A", size: 78 },
        { title: "ShortestPaths", color: "#12939A", size: 59 },
      ],
    },
    {
      title: "optimization",
      children: [{ title: "AspectRatioBanker", color: "#12939A", size: 70 }],
    },
  ],
};
const STYLES = {
  SVG: {
    stroke: "#ddd",
    strokeWidth: "0.25",
    strokeOpacity: 0.5,
  },
  DOM: {
    border: "thin solid #ddd",
  },
};
const Reactvis = (props) => {
  return (
    <>
      <Treemap
        title={"My New Treemap"}
        mode="circlePack"
        width={600}
        height={600}
        data={myData}
      />
      <XYPlot width={300} height={300}>
        <HorizontalGridLines />
        <LineSeries
          data={[
            { x: 1, y: 10 },
            { x: 2, y: 5 },
            { x: 3, y: 15 },
          ]}
        />
        <XAxis />
        <YAxis />
      </XYPlot>
      <Treemap
        {...{
          animation: true,
          className: "nested-tree-example",
          colorType: "literal",
          colorRange: ["#88572C"],
          data: { myData },
          mode: "circlePack",
          renderMode: "SVG",
          height: 300,
          width: 350,
          margin: 10,
          getSize: (d) => d.value,
          getColor: (d) => d.hex,
          style: STYLES["SVG"],
        }}
      />
    </>
  );
};

export default Reactvis;
