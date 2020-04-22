import React from "react";
import classNames from "classnames";

import icons from "../assets/icons.svg";
import "../scss/Icon.scss";

const Icon = (props) => {
  const {iconId, type} = props;
  const iconClass = classNames("Icon", `Icon--${iconId}`, {
    [`Icon--${type}`]: type
  });
  return (
    <svg className={iconClass} viewBox="0 0 100 100">
      <use href={`${icons}#${iconId}`}></use>
    </svg>
  );
};
export default Icon;
