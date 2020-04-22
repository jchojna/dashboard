import React from "react";
import Icon from "./Icon";
import "../scss/Button.scss";

const Button = (props) => {
  const {id} = props;
  return (
    <button className={`Button Button--${id}`}>
      <span className="Button__text">{id}</span>
      <Icon id={id} type="infographic" />
    </button>
  );
};
export default Button;
