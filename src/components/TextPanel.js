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
  const absPercent = Math.abs(percentage);
  const percentValue = absPercent !== 0 ? `${absPercent}%` : "stable";
  const isIconRotated = percentage > 0;

  return (
    <section className={`TextPanel TextPanel--${id}`}>
      {/* HEADER BAR */}
      <header className="TextPanel__header">
        <h3 className="TextPanel__heading">{heading}</h3>
        <Icon id={id} type="infographic" />
      </header>

      {/* VALUES AND INDICATORS */}
      <p className="TextPanel__value">{value}</p>
      <div className={percentageClass}>
        <Icon id="indicator" isRotated={isIconRotated} />
        <span>{percentValue}</span>
      </div>
    </section>
  );
};
export default TextPanel;
