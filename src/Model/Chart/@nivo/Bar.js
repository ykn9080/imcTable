import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import { generateCountriesData } from "@nivo/generators";

const colors = [
  "#fae04d",
  "#ff744c",
  "#789792",
  "#b1646a",
  "#efa9a1",
  "#8470c7",
  "#97a66f",
];
console.log(
  generateCountriesData(["rock", "jazz", "hip-hop", "reggae", "folk"], {
    size: 9,
  })
);
const Bar = (props) => {
  return (
    <div>
      {/* <ResponsiveBar
        margin={{
          top: 1.5,
          right: 10,
          bottom: 1.5,
          left: 1.5,
        }}
        padding={0.2}
        data={generateCountriesData(
          ["rock", "jazz", "hip-hop", "reggae", "folk"],
          { size: 9 }
        )}
        indexBy="country"
        enableGridX={false}
        enableGridY={false}
        keys={["rock", "jazz", "hip-hop", "reggae", "folk"]}
        colors={colors}
        axisBottom={null}
        axisLeft={null}
        borderWidth={3}
        borderColor="#000"
        enableLabel={true}
        labelSkipHeight={24}
        isInteractive={false}
        animate={false}
      /> */}
      <div className="Title">BAR</div>
    </div>
  );
};

export default Bar;
