import React from "react";
import Icon from "./Icon";
import "../scss/Button.scss";

const Button = (props) => {
  const {id, onClick} = props;
  return (
    <button className={`Button Button--${id}`} onClick={onClick}>
      <span className="Button__text">{id}</span>
      <Icon id={id} type="infographic" />
    </button>
  );
};
export default Button;
