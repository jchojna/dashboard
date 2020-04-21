import React from "react";
import icons from "../assets/icons.svg";
import "../scss/Icon.scss";

const Icon = (props) => {
  const {iconId} = props;
  return (
    <svg className={`Icon Icon--${iconId}`} viewBox="0 0 100 100">
      <use href={`${icons}#${iconId}`}></use>
    </svg>
  );
};
export default Icon;
