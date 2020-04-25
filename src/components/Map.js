import React, {Component} from "react";
import Datamaps from "datamaps/dist/datamaps.world.hires.min.js";
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
            //highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function (geo) {
              return geo["fillColor"] || "#ccc";
            },
            
            highlightBorderColor: function (geo) {
              return geo.value ? "#fff" : "#ccc";
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
                  <p class="tooltip__text">Share: ${countryPercent.toFixed(1)}%</p>
                </div>            
              `
            },
          },
        }
      )
    );
    this.map = map;
  };

  render() {
    return <div ref={this.container} className="Map"></div>;
  }
}
export default Map;
