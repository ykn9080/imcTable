import React from "react";
import { ResponsiveParallelCoordinates } from "@nivo/parallel-coordinates";

const theme = {
  axis: {
    textColor: "#eee",
    fontSize: "1px",
    tickColor: "#eee",
    domain: {
      line: {
        strokeWidth: 2,
        stroke: "#889eae"
      },
      ticks: {
        line: {
          stroke: "#bbb"
        },
        text: {
          fill: "#F00"
        }
      }
    },
    legend: {
      text: {
        fontSize: 20,
        fontWeight: 100
      },
      position:'horizontal'
    }
  },
  legends: {
    text: {
      fill: "#999999",
      color: "#999999",
      fontSize: 11,
      fontWeight: 300
    }
  }
};

// make sure parent container have a defined height when using responsive component,
// otherwise height will be 0 and no chart will be rendered.
// website examples showcase many properties, you'll often use just a few of them.
function ParallelCoordinatesChart({
  data,
  keys,
  max,
  ...props
}) {
    console.log("data는?")
    console.log(data)
  // const legends = data.map((d, i) => ({
  //   id: d.target,
  //   label: d.target,
  //   // color: palette[i]
  // }));

  // const legendHeight = 60;
  return (
    <div className="chart" style={{height:500}}>
      <ResponsiveParallelCoordinates
        // width={800}
        // height={500}
        variables={[
            {
                key: 'temp',
                type: 'linear',
                min: 'auto',
                max: 'auto',
                ticksPosition: 'before', // before 축 왼쪽 , after 축 오른쪽
                legend: 'temperature',
                legendPosition: 'start',
                legendOffset: 20,
            },
            {
                key: 'cost',
                type: 'linear',
                min: 0,
                max: 'auto',
                ticksPosition: 'before',
                legend: 'cost',
                legendPosition: 'start',
                legendOffset: 20
            },
            {
                key: 'color',
                type: 'point',
                padding: 1,
                values: [
                    'red',
                    'yellow',
                    'green'
                ],
                legend: 'color',
                legendPosition: 'start',
                legendOffset: -20
            },
            {
                key: 'target',
                type: 'point',
                padding: 0,
                values: [
                    'A',
                    'B',
                    'C',
                    'D',
                    'E'
                ],
                legend: 'target',
                legendPosition: 'start',
                legendOffset: -20
            },
            {
                key: 'volume',
                type: 'linear',
                min: 0,
                max: 'auto',
                legend: 'volume',
                legendPosition: 'start',
                legendOffset: -20
            }
        ]}
        margin={{
          top: 50,
          right: 60,
          bottom: 50,
          left: 60
        }}
        data={data}
        colors={{ scheme : 'nivo' }}
        curve="linear"
        lineOpacity={0.35} //선투명도
        strokeWidth={2} //선 굵기
        xaxesTicksPosition="after"
        layout="horizontal" //세로축 , 가로축 vertical
        axesPlan="foreground"
        theme={theme}
        animate
        motionStiffness={90}
        motionDamping={12}
        motionConfig="molasses" //data달라질때 라인 변경모션
      />
    </div>
  );
}


export default ParallelCoordinatesChart;
