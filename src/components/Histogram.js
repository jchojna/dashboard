import React from "react";
import {statsFields, months} from "../lib/dataHelpers";
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
    axisBottom = null,
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
        padding: "10px 15px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      },
    },
  };

  const axisLeft = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 3,
  };

  const color = {from: "color", modifiers: [["darker", "1.6"]]};

  const tooltip = (tooltipData) => {
    const {id, value, indexValue} = tooltipData;
    const monthName =
      type === "histogram" && indexValue.includes("all")
        ? months[parseInt(indexValue)]
        : null;

    const heading =
      type === "histogram"
        ? `${statsFields[id]}: ${value}${id === "profit" ? " $" : ""}`
        : `${indexValue}: ${value.toFixed(1)}%`;

    const text =
      type === "histogram"
        ? monthName ? monthName : `Date: ${indexValue}`
        : `${
            id === "before" ? "Before current period" : "During current period"
          }`;

    return (
      <div className="tooltip">
        <h4 className="tooltip__heading">{heading}</h4>
        <p className="tooltip__text">{text}</p>
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
        padding={0.6}
        layout={layout}
        //colors={bar => colors[bar.id]}
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
        gridXValues={[20, 40, 60, 80]}
        gridYValues={5}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={color}
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
