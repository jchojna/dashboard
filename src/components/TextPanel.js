import React from "react";
import Icon from "./Icon";
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
        <select name="" className="TextPanel__dropdown">
          <option className="TextPanel__option" value="weekly">
            Weekly Stats
          </option>
          <option className="TextPanel__option" value="monthly">
            Monthly Stats
          </option>
          <option className="TextPanel__option" value="yearly">
            Yearly Stats
          </option>
        </select>
        <Icon iconId={id} />
      </footer>
    </section>
  );
};
export default TextPanel;
