import React from "react";
import Icon from "./Icon";
import "../scss/Dropdown.scss";

const Dropdown = (props) => {
  return (
    <div className="Dropdown">
      <button className="Dropdown__button">
        Monthly Stats
        <Icon iconId="dropdown" />
      </button>
    </div>
  );
};
export default Dropdown;
