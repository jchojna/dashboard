import React, {Component, PropTypes} from "react";
import Datamaps from "datamaps/dist/datamaps.world.hires.min.js";
import "../scss/Map.scss";

class Map extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }
  /* static propTypes = {
    arc: PropTypes.array,
    arcOptions: PropTypes.object,
    bubbleOptions: PropTypes.object,
    bubbles: PropTypes.array,
    graticule: PropTypes.bool,
    labels: PropTypes.bool
  }; */

  resize = () => {
    if (this.map) {
      this.map.resize();
    }
  };

  componentDidMount() {
    this.drawMap();
    window.addEventListener("resize", this.resize);
  }

  //this will remove the map from the dom when the react component is unmounted
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
