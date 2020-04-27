import React from "react";
import Icon from "./Icon";
import "../scss/Intro.scss";

const Intro = ({className}) => {
  return (
    <div className={className}>
      <h2 className="Intro__heading">dashboard</h2>
      <Icon id="logo" />
      <div className="Intro__loader"></div>
    </div>
  );
};
export default Intro;
