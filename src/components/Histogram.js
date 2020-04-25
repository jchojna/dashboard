import React from "react";
import {ResponsiveBar} from "@nivo/bar";
import "../scss/Histogram.scss";

const Histogram = (props) => {
  const {data, keys, layout, axisRight = null, margin, colors} = props;

  const theme = {
    fontFamily: "Nunito",
    fontSize: "11px",
    axis: {
      textColor: "#eee",
      tickColor: "#eee",
      ticks: {
        line: {
          stroke: "gray",
        },
        text: {
          fill: "#ccc",
        },
      },
    },
    grid: {
      stroke: "#888",
      strokeWidth: 1,
    },
  };

  const axisLeft = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
  };

  const tooltip = (tooltipData) => {
    const {id, value, index, indexValue, color} = tooltipData;

    return (
      <div className="Histogram__tooltip">
        {id}
        <br />
        {value}
        <br />
        {index}
        <br />
        {indexValue}
        <br />
        {color}
      </div>
    );
  };

  return (
    <div className="Histogram">
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="id"
        margin={margin}
        padding={0.5}
        layout={layout}
        colors={colors}
        borderColor={{from: "color", modifiers: [["darker", "1.6"]]}}
        axisTop={null}
        axisRight={axisRight}
        axisBottom={null}
        axisLeft={axisLeft}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{from: "color", modifiers: [["darker", 1.6]]}}
        legends={[]}
        tooltip={tooltip}
        theme={theme}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};
export default Histogram;
