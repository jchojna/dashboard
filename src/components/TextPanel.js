import React, {PureComponent} from "react";
import classNames from "classnames";
import Icon from "./Icon";
import {getNumberFormatted} from "../lib/dataHandlers";
import "../scss/TextPanel.scss";

class TextPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.intervalId = null;
    this.state = {
      animatedValue: 0,
    };
  }

  componentDidMount = () => {
    this.handleValue();
  };

  componentDidUpdate = () => {
    if (!this.intervalId) {
      this.setState({animatedValue: 0});
      this.handleValue();
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
    this.intervalId = null;
  };

  handleValue = () => {
    this.intervalId = setInterval(() => {
      const {animatedValue} = this.state;
      const {value} = this.props;

      // one increment on every 10ms
      const increment = Math.ceil(value / 80);

      if (Math.abs(animatedValue) <= Math.abs(value)) {
        this.setState((prevState) => ({
          animatedValue: prevState.animatedValue + increment,
        }));
      } else {
        this.setState({animatedValue: value});
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 10);
  };

  render() {
    const {id, heading, percentage} = this.props;
    const {animatedValue} = this.state;
    const percentageClass = classNames("TextPanel__percentage", {
      "TextPanel__percentage--positive": percentage >= 0,
      "TextPanel__percentage--negative": percentage < 0,
    });
    const percentValue = percentage !== 0 ? `${percentage}%` : "stable";
    const isIconRotated = percentage >= 0;

    return (
      <section className={`TextPanel TextPanel--${id}`}>
        {/* HEADER BAR */}
        <header className="TextPanel__header">
          <h3 className="TextPanel__heading">{heading}</h3>
          <Icon id={id} type="infographic" />
        </header>

        {/* VALUES AND INDICATORS */}
        <p className="TextPanel__value">
          {getNumberFormatted(animatedValue)}
          {id === "income" ? " $" : ""}
        </p>
        <div className={percentageClass}>
          <Icon id="indicator" isRotated={isIconRotated} />
          <span>{percentValue}</span>
        </div>
      </section>
    );
  }
}
export default TextPanel;
