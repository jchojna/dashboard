import React, {Component} from "react";
import Datamaps from "datamaps";
import d3 from "d3";
import "../scss/Histogram.scss";
import "../scss/Map.scss";

class Map extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  resize = () => {
    if (this.map) {
      this.map.resize();
    }
  };

  componentDidMount() {
    this.drawMap();
    window.addEventListener("resize", this.resize);
  }

  componentWillReceiveProps() {
    this.clear();
  }

  componentDidUpdate() {
    this.drawMap();
  }

  componentWillUnmount() {
    this.clear();
    window.removeEventListener("resize", this.resize);
  }

  clear = () => {
    const container = this.container.current;
    for (const child of Array.from(container.childNodes)) {
      container.removeChild(child);
    }
  };

  drawMap = () => {
    const {data} = this.props;

    const map = new Datamaps(
      Object.assign(
        {},
        {
          ...this.props,
        },
        {
          element: this.container.current,
          projection: "mercator",
          responsive: true,
          fills: {
            defaultFill: "#fff",
          },
          data,
          geographyConfig: {
            borderWidth: 0.5,
            borderOpacity: 1,
            borderColor: "#fff",
            // don't change color on mouse hover
            highlightFillColor: function (geo) {
              return geo["fillColor"] || "#fff";
            },
            highlightBorderColor: function (geo) {
              return geo.field ? "#555" : "#fff";
            },
            highlightBorderWidth: 1,

            // show desired information in tooltip
            popupTemplate: function (geo, data) {
              const {countryPercent, field} = data;
              if (!data) return;
              return `
                <div class="hoverinfo tooltip">
                  <h4 class="tooltip__heading">${geo.properties.name}</h4>
                  <p class="tooltip__text">${field}: ${data.countryTotal}</p>
                  <p class="tooltip__text">Share: ${countryPercent.toFixed(
                    1
                  )}%</p>
                </div>            
              `;
            },
          },
          done: function (datamap) {
            datamap.svg.call(
              d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", redraw)
            );
            function redraw() {
              datamap.svg
                .selectAll("g")
                .attr(
                  "transform",
                  "translate(" +
                    d3.event.translate +
                    ")scale(" +
                    d3.event.scale +
                    ")"
                );
            }
          },
        }
      )
    );
    this.map = map;
    this.container.current.style.paddingBottom = 0;
  };

  render() {
    return <div ref={this.container} className="Map"></div>;
  }
}
export default Map;
