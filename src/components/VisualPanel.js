import React from "react";
import Controls from "./Controls.js";
import classNames from "classnames";
import "../scss/VisualPanel.scss";

const VisualPanel = (props) => {
  const {id, heading} = props;

  const panelClass = classNames("VisualPanel", `VisualPanel--${id}`, {});

  return (
    <section className={panelClass}>
      <header className="VisualPanel__header">
        <h3 className="VisualPanel__heading">{heading}</h3>
        <Controls />
      </header>
      {props.children}
    </section>
  );
};
export default VisualPanel;
