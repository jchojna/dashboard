import React from "react";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
import classNames from "classnames";
import "../scss/VisualPanel.scss";

const VisualPanel = (props) => {
  const {id, heading} = props;

  const panelClass = classNames("VisualPanel", `VisualPanel--${id}`, {});

  return (
    <section className={panelClass}>
      <header className="VisualPanel__header">
        <h2 className="VisualPanel__heading">{heading}</h2>

      </header>
      {/* <Dropdown /> */}
      {/* <Icon iconId={id} /> */}
    </section>
  );
};
export default VisualPanel;
