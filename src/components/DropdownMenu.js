import React from "react";
import "../scss/DropdownMenu.scss";

const DropdownMenu = (props) => {
  return (
    <ul className="DropdownMenu">{props.children}</ul>
  );


};
export default DropdownMenu;
