import React from "react";
import classNames from "classnames";
import Icon from "./Icon";
import "../scss/TextPanel.scss";

const TextPanel = (props) => {
  const {id, heading, value, percentage} = props;
  const percentageClass = classNames("TextPanel__percentage", {
    "TextPanel__percentage--positive": percentage > 0,
    "TextPanel__percentage--negative": percentage < 0,
  });
  const percentValue = `${Math.abs(percentage)}%`;

  return (
    <section className={`TextPanel TextPanel--${id}`}>
      <header className="TextPanel__header">
        <h3 className="TextPanel__heading">{heading}</h3>
        <Icon id={id} type="infographic" />
      </header>
      <p className="TextPanel__value">{value}</p>
      <div className={percentageClass}>
        <Icon id="minimize" type="indicator" isRotated={percentage > 0} />
        <span>{percentValue}</span>
      </div>
    </section>
  );
};
export default TextPanel;
