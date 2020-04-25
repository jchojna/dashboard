import React from "react";
import Icon from "./Icon";
import "../scss/Button.scss";

const Button = (props) => {
  const {id, label, hasLabel = false} = props;
  return (
    <button className={`Button Button--${id}`}>
      {hasLabel && <span className="Button__text">{label}</span>}
      <Icon id={id} type="infographic" />
    </button>
  );
};
export default Button;
