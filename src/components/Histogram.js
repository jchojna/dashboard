import React from "react";
import {ResponsiveBar} from "@nivo/bar";
import "../scss/Histogram.scss";

const Histogram = (props) => {
  const {
    data,
    keys,
    type,
    layout,
    margin,
    axisRight = null,
    colors,
    enableGridX = false,
    enableGridY = false,
  } = props;

  const theme = {
    axis: {
      textColor: "#fff",
      textTransform: "uppercase",
      tickColor: "#fff",
      ticks: {
        line: {
          stroke: "fff",
        },
        text: {
          fill: "#555",
          fontWeight: "bold",
          fontFamily: "Nunito",
          fontSize: "11px",
          textTransform: "uppercase",
        },
      },
    },
    grid: {
      line: {
        stroke: "#fff",
        strokeWidth: 3,
        strokeDasharray: "3 3",
      },
    },
    tooltip: {
      container: {
        padding: "10px",
        borderRadius: "5px"
      },
    },
  };

  const axisLeft = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 3,
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
    <div className={`Histogram Histogram--${type}`}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="id"
        margin={margin}
        padding={0.6}
        innerPadding={5}
        layout={layout}
        colors={colors}
        colorBy="id"
        borderColor={{from: "color", modifiers: [["darker", "1.6"]]}}
        axisTop={null}
        axisRight={axisRight}
        axisBottom={null}
        axisLeft={axisLeft}
        enableLabel={false}
        enableGridX={enableGridX}
        enableGridY={enableGridY}
        gridXValues={[20,40,60,80]}
        gridYValues={5}
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
