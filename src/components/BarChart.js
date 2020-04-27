import React from "react";
import {statsFields, months} from "../lib/dataHelpers";
import {ResponsiveBar} from "@nivo/bar";
import "../scss/BarChart.scss";

const Histogram = (props) => {
  const {
    data,
    keys,
    type,
    layout,
    axisRight = null,
    axisBottom = null,
    colors,
    enableGridX = false,
    enableGridY = false,
    gridXValues,
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
        strokeWidth: 2,
        strokeDasharray: "2 2",
      },
    },
    tooltip: {
      container: {
        padding: "10px 15px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      },
    },
  };

  const axisLeft = {
    tickSize: 5,
    tickPadding: 0,
    tickRotation: 0,
    tickValues: 3,
  };

  const margin = {top: 70, right: 30, bottom: 30, ...props.margin};
  const color = {from: "color", modifiers: [["darker", "1.6"]]};

  const tooltip = (tooltipData) => {
    const {id, value, indexValue} = tooltipData;
    const monthName =
      type === "histogram" && indexValue.includes("all months")
        ? months[parseInt(indexValue)]
        : null;

    const heading =
      type === "histogram"
        ? `${statsFields[id]}: ${value}${id === "income" ? " $" : ""}`
        : `${indexValue}: ${value.toFixed(1)}%`;

    const text =
      type === "histogram"
        ? monthName
          ? monthName
          : `Date: ${indexValue}`
        : `${
            id.includes("Before")
              ? "Before current period"
              : "During current period"
          }`;

    return (
      <div className="tooltip">
        <h4 className="tooltip__heading">{heading}</h4>
        <p className="tooltip__text">{text}</p>
      </div>
    );
  };

  return (
    <div className="BarChart">
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="id"
        margin={margin}
        padding={0.6}
        layout={layout}
        colors={(data) => colors(data.id)}
        colorBy="id"
        borderColor={color}
        axisTop={null}
        axisRight={axisRight}
        axisBottom={axisBottom}
        axisLeft={axisLeft}
        enableLabel={false}
        enableGridX={enableGridX}
        enableGridY={enableGridY}
        gridXValues={gridXValues}
        gridYValues={5}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={color}
        legends={[]}
        tooltip={tooltip}
        theme={theme}
        animate={true}
        motionStiffness={92}
        motionDamping={10}
      />
    </div>
  );
};
export default Histogram;
