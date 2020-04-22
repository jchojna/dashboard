import React from "react";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
import "../scss/TextPanel.scss";

const TextPanel = (props) => {
  const {id, heading, value, percentage} = props;
  return (
    <section className={`TextPanel TextPanel--${id}`}>
      <header className="TextPanel__header">
        <h3 className="TextPanel__heading">{heading}</h3>
        <Icon iconId={id} type="infographic" />
      </header>
      <p className="TextPanel__value">{`$ ${value}`}</p>
      <p className="TextPanel__percentage">{`${percentage}%`}</p>
    </section>
  );
};
export default TextPanel;
