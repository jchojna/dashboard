import React, {Component} from "react";
import Datamaps from "datamaps/dist/datamaps.world.hires.min.js";
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
            defaultFill: "#ccc",
          },
          data,
          geographyConfig: {
            //borderColor: "#DEDEDE",
            //highlightBorderWidth: 2,
            // don't change color on mouse hover
            /* highlightFillColor: function (geo) {
              return geo["fillColor"] || "#F5F5F5";
            }, */
            // only change border
            //highlightBorderColor: "#B7B7B7",
            // show desired information in tooltip
            /* popupTemplate: function (geo, data) {
              // don't show tooltip if country don't present in dataset
              if (!data) {
                return;
              }
              // tooltip content
              return [
                '<div class="hoverinfo">',
                "<strong>",
                geo.properties.name,
                "</strong>",
                "<br>Count: <strong>",
                data.numberOfThings,
                "</strong>",
                "</div>",
              ].join("");
            }, */
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
