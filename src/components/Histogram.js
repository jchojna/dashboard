import React from "react";
import {ResponsiveBar} from "@nivo/bar";
import "../scss/Histogram.scss";

const Histogram = ({data}) => {

  const styles = {
    fontFamily: 'Arial',
  };

  const theme = {
    fontFamily: 'Nunito',
    fontSize: '11px',
    axis: {
      textColor: '#eee',
      tickColor: '#eee',
      ticks: {
        line: {
          stroke: "gray"
        },
        text: {
          fill: "#ccc",
        },
      },
    },
    grid: {
      stroke: '#888',
      strokeWidth: 1,
    },
  }
  

  return (
    <div className="Histogram" style={styles}>
      <ResponsiveBar
        data={data}
        keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
        indexBy="country"
        margin={{top: 50, right: 0, bottom: 50, left: 60}}
        padding={0.5}
        layout="vertical"
        colors="#ccc"
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        borderColor={{from: "color", modifiers: [["darker", "1.6"]]}}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "country",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "food",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{from: "color", modifiers: [["darker", 1.6]]}}
        legends={[]}
        tooltip={function () {}}
        theme={theme}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
}
export default Histogram;
