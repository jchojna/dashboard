import React from "react";
import Icon from "./Icon";
import "../scss/Controls.scss";

const Controls = (props) => {
  const {id, onMaximize} = props;
  return (
    <ul className="Controls">
      <li className="Controls__item">
        <button className="Controls__button Controls__button--minimize">
          <Icon id="minimize" type="controls" />
        </button>
      </li>
      <li className="Controls__item">
        <button
          className="Controls__button Controls__button--maximize"
          onClick={() => onMaximize(id)}>
          <Icon id="maximize" type="controls" />
        </button>
      </li>
    </ul>
  );
};
export default Controls;
