import React from "react";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
import "../scss/TextPanel.scss";

const TextPanel = (props) => {
  const {id, heading, value, percentage} = props;
  return (
    <section className={`TextPanel TextPanel--${id}`}>
      <div className="TextPanel__stats">
        <h2 className="TextPanel__heading">{heading}</h2>
        <p className="TextPanel__value">{`$ ${value}`}</p>
        <p className="TextPanel__percentage">{`${percentage}%`}</p>
      </div>
      <footer className="TextPanel__footer">
        <Dropdown />
        <Icon iconId={id} type="infographic" />
      </footer>
    </section>
  );
};
export default TextPanel;
