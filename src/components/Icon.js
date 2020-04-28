import React from "react";
import classNames from "classnames";

import icons from "../assets/icons.svg";
import "../scss/Icon.scss";

const Icon = (props) => {
  const {id, type, isRotated} = props;
  const iconClass = classNames("Icon", `Icon--${id}`, {
    [`Icon--${type}`]: type,
    "Icon--rotated": isRotated,
  });
  return (
    <svg className={iconClass} viewBox="0 0 100 100">
      <use href={`${icons}#${id}`}></use>
    </svg>
  );
};
export default Icon;
