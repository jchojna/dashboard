import React from "react";
import Icon from "./Icon";
import "../scss/Controls.scss";

const Controls = (props) => {
  return (
    <ul className="Controls">
      <li className="Controls__item">
        <button className="Controls__button Controls__button--minimize">
          <Icon iconId="minimize" type="controls" />
        </button>
      </li>
      <li className="Controls__item">
        <button className="Controls__button Controls__button--fullscreen">
          <Icon iconId="fullscreen" type="controls" />
        </button>
      </li>
    </ul>
  );
};
export default Controls;
