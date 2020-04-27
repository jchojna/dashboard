import React from "react";
import Icon from "./Icon";
import "../scss/VisualPanel.scss";

const VisualPanel = (props) => {
  const {id, heading, info, isMaximized, onMaximize} = props;
  const iconId = isMaximized ? "minimize" : "maximize";

  return (
    <section className={`VisualPanel VisualPanel--${id}`}>
      <header className="VisualPanel__header">
        <h3 className="VisualPanel__heading">{heading}
          <span className="VisualPanel__heading--info">{` - ${info}`}</span>
        </h3>
        <button className="VisualPanel__button" onClick={() => onMaximize(id)}>
          <Icon id={iconId} />
        </button>
      </header>
      {props.children}
    </section>
  );
};
export default VisualPanel;
