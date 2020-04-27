import React from "react";
import classNames from "classnames";
import Icon from "./Icon";
import "../scss/Button.scss";

const Button = (props) => {
  const {id, onClick, isDataLoading} = props;

  const buttonClass = classNames("Button", {
    "Button--disabled": isDataLoading,
  });

  const handleClick = () => isDataLoading ? false : onClick();

  return (
    <button className={buttonClass} onClick={handleClick}>
      <span className="Button__text">{id}</span>
      <Icon id={id} type="infographic" />
    </button>
  );
};
export default Button;
