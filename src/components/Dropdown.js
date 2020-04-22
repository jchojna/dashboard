import React from "react";
import Icon from "./Icon";
import "../scss/Dropdown.scss";

const Dropdown = (props) => {
  const {id, label} = props;
  return (
    <div className="Dropdown">
      <button className="Dropdown__button">
        Last Month
        <Icon id="dropdown" />
      </button>
    </div>
  );
};
export default Dropdown;
