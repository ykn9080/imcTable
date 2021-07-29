import React from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryScatter,
} from "victory";
var randomColor = require("randomcolor");

const data = [
  { quarter: 1, earnings: 13000, label: "1" },
  { quarter: 2, earnings: 16500, label: "2" },
  { quarter: 3, earnings: 14250, label: "3" },
  { quarter: 4, earnings: 19000, label: "4" },
];

const datastack = {
  2012: [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ],

  2013: [
    { quarter: 1, earnings: 15000 },
    { quarter: 2, earnings: 12500 },
    { quarter: 3, earnings: 19500 },
    { quarter: 4, earnings: 13000 },
  ],

  2014: [
    { quarter: 1, earnings: 11500 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 20000 },
    { quarter: 4, earnings: 15500 },
  ],

  2015: [
    { quarter: 1, earnings: 18000 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 15000 },
    { quarter: 4, earnings: 12000 },
  ],
};

const VicScatter = (props) => {
  let data = [
    { x: 1, y: 2, amount: 30 },
    { x: 2, y: 3, amount: 40 },
    { x: 3, y: 5, amount: 25 },
    { x: 4, y: 4, amount: 10 },
    { x: 5, y: 7, amount: 45 },
  ];

  let bubble = "amount";
  if (props.dt) data = props.dt;
  if (props.bubble) bubble = props.bubble;

  return (
    <>
      <VictoryChart domain={{ x: [0, 5], y: [0, 5] }}>
        <VictoryAxis />
        <VictoryAxis dependentAxis />
        <VictoryScatter
          // style={{ data: { fill: "#c43a31" } }}
          style={{ data: { fill: randomColor() } }}
          bubbleProperty={bubble}
          maxBubbleSize={25}
          minBubbleSize={5}
          data={data}
        />
      </VictoryChart>
    </>
  );
};
export const Vchart = () => {
  return (
    <div style={{ width: 600, height: 500 }}>
      <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={["Q1", "Q2", "Q3", "Q4"]}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => `$${x / 1000}k`}
        />
        <VictoryBar
          data={data}
          //   // data accessor for x values
          //   x="quarter"
          //   // data accessor for y values
          //   y="earnings"
          events={[
            {
              target: "data",
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      target: "label",
                      mutation: (props) => {
                        return props.text === "clicked"
                          ? null
                          : { text: "clicked" };
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
      </VictoryChart>

      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={["Q1", "Q2", "Q3", "Q4"]}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => `$${x / 1000}k`}
        />
        <VictoryStack colorScale={"warm"}>
          {Object.keys(datastack).map((k, i) => {
            return <VictoryBar data={datastack[k]} x="quarter" y="earnings" />;
          })}
        </VictoryStack>
      </VictoryChart>
    </div>
  );
};

export class VicEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      externalMutations: undefined,
    };
  }

  removeMutation() {
    this.setState({
      externalMutations: undefined,
    });
  }

  clearClicks() {
    this.setState({
      externalMutations: [
        {
          childName: "Bar-1",
          target: ["data"],
          eventKey: "all",
          mutation: () => ({ style: undefined }),
          callback: this.removeMutation.bind(this),
        },
      ],
    });
  }

  render() {
    return (
      <div>
        {/* <button onClick={this.clearClicks.bind(this)} style={buttonStyle}>
          Reset
        </button> */}
        <VictoryChart
          domain={{ x: [0, 5] }}
          externalEventMutations={this.state.externalMutations}
          events={[
            {
              target: "data",
              childName: "Bar-1",
              eventHandlers: {
                onClick: () => ({
                  target: "data",
                  mutation: () => ({ style: { fill: "orange" } }),
                }),
              },
            },
          ]}
        >
          <VictoryBar
            name="Bar-1"
            style={{ data: { fill: "grey" } }}
            labels={() => "click me!"}
            data={[
              { x: 1, y: 2 },
              { x: 2, y: 4 },
              { x: 3, y: 1 },
              { x: 4, y: 5 },
            ]}
          />
        </VictoryChart>
      </div>
    );
  }
}

export default VicScatter;
