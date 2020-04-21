import React from "react";
import "../scss/TextPanel.scss";

const TextPanel = (props) => {
  const {modifier, heading, value, percentage} = props;
  return (
    <section className={`TextPanel TextPanel--${modifier}`}>
      <h2 className="TextPanel__heading">{heading}</h2>
      <p className="TextPanel__value">{`$ ${value}`}</p>
      <p className="TextPanel__percentage">{`${percentage}%`}</p>
      <nav className="TextPanel__footer">
        <select name="stats" className="TextPanel__dropdown">
          <option value="weekly">Weekly Stats</option>
          <option value="monthly">Monthly Stats</option>
          <option value="yearly">Yearly Stats</option>
        </select>
        {/* <svg className="TextPanel__icon" viewBox="0 0 100 100">
          <use href=""></use>
        </svg> */}
      </nav>
    </section>
  );
};
export default TextPanel;
